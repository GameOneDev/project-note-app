from django.urls import path
from .views import *

urlpatterns = [
    path("notes", NoteView.as_view()),
    path("users", UserView.as_view()),
    path("create-note", CreateNoteView.as_view()),
    path("create-user", CreateUserView.as_view()),
    path("handle-user-connection",HandleUserConnction.as_view()),
]
