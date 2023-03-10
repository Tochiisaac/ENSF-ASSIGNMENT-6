import { useEffect, useState } from "react";
import uuid from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// side functions
function Side({
  noteList,
  setCurrentNote,
  currentNote,
  addNote,
  newNoteAdded,
  textChange,
  text,
}) {
  const navigate = useNavigate();
  const { noteId } = useParams();

  useEffect(() => {
    const index = Number(noteId) - 1;
    if (index >= 0) {
      setCurrentNote(noteList[index].id);
    }
  }, [setCurrentNote, noteList, useParams]);

  //options
  const options = {
    month: "long", 
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  //date
  const formatDate = (when) => {
    const formatted = new Date(when).toLocaleString("en-US", options);
    if (formatted === "Date is invalid") {
      return "";
    }
    return formatted;
  };

  // new note button
  if (!newNoteAdded || noteList.length == 0) {
    return (
      <div id="sideBox">
        <div id="sideTitle">
          &nbsp;Notes
          <button onClick={addNote} id="addNote">
            +
          </button>
        </div>
        <div id="sideNoteMessage">No Note Yet.</div>
      </div>
    );
  }

  // side page formatting
  return (
    <>
      <div id="sideBox">
        <div id="sideTitle">
          &nbsp;Notes
          <button onClick={addNote} id="addNote">
            +
          </button>
        </div>

        <div
          id="noteListContainer"
          style={{ overflowY: "scroll", height: "100vh" }}
        >
          {noteList.map((note) => (
            <Link to={`/notes/${note.id}/edit`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              key={note.id}
              className={`sideData ${note.id == currentNote && "active"}`}
              onClick={() => {
                setCurrentNote(note.id);
              }}
            >
              <div id="noteTitle">{note.title}</div>
              <div id="datetime">{formatDate(note.date)}</div>
              <ReactQuill
                readOnly={true}
                id="sideBody"
                modules={{ toolbar: false }}
                value={note.body.slice(0, 50) + "..."}
              ></ReactQuill>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Side;