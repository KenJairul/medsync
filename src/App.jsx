import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Background from "./Components/Background/Background.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Hero from "./Components/Hero/Hero.jsx";
import SearchPage from "./Pages/SearchPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";

const App = () => {
  let heroData = [
    { text1: "Simplify Records", text2: "Save Time" },
    { text1: "Secure Data", text2: "Stay Compliant" },
    { text1: "Anywhere Access", text2: "Always Available" },
  ];

  useEffect(() => {
    setInterval(() => {
      setHeroCount((count) => (count === 2 ? 0 : count + 1));
    }, 3000);
  }, []);

  const [heroCount, setHeroCount] = useState(1);
  const [playStatus, setPlayStatus] = useState(false);

  return (
    <Router>
      <Background playStatus={playStatus} heroCount={heroCount} />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Hero
              setPlayStatus={setPlayStatus}
              heroData={heroData[heroCount]}
              heroCount={heroCount}
              setHeroCount={setHeroCount}
              playStatus={playStatus}
            />
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
