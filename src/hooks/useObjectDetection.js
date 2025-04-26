import { useEffect, useRef, useState } from "react";
import ml5 from "ml5";

const useObjectDetection = (videoRef, canvasRef) => {
  const ctx = useRef(null);
  const detector = useRef(null);
  const animationFrameRef = useRef(null);
  const detectorFrameRef = useRef(null);
  const lastDetections = useRef([]);

  const [active, setActive] = useState(false);

  function beginDetection() {
    if (videoRef.current?.readyState >= 2) {
      startDetection();
    } else {
      videoRef.current.onloadeddata = startDetection;
    }
    setActive(true);
  }

  function startDetection() {
    if (!videoRef.current || !canvasRef.current) return;

    ctx.current = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    detector.current = ml5.objectDetector("cocossd", () => {
      detectObjects();
    });

    drawVideo();
  }

  function drawVideo() {
    if (!canvasRef.current || !ctx.current || !videoRef.current) return;

    ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.current.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    drawDetections(lastDetections.current);
    animationFrameRef.current = requestAnimationFrame(drawVideo);
  }

  function detectObjects() {
    if (!videoRef.current || !detector.current) return;

    detector.current.detect(videoRef.current, (err, results) => {
      if (!err && results) {
        lastDetections.current = results.filter(r => r.confidence >= 0.5);
      }
      detectorFrameRef.current = requestAnimationFrame(detectObjects);
    });
  }

  function drawDetections(results) {
    if (!ctx.current || !canvasRef.current) return;

    ctx.current.strokeStyle = "green";
    ctx.current.lineWidth = 2;
    ctx.current.font = "16px Arial";
    ctx.current.fillStyle = "white";

    results.forEach(({ x, y, width, height, label }) => {
      ctx.current.strokeRect(x, y, width, height);
      ctx.current.fillText(label, x, y > 10 ? y - 5 : y + 15);
    });
  }

  function stopDetection() {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (detectorFrameRef.current) cancelAnimationFrame(detectorFrameRef.current);
    detector.current = null;
    animationFrameRef.current = null;
    detectorFrameRef.current = null;
    ctx.current = null;
    lastDetections.current = [];
    setActive(false);
  }

  useEffect(() => {
    return () => stopDetection();
  }, []);

  return {
    beginDetection,
    stopDetection,
    active
  }
};

export default useObjectDetection;
