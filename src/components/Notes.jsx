import { createRef } from "react";
import Note from "./Note";
import { useEffect, useRef } from "react";

const Notes = ({ notes, setNotes }) => {
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const updatedNotes = notes.map((note) => {
      const savedNote = savedNotes.find(
        (savedNote) => savedNote.id === note.id
      );
      if (savedNote) {
        return { ...note, position: savedNote.position };
      } else {
        const position = determinePosition();
        return {
          ...note,
          position,
        };
      }
    });
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }, [notes.length]);

  const noteRefs = useRef({});

  const determinePosition = () => {
    const maxX = window.innerWidth - 250;
    const maxY = window.innerHeight - 250;

    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  };

  const updateNoteposition = (id, position) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return { ...note, position };
      } else {
        return note;
      }
    });
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleDragStart = (note, e) => {
    const { id } = note;
    const noteRef = noteRefs.current[id].current;
    const rect = noteRef.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const startPos = note.position;

    const handleMouseMove = (e) => {
      const newPosX = e.clientX - offsetX;
      const newPosY = e.clientY - offsetY;

      noteRef.style.left = `${newPosX}px`;
      noteRef.style.top = `${newPosY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      const finalRect = noteRef.getBoundingClientRect();
      const newPosition = { x: finalRect.left, y: finalRect.top };

      if (checkForOverlap(id)) {
        //check for overlap
        noteRef.style.left = `${startPos.x}px`;
        noteRef.style.top = `${startPos.y}px`;
      } else {
        updateNoteposition(id, newPosition);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const checkForOverlap = (id) => {
    const currRef = noteRefs.current[id].current;
    const rec = currRef.getBoundingClientRect();

    return notes.some((note) => {
      if (note.id === id) {
        return false;
      }
      const ref = noteRefs.current[note.id].current;
      const rect = ref.getBoundingClientRect();
      return (
        rect.left < rec.right &&
        rect.right > rec.left &&
        rect.top < rec.bottom &&
        rect.bottom > rec.top
      );
    });
  };

  return (
    <div>
      {notes.map((note) => (
        <Note
          key={note.id}
          initialPosition={note.position}
          content={note.text}
          ref={
            noteRefs.current[note.id]
              ? noteRefs.current[note.id]
              : (noteRefs.current[note.id] = createRef())
          }
          onMouseDown={(e) => handleDragStart(note, e)}
        />
      ))}
    </div>
  );
};

export default Notes;
