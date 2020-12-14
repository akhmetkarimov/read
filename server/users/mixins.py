from calendar import monthrange
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class ReviwsSetPagination(PageNumberPagination):
    page_size = 5
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'page_count': self.page.paginator.num_pages,
            'reviews': data
        })


class FavoritesSetPagination(PageNumberPagination):
    page_size = 16
    max_page_size = 1000

    def get_paginated_response(self, data):
        changed = []
        for item in data:
            changed.append(item['book'])
        return Response({
            'page_count': self.page.paginator.num_pages,
            'favorites': changed
        })


def last_day_of_month(date_value):
    return date_value.replace(day=monthrange(date_value.year, date_value.month)[1])
