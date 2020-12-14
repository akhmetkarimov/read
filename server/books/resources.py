from import_export import resources, fields
from import_export.widgets import ManyToManyWidget, ForeignKeyWidget
from books.models import Book, Category


class BookResource(resources.ModelResource):
    categories = fields.Field(column_name='categories', attribute='categories',
                              widget=ManyToManyWidget(Category, separator=',', field='id'))

    class Meta:
        model = Book
        skip_unchanged = True
        report_skipped = True
        batch_size = 5000

        exclude = ('id', )

        import_id_fields = ('title', 'annotation', 'ISBN', 'publish_year',
                            'language', 'slug', 'password', 'book_cover', 'book_content_pdf')

    def before_save_instance(self, instance, using_transactions, dry_run):
        instance.book_cover = 'images/Books/'+instance.book_cover.name
        instance.book_content_pdf = 'store/Books/'+instance.book_content_pdf.name
        return instance


class CategoryResource(resources.ModelResource):
    parent = fields.Field(column_name='parent', attribute='parent',
                          widget=ForeignKeyWidget(Category, 'id'))

    class Meta:
        model = Category
        skip_unchanged = True
        report_skipped = True
        exclude = ('lft', 'rght', 'tree_id', 'level')
        fields = ('id', 'category_direction', 'slug', 'parent')
