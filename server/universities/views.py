from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny
from rest_framework import status
from universities import models
from universities import serializers
from universities import utils


class FAQViews(ListAPIView):
    serializer_class = serializers.FAQSerializer
    filter_backends = (SearchFilter,)
    search_fields = ('question', 'answer',)

    def get_queryset(self):
        return models.FAQ.objects.all()


class UniversityReviewViews(ListAPIView):
    serializer_class = serializers.UniversityReviewSerializer
    queryset = models.UniversityReview.objects.all()


class RequestUniversityViews(APIView):
    permission_classes = (AllowAny,)
    serializer_class = serializers.RequestUniversitySerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email_body = 'Заявка на Read.kz \n' +\
            'Имя клиента: '+request.data['full_name']+'\n' + \
            'Номер тел: ' + request.data['phone_number'] + '\n' + \
            'Email: '+request.data['email']+'\n' + \
            'Название организации: '+request.data['org_title']

        data = {'email_body': email_body, 'to_email': 'baspa@kaznu.kz',
                'email_subject': 'Заявка на Read.kz'}

        utils.Util.send_email(data)

        return Response({"created": True}, status=status.HTTP_201_CREATED)
