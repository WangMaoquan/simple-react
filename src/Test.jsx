import React from '../package/React';

/**
 * 为啥会出现 点击 Foo 的 add , Foo,Bar,Test 都会执行的这种情况
 *
 * 因为我们的 update 方法不能定位到 具体的是哪个组件发生了变化, 我们传入的 workInProgrocess 始终是 从最root 开始的
 *
 * 所以我们只需要 让更新从 触发的组件那个fiber 开始就行了,
 * 什么时候结束呢? 下一个 就是 触发的组件fiber.sibling
 *
 * 怎么获取 触发的组件 fiber?
 */

let fooCount = 1;
function Foo() {
  console.log('foo update');
  const update = React.update();
  const add = () => {
    fooCount++;
    update();
  };
  return (
    <div className="foo">
      <p>fooCount: {fooCount}</p>
      <button onClick={add}>add</button>
    </div>
  );
}

let barCount = 1;
function Bar() {
  console.log('bar update');
  const update = React.update();
  const add = () => {
    barCount++;
    update();
  };
  return (
    <div className="bar">
      <p>barCount: {barCount}</p>
      <button onClick={add}>add</button>
    </div>
  );
}

let testCount = 1;
export default function Test() {
  console.log('test update');
  const update = React.update();
  const add = () => {
    testCount++;
    update();
  };
  return (
    <div className="test">
      <p>testCount: {testCount}</p>
      <button onClick={add}>add</button>

      <div className="area">
        <Bar />
        <Foo />
      </div>
    </div>
  );
}
