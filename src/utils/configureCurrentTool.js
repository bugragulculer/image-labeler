// Configures the drawing settings based on the selected tool.
import { colors } from "../constants/colors";
import { hexToRGBA } from "./hexToRgb";

export const configureCurrentTool = (
  ctx,
  selectedTool = "pen",
  selectedColor,
  currentSize = 25,
  step
) => {
  switch (selectedTool) {
    case "pen":
      // Configuration for the pen tool
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = hexToRGBA(colors[step + 1], 0.8);
      ctx.lineWidth = 3;
      ctx.canvas.style.cursor = "crosshair";
      break;

    case "brush":
      // Configuration for the brush tool
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = selectedColor ?? hexToRGBA(colors[step + 1], 0.2);
      ctx.lineWidth = currentSize;
      ctx.canvas.style.cursor = "crosshair";
      break;

    default:
      // Default configuration for unknown tools (To be on the safe side)
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
  }
};
