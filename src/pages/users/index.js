import React from 'react';
import {connect} from 'dva';
import ButtonComponent from '@/components/Button';
import ButtonYouComponent from '@/love/you';


const UserPage = ({dispatch}) => {
  return (
    <div>
      <span onClick={() => {
        dispatch({
          type: 'global/login'
        })
      }}>login</span>
      <ButtonComponent/>
      <ButtonYouComponent/>
    </div>
  );
};

export default connect()(UserPage)
