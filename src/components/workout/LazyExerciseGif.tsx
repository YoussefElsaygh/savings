"use client";

import { useState, useRef, useEffect } from "react";
import { Spin } from "antd";

interface LazyExerciseGifProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}

export default function LazyExerciseGif({
  src,
  alt,
  style,
}: LazyExerciseGifProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        borderRadius: "8px",
        padding: "20px",
        minHeight: "300px",
        position: "relative",
        ...style,
      }}
    >
      {!isLoaded && !error && (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
          <div style={{ marginTop: "12px", color: "#999" }}>
            Loading exercise...
          </div>
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", color: "#999" }}>
          <p>📹 Exercise GIF</p>
          <p style={{ fontSize: "12px" }}>{alt}</p>
        </div>
      )}

      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setError(true);
            setIsLoaded(true);
          }}
          style={{
            maxWidth: "100%",
            maxHeight: "400px",
            borderRadius: "8px",
            display: isLoaded ? "block" : "none",
          }}
        />
      )}
    </div>
  );
}
