import React from '../package/React.js';
let i = 0;
let props = {
  className: 'counter',
};
export default function Counter({ num }) {
  function add() {
    console.log('click');
    i++;
    props = { id: '11' };
    React.update();
  }

  return (
    <div {...props}>
      <p>counter: {i}</p>
      <button onClick={add}>click</button>
    </div>
  );
}
