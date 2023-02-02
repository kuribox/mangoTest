import React, { useState, useRef, useEffect } from "react";
import styles from "./range.module.css";

const Range = ({
  min = 30,
  max = 40,
  values, // = [5, 10, 99, 30.5],
  step = 2,
  onChange,
}) => {
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [maxSteps] = useState(values ? values.length - 1 : max - min);

  const [result, setResult] = useState({
    min: values ? values[0] : min,
    max: values ? values[values.length - 1] : max,
  });

  const [width, setWidth] = useState(null);
  const [pointWidth, setPointWidth] = useState(1);

  const rangeRef = useRef(null);
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    setWidth(ref.current.parentElement.offsetWidth);
    setMaxValue(ref.current.parentElement.offsetWidth);
  }, []); // Get width of parent element

  useEffect(() => {
    setTimeout(() => {
      if (maxRef.current?.offsetWidth || minRef.current?.offsetWidth) {
        setPointWidth(maxRef.current.offsetWidth);
        setMinValue(maxRef.current.offsetWidth);
      }
    }, 50);
  }, [maxRef, minRef]); // Get width of parent element

  useEffect(() => {
    if (onChange) onChange(result);
  }, [result]);

  // no render if width is not set or if values are set and there is only one value
  if (!width && (!values || (values && values.length > 1)))
    return <div ref={ref} />;

  // Update min drag position
  const handleMinDrag = (e) => {
    if (e.clientX < maxValue && e.clientX >= pointWidth) setMinValue(e.clientX);
  };

  // Update max drag position
  const handleMaxDrag = (e) => {
    if (e.clientX > minValue && e.clientX <= width) setMaxValue(e.clientX);
  };

  const handleMinMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    window.addEventListener("mousemove", handleMinDrag);
    window.addEventListener("mouseup", handleMinMouseUp);
  };

  const handleMaxMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    window.addEventListener("mousemove", handleMaxDrag);
    window.addEventListener("mouseup", handleMaxMouseUp);
  };

  // on mouse up min drag point, set most close value to result
  const handleMinMouseUp = (e) => {
    if (values) {
      let stepValue = Math.round(e.clientX / ((width - pointWidth) / maxSteps));

      if (
        values[stepValue] &&
        values.findIndex((c) => c === result.max) <= stepValue
      ) {
        stepValue = stepValue - 1;
      }

      if (!values[stepValue]) stepValue = 0;

      setMinValue(stepValue * ((width - pointWidth) / maxSteps) + pointWidth);
      setResult({ ...result, min: values[stepValue] });
    } else {
      let stepValue = Math.ceil(e.clientX / ((width - pointWidth) / maxSteps));

      if (stepValue % step !== 0) stepValue = stepValue - (stepValue % step);
      if (stepValue + min >= result.max) stepValue = stepValue - step;

      setMinValue(stepValue * ((width - pointWidth) / maxSteps) + pointWidth);
      setResult({ ...result, min: stepValue + min });
    }

    window.removeEventListener("mousemove", handleMinDrag);
    window.removeEventListener("mouseup", handleMinMouseUp);
  };

  // on mouse up max drag point, set most close value to result
  const handleMaxMouseUp = (e) => {
    if (values) {
      let stepValue = Math.round(e.clientX / ((width - pointWidth) / maxSteps));

      if (
        values[stepValue] &&
        values.findIndex((c) => c === result.min) >= stepValue
      ) {
        stepValue = stepValue + 1;
      }

      if (!values[stepValue]) stepValue = values.length - 1;

      setMaxValue(stepValue * ((width - pointWidth) / maxSteps) + pointWidth);
      setResult({ ...result, max: values[stepValue] });
    } else {
      let stepValue = Math.floor(e.clientX / ((width - pointWidth) / maxSteps));

      if (stepValue % step !== 0) stepValue = stepValue + (stepValue % step);
      if (stepValue + min <= result.min) stepValue = stepValue + step;

      setMaxValue(stepValue * ((width - pointWidth) / maxSteps) + pointWidth);
      setResult({ ...result, max: stepValue + min });
    }

    window.removeEventListener("mousemove", handleMaxDrag);
    window.removeEventListener("mouseup", handleMaxMouseUp);
  };

  return (
    <div ref={ref}>
      {result.min}
      <div ref={rangeRef} className={styles.range} style={{ width }}>
        <div className={styles.bar} />
        <div
          className={styles.selectedBar}
          style={{
            width: maxValue - minValue,
            left: `${minValue - pointWidth / 2}px`,
          }}
        />
        <div
          ref={minRef}
          className={styles.min}
          style={{
            left: `${minValue - pointWidth}px`,
          }}
          onMouseDown={handleMinMouseDown}
        >
          <div className={styles.circle} />
        </div>
        <div
          ref={maxRef}
          className={styles.max}
          style={{
            left: `${maxValue - pointWidth}px`,
          }}
          onMouseDown={handleMaxMouseDown}
        >
          <div className={styles.circle} />
        </div>
      </div>
      {result.max}
    </div>
  );
};

export default Range;
