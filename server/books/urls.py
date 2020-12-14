from django.urls import path
from books import views

urlpatterns = [
    path('books', views.BooksViews.as_view()),
    path('recommended', views.RecBooksViews.as_view()),
    path('categories', views.CategoryViews.as_view()),
    path('books/<slug:slug>', views.BooksDetailViews.as_view()),
    path('Books/<str:file_name>', views.SendEncryptedBookViews.as_view()),
    path('books/show_pdf/<str:file_name>',
         views.SendEncryptedBookViews.as_view()),

    path('search_authors', views.SearchAuthorViews.as_view()),
    path('search_categories', views.SearchCategoriesViews.as_view()),
    path('search_isbns', views.SearchISBNViews.as_view()),
    path('search_languages', views.SearchLanguageViews.as_view()),
]
