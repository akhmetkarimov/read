from django.urls import path
import universities.views as views

urlpatterns = [
    path('faq', views.FAQViews.as_view()),
    path('university_reviews', views.UniversityReviewViews.as_view()),
    path('university_request', views.RequestUniversityViews.as_view()),
]
