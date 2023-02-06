import React, { useEffect, useState } from "react";
import styles from "./exercise2.module.css";
import Range from "../../components/Range";
import { getExercise2 } from "../../services/exercise";

const Exercise2 = () => {
  const [values, setValues] = useState(null);

  const onMount = async () => {
    try {
      const response = await getExercise2();

      if (response && Array.isArray(response.values)) setValues(response.values);
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
      <div style={{ width: '30%'}}>
        <Range values={values} suffix="€" />
      </div>
    </div>
  );
};

export default Exercise2;
