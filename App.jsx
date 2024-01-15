import React from './package/React.js';

// const App = React.createElement(
//   'div',
//   { class: 'text' },
//   'hi, react',
//   React.createElement('div', { class: 'text2' }, 'hi, react2'),
// );

function Counter({ num }) {
  return <p>counter: {num}</p>;
}

function App({ num }) {
  return (
    <div className="app">
      <p>hi-react: {num}</p>
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
    </div>
  );
}

export default App;
