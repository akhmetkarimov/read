from rest_framework import serializers
from universities import models


class UniversitiesSerializer(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = models.University
        fields = ("id", "abbr", "title", "categories")


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = models.FAQ
        fields = ("id", "question", "answer")


class UniversityReviewSerializer(serializers.ModelSerializer):
    class Meta:
        ordering = ['-id']
        model = models.UniversityReview
        fields = ("id", "full_name", "position", "avatar", "content")


class RequestUniversitySerializer(serializers.Serializer):
    full_name = serializers.CharField()
    phone_number = serializers.CharField()
    email = serializers.EmailField()
    org_title = serializers.CharField()
