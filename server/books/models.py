import time
from datetime import date
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from mptt.models import MPTTModel, TreeForeignKey, TreeManyToManyField


def current_year():
    return date.today().year


def max_value_current_year(value):
    return MaxValueValidator(current_year())(value)


def upload_book_image(instance, filename):
    lastDot = filename.rfind('.')
    extension = filename[lastDot:len(filename):1]
    return 'images/Books/%s-%s-%s' % (instance.slug, time.time(), extension)


def upload_rec_book_image(instance, filename):
    lastDot = filename.rfind('.')
    extension = filename[lastDot:len(filename):1]
    return 'images/Rec_Books/%s-%s-%s' % (instance.slug, time.time(), extension)


def upload_book_pdf(instance, filename):
    lastDot = filename.rfind('.')
    extension = filename[lastDot:len(filename):1]
    return 'store/Books/%s-%s-%s' % (instance.slug, time.time(), extension)


class Language(models.Model):
    language = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, null=False, default=None)

    def __str__(self):
        return self.language


class Author(models.Model):
    full_name = models.CharField(max_length=225)
    slug = models.SlugField(max_length=500, unique=False, null=False)

    def __str__(self):
        return self.full_name


class Category(MPTTModel):
    category_direction = models.CharField(max_length=100)
    parent = TreeForeignKey('self', null=True, blank=True,
                            on_delete=models.CASCADE, related_name='children', db_index=True)
    slug = models.SlugField(max_length=500, unique=False, null=False)

    class MPTTMeta:
        order_insertion_by = ['category_direction']

    class Meta:
        unique_together = (('parent', 'slug',))
        verbose_name_plural = 'categories'

    def get_slug_list(self):
        try:
            ancestors = self.get_ancestors(include_self=True)
        except:
            ancestors = []
        else:
            ancestors = [i.slug for i in ancestors]
            slugs = []
        for i in range(len(ancestors)):
            slugs.append('/'.join(ancestors[:i+1]))
        return slugs

    def __str__(self):
        return self.category_direction


class Book(models.Model):
    title = models.CharField(max_length=500)
    annotation = models.TextField()
    ISBN = models.CharField(max_length=255)
    publish_year = models.IntegerField(default=current_year(), validators=[
                                       MinValueValidator(1900), max_value_current_year])
    language = models.ForeignKey(
        Language, default=None, on_delete=models.CASCADE, blank=True, null=True)

    slug = models.SlugField(max_length=500, unique=False, null=False)
    password = models.CharField(max_length=600)
    is_featured = models.BooleanField(
        default=False, help_text="Для рекомендуемых")
    book_cover = models.FileField(default=None,
                                  upload_to=upload_book_image, blank=True, null=False, max_length=1000)
    book_content_pdf = models.FileField(default=None,
                                        upload_to=upload_book_pdf, blank=True, null=False, validators=[FileExtensionValidator(['pdf'])], max_length=1000)
    authors = models.ManyToManyField(Author, related_name='books', blank=True)
    categories = TreeManyToManyField(
        Category, blank=True, related_name='books')

    def __str__(self):
        return self.title


class RecommendedBook(models.Model):
    title = models.CharField(max_length=500)
    slug = models.SlugField(max_length=500, unique=False, null=False)
    book_cover = models.FileField(default=None,
                                  upload_to=upload_rec_book_image, blank=True, null=False, max_length=1000)
    authors = models.ManyToManyField(
        Author, related_name='rec_books', blank=True)
    book_rating = models.IntegerField(default=5.0)
    price = models.IntegerField(default=0)

    def __str__(self):
        return self.title
