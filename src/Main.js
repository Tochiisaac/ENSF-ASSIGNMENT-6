import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

//main page function 
function Main({
  note,
  noteList,
  newNoteAdded,
  saveNote,
  deleteNote,
  currentNote,
  enableSide,
  getCurrentNote,

}) {
  const navigate = useNavigate();
  const [noteContent, setNoteContent] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(Date.now());
  const [editing, setEditing] = useState(false);
  

  useEffect(() => {
    console.log(getCurrentNote().title);
    console.log(getCurrentNote().body);
    setTitle(getCurrentNote().title);
    setNoteContent(getCurrentNote().body);
  }, [currentNote]);

  //editing constructors
  const handleEdit = () => {
    setEditing(false);
    navigate(`/notes/${currentNote}/edit`); 
  }; 
  
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleChange = (value) => {
    setNoteContent(value);
  };

  const handleSaveNote = () => {
    console.log(typeof date);
    const note = {
      id: currentNote,
      title: document.getElementById("noteTopText").value,
      date: date,
      body: noteContent,
    };
    navigate(`/notes/${currentNote}`); 
    saveNote(note);
    setEditing(true);
  };

  if (!newNoteAdded || noteList.length == 0) {
    return (
      <div
        id="mainBox"
        style={enableSide ? { width: "100%" } : { width: "100%" }}
      >
        <div id="mainNoteMessage">Select a note, or create a new one.</div>
      </div>
    );
  }

//main page formatting
  return (
    <>
      <div
        id="mainBox"
        style={{
          overflowY: "scroll",
          height: "100vh",
          ...(enableSide ? { width: "100%" } : { width: "100%" }),
        }}
      >
        <div id="noteTop">
          <div id="leftTop">
            <input
              type="text"
              id="noteTopText"
              placeholder="Untitled"
              value={title}
              onChange={handleTitleChange}
              autoFocus
            ></input>

            <div id="currentDate">
              <input
                id="calendarbutton"
                type="datetime-local"
                defaultValue={new Date(note.date - 25200000)
                  .toISOString()
                  .slice(0, 19)}
                onChange={(e) => setDate(Date.parse(e.target.value))}
              />
            </div>
          </div>

          <div id="rightTop">
            {editing ? (
              <button onClick={handleEdit} id="editNote"> 
                Edit
              </button>
            ) : (
              <button onClick={handleSaveNote}  id="saveNote"> 
                Save
              </button>
            )}

            <button // button for current note
              onClick={() => {
                const currentNote = getCurrentNote();
                if (currentNote) {
                  deleteNote(currentNote.id);
                }
              }}
              id="deleteNote"
            >
              Delete
            </button>
          </div>
        </div>

        {!editing ? ( //for editing notes
          <div id="noteEdit">
            <ReactQuill
              placeholder="Write your note here..."
              value={noteContent}
              onChange={handleChange}
            ></ReactQuill>
          </div>
        ) : (<div id="newNoteContent" dangerouslySetInnerHTML={{__html: noteContent}}></div>)}
      </div>
    </>
  );
}

export default Main;