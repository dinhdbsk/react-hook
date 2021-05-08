import React from "react";
import styles from "./index.css";
import Link from "umi/link";
// import {formatMessage} from "umi-plugin-react/locale";
import { formatMessage } from "umi/locale";

export default function () {
  const a = API_ENDPOINT;
  console.log(process.env, a);
  return (
    <div className={styles.normal}>
      <div>
        {formatMessage({id: "WELCOME_TO_UMI_WORLD", defaultMessage: "Báo cáo dasadsd"})}
        <br/>
        {formatMessage({id: "WELCOME_TO_UMI_WORLD_1", defaultMessage: "hehe"})}
        {formatMessage({id: "a.b.c", defaultMessage: "a b c"})}
        {formatMessage({id: "a.b.c.f", defaultMessage: "a b ceqweqweqw"})}
        {formatMessage({id: "a.b.c.f.12312312", defaultMessage: "a b ceqweqweqw"})}
        {formatMessage({id: "a.b.c.f.345345454", defaultMessage: "a b ceqweqweqw"})}
        {formatMessage({id: "a.b.c.d", defaultMessage: "a b c d"})}
        {formatMessage({id: "hehe", defaultMessage: "dasda asdasdsdasd"})}
        {formatMessage({id: "hehe11231", defaultMessage: "dasda asdasdsdasd"})}
        {formatMessage({id: "hehe11231qqweqwe21123123", defaultMessage: "dasda asdasdsdasd dasdasda hehehe"})}
        {formatMessage({id: "hehe11231qqweqwe21123123 eqweqweqweqw", defaultMessage: "dasda asdasdsdasd dasdasda hehehe"})}
      </div>
      <ul className={styles.list}>
        <li>To get started, edit <code>src/pages/index.js</code> and save to reload.</li>
        <li>
          <a href="https://umijs.org/guide/getting-started.html">
            Getting Started
          </a>
        </li>
        <li>
          <Link to="/users">Go to users page</Link>
        </li>
        <li>{a}</li>
      </ul>
      <div className={styles.welcome}/>
    </div>
  );
}
