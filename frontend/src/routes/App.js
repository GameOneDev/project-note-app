import React, {useEffect, useState} from 'react';
import axios from "axios";
import { API_URL } from '../constants';
import Note from '../components/Note';
import { Box, Button, Divider, Input, Textarea, Flex } from '@chakra-ui/react';
import Cookies from 'js-cookie';

function App() {

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({note_text: "", title: ""});

    const [selectedNote, setSelectedNote] = useState(null);
    
    useEffect(()=>{

        // axios/fetch request do backendu, aby dostać notes-y. 
        // wysyłamy do backend token, backend nam zwraca listę notes-ów 
        const token = Cookies.get('token');
        // przykład
        // pobieramy notes-y i wstawiamy w state-cie
        fetchNotes(token)
         .then(notes => setNotes(notes))
    
    },[]);

    const fetchNotes = async (token) => {
        try {
            // Send a POST request to fetch notes with the token
            const response = await axios.post(
                API_URL + "notes",
                {}, // Empty data object
                {
                    headers: {
                        Authorization: `Token ${token}` // Set Authorization header
                    }
                }
            );

            if (response.status === 200) {
                // Update notes state with the received data
                return response.data;
            } else {
                console.error("Failed to fetch notes:", response.data);
                return [];
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle the error accordingly
            return [];
        }
    }

    const addNote = async () =>{
        // Coś takiego ma być
        // const data = await axios.post(API_URL + "/add-note",{note_text,token})

        // if(data.ok){
        //     dodajemy Note do listy wszystkich Note-ów
        //     setNewNote(prev=>[...prev,newNote])
        // }
    }     

    // function changeNoteTitle(e){
    //     setNewNote((prev)=> {note_text:prev.note_text,title: e.target.value})
    // }

    return (
        <Flex bg="gray.800" h="100vh"> {/* Set background color and full height */}
      <Box w="25%" p={4} overflowY="auto"> {/* Make the left panel scrollable */}
        <Input
          placeholder="Add Title"
          mb={2}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <Divider />
        <Textarea
          placeholder="Add Description"
          mb={2}
          onChange={(e) => setNewNote({ ...newNote, note_text: e.target.value })}
        />
        <Divider />
        <Button onClick={addNote} colorScheme="blue" mb={2}>
          Add Note
        </Button>

        {notes.map((note, index) => (
          <Box key={index} onClick={() => setSelectedNote(note)} cursor="pointer">
            <Note
              noteHeader={note.title}
              noteDescription={note.note_text.length > 50 ? note.note_text.substring(0, 50) + '...' : note.note_text}
            />
            <Divider />
          </Box>
        ))}
      </Box>

      <Box bg="gray.900" w="75%" p={4}>
        {selectedNote && (
          <Note noteHeader={selectedNote.title} noteDescription={selectedNote.note_text} />
        )}
      </Box>
    </Flex>
    );
}

export default App;