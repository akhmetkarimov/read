from rest_framework import serializers
from users import models
from books.serializers import BookSerializer
from rest_framework_sso.serializers import SessionTokenSerializer


class ChangePasswordSerializer(serializers.Serializer):
    model = models.CustomUser

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ("id", "first_name", "last_name",
                  "username", "email", "university", 'reader_role')


class ReviewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ("first_name", "last_name", "middle_name")


class ReviewsSerilizer(serializers.ModelSerializer):
    user = ReviewUserSerializer(read_only=True)

    class Meta:
        model = models.Review
        fields = ('review_content', 'book', 'star', 'user')


class ReviewsPostSerilizer(serializers.ModelSerializer):
    user = ReviewUserSerializer(read_only=True)

    class Meta:
        model = models.Review
        fields = ('review_content', 'book', 'star', 'user')


class FavoritesSerilizer(serializers.ModelSerializer):

    class Meta:
        model = models.Favorites
        fields = ('id', 'user', 'book', 'saved')


class DetailFavoritesSerilizer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = models.Favorites
        fields = ('book',)


class KazNuSignInUserSerializer(SessionTokenSerializer):
    is_teacher = serializers.CharField(required=False, allow_null=True)
