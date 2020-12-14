from import_export import resources
from users.models import CustomUser


class UserResource(resources.ModelResource):

    class Meta:
        model = CustomUser
        skip_unchanged = True
        report_skipped = True
        exclude = ('id', 'password', 'last_login', 'is_superuser', 'groups',
                   'user_permissions', 'is_staff', 'is_active', 'date_joined', 'university')
        import_id_fields = ('username', 'email', 'first_name',
                            'last_name', 'middle_name', 'reader_role')

    def before_save_instance(self, instance, using_transactions, dry_run):
        instance.set_password('Password1122')
        return instance

    def after_import_instance(self, instance, new, **kwargs):
        instance.university = kwargs['user'].university
        instance.university_id = kwargs['user'].university_id
        return instance
