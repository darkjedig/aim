'use client';

import React, { useEffect, useState } from 'react';

export const AnimatedBackgroundForgotPassword: React.FC = () => {
  const [elements, setElements] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newElements = [...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute text-4xl text-purple-500 opacity-30 animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`, // Start from random positions within the viewport
          animationDuration: `${Math.random() * 5 + 15}s`, // Reduced duration range
          animationDelay: `${Math.random() * 2}s`, // Reduced delay range
        }}
      >
        ?
      </div>
    ));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {elements}
    </div>
  );
};
