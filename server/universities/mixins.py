from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class FAQSetPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'page_count': self.page.paginator.num_pages,
            'FAQs': data
        })
