// Custom hook for managing canvas drawing operations.

import { useState, useEffect, useRef, useCallback } from "react";
import { configureCurrentTool } from "../utils/configureCurrentTool";
import { drawImageOnCanvas } from "../utils/onDrawImage";
import { combineAndExport } from "../utils/combineAndExport";
import { hexToRGBA } from "../utils/hexToRgb";
import { getFillColor } from "../utils/getFillColor";

const useCanvas = (selectedTool, imageUrl, currentColor, currentSize) => {
  const drawingCanvasRef = useRef(null);
  const backgroundCanvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(-1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lassoPoints, setLassoPoints] = useState([]);
  const [lastDrawPoint, setLastDrawPoint] = useState({ x: null, y: null });

  useEffect(() => {
    drawImageOnCanvas({ backgroundCanvasRef, imageUrl });
  }, [imageUrl]);

  const startDrawing = useCallback(
    (e) => {
      const ctx = drawingCanvasRef.current.getContext("2d");
      configureCurrentTool(ctx, selectedTool, currentColor, currentSize, step);
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent?.offsetX, e.nativeEvent?.offsetY);
      setIsDrawing(true);
    },
    [currentColor, currentSize, selectedTool, step]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return;
      const ctx = drawingCanvasRef.current.getContext("2d");
      configureCurrentTool(ctx, selectedTool, currentColor, currentSize, step);

      ctx.lineTo(e.nativeEvent?.offsetX, e.nativeEvent?.offsetY);

      ctx.stroke();

      if (
        e.nativeEvent?.offsetX !== undefined &&
        e.nativeEvent?.offsetY !== undefined
      ) {
        if (selectedTool === "pen") {
          setLassoPoints((prevPoints) => [
            ...prevPoints,
            { x: e.nativeEvent?.offsetX, y: e.nativeEvent?.offsetY },
          ]);
        }
        setLastDrawPoint({
          x: e.nativeEvent?.offsetX,
          y: e.nativeEvent?.offsetY,
        });
      }
    },
    [currentColor, currentSize, isDrawing, selectedTool, step]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    const ctx = drawingCanvasRef.current.getContext("2d");
    setIsDrawing(false);
    setIsModalVisible(true);

    if (selectedTool === "pen") {
      ctx.beginPath();
      lassoPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();

      const fillColor = hexToRGBA(getFillColor(step), 0.5);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.stroke();
      setLassoPoints([]);
    }

    const newStep = step + 1;
    setStep(newStep);
    const newHistory = history.slice(0, newStep);
    newHistory.push(drawingCanvasRef.current.toDataURL());
    setHistory(newHistory);
  }, [history, isDrawing, lassoPoints, selectedTool, step]);

  const handleModalConfirm = useCallback(
    (text) => {
      const ctx = drawingCanvasRef.current.getContext("2d");
      ctx.font = "16px Arial";

      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = parseInt(ctx.font, 10);

      const rectX = lastDrawPoint.x - 16;
      const rectY = lastDrawPoint.y - textHeight - 16 * 0.5;
      const rectWidth = textWidth + 16 * 2;
      const rectHeight = textHeight + 16;

      ctx.shadowColor = "RGBA(0, 0, 0, 0.2)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = "white";
      ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

      ctx.shadowColor = "transparent";
      ctx.fillStyle = "black";
      ctx.fillText(text, lastDrawPoint.x, lastDrawPoint.y);

      setTimeout(() => {
        const newStep = step + 1;
        const newHistory = history.slice(0, newStep);
        newHistory.push(drawingCanvasRef.current.toDataURL());
        setHistory(newHistory);
        setStep(newStep);

        setIsModalVisible(false);
      }, 0);
    },
    [lastDrawPoint.x, lastDrawPoint.y, step, history]
  );

  const undo = useCallback(
    (undoCount) => {
      if (step > 0) {
        const newStep = step - undoCount || 1;
        setStep(newStep);
        const canvasImage = new Image();
        canvasImage.src = history[newStep];
        canvasImage.onload = () => {
          const ctx = drawingCanvasRef.current.getContext("2d");
          ctx.clearRect(
            0,
            0,
            drawingCanvasRef.current.width,
            drawingCanvasRef.current.height
          );
          ctx.drawImage(canvasImage, 0, 0);
        };
      }
    },
    [step, history]
  );

  const redo = useCallback(() => {
    if (step >= history.length - 1) return;
    setStep((prevStep) => prevStep + 2);
    const canvasImage = new Image();
    canvasImage.src = history[step + 2];
    canvasImage.onload = () => {
      const ctx = drawingCanvasRef.current.getContext("2d");
      ctx.clearRect(
        0,
        0,
        drawingCanvasRef.current.width,
        drawingCanvasRef.current.height
      );
      ctx.drawImage(canvasImage, 0, 0);
    };
  }, [step, history]);

  const handleModalDismiss = useCallback(() => {
    undo(1);
    setIsModalVisible(false);
  }, [undo]);

  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);

  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
    const img = new Image();
    img.src = history[step] || "";
    if (img.src) {
      img.onload = () => ctx?.drawImage(img, 0, 0);
    }
  }, [history, step, drawingCanvasRef]);

  const onExportCanvas = async () =>
    await combineAndExport(backgroundCanvasRef, drawingCanvasRef);

  const disabledUndo = step < 0;
  const disabledRedo = step === history.length - 1;

  return {
    disabledUndo,
    disabledRedo,
    drawingCanvasRef,
    backgroundCanvasRef,
    isModalVisible,
    handleModalConfirm,
    handleModalDismiss,
    undo,
    redo,
    startDrawing,
    draw,
    stopDrawing,
    onExportCanvas,
  };
};

export default useCanvas;
