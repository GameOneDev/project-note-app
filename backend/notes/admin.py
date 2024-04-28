from django.contrib import admin
from notes.models import User, Note

# Register your models here.
# admin.site.register(User) # old
admin.site.register(Note)
