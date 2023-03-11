import { useState, useEffect } from "react";
import uuid from "react-uuid";
import Side from "./Side";
import Main from "./Main";
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

  const [newNoteAdded, setnewNoteAdded] = useState(false);
  const [enableSide, setEnableSide] = useState(true);
  const [mainWidth, setMainWidth] = useState("100%");
  const [text, setText] = useState("");
  const navigate = useNavigate();

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

  const textChange = (bodyText) => {
    setText(bodyText);
  };

  function addNote() {
    const newNote = {
      id: uuid(),
      title: "Untitled",
      body: " ",
      date: Date.now(),
    };

    setNoteList([newNote, ...noteList]);
    setnewNoteAdded(true);
  }

  const deleteNote = (noteId) => {
    const answer = window.confirm("Are you sure you want to delete this note?");
    if (!answer) return;
  
    const newNoteList = noteList.filter((note) => note.id !== noteId);
    localStorage.removeItem(currentNote.id);
    setNoteList(newNoteList);
  
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

  function getCurrentNote() {
    return noteList.find((note) => note.id == currentNote);
  }

  function toggleSide() {
    setEnableSide(!enableSide);
    setMainWidth({ width: !enableSide ? "83%" : "100%" });
  }

  return (
    <>
      <div id="top">
        <div id="title">Lotion</div>
        <div id="subTitle">Like Notion, but dripped.</div>
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
                enableSide={enableSide}
                currentNote={currentNote}
              ></Main>
            )
        )}
      </div>
    </>
  );
}

export default App;
