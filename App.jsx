import React from './package/React.js';
import Counter from './src/Counter.jsx';

// const App = React.createElement(
//   'div',
//   { class: 'text' },
//   'hi, react',
//   React.createElement('div', { class: 'text2' }, 'hi, react2'),
// );

function App({ num }) {
  return (
    <div className="app">
      <p>hi-react: {num}</p>
      {/* <Counter num={10}></Counter> */}
      {/* <Counter num={20}></Counter> */}
      {/* <Counter></Counter> */}
    </div>
  );
}

export default App;
