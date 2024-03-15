//  Component for the toolbar containing drawing tools and actions.

import PropTypes from "prop-types";
import { Button, Slider, Input } from "antd";
import {
  DownloadOutlined,
  RedoOutlined,
  UndoOutlined,
  EditOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import "./Toolbar.css";

const ToolBar = ({
  activeTool,
  onPenClick,
  onBrushClick,
  onSizeChange,
  onColorChange,
  currentColor,
  currentSize,
  undo,
  redo,
  onExportCanvas,
  disabledUndo,
  disabledRedo,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-buttons-wrapper">
        <Button
          className={activeTool === "pen" ? "active-tool" : ""}
          onClick={onPenClick}
          icon={<EditOutlined />}
        >
          Pen
        </Button>

        <Button
          className={activeTool === "brush" ? "active-tool" : ""}
          onClick={onBrushClick}
          icon={<HighlightOutlined />}
        >
          Brush
        </Button>

        {activeTool === "brush" && (
          <>
            <div className="size-wrapper">
              <span>Size: </span>
              <Slider
                min={5}
                max={50}
                step={5}
                value={currentSize}
                onChange={onSizeChange}
                style={{ width: 200 }}
              />
            </div>

            <Input
              type="color"
              value={currentColor}
              onChange={(e) => onColorChange(e.target.value)}
              style={{ width: 100 }}
            />
          </>
        )}
      </div>

      <div className="toolbar-buttons-wrapper">
        <Button
          onClick={() => undo(2)}
          type="dashed"
          icon={<UndoOutlined />}
          disabled={disabledUndo}
        >
          Undo
        </Button>

        <Button
          onClick={redo}
          type="dashed"
          icon={<RedoOutlined />}
          disabled={disabledRedo}
        >
          Redo
        </Button>

        <Button
          type="primary"
          shape="round"
          icon={<DownloadOutlined />}
          onClick={onExportCanvas}
          disabled={disabledUndo}
        >
          Download
        </Button>
      </div>
    </div>
  );
};

ToolBar.propTypes = {
  activeTool: PropTypes.oneOf(["pen", "brush"]).isRequired,
  onPenClick: PropTypes.func.isRequired,
  onBrushClick: PropTypes.func.isRequired,
  onSizeChange: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  currentColor: PropTypes.string,
  currentSize: PropTypes.number.isRequired,
  undo: PropTypes.func.isRequired,
  redo: PropTypes.func.isRequired,
  onExportCanvas: PropTypes.func.isRequired,
  disabledUndo: PropTypes.bool.isRequired,
  disabledRedo: PropTypes.bool.isRequired,
};

export default ToolBar;
