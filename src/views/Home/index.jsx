import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.button} onClick={() => navigate("/exercise1")}>
        Exercise 1
      </div>
      <div className={styles.button} onClick={() => navigate("/exercise2")}>
        Exercise 2
      </div>
    </div>
  );
};

export default Home;
