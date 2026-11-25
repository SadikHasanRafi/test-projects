# Data migration: adds sample books when you run `migrate`.
from django.db import migrations


def add_books(apps, schema_editor):
    Book = apps.get_model("books", "Book")
    Book.objects.create(title="Clean Code", author="Robert C. Martin", year=2008)
    Book.objects.create(title="The Pragmatic Programmer", author="Andy Hunt", year=1999)


class Migration(migrations.Migration):
    dependencies = [("books", "0001_initial")]
    operations = [migrations.RunPython(add_books, migrations.RunPython.noop)]
