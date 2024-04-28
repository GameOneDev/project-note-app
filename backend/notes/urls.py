from django.urls import path
from .views import *

urlpatterns = [
    path("notes", NoteView.as_view()),
    path("users", UserView.as_view()),
    path("user-info", UserInfo.as_view()),
    path("create-note", CreateNoteView.as_view()),
    path("create-user", CreateUserView.as_view()),
    path("handle-user-connection",HandleUserConnection.as_view()),
    path("edit-note", EditNoteView.as_view()),
    path("delete-note",DeleteNoteView.as_view()),
    path("hide-note",HideNoteView.as_view()),
    path("add-collab",AddCollaborate.as_view()),
    path("delete-collab",DeleteCollaborate.as_view()),

]
