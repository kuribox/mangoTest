import React, { useEffect, useState } from "react";
import styles from "./range.module.css";

const Label = ({ name = "", text, suffix, style, enableEdit, onChange }) => {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    setValue(text);
  }, [text]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (!onChange(value)) {
        setValue(text);
      }
      setEditMode(false);
    }
  };

  return (
    <div
      data-testid={`label-${name}`}
      className={`${styles.value} ${enableEdit ? styles.editable : ""}`}
      style={style}
      onClick={() => {
        if (enableEdit) {
          setEditMode(true);
        }
      }}
    >
      {editMode ? (
        <input
          data-testid="label-input"
          autoFocus
          className={styles.input}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      ) : (
        `${value} ${suffix}`
      )}
    </div>
  );
};

export default Label;
