import React, { useEffect, useState } from "react";
import styles from "./exercise1.module.css";
import Range from "../../components/Range";
import { getExercise1 } from "../../services/exercise";

const Exercise1 = () => {
  const [values, setValues] = useState(null);

  const onMount = async () => {
    try {
      const resposne = await getExercise1();

      if (
        resposne &&
        typeof resposne.min === "number" &&
        typeof resposne.max === "number"
      )
        setValues(resposne);
      else setValues(false);
    } catch (error) {
      setValues(false);
    }
  };

  useEffect(() => {
    onMount();
  }, []);

  if (values === null) return null;
  if (!values)
    return (
      <div className={styles.container} style={{ color: "red" }}>
        Error. cannot get config
      </div>
    );

  return (
    <div className={styles.container}>
      <Range min={values.min} max={values.max} suffix="€" />
    </div>
  );
};

export default Exercise1;
