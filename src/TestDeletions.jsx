import React from '../package/React';

// 新旧 type 不一致 直接删除旧的

function Bar() {
  return <div>bar</div>;
}

function Foo() {
  return <p>foo</p>;
}

let show = false;
export default function TestDeletions() {
  function change() {
    show = !show;
    React.update();
  }
  return (
    <div className="test-deletions">
      <button onClick={change}>change</button>
      {show ? <Bar /> : <Foo />}
    </div>
  );
}
