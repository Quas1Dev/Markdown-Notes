import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import { nanoid } from "nanoid"


export default function App() {
    // notes is lazily initialized here *1
    const [notes, setNotes] = React.useState(
        () => JSON.parse(window.localStorage.getItem("notes")) || []
    )

    React.useEffect(() => {
        window.localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])

    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }

    function updateNote(text) {
        setNotes( oldNotes => {
            let newNotes = []

            for (let i = 0; i < oldNotes.length; i++) {
                const currNote = oldNotes[i];

                if (currNote.id === currentNoteId) {
                    newNotes.unshift({...currNote, body: text})
                } else {
                    newNotes.push(currNote)
                }
                
            }

            return newNotes;
        })
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    function deleteNote(event, noteId){
        event.stopPropagation();
        console.log("Deleting note:",noteId);
        setNotes(oldNotes => oldNotes.filter(oldNote => oldNote.id != noteId));
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={findCurrentNote()}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={findCurrentNote()}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}

/*
Dev's comment

*1 - We keep state in this component, which is nitialized using React.useState() function. 

Everytime this state is updated, a new rendering process is fired. As the initalization 
instruction is part of the component instructions, it is read again. Of course, React is 
smart enough to ignore this command, as it is tracking the state value separately,

However, React will read and execute an initializer, even though it does ignore what it is
trying to insert into the state. Therefore, if the initializer includes a really heavy 
set of commands, we should add some code that is guaranteed to run only once.

The instruction to accomplish that is a function. A function is guaranteed to execute only 
one time when found in an initializer instruction.

*/