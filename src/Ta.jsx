import React from '../package/React';
// 优化更新，update只更新当前组件和子组件

let copy = null;

function Foo() {
  console.log('foo return');
  // 需要再创建组件时候获取节点
  const update = React.update();
  function handleClick() {
    // 方法里获取节点会获取到下一个获取节点
    num++;
    update();
  }
  if (!copy) {
    copy = handleClick;
    window.copy = copy;
  }
  console.log('copy', copy);
  return (
    <div>
      fooNum：{num}
      <button onClick={handleClick}>click</button>
    </div>
  );
}
function Boo() {
  console.log('boo return');
  const update = React.update();
  function handleClick() {
    num++;
    update();
  }
  return (
    <div>
      booNum：{num}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let num = 1;
function Test1() {
  console.log('app return');
  const update = React.update();
  function handleClick() {
    num++;
    update();
  }
  return (
    <div>
      appNum：{num}
      <button onClick={handleClick}>click</button>
      <Foo></Foo>
      <Boo></Boo>
    </div>
  );
}

export default Test1;
