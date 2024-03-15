// Component for displaying the canvas and related tools.
import { useState } from "react";
import PropTypes from "prop-types";
import useCanvas from "../../hooks/useCanvas";
import LabelModal from "../../components/label-modal/LabelModal";
import ToolBar from "../../components/toolbar/Toolbar";
import "./Canvas.css";

const Canvas = ({ imageURL }) => {
  const [selectedTool, setSelectedTool] = useState("pen");
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState(25);

  const {
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
  } = useCanvas(selectedTool, imageURL, selectedColor, selectedSize);

  return (
    <div className="canvas-container">
      <ToolBar
        onPenClick={() => setSelectedTool("pen")}
        onBrushClick={() => setSelectedTool("brush")}
        activeTool={selectedTool}
        onSizeChange={(size) => setSelectedSize(size)}
        onColorChange={(color) => setSelectedColor(color)}
        currentColor={selectedColor}
        currentSize={selectedSize}
        undo={undo}
        redo={redo}
        onExportCanvas={onExportCanvas}
        disabledUndo={disabledUndo}
        disabledRedo={disabledRedo}
      />

      <div className="canvas-wrapper">
        <canvas
          ref={backgroundCanvasRef}
          className="canvas canvas-image"
          height="800px"
        />

        <canvas
          ref={drawingCanvasRef}
          height="800px"
          width="1200px"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="canvas"
        />
      </div>

      <LabelModal
        open={isModalVisible}
        onConfirm={handleModalConfirm}
        onCancel={handleModalDismiss}
      />
    </div>
  );
};

Canvas.propTypes = {
  imageURL: PropTypes.string.isRequired,
};

export default Canvas;
