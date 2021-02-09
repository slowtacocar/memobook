import React from "react";
import Notes from "./Notes";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCzUcq6QPWDBAUeAXfvXY2NPHcecG9j97w",
  authDomain: "memobook-6cd3c.firebaseapp.com",
  databaseURL: "https://memobook-6cd3c.firebaseio.com",
  projectId: "memobook-6cd3c",
  storageBucket: "memobook-6cd3c.appspot.com",
  messagingSenderId: "25275783660",
  appId: "1:25275783660:web:4b94378b6da61ac41248c9",
  measurementId: "G-RJHXP89SV8",
});

function Memobook() {
  const [user, setUser] = React.useState();

  React.useEffect(
    () =>
      firebase.auth().onAuthStateChanged((user) => {
        setUser(user);
      }),
    []
  );

  const notesRef = React.useMemo(
    () =>
      user &&
      firebase.firestore().collection("user").doc(user.uid).collection("notes"),
    [user]
  );

  return user ? (
    <Notes notesRef={notesRef} />
  ) : (
    <StyledFirebaseAuth
      firebaseAuth={firebase.auth()}
      uiConfig={{
        signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
        callbacks: {
          signInSuccessWithAuthResult: () => false,
        },
      }}
    />
  );
}

export default Memobook;
