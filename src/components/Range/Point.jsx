import React, { useCallback, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./range.module.css";

const Point = ({
  name,
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
  XOffset,
}) => {
  const [value, setValue] = useState(null);
  const [result, setResult] = useState(null);

  const [maxSteps] = useState(values ? values.length - 1 : max - min);

  const [isActive, setIsActive] = useState(false);

  const pointRef = useRef(null);

  // calc point real step
  const getPointStep = useCallback(
    (value) => {
      return value * ((width - pointWidth) / maxSteps);
    },
    [width, pointWidth, maxSteps]
  );

  // calc point x position
  const getPointPosition = useCallback(
    (value) => {
      return Math.round(value / ((width - pointWidth) / maxSteps));
    },
    [width, pointWidth, maxSteps]
  );

  // set default value
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
    const x = e.clientX - XOffset + pointWidth / 2;

    if (limitMax && x - offset < limitMax && x - offset >= pointWidth)
      setValue(x - offset);

    if (limitMin && x - offset > limitMin && x - offset <= width)
      setValue(x - offset);

    if (!limitMax && !limitMin) {
      setValue(x - offset);
    }
  };

  // on mouse release drag point
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
    const x = e.clientX - XOffset - pointWidth / 2;

    let stepValue = null;
    if (values) {
      stepValue = getPointPosition(x - offset);

      if (!values[stepValue]) stepValue = getPointPosition(defaultValue);

      if (limitMin) {
        const limitPoint = getPointPosition(limitMin);
        if (x - offset <= limitMin || stepValue <= limitPoint)
          stepValue = limitPoint + 1;
      }

      if (limitMax) {
        const limitPoint = getPointPosition(limitMax);
        if (x - offset >= limitMax || stepValue >= limitPoint)
          stepValue = limitPoint - 1;
      }

      setResult(values[stepValue]);
    } else {
      stepValue = getPointPosition(x - offset);

      if (stepValue % step !== 0) stepValue = stepValue - (stepValue % step);

      if (stepValue + min < min) stepValue = 0;
      if (stepValue + min > max) stepValue = max - min;

      if (limitMin) {
        const limitPoint = getPointPosition(limitMin - pointWidth);
        if (x - offset <= limitMin || stepValue <= limitPoint)
          stepValue = limitPoint + step;
      }

      if (limitMax) {
        const limitPoint = getPointPosition(limitMax - pointWidth);
        if (x - offset >= limitMax || stepValue >= limitPoint)
          stepValue = limitPoint - step;
      }

      setResult(stepValue + min);
    }

    if (stepValue !== null) {
      const newValue = Number(
        (stepValue * ((width - pointWidth) / maxSteps) + pointWidth).toFixed(2)
      );

      setValue(newValue);
      if (onChange)
        onChange(values ? values[stepValue] : stepValue + min, newValue);
    }
    setIsActive(false);

    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  if (!value || result === null) return null;

  return (
    <div
      ref={pointRef}
      className={`${styles.point} ${isActive ? styles.dragging : ""}`}
      style={{
        left: `${(value - pointWidth).toFixed(2)}px`,
      }}
      data-testid={`point-${name}`}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.circle} />
    </div>
  );
};

Point.propTypes = {
  name: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  values: PropTypes.array,
  step: PropTypes.number,
  offset: PropTypes.number,
  limitMax: PropTypes.number,
  limitMin: PropTypes.number,
  onChange: PropTypes.func,
  pointWidth: PropTypes.number,
  defaultValue: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  XOffset: PropTypes.number,
};

Point.defaultProps = {
  name: "",
  min: 1,
  max: 10,
  step: 1,
  pointWidth: 30,
  offset: 0,
  XOffset: 0,
};

export default Point;
