import React from './package/React.js';

// const App = React.createElement('div', { class: 'text' }, 'hi, react');

function App() {
  return (
    <div>
      <p className="app">hi app</p>
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
    </div>
  );
}

function Counter({ num }) {
  return <p>count: {num}</p>;
}

export default App;
