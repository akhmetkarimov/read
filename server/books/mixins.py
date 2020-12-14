from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django_filters import rest_framework as filters
from .models import Book


class BookSetPagination(PageNumberPagination):
    page_size = 16
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'page_count': self.page.paginator.num_pages,
            'Books': data
        })


class SearchCategorySetPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'page_count': self.page.paginator.num_pages,
            'Filter_categories': data
        })


class CharFilterInFilter(filters.BaseInFilter, filters.CharFilter):
    pass


class BooksFilterSet(filters.FilterSet):
    authors = CharFilterInFilter(
        field_name='authors__slug', lookup_expr='in')
    categories = CharFilterInFilter(
        field_name='categories__slug', lookup_expr='in')
    language = CharFilterInFilter(
        field_name='language__slug', lookup_expr='in')
    ISBN = filters.CharFilter()

    class Meta:
        model = Book
        fields = ['authors', 'categories', 'ISBN', 'language']
