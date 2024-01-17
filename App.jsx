import React from './package/React.js';

// const App = React.createElement(
//   'div',
//   { class: 'text' },
//   'hi, react',
//   React.createElement('div', { class: 'text2' }, 'hi, react2'),
// );

let i = 0;
let props = {
  className: 'counter',
};
function Counter({ num }) {
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

function App({ num }) {
  return (
    <div className="app">
      <p>hi-react: {num}</p>
      {/* <Counter num={10}></Counter> */}
      {/* <Counter num={20}></Counter> */}
      <Counter></Counter>
    </div>
  );
}

export default App;
