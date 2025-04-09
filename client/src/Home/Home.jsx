import React from "react";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <h1>Welcome to the App</h1>
      <p>Select a page to navigate:</p>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li className={styles.listItem}>
          <a href="/chat" className={styles.link}>Chat Page</a>
        </li>
        <li className={styles.listItem}>
          <a href="/qnote" className={styles.link}>QNote Page</a>
        </li>
      </ul>
    </div>
  );
};

export default Home; 