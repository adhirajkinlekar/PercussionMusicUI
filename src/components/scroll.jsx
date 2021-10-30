import React from 'react';
import './scroll.css'
const Scroll = (props) => {
  return (
    <div className="scrollBar" style={{ overflowY: 'overlay', height: props.height }}>
      {props.children}
    </div>
  );
};

export default Scroll;