import React from "react";
import EditNote from "./EditNote";

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
      <div className="row">
        <div className="col-3 py-3 pr-3">
          <div className="nav flex-column nav-pills tags">
            {Object.entries(tags).map(([key, value]) => (
              <a
                key={key}
                className={`nav-link tag${value ? " active" : ""}`}
                href="#"
                onClick={() => selectTag(key)}
              >
                {key}
              </a>
            ))}
          </div>
        </div>
        <div className="dashboard col-9 d-flex flex-column">
          <div className="notes flex-grow-1">
            <div className="row container-fluid pt-3">
              {tagged.map((doc) => (
                <div className="col-sm-6 col-lg-4 mb-4" key={doc.id}>
                  <div className="card">
                    <div className="card-body note-body">{doc.data().html}</div>
                    <div className="card-footer">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setOpenDoc(doc)}
                      >
                        Open Note
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-buttons container-fluid py-3">
            <button type="button" className="btn btn-primary" onClick={newNote}>
              New Note
            </button>
          </div>
        </div>
      </div>
      {openDoc && <EditNote openDoc={openDoc} close={() => setOpenDoc(null)} />}
    </>
  );
}

export default Notes;
