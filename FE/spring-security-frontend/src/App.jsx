import { useState } from "react";
import "./App.css";
import { Buffer } from "buffer";

const BACKEND_ENDPOINT = "http://localhost:8080";
const BACKEND_MESSAGES = `${BACKEND_ENDPOINT}/messages`;
const BACKEND_LOGIN = `${BACKEND_ENDPOINT}/login`;
const BACKEND_CUSTOMIZED = `${BACKEND_MESSAGES}/authorized/customized`;
const authentication = {
  username: "nenad",
  password: "123",
};

function App() {
  const initialMessage = "Outcome will be displayed here...";
  const [message, setMessage] = useState(initialMessage);

  function handleUnauthorized() {
    fetch(BACKEND_MESSAGES + "/unauth orized")
      .then((response) => response.text())
      .then((text) => setMessage(text));
  }

  function handleAuthorized() {
    const headers = new Headers();
    const auth = Buffer.from(
      authentication.username + ":" + authentication.password
    ).toString("base64");
    headers.set("Authorization", "Basic " + auth);
    return fetch(BACKEND_MESSAGES + "/authorized", {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.text())
      .then((text) => setMessage(text));
  }

  function handleLogin() {
    const headers = new Headers();
    const auth = Buffer.from(
      authentication.username + ":" + authentication.password
    ).toString("base64");
    headers.set("Authorization", "Basic " + auth);
    return fetch(BACKEND_LOGIN, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.text())
      .then((jwt) => {
        setMessage("JWT: " + jwt);
        localStorage.setItem("jwt", jwt);
      });
  }

  function handleCustomized() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setMessage("JWT is not provided");
      return;
    }
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${jwt}`);

    return fetch(BACKEND_CUSTOMIZED, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.text())
      .then((jwt) => {
        setMessage("JWT:  " + jwt);
        localStorage.setItem("jwt", jwt);
      });
  }
  return (
    <>
      <h1>Spring Security JWT</h1>
      <button type="button" onClick={handleUnauthorized}>
        unathorized message
      </button>
      <button type="button" onClick={handleAuthorized}>
        authorized
      </button>
      <button type="button" onClick={handleLogin}>
        login
      </button>
      <button type="button" onClick={handleCustomized}>
        customized message
      </button>
      <p>{message}</p>
    </>
  );
}

export default App;
