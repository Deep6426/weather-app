import { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";

const API_KEY = "your_api_key";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading,setLoading]= useState(false);
  const getWeather = async () => {
  if (!city) {
    alert("Please enter a city");
    return;
  }

  try {
    setLoading(true); // 👈 START loading

    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    setWeather(res.data);
  } catch (error) {
    alert("City not found");
  } finally {
    setLoading(false); // 👈 STOP loading
  }
};

  const getLocationWeather = () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        setLoading(true);

        const { latitude, longitude } = position.coords;

        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        setWeather(res.data);
      } finally {
        setLoading(false);
      }
    },
    () => {
      alert("Location access denied");
    }
  );
};

  const getBackground = () => {
  if (!weather) return "linear-gradient(135deg, #1e3c72, #2a5298)";

  const main = weather?.weather?.[0]?.main;

  if (main === "Clear") return "linear-gradient(135deg, #f7971e, #ffd200)";
  if (main === "Rain") return "linear-gradient(135deg, #4b79a1, #283e51)";
  if (main === "Clouds") return "linear-gradient(135deg, #757f9a, #d7dde8)";

  return "linear-gradient(135deg, #1e3c72, #2a5298)";
};
  return (
    <div style={{
    height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: getBackground(),
  fontFamily: "sans-serif"
  }}>
    <div style={{
  textAlign: "center",
  padding: "40px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(15px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  width: "350px",
  color: "white"
}}>
     <Typography variant="h3" style={{ fontWeight: "bold", marginBottom: "20px" }}>
  🌤 Weather
</Typography>

      <TextField
  placeholder="Enter city..."
  variant="outlined"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  fullWidth
  sx={{
    "& .MuiInputBase-input": {
      color: "white"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "white" },
      "&:hover fieldset": { borderColor: "#ccc" },
      "&.Mui-focused fieldset": { borderColor: "white" }
    }
  }}
/>

      <br />

      <Button
  variant="contained"
  onClick={getWeather}
  style={{
    marginTop: "15px",
    borderRadius: "30px",
    width: "100%"
  }}
>
  Search
</Button>

<Button
  variant="text"
  onClick={getLocationWeather}
  style={{ marginTop: "10px", color: "white" }}
>
  Use Current Location
</Button>

     

{loading && <CircularProgress sx={{ color: "white", marginTop: "20px" }} />}
      {weather && (
  <div style={{ marginTop: "30px" }}>
    <h2>{weather.name}</h2>

    <img
      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
      alt="weather icon"
    />

    <h1 style={{ fontSize: "50px", margin: "10px 0" }}>
      {weather.main.temp}°C
    </h1>

    <p style={{ textTransform: "capitalize" }}>
      {weather.weather[0].description}
    </p>

    <div style={{ marginTop: "15px" }}>
      <p>💧 {weather.main.humidity}% Humidity</p>
      <p>🌬 {weather.wind.speed} m/s Wind</p>
    </div>
  </div>
)}
    
    </div>
    </div>
  );
}

export default App;
