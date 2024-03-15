// Combines background and drawing canvases, exports them as images, and downloads as a ZIP file.
import JSZip from "jszip";

export const combineAndExport = async (
  backgroundCanvasRef,
  drawingCanvasRef
) => {
  const backgroundCanvas = backgroundCanvasRef.current;
  const drawingCanvas = drawingCanvasRef.current;

  const zip = new JSZip();

  try {
    // Create a combined canvas
    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = drawingCanvas.width;
    combinedCanvas.height = drawingCanvas.height;
    const combinedCtx = combinedCanvas.getContext("2d");

    combinedCtx.drawImage(backgroundCanvas, 0, 0);
    combinedCtx.drawImage(drawingCanvas, 0, 0);

    const combinedBlob = await new Promise((resolve) =>
      combinedCanvas.toBlob(resolve, "image/png")
    );
    zip.file("combined-image.png", combinedBlob);

    // Convert the drawing canvas to a Blob
    // Add the drawing image to the ZIP file
    const drawingBlob = await new Promise((resolve) =>
      drawingCanvas.toBlob(resolve, "image/png")
    );
    zip.file("drawing-image.png", drawingBlob);

    zip.generateAsync({ type: "blob" }).then(function (content) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "images.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  } catch (error) {
    console.error("Error exporting images:", error);
  }
};
