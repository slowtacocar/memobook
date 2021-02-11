import React from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

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
    <Container fluid className="note d-flex flex-column py-3">
      <FormControl
        as="div"
        ref={noteBody}
        contentEditable
        className="note-text flex-grow-1 mb-3"
        dangerouslySetInnerHTML={{
          __html: props.openDoc.get("html"),
        }}
      />
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="tags">Tags</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          className="tags-text"
          aria-describedby="tags"
          defaultValue={openTags ? openTags.join() : ""}
          ref={tagsRef}
        />
      </InputGroup>
      <div>
        <Button onClick={saveNote}>Save Changes</Button>
        <Button variant="secondary" onClick={closeNote}>
          Close Note
        </Button>
        <Button variant="danger" className="float-right" onClick={deleteNote}>
          Delete
        </Button>
      </div>
    </Container>
  );
}

export default EditNote;
