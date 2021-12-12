import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

import Login from "./components/Login";
import Home from "./components/Home";
import CodePage from "./components/CodePage";

function App() {
  const [authenticate, setAuthenticate] = useState(false);
  const [currentAuthenticate, setCurrentAuthenticate] = useState(false);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState(false);
  const [id, setId] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Login
                setAuthenticate={setAuthenticate}
                setCurrentAuthenticate={setCurrentAuthenticate}
                setCode={setCode}
                setId={setId}
                setUrl={setUrl}
              />
            }
          />
          {authenticate ? (
            <Route
              path="/home"
              element={
                <Home
                  id={id}
                  currentAuthenticate={currentAuthenticate}
                  setCurrentAuthenticate={setCurrentAuthenticate}
                />
              }
            />
          ) : (
            ""
          )}
          {code ? (
            <Route
              path="/code"
              element={
                <CodePage id={id} url={url} setAuthenticate={setAuthenticate} />
              }
            />
          ) : (
            ""
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
