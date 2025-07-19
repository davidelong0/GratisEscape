import React, { useEffect, useState } from "react";

const PoeticText = ({ text, delay = 100 }) => {
  const [visibleLetters, setVisibleLetters] = useState([]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setVisibleLetters((vis) => [...vis, text[currentIndex]]);
      currentIndex++;
      if (currentIndex === text.length) clearInterval(interval);
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay]);

  return (
<h2 className="poetic-text">

      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            opacity: visibleLetters.includes(char) ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h2>
  );
};

export default PoeticText;
