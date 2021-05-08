import React from "react";
import styles from "./index.css";
import Link from "umi/link";

export default function () {
  return (
    <div>
      <ul className={styles.list}>
        <li>To get started, edit <code>src/pages/index.js</code> and save to reload.</li>
        <li>
          <a href="https://umijs.org/guide/getting-started.html">
            Getting Started
          </a>
        </li>
        <li>
          <Link to="/react-use-state">Go to useState</Link>
        </li>
      </ul>
      <div className={styles.welcome}/>
    </div>
  );
}
