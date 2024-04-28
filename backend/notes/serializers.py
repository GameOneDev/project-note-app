from rest_framework import serializers
from .models import Note, Note_collab
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "last_login", "first_name", "last_name", "email", "date_joined")

class NoteSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()  # Use the UserSerializer for the owner field
    collaborators = serializers.SerializerMethodField()

    def get_owner(self, note):
        return note.owner.username  # Get the username of the owner

    def get_collaborators(self, note):
        return [{"username": collaborator.collaborant.username, "id": collaborator.collaborant.id} for collaborator in note.note_collab_set.all()]

    class Meta:
        model = Note
        fields = ("pk", "note_text", "pub_date", "edit_date", "owner", "collaborators", "protected")
