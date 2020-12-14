from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from universities.models import University
from books.models import Book


class CustomUser(AbstractUser):
    middle_name = models.CharField(max_length=255, null=True, blank=True)
    university = models.ForeignKey(
        University, on_delete=models.CASCADE, blank=True, null=True)
    reader_role = models.CharField(max_length=255, null=True, blank=True)


class Review(models.Model):
    review_content = models.TextField()
    star = models.FloatField(default=5,
                             validators=[
                                 MaxValueValidator(5),
                                 MinValueValidator(1)
                             ])
    user = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, blank=True, null=True)
    book = models.ForeignKey(
        Book, on_delete=models.SET_NULL, blank=True, null=True, related_name='reviews')
    is_show = models.BooleanField(
        default=False, help_text='Одобрение для публикаций отзыва', name='Show')


class Favorites(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    book = models.ForeignKey(
        Book, on_delete=models.SET_NULL, blank=True, null=True, related_name='favorites')
    is_save = models.BooleanField(default=False, name='saved')
