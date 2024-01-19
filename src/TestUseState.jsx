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
    </div>
  );
}
