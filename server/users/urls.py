from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from users import views

urlpatterns = [
    path('signin/', views.CustomSessionTokenView.as_view()),
    path('signin_kaznu', views.KazNuUserTokenView.as_view()),
    path('logout', views.LogoutView.as_view()),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('current/', views.CurrentUserViews.as_view()),
    path('change_password', views.ChangePasswordViews.as_view()),
    path('review', views.ReviewViews.as_view()),
    path('review/<slug:slug>', views.ReviewForBookViews.as_view()),
    path('favorite', views.FavoritesViews.as_view()),
    path('favorites_list', views.DetailFavoritesViews.as_view()),
    path('statistic', views.UserStatisticViews.as_view()),
]
