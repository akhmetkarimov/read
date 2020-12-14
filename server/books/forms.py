from datetime import date
from django import forms
from django.db.models import Q
from books import models


def year_choices():
    return [(r, r) for r in range(1900, date.today().year+1)]


class BookForm(forms.ModelForm):
    publish_year = forms.TypedChoiceField(
        coerce=int, choices=year_choices, initial=models.current_year)

    def __init__(self, *args, **kwargs):
        super(BookForm, self).__init__(*args, **kwargs)
        self.fields['categories'].queryset = models.Category.objects.filter(
            ~Q(parent=None))

    class Meta:
        model = models.Book
        fields = '__all__'
