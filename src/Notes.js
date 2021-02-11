import React from "react";
import EditNote from "./EditNote";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function Notes(props) {
  const [tagged, setTagged] = React.useState([]);
  const [tags, setTags] = React.useState({ "All notes": true });
  const [openDoc, setOpenDoc] = React.useState();

  React.useEffect(() => {
    if (props.notesRef) {
      return props.notesRef.onSnapshot((snapshot) => {
        setTags({
          ...Object.fromEntries(
            [].concat(
              ...snapshot.docs.map((doc) =>
                doc.get("tags").map((tag) => [tag, false])
              )
            )
          ),
          "All notes": true,
        });
      });
    }
  }, [props.notesRef]);

  React.useEffect(() => {
    if (props.notesRef) {
      return props.notesRef
        .where(
          "tags",
          "array-contains-any",
          Object.entries(tags)
            .filter(([, value]) => value)
            .map(([key]) => key)
        )
        .onSnapshot((snapshot) => {
          setTagged(snapshot.docs);
        });
    }
  }, [props.notesRef, tags]);

  function selectTag(key) {
    const newTags = { ...tags };
    if (key === "All notes") {
      for (const tag in newTags) {
        newTags[tag] = false;
      }
      newTags["All notes"] = true;
    } else {
      newTags[key] = !newTags[key];
      const length = Object.values(newTags).filter((val) => val).length;
      if (length <= 0) {
        newTags["All notes"] = true;
      } else if (length > 1) {
        newTags["All notes"] = false;
      }
    }
    setTags(newTags);
  }

  async function newNote() {
    const doc = await props.notesRef.add({ html: "", tags: ["All notes"] });
    setOpenDoc(await doc.get());
  }

  return (
    <>
      <Row>
        <Col xs={3} className="py-3 pr-3">
          <Nav variant="pills" className="flex-column tags">
            {Object.entries(tags).map(([key, value]) => (
              <Nav.Link
                key={key}
                className={`tag${value ? " active" : ""}`}
                onClick={() => selectTag(key)}
              >
                {key}
              </Nav.Link>
            ))}
          </Nav>
        </Col>
        <Col xs={9} className="dashboard d-flex flex-column">
          <div className="notes flex-grow-1 p-3">
            <Row>
              {tagged.map((doc) => (
                <Col sm={6} lg={4} className="mb-4" key={doc.id}>
                  <Card>
                    <Card.Body className="note-body">
                      {doc.data().html}
                    </Card.Body>
                    <Card.Footer>
                      <Button onClick={() => setOpenDoc(doc)}>Open Note</Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          <div className="dashboard-buttons p-3">
            <Button onClick={newNote}>New Note</Button>
          </div>
        </Col>
      </Row>
      {openDoc && <EditNote openDoc={openDoc} close={() => setOpenDoc(null)} />}
    </>
  );
}

export default Notes;
