import { useState, useEffect } from "react";

import sunnyIcon from "../assets/sunny.png";
import cloudyIcon from "../assets/cloudy.png";
import rainIcon from "../assets/rain.png";
import snowIcon from "../assets/snow.png";
import lightningIcon from "../assets/lightning.png";
import nightIcon from "../assets/night.png";

function WeatherDisplay({ city }) {
  const [temp, setTemp] = useState("Loading...");
  const [error, setError] = useState("");
  const [icon, setIcon] = useState(cloudyIcon);
  const [cityInfo, setCityInfo] = useState({ name: city, country: "" });

  async function getCoordinates(cityName) {
    const apiKey = import.meta.env.VITE_WEATHER_KEY;
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`
    );
    const data = await res.json();
    if (!data || data.length === 0) {
      throw new Error("City not found");
    }
    return {
      lat: data[0].lat,
      lon: data[0].lon,
      name: data[0].name,
      country: data[0].country,
    };
}


  function getIconByCondition(desc, isNight) {
    const condition = desc.toLowerCase();

    if (isNight && (condition.includes("clear") || condition.includes("sun")))
      return nightIcon;
    if (condition.includes("clear") || condition.includes("sun"))
      return sunnyIcon;
    if (condition.includes("cloud")) return cloudyIcon;
    if (condition.includes("rain")) return rainIcon;
    if (condition.includes("snow")) return snowIcon;
    if (condition.includes("thunder") || condition.includes("storm"))
      return lightningIcon;

    return isNight ? nightIcon : cloudyIcon;
  }

  async function getWeather(cityName) {
    try {
      setError("");
      setTemp("Loading...");

      const { lat, lon, name, country } = await getCoordinates(cityName);
      setCityInfo({ name, country });

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
      );
      const data = await response.json();

      const currentTemp = data.current_weather?.temperature ?? "N/A";
      const weatherCode = data.current_weather?.weathercode ?? 0;
      const isDay = data.current_weather?.is_day === 1; // 1=day 0=night

      const weatherDesc = getWeatherDescription(weatherCode);
      setIcon(getIconByCondition(weatherDesc, !isDay));
      setTemp(currentTemp);
    } catch (err) {
      console.error(err);
      setTemp("Error");
      setError(err.message);
    }
  }

  function getWeatherDescription(code) {
    const codes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      61: "Rain",
      71: "Snow",
      80: "Rain showers",
      95: "Thunderstorm",
      99: "Heavy thunderstorm",
    };
    return codes[code] || "Unknown";
  }

  useEffect(() => {
    if (city) getWeather(city);
  }, [city]);

  return (
    <div className="weatherDisplay">
      <img src={icon} alt="Weather" className="weatherIcon" />
      <p className="tmp">{temp !== "N/A" ? Math.round(temp) + "°C" : temp}</p>
      <p>
        {cityInfo.name}
        {cityInfo.country ? `, ${cityInfo.country}` : ""}
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default WeatherDisplay;
