import { useState } from "react";
import SearchBar from "./Components/SearchBar.jsx";
import WeatherDisplay from "./Components/WeatherDisplay.jsx";

function App() {
  const [city, setCity] = useState("Berlin");

  return (
    <div className="section">
      <SearchBar setCity={setCity} />
      <WeatherDisplay city={city} />
    </div>
  );
}

export default App;
