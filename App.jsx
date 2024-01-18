import React from './package/React';
import Counter from './src/Counter';
import TestDeletions from './src/TestDeletions';

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
      <TestDeletions />
    </div>
  );
}

export default App;
