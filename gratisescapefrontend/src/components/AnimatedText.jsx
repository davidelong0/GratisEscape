import React from "react";
import { useSpring, animated } from "@react-spring/web";

const AnimatedText = ({ text }) => {
  const styles = useSpring({
    from: { opacity: 0, transform: "scale(0.5)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 200, friction: 15 },
    delay: 500,
  });

  return (
    <animated.h1
      style={{
        ...styles,
        fontFamily: "'Georgia', serif",
        fontWeight: 900,
        fontSize: "2.8rem",
        color: "#b0882f",
        textShadow: "1px 1px 3px #f5e79e",
        userSelect: "none",
        textAlign: "center",
        marginBottom: "2rem",
        letterSpacing: "2px",
      }}
    >
      {text}
    </animated.h1>
  );
};

export default AnimatedText;
