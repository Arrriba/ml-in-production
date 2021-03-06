import React, { useRef, useState, useEffect } from "react";
import "./canvas.css";

const DigitCanvas = (props) => {
  const canvasRef = useRef(null);
  const [canvasContext, setCanvasContext] = useState(null);
  const [isMouseDown, setMouseDown] = useState(false);
  const [lastPos, setLastPos] = useState({ x: null, y: null });

  const onMouseDown = (e) => {
    const { mouseX, mouseY } = getMousePosition(e);
    const el = document.getElementsByClassName("layout-content");
    if (el && el[0]) {
      el[0].style.overflowY = "hidden";
    }
    setMouseDown(true);
    draw(mouseX, mouseY);
  };

  const onMouseMove = (e) => {
    if (isMouseDown) {
      const { mouseX, mouseY } = getMousePosition(e);
      draw(mouseX, mouseY);
    }
  };

  const onMouseUp = (e) => {
    setMouseDown(false);
    const el = document.getElementsByClassName("layout-content");
    if (el && el[0]) {
      el[0].style.overflowY = "scroll";
    }
  };

  const getMousePosition = (e) => {
    let mouseX = null;
    let mouseY = null;
    if (canvasRef.current) {
      const boundingRect = canvasRef.current.getBoundingClientRect();
      mouseX = e.clientX - boundingRect.left;
      mouseY = e.clientY - boundingRect.top;
      if (e.touches) {
        mouseX = e.touches[0].clientX - boundingRect.left;
        mouseY = e.touches[0].clientY - boundingRect.top;
      }
    }
    return {
      mouseX: mouseX,
      mouseY: mouseY
    };
  };

  const draw = (x, y) => {
    if (isMouseDown) {
      canvasContext.strokeStyle = "white";
      canvasContext.lineWidth = 10;
      canvasContext.lineJoin = "round";
      canvasContext.beginPath();
      canvasContext.moveTo(lastPos.x, lastPos.y);
      canvasContext.lineTo(x, y);
      canvasContext.closePath();
      canvasContext.stroke();
    }
    setLastPos({ x, y });
  };

  const clearCanvas = (e) => {
    canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    setMouseDown(false);
    setLastPos({ x: null, y: null });
  };

  const onPredict = async (e) => {
    const { predictDigit } = props;
    let c = canvasRef.current.toDataURL('image/png')
    predictDigit(c)
  };

  useEffect(() => {
    if (canvasRef) {
      setCanvasContext(canvasRef.current.getContext("2d"));
    }
  }, []);

  return (
    <>
      <div className="canvas-container">
        <canvas
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onMouseDown}
          onTouchEnd={onMouseUp}
          onTouchMove={onMouseMove}
          ref={canvasRef}
          width={"250px"}
          height={"250px"}
          className="canvas-styles"
        ></canvas>
      </div>
      <div>
        <button style={{ width: "4rem", marginRight: "2rem" }} onClick={onPredict}>
          Predict
        </button>
        <button style={{ width: "4rem" }} onClick={clearCanvas}>
          Clear
        </button>
      </div>
    </>
  );
};

export default DigitCanvas;
