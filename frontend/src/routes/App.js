import React, {useEffect, useState} from 'react';
import axios from "axios";
import { API_URL } from '../constants';
import Note from '../components/Note';
import { Box, Button, Divider, Input, Textarea } from '@chakra-ui/react';

function App() {

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({note_text: "", title: ""});
    
    useEffect(()=>{

        // axios/fetch request do backendu, aby dostać notes-y. 
        // wysyłamy do backend token, backend nam zwraca listę notes-ów 
                
        // przykład
        // pobieramy notes-y i wstawiamy w state-cie
        fetchNotes()
         .then(notes => setNotes(notes))
    
    },[]);

    const fetchNotes = async () =>{

        // Coś takiego ma być
        // const data = await axios.post(API_URL + "notes",{token})

        // if(data.ok){
        //     return data;
        // }

        // przykładowe dane

        return [
            {note_text: "Description1", title: "Title1"},
            {note_text: "Description2", title: "Title2"},
            {note_text: "Description3", title: "Title3"},
        ]
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
        <>
            
            <Box m={4}>
                <Input onChange={changeNoteTitle} maxW={"md"} placeholder='Add Title' />
                <Divider maxW={"md"} />
                <Textarea maxW={"md"} placeholder='Add Description' />
                <Divider maxW={"md"} />
                <Button onClick={addNote}>Add Note!</Button>
            </Box>

            {/* wyświetlenie listy Notes-ów */}
            {notes.map((note,index)=>{
                return(
                    <div index={index}>
                        <Note noteHeader={note.title} noteDescription={note.note_text} />
                    </div>
                )
            })}
        </>        
    )
        
}

export default App;
