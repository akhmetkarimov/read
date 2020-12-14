from django.contrib import admin
from universities import models
from books.models import Category


class UniversitiesAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'abbr')
    search_fields = ('title', 'abbr')
    filter_horizontal = ('books', )

    def save_related(self, request, form, formsets, change):
        super(UniversitiesAdmin, self).save_related(
            request, form, formsets, change)
        universities = models.University.objects.get(pk=form.instance.id)
        categories = Category.objects.filter(
            pk__in=form.instance.books.values('categories'))
        all_categories_univerity = models.UniversityCategory.objects.filter(
            universities=universities).values_list('categories', flat=True)
        current_categories = form.instance.books.values_list(
            'categories', flat=True).distinct()

        if len(current_categories) < len(all_categories_univerity):
            not_equal_categories = list(
                set(all_categories_univerity) - set(current_categories))
            models.UniversityCategory.objects.filter(
                categories__in=not_equal_categories, universities=form.instance.id).delete()

        for category in categories:
            models.UniversityCategory.objects.update_or_create(
                universities=universities, categories=category)


class FAQAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', )
    search_fields = ('question', 'answer')


class UniversityReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', )
    search_fields = ('question', 'answer')


admin.site.register(models.University, UniversitiesAdmin)
admin.site.register(models.FAQ, FAQAdmin)
admin.site.register(models.UniversityReview, UniversityReviewAdmin)
