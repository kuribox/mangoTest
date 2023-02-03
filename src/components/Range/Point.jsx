import React, { useCallback, useState, useRef, useEffect } from "react";
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
  value: valueProp,
}) => {
  const [value, setValue] = useState(null);
  const [result, setResult] = useState(null);

  const [maxSteps] = useState(values ? values.length - 1 : max - min);

  const [isActive, setIsActive] = useState(false);

  const pointRef = useRef(null);

  const getPointStep = useCallback(
    (value) => {
      return value * ((width - pointWidth) / maxSteps);
    },
    [width, pointWidth, maxSteps]
  );

  const getPointPosition = useCallback(
    (value) => {
      return Math.round(value / ((width - pointWidth) / maxSteps));
    },
    [width, pointWidth, maxSteps]
  );

  useEffect(() => {
    if (defaultValue) {
      if (values) {
        const stepValue = getPointPosition(defaultValue);

        setValue(getPointStep(stepValue) + pointWidth);
        setResult(values[stepValue]);
      } else {
        const stepValue = getPointPosition(defaultValue - min);
        setValue(getPointStep(stepValue) + pointWidth);
        setResult(defaultValue + min);
      }
    }
  }, []);

  useEffect(() => {
    if (valueProp && valueProp !== result) {
      setResult(valueProp);

      const newValue = values
        ? getPointStep(values.findIndex((v) => v === valueProp)) + pointWidth
        : getPointStep(valueProp - min) + pointWidth;

      setValue(newValue);

      if (onChange) onChange(valueProp, newValue);
    }
  }, [valueProp]);

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
      stepValue = getPointPosition(e.clientX - offset);

      if (!values[stepValue]) stepValue = getPointPosition(defaultValue);

      if (limitMin) {
        const limitPoint = getPointPosition(limitMin);
        if (e.clientX - offset <= limitMin || stepValue <= limitPoint)
          stepValue = limitPoint + 1;
      }

      if (limitMax) {
        const limitPoint = getPointPosition(limitMax);
        if (e.clientX - offset >= limitMax || stepValue >= limitPoint)
          stepValue = limitPoint - 1;
      }

      setResult(values[stepValue]);
    } else {
      stepValue = getPointPosition(e.clientX - offset);

      if (stepValue % step !== 0) stepValue = stepValue - (stepValue % step);

      if (limitMin) {
        const limitPoint = getPointPosition(limitMin - pointWidth);
        if (e.clientX - offset <= limitMin || stepValue <= limitPoint)
          stepValue = limitPoint + step;
      }

      if (limitMax) {
        const limitPoint = getPointPosition(limitMax - pointWidth);
        if (e.clientX - offset >= limitMax || stepValue >= limitPoint)
          stepValue = limitPoint - step;
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
