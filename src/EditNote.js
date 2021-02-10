import React from "react";

function EditNote(props) {
  const noteBody = React.useRef();
  const tagsRef = React.useRef();

  function closeNote() {
    props.close();
  }

  function saveNote() {
    const tagsArr = [
      ...(tagsRef.current.value === ""
        ? []
        : tagsRef.current.value.split(",").map((str) => str.trim())),
      "All notes",
    ];
    props.openDoc.ref.update({
      html: noteBody.current.innerHTML,
      tags: tagsArr,
    });
  }

  async function deleteNote() {
    await props.openDoc.ref.delete();
    props.close();
  }

  let openTags = props.openDoc.get("tags");
  openTags.splice(openTags.indexOf("All notes"), 1);

  return (
    <div className="note container-fluid d-flex flex-column py-3">
      <div
        ref={noteBody}
        contentEditable
        className="form-control note-text flex-grow-1 mb-3"
        dangerouslySetInnerHTML={{
          __html: props.openDoc.get("html"),
        }}
      />
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Tags</span>
        </div>
        <input
          type="text"
          className="form-control tags-text"
          aria-describedby="tags"
          defaultValue={openTags ? openTags.join() : ""}
          ref={tagsRef}
        />
      </div>
      <div>
        <button type="button" className="btn btn-primary" onClick={saveNote}>
          Save Changes
        </button>
        <button type="button" className="btn btn-secondary" onClick={closeNote}>
          Close Note
        </button>
        <button
          type="button"
          className="btn btn-danger float-end"
          onClick={deleteNote}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default EditNote;
