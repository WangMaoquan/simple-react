import React from '../package/React';

export default function TestUseState() {
  const [count, setCount] = React.useState(10);

  function add() {
    setCount((c) => c + 1);
  }

  return (
    <div className="test-use-state">
      <p>count: {count}</p>
      <button onClick={add}>add</button>

      <div className="sub">
        <h2>Counter</h2>
        <Counter />
        <h2>Counter1</h2>
        <Counter1 />
      </div>
    </div>
  );
}

const Counter = () => {
  const [count, setCount] = React.useState(10);

  function add() {
    setCount((c) => c + 1);
  }

  return (
    <div className="counter">
      <p>count: {count}</p>
      <button onClick={add}>add</button>
    </div>
  );
};

let i = 0;
const Counter1 = () => {
  const [count, setCount] = React.useState(10);

  function add() {
    setCount(++i);
  }

  return (
    <div className="counter">
      <p>count: {count}</p>
      <button onClick={add}>add</button>
    </div>
  );
};
