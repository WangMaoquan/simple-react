import React from '../package/React';

/**
 * 旧的比新的多
 * 怎么理解这里的多? 简单来说就是多出来的 DOM
 *
 * 因为我们现在的代码是没有删除 fooFiber.sibling.dom 的 即 <p>foo-child</p> 这里
 */

const Bar = <div>bar</div>;

const Foo = (
  <div>
    foo
    <p>foo-child</p>
  </div>
);

let show = false;
export default function Deletions() {
  function change() {
    show = !show;
    React.update();
  }
  return (
    <div className="test-deletions">
      <button onClick={change}>change</button>
      {show ? Bar : Foo}
    </div>
  );
}
