import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import api from "./api";

function App() {
  const [counter, setCounter] = React.useState<number | null>(null);

  const onClick = async () => setCounter(await api.incrementCounter());

  useEffect(() => {
    api.getCounter().then(setCounter);
  }, []);

  if (counter === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App" onClick={onClick}>
      <header className="App-header">
        <p>Click anywhere to increment the counter on the server</p>
        <div >
          <img src={logo} className="App-logo" alt="logo" onClick={onClick} />
        </div>
        {counter ? <p>You clicked {counter} times</p> : <p>Loading...</p>}
      </header>
    </div>
  );
}

export default App;
