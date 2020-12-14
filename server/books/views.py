import os

import pyAesCrypt

from django.db.models import Prefetch
from django.http import HttpResponse
from django.db.models import Avg, Case, When, Value, Q

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django_filters.views import BaseFilterView
from books import models
from users.models import Favorites
from books import serializers
from universities.models import UniversityCategory
from books import mixins
from books import encryptBook


class BooksViews(ListAPIView, BaseFilterView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    serializer_class = serializers.BookSerializer
    pagination_class = mixins.BookSetPagination
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_class = mixins.BooksFilterSet
    search_fields = ('title',)

    def get_queryset(self):

        if self.request.user.is_anonymous:
            self.serializer_class = serializers.BookSerializerUnauthorize
            books = models.Book.objects.select_related('language').prefetch_related(Prefetch(
                'categories', queryset=models.Category.objects.all())).prefetch_related('authors').order_by('-is_featured', '-id').distinct()
        else:
            books = models.Book.objects.filter(universities=self.request.user.university).select_related('language').prefetch_related(Prefetch(
                'categories', queryset=models.Category.objects.all())).prefetch_related('authors').prefetch_related(Prefetch('favorites', queryset=Favorites.objects.filter(user=self.request.user))).order_by('-is_featured', '-id').distinct()
        return books


class BooksDetailViews(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    serializer_class = serializers.ModelSerializer

    def get(self, request, slug):
        self.serializer_class.Meta.model = models.Book
        if request.user.is_anonymous:
            book = models.Book.objects.annotate(book_rating_avg=Avg(Case(
                When(reviews__Show=True, then='reviews__star'),
                When(reviews__Show=False, then=Value(5)))
            )).filter(slug=slug)
        else:
            book = models.Book.objects.annotate(book_rating_avg=Avg(Case(
                When(reviews__Show=True, then='reviews__star'),
                When(reviews__Show=False, then=Value(5)))
            )).prefetch_related(Prefetch('favorites', queryset=Favorites.objects.filter(user=self.request.user))).filter(slug=slug)

        book.values('book_rating_avg')[0]['book_rating_avg'] = 5

        if request.user.is_anonymous:
            books_recomendations = models.Book.objects.select_related('language').filter(categories=book.values('categories')[0]['categories']).prefetch_related(
                'authors').order_by('-id')[:7]
        else:
            books_recomendations = models.Book.objects.select_related('language').filter(categories=book.values('categories')[0]['categories']).prefetch_related(
                'authors').prefetch_related(Prefetch('favorites', queryset=Favorites.objects.filter(user=self.request.user))).order_by('-id')[:7]

        if not book:
            return Response({"error_message": "not_found 404"}, status=status.HTTP_404_NOT_FOUND)

        if request.user.is_anonymous:
            serializer = self.serializer_class(book, many=True, fields=[
                'id', 'title', 'annotation', 'slug', 'ISBN', 'publish_year', 'book_rating_avg', 'language', 'book_cover', 'categories', 'authors'])
        else:
            serializer = self.serializer_class(book, many=True, fields=[
                'id', 'title', 'annotation', 'slug', 'ISBN', 'publish_year', 'book_rating_avg', 'language', 'book_cover', 'book_content_pdf', 'categories', 'authors', 'is_favorite'])

        recomendation = serializers.BookSerializer(
            books_recomendations, many=True)

        try:
            serializer.data[0]['book_rating_avg'] = round(
                serializer.data[0]['book_rating_avg'], 2)
        except Exception as e:
            serializer.data[0]['book_rating_avg'] = 5.0

        return Response({'Book': serializer.data[0],
                         'Recomendation_list': recomendation.data})


class SendEncryptedBookViews(APIView):

    def get(self, request, file_name):
        try:
            if 'Origin' in request.headers:
                if request.path != '/api/books/show_pdf/'+file_name and 'admin' not in request.headers['Origin']:
                    with open(os.path.abspath('media/store/Books/'+file_name), 'rb') as pdf:
                        response = HttpResponse(
                            pdf.read(), content_type='application/pdf')
                        response['Access-Control-Allow-Origin'] = '*'
                        response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT'
                        response['Content-Disposition'] = 'filename=downloaded_book.pdf'
                        return response

            elif request.path == '/api/books/show_pdf/'+file_name:
                try:
                    book = models.Book.objects.get(
                        book_content_pdf="store/Books/"+file_name)
                    check_file = encryptBook.encryptFileForDetail(
                        book.book_content_pdf.path, book.password)
                    enc_pass = encryptBook.encryptPasswordField(book.password)
                    if check_file is not None:
                        new_file_name = check_file.split('media/')[1]
                        book.book_content_pdf = new_file_name
                        book.save()
                        return Response({'path': 'media/'+new_file_name, 'password': enc_pass})
                    return Response({'path': 'media/store/Books/'+file_name, 'password': enc_pass})
                except models.Book.DoesNotExist:
                    return Response(status.HTTP_404_NOT_FOUND)
            else:
                full_path = os.path.abspath('media/store/Books/'+file_name)
                full_path_enc = full_path[:-3]+'not_open.pdf'

                if os.path.exists(full_path_enc):
                    os.remove(full_path_enc)

                pyAesCrypt.encryptFile(
                    full_path, full_path_enc, "genmodpass", 64 * 1024)

                with open(full_path_enc, 'rb') as pdf:
                    response = HttpResponse(
                        pdf.read(), content_type='application/pdf')
                    response['Content-Disposition'] = 'filename=downloaded_book.pdf'
                    os.remove(full_path_enc)
                    return response
        except FileNotFoundError:
            return Response(status.HTTP_404_NOT_FOUND)


class CategoryViews(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )
    serializer_class = serializers.ModelSerializer

    def new_children(self, categories_list, categories_in_university):
        for category in categories_list:
            setattr(category, 'new_children', [])
            for child in category.get_children().all():
                if child.id in categories_in_university:
                    getattr(category, 'new_children').append(
                        models.Category.objects.get(pk=child.id))
                if child.get_children().all():
                    setattr(child, 'new_children', [])
                    for inner_child in child.get_children().all():
                        if inner_child.id in categories_in_university:
                            getattr(child, 'new_children').append(
                                models.Category.objects.get(pk=inner_child.id))
        return categories_list

    def get(self, request):
        self.serializer_class.Meta.model = models.Category
        childrens = None
        if request.user.is_anonymous:
            childrens = models.Category.objects.all().values('id')
            categories = models.Category.objects.all().select_related('parent').filter(level=0).filter(
                children__in=childrens).filter(~Q(category_direction='Доступные категории')).order_by('-id').reverse().distinct()
            serializer_category = self.serializer_class(categories, many=True, fields=[
                'id', 'category_direction', 'slug', 'children'])
        else:
            self.serializer_class = serializers.CategoriesSerializerForModel
            categories_in_university = UniversityCategory.objects.filter(
                universities=request.user.university).values_list('categories', flat=True)
            categories = models.Category.objects.filter(
                pk__in=categories_in_university).order_by('-id').reverse().distinct()
            categories_list = []
            for category in categories:
                categories_list.append(category.get_root())

            categories_list = list(dict.fromkeys(categories_list))
            categories_list = self.new_children(
                categories_list, categories_in_university)

            serializer_category = self.serializer_class(
                categories_list, many=True)

        return Response({'categories': serializer_category.data})


class SearchAuthorViews(ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.AuthorsSerializerForSearch
    filter_backends = (SearchFilter,)
    search_fields = ('full_name', 'slug')

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return models.Author.objects.all().distinct()
        books_in_univeristy = models.Book.objects.filter(
            universities=self.request.user.university).values_list('id', flat=True)
        return models.Author.objects.filter(books__in=books_in_univeristy).distinct()


class SearchLanguageViews(ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.LanguagesSerializerForSearch
    filter_backends = (SearchFilter,)
    search_fields = ('language', 'slug')
    queryset = models.Language.objects.all()

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return models.Language.objects.all()
        books_in_univeristy = models.Book.objects.filter(
            universities=self.request.user.university).values_list('id', flat=True)
        return models.Language.objects.filter(book__in=books_in_univeristy).distinct()


class SearchCategoriesViews(ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.CategoriesSerializerForSearch
    filter_backends = (SearchFilter,)
    search_fields = ('category_direction', 'slug')
    pagination_class = mixins.SearchCategorySetPagination

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return models.Category.objects.select_related('parent').filter(~Q(parent=None))
        categories_in_university = UniversityCategory.objects.filter(
            universities=self.request.user.university).values_list('categories', flat=True)
        return models.Category.objects.filter(
            pk__in=categories_in_university).select_related('parent').filter(~Q(parent=None))


class SearchISBNViews(ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.ISBNSerializerForSearch
    filter_backends = (SearchFilter,)
    search_fields = ('ISBN',)

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return models.Book.objects.all()
        return models.Book.objects.filter(universities=self.request.user.university)


class RecBooksViews(ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )
    serializer_class = serializers.RecBookSerializerUnauthorize
    pagination_class = mixins.BookSetPagination

    def get_queryset(self):
        books = models.RecommendedBook.objects.prefetch_related(
            'authors').order_by('id').distinct()
        return books
