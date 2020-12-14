from rest_framework import serializers
from django.db.models import Avg, Case, When, Value
from books import models


class RecursiveSerializer(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class LanguagesSerializerForModel(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = models.Language
        fields = ("language", "slug")


class AuthorsSerializerForModel(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = models.Author
        fields = ("full_name", "slug")


class SubCategoriesSerializerForModel(serializers.ModelSerializer):
    children = RecursiveSerializer(many=True, read_only=True)

    class Meta:
        ordering = ['-id']
        model = models.Category
        fields = ("id", "category_direction", "slug", "children")


class CategoriesSerializerForModel(serializers.ModelSerializer):
    children = serializers.SerializerMethodField('get_new_children')

    class Meta:
        ordering = ['-id']
        model = models.Category
        fields = ("id", "category_direction", "slug", 'children')

    def get_new_children(self, obj):
        if obj.new_children:
            return SubCategoriesSerializerForModel(obj.new_children, many=True).data


class CategoriesSerializerForBook(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = models.Category
        fields = ("category_direction", "slug")


class BookSerializer(serializers.ModelSerializer):
    authors = AuthorsSerializerForModel(many=True, read_only=True)
    categories = CategoriesSerializerForBook(many=True, read_only=True)
    book_rating_avg = serializers.SerializerMethodField(
        'get_rataing', default=5.0)
    is_favorite = serializers.SerializerMethodField('is_saved')
    book_content_pdf = serializers.SerializerMethodField(
        'get_book_content_pdf')

    class Meta:
        ordering = ['-id', '-is_featured']
        model = models.Book
        lookup_field = 'slug'
        fields = 'id', 'title', 'book_cover', 'book_content_pdf', 'slug', 'categories', 'authors', 'book_rating_avg', 'is_favorite'

    def is_saved(self, instance):
        saved_list = instance.favorites.values('saved')
        for elem in saved_list:
            return elem['saved']
        return False

    def get_rataing(self, obj):
        book_ratings = models.Book.objects.filter(pk=obj.pk).annotate(book_rating_avg=Avg(Case(
            When(reviews__Show=True, then='reviews__star'),
            When(reviews__Show=False, then=Value(5)),
            default=Value(5))
        )).values_list('book_rating_avg')
        for rating in book_ratings:
            return round(rating[0], 2)
        return 5.0

    def get_book_content_pdf(self, obj):
        return obj.book_content_pdf.name.split('/')[-1]


class BookSerializerUnauthorize(serializers.ModelSerializer):
    authors = AuthorsSerializerForModel(many=True, read_only=True)
    book_rating_avg = serializers.SerializerMethodField(
        'get_rataing', default=5.0)

    class Meta:
        ordering = ['-id', '-is_featured']
        model = models.Book
        lookup_field = 'slug'
        fields = 'id', 'title', 'book_cover', 'slug', 'authors', 'book_rating_avg'

    def get_rataing(self, obj):
        book_ratings = models.Book.objects.filter(pk=obj.pk).annotate(book_rating_avg=Avg(Case(
            When(reviews__Show=True, then='reviews__star'),
            When(reviews__Show=False, then=Value(5)),
            default=Value(5))
        )).values_list('book_rating_avg')
        for rating in book_ratings:
            return round(rating[0], 2)
        return 5.0


class RecBookSerializerUnauthorize(serializers.ModelSerializer):
    authors = AuthorsSerializerForModel(many=True, read_only=True)

    class Meta:
        ordering = ['-id']
        model = models.RecommendedBook
        lookup_field = 'slug'
        fields = 'id', 'title', 'book_cover', 'slug', 'authors', 'book_rating', 'price'


class ModelSerializer(serializers.ModelSerializer):
    authors = AuthorsSerializerForModel(many=True, read_only=True)
    categories = CategoriesSerializerForBook(many=True, read_only=True)
    children = SubCategoriesSerializerForModel(many=True, read_only=True)
    language = LanguagesSerializerForModel(read_only=True)
    is_favorite = serializers.SerializerMethodField('is_saved')
    book_rating_avg = serializers.FloatField(default=5.0)
    book_content_pdf = serializers.SerializerMethodField(
        'get_book_content_pdf')

    class Meta:
        ordering = ['-id']
        model = None
        lookup_field = 'slug'
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        exclude = kwargs.pop('exclude', None)

        super(ModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)

        if exclude is not None:
            not_allowed = set(exclude)
            for exclude_name in not_allowed:
                self.fields.pop(exclude_name)

    def is_saved(self, instance):
        saved_list = instance.favorites.values('saved')
        for elem in saved_list:
            return elem['saved']
        return False

    def get_book_content_pdf(self, obj):
        return obj.book_content_pdf.name.split('/')[-1]


class CategoriesSerializerForSearch(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = models.Category
        fields = ("category_direction", "slug")


class LanguagesSerializerForSearch(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = models.Language
        fields = ("language", "slug")


class AuthorsSerializerForSearch(serializers.ModelSerializer):
    class Meta:
        model = models.Author
        fields = ("full_name", "slug")


class ISBNSerializerForSearch(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = models.Book
        fields = ("ISBN", )
