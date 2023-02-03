import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./range.module.css";

const Range = ({
  min = 30,
  max = 40,
  values, // = [5, 10, 909, 30.5],
  suffix = "€",
  step = 2,
  onChange,
  fontSize = 15,
}) => {
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [maxSteps] = useState(values ? values.length - 1 : max - min);

  const [result, setResult] = useState({
    min: values ? values[0] : min,
    max: values ? values[values.length - 1] : max,
  });

  const [pointWidth, setPointWidth] = useState(1);
  const [labelSize, seLabelSize] = useState(null);

  const [isActiveMin, setIsActiveMin] = useState(false);
  const [isActiveMax, setIsActiveMax] = useState(false);

  const rangeRef = useRef(null);
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const ref = useRef(null);
  const rangeContainerRef = useRef(null);

  useEffect(() => {
    let LabelSize = 0;
    if (values) {
      LabelSize =
        values.reduce((p, c) => {
          return p > String(c).length ? p : String(c).length;
        }, 0) *
          fontSize +
        5;
    } else {
      LabelSize = String(max).length * fontSize + 5;
    }

    if (suffix) LabelSize += (suffix.length + 1) * fontSize;

    seLabelSize(LabelSize);
    setMaxValue(ref.current.parentNode.offsetWidth - 2 * LabelSize);
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

  // Update min drag position
  const handleMinDrag = (e) => {
    if (e.clientX - labelSize < maxValue && e.clientX - labelSize >= pointWidth)
      setMinValue(e.clientX - labelSize);
  };

  // Update max drag position
  const handleMaxDrag = (e) => {
    if (
      e.clientX - labelSize > minValue &&
      e.clientX - labelSize <= rangeContainerRef.current.offsetWidth
    )
      setMaxValue(e.clientX - labelSize);
  };

  const handleMinMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsActiveMin(true);

    document.body.style.cursor = "grab";
    window.addEventListener("mousemove", handleMinDrag);
    window.addEventListener("mouseup", handleMinMouseUp);
  };

  const handleMaxMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsActiveMax(true);

    document.body.style.cursor = "grab";
    window.addEventListener("mousemove", handleMaxDrag);
    window.addEventListener("mouseup", handleMaxMouseUp);
  };

  // on mouse up min drag point, set most close value to result
  const handleMinMouseUp = (e) => {
    document.body.style.cursor = "auto";
    const width = rangeContainerRef.current.offsetWidth;

    let stepValue = null;
    if (values) {
      stepValue = Math.round(
        (e.clientX - labelSize) / ((width - pointWidth) / maxSteps)
      );

      if (!values[stepValue]) stepValue = 0;
      else if (values.findIndex((c) => c === result.max) <= stepValue)
        stepValue = stepValue - 1;

      setResult({ ...result, min: values[stepValue] });
    } else {
      stepValue = Math.round(
        (e.clientX - labelSize) / ((width - pointWidth) / maxSteps)
      );

      if (stepValue % step !== 0) stepValue = stepValue - (stepValue % step);
      if (stepValue + min >= result.max) stepValue = stepValue - step;

      setResult({ ...result, min: stepValue + min });
    }

    if (stepValue !== null) {
      setMinValue(stepValue * ((width - pointWidth) / maxSteps) + pointWidth);
    }
    setIsActiveMin(false);

    window.removeEventListener("mousemove", handleMinDrag);
    window.removeEventListener("mouseup", handleMinMouseUp);
  };

  // on mouse up max drag point, set most close value to result
  const handleMaxMouseUp = (e) => {
    document.body.style.cursor = "auto";

    const width = rangeContainerRef.current.offsetWidth;

    let stepValue = null;
    if (values) {
      stepValue = Math.round(
        (e.clientX - labelSize) / ((width - pointWidth) / maxSteps)
      );
      if (!values[stepValue]) stepValue = values.length - 1;
      else if (values.findIndex((c) => c === result.min) >= stepValue)
        stepValue = stepValue + 1;

      setResult({ ...result, max: values[stepValue] });
    } else {
      stepValue = Math.round(
        (e.clientX - labelSize) / ((width - pointWidth) / maxSteps)
      );
      if (stepValue % step !== 0) stepValue = stepValue + (stepValue % step);
      if (stepValue + min <= result.min) stepValue = stepValue + step;

      setResult({ ...result, max: stepValue + min });
    }

    if (stepValue !== null) {
      setMaxValue(stepValue * ((width - pointWidth) / maxSteps) + pointWidth);
    }
    setIsActiveMax(false);

    window.removeEventListener("mousemove", handleMaxDrag);
    window.removeEventListener("mouseup", handleMaxMouseUp);
  };

  if (!labelSize) return <div ref={ref} />;

  return (
    <div ref={ref} className={styles.container}>
      <div className={styles.value} style={{ fontSize, width: labelSize }}>
        {suffix ? `${result.min} ${suffix}` : result.min}
      </div>
      <div ref={rangeContainerRef} style={{ flex: 1 }}>
        {(!values || (values && values.length > 1)) && (
          <div ref={rangeRef} className={styles.range}>
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
              className={`${styles.point} ${
                isActiveMin ? styles.dragging : ""
              }`}
              style={{
                left: `${minValue - pointWidth}px`,
              }}
              onMouseDown={handleMinMouseDown}
            >
              <div className={styles.circle} />
            </div>
            <div
              ref={maxRef}
              className={`${styles.point} ${
                isActiveMax ? styles.dragging : ""
              }`}
              style={{
                left: `${maxValue - pointWidth}px`,
              }}
              onMouseDown={handleMaxMouseDown}
            >
              <div className={styles.circle} />
            </div>
          </div>
        )}
      </div>
      <div className={styles.value} style={{ fontSize, width: labelSize }}>
        {suffix ? `${result.max} ${suffix}` : result.max}
      </div>
    </div>
  );
};

Range.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  values: PropTypes.array,
  suffix: PropTypes.string,
  fontSize: PropTypes.number,
  onChange: PropTypes.func,
};

Range.defaultProps = {
  step: 1,
  fontSize: 15,
};

export default Range;
