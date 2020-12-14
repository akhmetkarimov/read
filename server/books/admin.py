import os
from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin
from import_export.admin import ImportExportModelAdmin
from books import models
from books import encryptBook
from books import forms
from books import resources


def book_encrypt(obj):
    book = models.Book.objects.get(pk=obj.id)
    if encryptBook.encryptFile(book.book_content_pdf.path, book.password) is True:
        os.remove(book.book_content_pdf.path)
        enc_path = book.book_content_pdf.name[:-4]+'_encrypted.pdf'
        book.book_content_pdf.name = enc_path
        book.save()


class BooksAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = resources.BookResource
    list_display = ('id', 'title', 'slug', 'language', 'is_featured')
    filter_horizontal = ('authors', 'categories')
    list_filter = ('language', 'categories', 'is_featured')
    search_fields = ('title', 'slug', 'authors__full_name')
    list_editable = ('is_featured',)
    form = forms.BookForm
    add_form = forms.BookForm

    def get_object(self, request, object_id, from_field=None):
        obj = super(BooksAdmin, self).get_object(request, object_id)
        return obj

    def save_model(self, request, obj, form, change):
        if change is True:
            super().save_model(request, obj, form, change)
        else:
            obj.password = encryptBook.encryptPasswordField(obj.password)
            super().save_model(request, obj, form, change)
        book_encrypt(obj)


class AuthorsAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('id', 'full_name', 'slug')
    search_fields = ('full_name', 'slug',)


class LanguagesAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('id', 'language', 'slug')
    search_fields = ('language', 'slug',)


@admin.register(models.Category)
class CategoryAdmin(ImportExportModelAdmin, DraggableMPTTAdmin):
    resource_class = resources.CategoryResource


class RecBooksAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug')
    filter_horizontal = ('authors', )


admin.site.register(models.Book, BooksAdmin)
admin.site.register(models.Author, AuthorsAdmin)
admin.site.register(models.Language, LanguagesAdmin)
admin.site.register(models.RecommendedBook, RecBooksAdmin)
