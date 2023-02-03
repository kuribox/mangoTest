import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./range.module.css";

const Range = ({
  min,
  max,
  values,
  step,
  offset,
  limitMax,
  limitMin,
  onChange,
  pointWidth,
  defaultValue,
  width,
}) => {
  const [value, setValue] = useState(null);
  const [result, setResult] = useState(null);

  const [maxSteps] = useState(values ? values.length - 1 : max - min);

  const [isActive, setIsActive] = useState(false);

  const pointRef = useRef(null);

  useEffect(() => {
    if (defaultValue) {
      if (values) {
        const stepValue = Math.round(
          defaultValue / ((width - pointWidth) / maxSteps)
        );

        setValue(stepValue * ((width - pointWidth) / maxSteps) + pointWidth);
        setResult(values[stepValue]);
      } else {
        const stepValue = Math.round(
          (defaultValue - min) / ((width - pointWidth) / maxSteps)
        );
        setValue(stepValue * ((width - pointWidth) / maxSteps) + pointWidth);
        setResult(defaultValue + min);
      }
    }
  }, []);

  // Update drag position
  const handleDrag = (e) => {
    if (
      limitMax &&
      e.clientX - offset < limitMax &&
      e.clientX - offset >= pointWidth
    )
      setValue(e.clientX - offset);

    if (
      limitMin &&
      e.clientX - offset > limitMin &&
      e.clientX - offset <= width
    )
      setValue(e.clientX - offset);
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsActive(true);

    document.body.style.cursor = "grab";
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // on mouse up drag point, set most close value to result
  const handleMouseUp = (e) => {
    document.body.style.cursor = "auto";

    let stepValue = null;
    if (values) {
      stepValue = Math.round(
        (e.clientX - offset) / ((width - pointWidth) / maxSteps)
      );

      if (!values[stepValue])
        stepValue = Math.round(
          defaultValue / ((width - pointWidth) / maxSteps)
        );

      if (limitMin && e.clientX - offset <= limitMin)
        stepValue =
          Math.round(limitMin / ((width - pointWidth) / maxSteps)) + 1;

      if (limitMax && e.clientX - offset >= limitMax)
        stepValue =
          Math.round(limitMax / ((width - pointWidth) / maxSteps)) - 1;

      setResult(values[stepValue]);
    } else {
      stepValue = Math.round(
        (e.clientX - offset) / ((width - pointWidth) / maxSteps)
      );

      if (stepValue % step !== 0) stepValue = stepValue - (stepValue % step);

      if (limitMin && e.clientX - offset <= limitMin)
        stepValue =
          Math.round(limitMin / ((width - pointWidth) / maxSteps)) + step;

      if (limitMax && e.clientX - offset >= limitMax) {
        stepValue =
          Math.round(limitMax / ((width - pointWidth) / maxSteps)) - step;
      }

      setResult(stepValue + min);
    }

    if (stepValue !== null) {
      const newValue =
        stepValue * ((width - pointWidth) / maxSteps) + pointWidth;
      setValue(newValue);
      if (onChange)
        onChange(values ? values[stepValue] : stepValue + min, newValue);
    }
    setIsActive(false);

    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  if (!value || !result) return null;
  return (
    <div
      ref={pointRef}
      className={`${styles.point} ${isActive ? styles.dragging : ""}`}
      style={{
        left: `${value - pointWidth}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.circle} />
    </div>
  );
};

PropTypes.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  values: PropTypes.array,
  step: PropTypes.number,
  offset: PropTypes.number,
  limitMax: PropTypes.number,
  limitMin: PropTypes.number,
  onChange: PropTypes.func,
  pointWidth: PropTypes.number,
  defaultValue: PropTypes.number,
  width: PropTypes.number,
};

export default Range;
