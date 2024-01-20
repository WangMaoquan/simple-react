import React from '../package/React';

const Counter = () => {
  const [count, setCount] = React.useState(10);

  function add() {
    setCount((c) => c + 1);
  }

  React.useEffect(() => {
    console.log('Counter-count', count);
  }, [count]);

  return (
    <div className="counter">
      <p>count: {count}</p>
      <button onClick={add}>add</button>
    </div>
  );
};

const Counter1 = () => {
  const [count, setCount] = React.useState(10);

  function add() {
    setCount((c) => c + 2);
  }

  React.useEffect(() => {
    console.log('Counter1-count', count);
  }, [count]);

  return (
    <div className="counter">
      <p>count: {count}</p>
      <button onClick={add}>add</button>
    </div>
  );
};

export default function TestUseEffect() {
  const [count, setCount] = React.useState(10);
  React.useEffect(() => {
    console.log('init');
  }, []);

  React.useEffect(() => {
    console.log('update', count);
  }, [count]);

  const add = () => {
    setCount((c) => c + 1);
  };

  return (
    <div className="test-use-effect">
      <p>{count}</p>
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
