import React, { useState, useEffect } from "react";

function Eyes() {
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false); // وضعیت پلک زدن

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;

      const eye = document.querySelector(".eye");
      const eyeRect = eye.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      const deltaX = clientX - eyeCenterX;
      const deltaY = clientY - eyeCenterY;

      const maxMovement = 20;
      const moveX = Math.min(maxMovement, Math.max(-maxMovement, deltaX / 10));
      const moveY = Math.min(maxMovement, Math.max(-maxMovement, deltaY / 10));

      setPupilPosition({ x: moveX, y: moveY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleBlink = () => {
    setBlink(true);
    setTimeout(() => {
      setBlink(false); // بعد از چند میلی‌ثانیه پلک زدن به حالت اولیه برمی‌گردد
    }, 300); // مدت زمان پلک زدن
  };

  return (
    <div className="eye-container flex justify-between items-center gap-2">
      <div
        className={`eye relative border-3 p-7 rounded-full transition-all duration-300 ease-out ${
          blink
            ? "bg-red-100 scale-105 border-red-900"
            : "bg-white border-black"
        }`}
        onClick={handleBlink}>
        <div
          className={`absolute -top-5 w-20 rounded-full h-3 transition-all duration-300 ease-out ${
            blink ? "-rotate-12 right-2" : "rotate-6 right-0"
          } bg-black`}></div>
        <div
          className={`p-5 rounded-full transition-all duration-300 ease-out ${
            blink ? "bg-red-800 scale-75" : "bg-subPrimary"
          }`}
          style={{
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      </div>
      <div
        className={`eye relative border-3 p-7 rounded-full transition-all duration-300 ease-out ${
          blink
            ? "bg-red-100 scale-105 border-red-900"
            : "bg-white border-black"
        }`}
        onClick={handleBlink}>
        <div
          className={`absolute -top-5 w-20 rounded-full h-3 transition-all duration-300 ease-out ${
            blink ? "rotate-12 left-2" : "-rotate-6 left-0"
          } bg-black`}></div>
        <div
          className={`p-5 rounded-full transition-all duration-300 ease-out ${
            blink ? "bg-red-800 scale-75" : "bg-subPrimary"
          }`}
          style={{
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      </div>
    </div>
  );
}

export default Eyes;
