from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from users import models


class CustomUserCreationForm(UserCreationForm):
    reader_role = forms.ChoiceField(
        label='Roles',
        choices=(
            ('Студент', 'Студент'),
            ('Преподаватель', 'Преподаватель'),
        ),
        widget=forms.RadioSelect,
        required=False
    )

    class Meta(UserCreationForm):
        model = models.CustomUser
        fields = UserCreationForm.Meta.fields + \
            ('groups', "middle_name", "university", "reader_role")

    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)
        self.fields['reader_role'].required = False
        self.fields['password1'].required = False
        self.fields['password2'].required = False
        self.fields['password1'].widget.attrs['autocomplete'] = 'off'
        self.fields['password2'].widget.attrs['autocomplete'] = 'off'

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = super(CustomUserCreationForm, self).clean_password2()
        if bool(password1) ^ bool(password2):
            raise forms.ValidationError("Fill out both fields")
        return password2


class CustomUserCreationFormLibrarian(UserCreationForm):
    reader_role = forms.ChoiceField(
        label='Roles',
        choices=(
            ('Студент', 'Студент'),
            ('Преподаватель', 'Преподаватель'),
        ),
        widget=forms.RadioSelect,
        required=False
    )

    class Meta:
        model = models.CustomUser
        fields = ('first_name', 'last_name', 'middle_name',
                  'email', 'username', "reader_role")

    def __init__(self, *args, **kwargs):
        super(CustomUserCreationFormLibrarian, self).__init__(*args, **kwargs)
        self.fields['password1'].required = False
        self.fields['password2'].required = False
        self.fields['password1'].widget.attrs['autocomplete'] = 'off'
        self.fields['password2'].widget.attrs['autocomplete'] = 'off'

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = super(CustomUserCreationFormLibrarian,
                          self).clean_password2()
        if bool(password1) ^ bool(password2):
            raise forms.ValidationError("Fill out both fields")
        return password2


class CustomUserChangeForm(UserChangeForm):
    reader_role = forms.ChoiceField(
        label='Roles',
        choices=(
            ('Студент', 'Студент'),
            ('Преподаватель', 'Преподаватель'),
        ),
        widget=forms.RadioSelect,
        required=False
    )

    class Meta(UserChangeForm):
        model = models.CustomUser
        fields = UserChangeForm.Meta.fields
