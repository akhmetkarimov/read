import datetime
import requests

from django.db.models import Q
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework_sso import views as sso_views
from rest_framework_sso.models import SessionToken
from dateutil.relativedelta import relativedelta
from users import serializers
from users import mixins
from universities.models import University
from users import models


class ChangePasswordViews(APIView):
    serializer_class = serializers.ChangePasswordSerializer
    model = models.CustomUser
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        obj = self.request.user
        return obj

    def put(self, request):
        self.object = self.get_object()
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserViews(APIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = serializers.UsersSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)


class ReviewViews(APIView):
    permission_classes = (IsAuthenticated, )
    serializers_class = serializers.ReviewsPostSerilizer

    def post(self, request):
        serializer = self.serializers_class(data=request.data)
        if (serializer.is_valid()):
            serializer.save(user=request.user)
            return Response(status.HTTP_200_OK)

        return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ReviewForBookViews(ListAPIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = mixins.ReviwsSetPagination
    serializer_class = serializers.ReviewsSerilizer

    def get_queryset(self):
        return models.Review.objects.select_related(
            'user').filter(Show=True).filter(book__slug=self.kwargs['slug'])


class FavoritesViews(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializers_class = serializers.FavoritesSerilizer
    queryset = models.Favorites.objects.all()

    def create(self, request):

        try:
            exist = models.Favorites.objects.filter((Q(saved=True) | Q(saved=False)) & Q(book=request.data.get(
                'book'), user=request.user))
            if not exist:
                serializer = self.serializers_class(data=request.data)
                if serializer.is_valid():
                    serializer.save(user=request.user, saved=True)
                    return Response({'saved': True}, status.HTTP_200_OK)
            else:
                try:
                    created = models.Favorites.objects.get(book=request.data.get(
                        'book'), user=request.user, saved=False)
                    serializer = self.serializers_class(
                        instance=created, data=request.data)
                    if serializer.is_valid():
                        serializer.save(user=request.user, saved=True)
                        return Response({'saved': True}, status.HTTP_201_CREATED)
                except models.Favorites.DoesNotExist:
                    created = models.Favorites.objects.get(book=request.data.get(
                        'book'), user=request.user, saved=True)
                    serializer = self.serializers_class(
                        instance=created, data=request.data)
                    if serializer.is_valid():
                        serializer.save(user=request.user, saved=False)
                        return Response({'saved': False}, status.HTTP_201_CREATED)
        except Exception as e:
            return Response({e}, status.HTTP_400_BAD_REQUEST)


class DetailFavoritesViews(ListAPIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = mixins.FavoritesSetPagination
    serializer_class = serializers.DetailFavoritesSerilizer

    def get_queryset(self):
        return models.Favorites.objects.select_related(
            'user').select_related('book').filter(user=self.request.user, saved=True)


class CustomSessionTokenView(sso_views.ObtainSessionTokenView):

    serializer_class = serializers.KazNuSignInUserSerializer

    def post(self, request, *args, **kwargs):
        today = datetime.date.today()
        models.CustomUser.objects.filter(
            university__agreement_end_date__lt=today).update(is_active=False)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        session_token = SessionToken.objects.filter(
            user=user, revoked_at=None).first()
        if session_token is None:
            session_token = SessionToken(user=user)
        else:
            session_token.revoked_at = datetime.datetime.now()
            session_token.save()
            session_token = SessionToken(user=user)
        session_token.save()
        payload = sso_views.create_session_payload(
            session_token=session_token, user=user)
        jwt_token = sso_views.encode_jwt_token(payload=payload)
        return Response({"token": jwt_token})


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        session_token = SessionToken.objects.filter(
            user=request.user, revoked_at=None).first()
        session_token.revoked_at = datetime.datetime.now()
        session_token.save()
        return Response({"logout": True})


class KazNuUserTokenView(CustomSessionTokenView):

    def post(self, request):
        third_party = requests.Session()
        university = University.objects.get(title='КазНУ')
        if int(request.data["is_teacher"]) == 1:
            kaznu_signin_end_point = "https://univerapi.kaznu.kz/user/login?login=" + \
                request.data['username']+"&password="+request.data['password']
            response_kaznu = third_party.request(
                'GET', kaznu_signin_end_point).json()
        elif int(request.data["is_teacher"]) == 0:
            kaznu_signin_end_point = "https://univerapi.kaznu.kz/epigrof/login?elogin=" + \
                request.data['username']+"&epass="+request.data['password']
            response_kaznu = third_party.request(
                'GET', kaznu_signin_end_point).json()

        try:
            if response_kaznu['code'] == 0:
                models.CustomUser.objects.get(
                    username=request.data['username'])
                token = CustomSessionTokenView.post(self, request)
                return Response(token.data)
            else:
                return Response({"error": "not found"}, status=status.HTTP_404_NOT_FOUND)
        except models.CustomUser.DoesNotExist:
            user_info = ''.join(
                [i for i in request.data['username'] if not i.isdigit()])
            user = models.CustomUser.objects.create(
                username=request.data['username']
            )
            user.set_password(request.data['password'])
            user.university_id = university.pk
            if '.' in user_info:
                user_info = user_info.split('.')
                user.first_name = user_info[0].capitalize()
                user.last_name = user_info[1].capitalize()
            else:
                user.first_name = user_info.capitalize()

            if int(request.data["is_teacher"]) == 0:
                user.reader_role = "Студент"
            elif int(request.data["is_teacher"]) == 1:
                user.reader_role = "Преподаватель"

            user.save()
            token = CustomSessionTokenView.post(self, request)
            return Response(token.data)
        return Response({"error": "not found"}, status=status.HTTP_404_NOT_FOUND)


class UserStatisticViews(APIView):
    permission_classes = (AllowAny,)

    def update_user_time(self, today):
        current_time = datetime.datetime.now().hour-3
        SessionToken.objects.filter(Q(created_at__hour__lte=current_time) & (Q(created_at__day__lte=today.day) | Q(
            created_at__month__lte=today.month) | Q(created_at__year__lte=today.year)) | Q(created_at__lte=today), Q(revoked_at=None)).update(revoked_at=datetime.datetime.now())


    def get(self, request):
        today = datetime.date.today()
        data = today - relativedelta(months=1)
        last_month = datetime.date(data.year, data.month, 1)

        self.update_user_time(today)

        if request.user.is_anonymous:
            statistic = SessionToken.objects.filter(revoked_at=None).count()
            statistic_month = SessionToken.objects.filter(created_at__lte=mixins.last_day_of_month(
                today), created_at__gte=last_month).values('user').distinct().count()
        else:
            statistic = SessionToken.objects.filter(
                revoked_at=None, user__university=request.user.university).count()
            statistic_month = SessionToken.objects.filter(created_at__lte=mixins.last_day_of_month(
                today), created_at__gte=last_month, user__university=request.user.university).values('user').distinct().count()
        return Response({'user_count': statistic, 'month_count': statistic_month})
