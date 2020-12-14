from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from import_export.admin import ImportExportModelAdmin
from universities.models import University
from users import forms
from users import models
from users import resources



class CustomUserAdmin(UserAdmin, ImportExportModelAdmin):
    actions = ["Reset_Password"]
    resource_class = resources.UserResource
    model = models.CustomUser
    ordering = ('email', )
    list_display = ["id", "username", "is_active", 'university']
    list_filter = ('university', 'is_active', 'reader_role')
    add_form = forms.CustomUserCreationForm
    form = forms.CustomUserChangeForm
    list_per_page = 10

    def Reset_Password(self, request, queryset):
        for user in queryset:
            user.set_password('Password1122')
            user.save()

    def has_import_permission(self, request):
        if not request.user.is_superuser and models.CustomUser.objects.filter(university=request.user.university, is_staff=False).count() >= University.objects.filter(pk=request.user.university_id).values('user_count')[0]['user_count']:
            return False
        return True

    def has_add_permission(self, request):
        if not request.user.is_superuser and models.CustomUser.objects.filter(university=request.user.university, is_staff=False).count() >= University.objects.filter(pk=request.user.university_id).values('user_count')[0]['user_count']:
            return False
        return True

    def get_queryset(self, request):
        qs = super(CustomUserAdmin, self).get_queryset(request)
        if request.user.is_superuser:
            return qs.filter(is_superuser=False)
        return qs.filter(is_superuser=False, is_staff=False, university=request.user.university)

    def save_model(self, request, obj, form, change):
        if request.user.is_superuser:
            if not change and (not form.cleaned_data['password1'] or not obj.has_usable_password()):
                obj.set_password('Password1122')
            super(CustomUserAdmin, self).save_model(request, obj, form, change)

        if request.user.is_staff and not request.user.is_superuser and change is False:
            if not change and (not form.cleaned_data['password1'] or not obj.has_usable_password()):
                obj.set_password('Password1122')
                obj.university = request.user.university
                super(CustomUserAdmin, self).save_model(
                    request, obj, form, change)

        if change is True:
            super(CustomUserAdmin, self).save_model(request, obj, form, change)

    def get_form(self, request, obj=None, **kwargs):
        if request.user.is_staff and not request.user.is_superuser:
      
            self.add_form = forms.CustomUserCreationFormLibrarian
            self.add_fieldsets = (
                (
                    None,
                    {
                        "classes": ("wide",),
                        "fields": ("username", "email", "first_name", "last_name", "middle_name", "reader_role"),
                    },
                ),
            )
            self.fieldsets = (
                (None, {'fields': ('email', 'username', 'is_active',)}),
                ('Personal info', {'fields': ("first_name",
                                              "last_name", "middle_name", 'reader_role')}),
            )
        elif request.user.is_staff and request.user.is_superuser:

            self.add_fieldsets = (
                (
                    "Personal Information",
                    {
                        "classes": ("wide",),
                        "fields": ("username", "email", "first_name",  "last_name", "middle_name", "university"),
                    },
                ),
            )

            self.fieldsets = (
                (None, {'fields': ('email', 'username',
                                   'password', 'is_staff', 'is_active',)}),
                ('Personal info', {'fields': ("first_name",
                                              "last_name", "middle_name", "university", 'reader_role')}),
                ('Permissions', {'fields': ('user_permissions',)}),
            )

        return super(CustomUserAdmin, self).get_form(request, obj, **kwargs)


class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'book', 'user', 'Show',)


admin.site.register(models.CustomUser, CustomUserAdmin)
admin.site.register(models.Review, ReviewAdmin)
