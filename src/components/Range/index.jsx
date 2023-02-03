import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./range.module.css";
import Point from "./Point";
import Label from "./Label";

const Range = ({ min, max, values, suffix, step, onChange, fontSize }) => {
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

    // initial values
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
      <Label
        text={String(result.min)}
        suffix={suffix}
        style={{ fontSize, width: labelSize }}
        enableEdit={!values}
        onChange={(value) => {
          if (isNaN(Number(value))) return false;
          if (!(Number(value) >= min && Number(value) <= result.max))
            return false;
          if (Number(value) >= result.max) return false;

          setResult({ ...result, min: Number(value) });
        }}
      />
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
              value={result.min}
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
              value={result.max}
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
      <Label
        text={String(result.max)}
        suffix={suffix}
        style={{ fontSize, width: labelSize }}
        enableEdit={!values}
        onChange={(value) => {
          if (isNaN(Number(value))) return false;
          if (!(Number(value) >= min && Number(value) <= result.max))
            return false;
          if (Number(value) <= result.min) return false;

          setResult({ ...result, max: Number(value) });
        }}
      />
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
  min: 1,
  max: 10,
  step: 1,
  fontSize: 15,
  suffix: "",
};

export default Range;
