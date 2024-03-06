import React from "react";
import logo from './logo.png';
import './App.css';

function App() {
  //Set things up
  const [data, setData] = React.useState(null);
  const inputRef = React.useRef(null);

  //Handles submission of the zip code form
  async function handleSubmit(event) {
    event.preventDefault();
    await fetch("/api/weather/" + inputRef.current.value)
    .then((res) => res.json())
    .then((data) => setData(data.message));
  }

  return (
    <div className="App">

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to CranioWeather!
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <label>
          <p>Zip Code:</p>
          <input name="weather-zip" ref={inputRef} type="text" placeholder="Enter Your Zip Code" />
        </label>
        <br/><br/>
        <button type="submit">Submit</button>
      </form>

      <div className="weather">
        {!data ? "Enter a zip code above to see the weather." : data}
      </div>
    </div>
  );
}

export default App;
