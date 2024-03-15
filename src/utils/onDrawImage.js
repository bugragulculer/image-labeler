// Function to draw an image on a canvas with optional centering.
// backgroundCanvasRef - Reference to the canvas element.
// imageUrl - URL of the image to be drawn.

export const drawImageOnCanvas = ({ backgroundCanvasRef, imageUrl }) => {
  const backgroundCanvas = backgroundCanvasRef.current;
  const ctx = backgroundCanvas?.getContext("2d");

  const image = new Image();
  image.src = imageUrl;

  image.onload = () => {
    const maxWidth = 1200;
    const maxHeight = 800;

    // Calculating scale factors to fit the image within the maximum dimensions
    const scaleWidth = maxWidth / image.width;
    const scaleHeight = maxHeight / image.height;
    const scale = Math.min(scaleWidth, scaleHeight);

    const imageWidth = scale * image.width;
    const imageHeight = scale * image.height;

    const dx = (maxWidth - imageWidth) / 2;
    const dy = (maxHeight - imageHeight) / 2;

    backgroundCanvas.width = maxWidth;
    backgroundCanvas.height = maxHeight;

    // Drawing the image on the canvas
    ctx.drawImage(image, dx, dy, imageWidth, imageHeight);
  };
};
