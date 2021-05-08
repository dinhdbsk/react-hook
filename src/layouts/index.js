import React from 'react';
import withRouter from 'umi/withRouter';
import {connect} from 'dva';
import styles from './index.css';

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Hi! Welcome to react-hook!</h1>
      {props.children}
    </div>
  );
}

export default withRouter(connect()(BasicLayout));
