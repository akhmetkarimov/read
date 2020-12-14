import time
from django.db import models
from django.core.validators import MaxValueValidator
from books.models import Book, Category


def upload_avatar(instance, filename):
    lastDot = filename.rfind('.')
    extension = filename[lastDot:len(filename):1]
    return 'images/avatars/%s-%s-%s' % ('avatarPro', time.time(), extension)


class University(models.Model):
    title = models.CharField(max_length=255)
    abbr = models.CharField(max_length=255)
    agreement_end_date = models.DateField()
    books = models.ManyToManyField(
        Book, blank=True, related_name='universities')
    user_count = models.IntegerField(
        default=0, validators=[MaxValueValidator(10000)])

    def __str__(self):
        return self.title


class UniversityCategory(models.Model):
    universities = models.ForeignKey(
        University, default=None, blank=True, null=True, on_delete=models.CASCADE)
    categories = models.ForeignKey(
        Category, default=None, blank=True, null=True, on_delete=models.CASCADE)


class FAQ(models.Model):
    question = models.CharField(max_length=500)
    answer = models.TextField()

    def __str__(self):
        return self.question


class UniversityReview(models.Model):
    avatar = models.FileField(default=None,
                              upload_to=upload_avatar, max_length=1000)
    full_name = models.CharField(max_length=500)
    position = models.CharField(max_length=500, blank=True, null=True)
    content = models.TextField()

    def __str__(self):
        return self.full_name
