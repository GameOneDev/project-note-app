from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from .serializers import NoteSerializer, UserSerializer
from .models import Note, Note_collab
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q




# USERS
class UserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  # Get the authenticated user
        users = User.objects.all()
        user_data = [{"username": user.username, "id": user.id} for user in users]
        return Response(user_data, status=status.HTTP_200_OK)

class UserInfo(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  # Get the authenticated user
        serializer = UserSerializer(user)  # Serialize the user object
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateUserView(APIView):

    def post(self, request):
        form = UserCreationForm(request.data)
        if form.is_valid():
            form.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class HandleUserConnection(APIView):
    queryset = User.objects.all()

    def post(self, request):
        username = request.data.get('login')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Please provide login and password'}, status=status.HTTP_418_IM_A_TEAPOT)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Generate or get an existing token for the user
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
# ---------------------------
# NOTES
class NoteView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


    def post(self, request):
        user = request.user  # Get the authenticated user
        limit = int(request.POST.get('limit', 100))
        # notes = Note.objects.filter(owner=user, vissible=True).order_by('-pub_date')[:limit]  # Filter notes by the authenticated user

        notes = Note.objects.filter(
            Q(owner=user) | Q(note_collab__collaborant_id=user),
            vissible=True
        ).prefetch_related('note_collab_set__collaborant').order_by('-pub_date').distinct()[:limit]

        serializer = NoteSerializer(notes, many=True)  # Serialize the notes
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CreateNoteView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user  # Get the authenticated user
        if(note_text := request.data.get('note_text')) is None: 
            return Response({'error': 'Empty note is not accepted'}, status=status.HTTP_418_IM_A_TEAPOT)
       
        try:
            owner = user
            Note.objects.create(
                note_text=note_text,
                pub_date=timezone.now(),
                owner=owner
            )
            return Response({'message': 'Note created successfully'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_418_IM_A_TEAPOT)


class EditNoteView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user  # Get the authenticated user
        note_text = request.data.get('note_text')
        note_id = request.data.get('note_id')
    
        try:
            db_note = Note.objects.get(id=note_id)
            if not db_note.protected:
                db_note.note_text = note_text
                db_note.edit_date = timezone.now()
                db_note.save()
                return Response({'message': 'Note edited successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Note is protected and cannot be edited'}, status=status.HTTP_418_IM_A_TEAPOT)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_418_IM_A_TEAPOT)

# delete note
class HideNoteView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user  # Get the authenticated user
        note_id = request.data.get('note_id')
        try:
            owner = user
            Note.objects.filter(id=note_id).delete()
            return Response({'message': 'Note deleted successfully'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_418_IM_A_TEAPOT)

# hide Note
class DeleteNoteView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user  # Get the authenticated user
        note_id = request.data.get('note_id')
        hide = request.data.get('hide', True)

        if hide in (0, 1):  # Check if 'hide' is either 0 or 1
            try:
                # Retrieve the note from the database
                db_note = Note.objects.get(id=note_id)

                # Check if the note is protected
                if not db_note.protected:
                    # If not protected, update its visibility based on 'hide'
                    db_note.vissible = not bool(hide)
                    db_note.save()
                    action = "hidden" if hide else "unhidden"
                    return Response({'message': f'Note {action} successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Note is protected and cannot be hidden'}, status=status.HTTP_418_IM_A_TEAPOT)
            except Note.DoesNotExist:
                return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Wrong hide option, only 0 or 1 allowed'}, status=status.HTTP_400_BAD_REQUEST)
# -------------------------------------------------
# Collaborators
class AddCollaborate(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user  # Get the authenticated user
        collaborant_id = request.data.get('collaborant_id')
        note_id = request.data.get('note_id')
        try:
            Note_collab.objects.create(
                note_id = note_id,
                collaborant_id = collaborant_id

            )
            return Response({'message': 'collaborant added successfully'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_418_IM_A_TEAPOT)


class DeleteCollaborate(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user  # Get the authenticated user
        collaborant_id = request.data.get('collaborant_id')
        note_id = request.data.get('note_id')
       
        try:
            Note_collab.objects.filter(note_id=note_id,collaborant_id = collaborant_id).delete()
            return Response({'message': 'collaborant removed successfully'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_418_IM_A_TEAPOT)


            


