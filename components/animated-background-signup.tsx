"use client"

import React, { useEffect, useState } from 'react'

export const AnimatedBackgroundSignup: React.FC = () => {
  const [elements, setElements] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newElements = [...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute text-4xl text-gray-700 opacity-20 animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 10 + 5}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      >
        ✍️
      </div>
    ));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {elements}
    </div>
  );
}
