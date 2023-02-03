import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./range.module.css";
import Point from "./Point";

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

  const [result, setResult] = useState({
    min: values ? values[0] : min,
    max: values ? values[values.length - 1] : max,
  });

  const [labelSize, seLabelSize] = useState(null);
  const [width, setWidth] = useState(null);

  const ref = useRef(null);

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

    // Valores iniciales
    setMinValue(30);
    setMaxValue(ref.current.parentNode.offsetWidth - 2 * LabelSize);

    setWidth(ref.current.parentNode.offsetWidth - 2 * LabelSize);
  }, []); // Get width of parent element

  useEffect(() => {
    if (onChange) onChange(result);
  }, [result]);

  if (!labelSize) return <div ref={ref} />;

  return (
    <div ref={ref} className={styles.container}>
      <div className={styles.value} style={{ fontSize, width: labelSize }}>
        {suffix ? `${result.min} ${suffix}` : result.min}
      </div>
      <div style={{ flex: 1 }}>
        {(!values || (values && values.length > 1)) && (
          <div className={styles.range}>
            <div className={styles.bar} />
            <div
              className={styles.selectedBar}
              style={{
                width: maxValue - minValue,
                left: `${minValue - 30 / 2}px`,
              }}
            />
            <Point
              min={min}
              max={max}
              step={step}
              values={values}
              offset={labelSize}
              pointWidth={30}
              defaultValue={minValue}
              limitMax={maxValue}
              width={width}
              onChange={(r, val) => {
                setResult({ ...result, min: r });
                setMinValue(val);
              }}
            />

            <Point
              min={min}
              max={max}
              step={step}
              values={values}
              offset={labelSize}
              pointWidth={30}
              defaultValue={maxValue}
              limitMin={minValue}
              width={width}
              onChange={(r, val) => {
                setResult({ ...result, max: r });
                setMaxValue(val);
              }}
            />
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
