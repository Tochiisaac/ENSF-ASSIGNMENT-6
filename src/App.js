import { useState, useEffect } from "react";
import Main from "./Main"
import Side from "./Side";
import uuid from "react-uuid";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [noteList, setNoteList] = useState(
    localStorage.noteList ? JSON.parse(localStorage.noteList) : []
  );

  const [currentNote, setCurrentNote] = useState(false);

  useEffect(() => {
    if (!localStorage.noteList) {
      localStorage.setItem("noteList", "[]");
    }
    setNoteList(JSON.parse(localStorage.noteList));
  }, []);

  useEffect(() => {
    localStorage.setItem("noteList", JSON.stringify(noteList));
  }, [noteList]);
  
  // 
  const [mainWidth, setMainWidth] = useState("100%");
  const [enableSide, setEnableSide] = useState(true);
  const [newNoteAdded, setnewNoteAdded] = useState(false);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  // save updated changes to note
  const saveNote = (updatedNote) => {
    const updatedNotesArr = noteList.map((note) => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      } else {
        return note;
      }
    });

    setNoteList(updatedNotesArr);
  };

  //text editing
  const textChange = (bodyText) => {
    setText(bodyText);
  };

  // creating new note function
  function addNote() {
    const newNote = {
      id: uuid(),
      title: "Untitled note",
      body: " ",
      date: Date.now(),
    };

    setNoteList([newNote, ...noteList]);
    setnewNoteAdded(true);
  }

    // note deleting function
    const deleteNote = (noteId) => {
    const answer = window.confirm("this will delete this note, press enter/return to confirm?");
    if (!answer) return;
  
    //note list
    const newNoteList = noteList.filter((note) => note.id !== noteId);
    localStorage.removeItem(currentNote.id);
    setNoteList(newNoteList);
  
    //keeps track of current note
    const currentIndex = noteList.findIndex((note) => note.id === noteId);
    const nextNoteIndex = currentIndex === 0 ? 1 : currentIndex - 1;
    let nextNoteId;
    if (newNoteList.length > 0) {
      if (nextNoteIndex === newNoteList.length) {
        nextNoteId = newNoteList[0].id;
      } else {
        nextNoteId = newNoteList[nextNoteIndex].id;
      }
    } else {
      navigate(`/notes`);
      return;
    }
    setCurrentNote(nextNoteId);
    navigate(`/notes/${nextNoteId}/edit`);
  };

  function toggleSide() {
    setEnableSide(!enableSide);
    setMainWidth({ width: !enableSide ? "83%" : "100%" });
  }  
  
 function getCurrentNote() {
    return noteList.find((note) => note.id == currentNote);
  }



  // main front page 
  return (
    <>
      <div id="top">
        <div id="title">Lotion</div>
        <div id="subTitle">Like Notion, but different.</div>
        <div id="icon">
          <button id="enableSide" onClick={toggleSide}>
            &#9776;
          </button>
        </div>
      </div>
      <div id="middle">
        {enableSide && (
          <Side
            noteList={noteList}
            addNote={addNote}
            currentNote={currentNote}
            setCurrentNote={setCurrentNote}
            newNoteAdded={newNoteAdded}
            textChange={textChange}
            text={text}
          ></Side>
        )}

        {noteList.map(
          (note) =>
            note.id === currentNote && (
              <Main
                note={note}
                key={note.id}
                noteList={noteList}
                deleteNote={deleteNote}
                getCurrentNote={getCurrentNote}
                saveNote={saveNote}
                newNoteAdded={newNoteAdded}
                currentNote={currentNote}
                enableSide={enableSide}
                
              ></Main>
            )
        )}
      </div>
    </>
  );
}

export default App;