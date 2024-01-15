import { Fiber, createFiber } from './Fiber';

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === 'string' || typeof child === 'number') {
          return {
            type: 'TEXT_ELEMENT',
            props: {
              nodeValue: child,
            },
          };
        }
        return child;
      }),
    },
  };
}

let root = null;
let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = preformWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 统一提交
  if (!nextWorkOfUnit && root) {
    commitRoot();
    root = null;
  }

  requestIdleCallback(workLoop);
}

function preformWorkOfUnit(fiber) {
  const { props, type } = fiber;
  if (!fiber.dom) {
    // 创建dom
    const el = (fiber.dom =
      type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(type));
    // 处理 props
    Object.keys(props).forEach((prop) => {
      if (prop === 'class') {
        el.className = props[prop];
      } else if (prop !== 'children') {
        el[prop] = props[prop];
      }
    });
  }
  // 转换成链表
  const { children = [] } = props;
  if (children.length) {
    let prevFiber = null;
    children.forEach((child, index) => {
      const newFiber = createFiber(child);
      newFiber.return = fiber;
      if (index === 0) {
        fiber.child = newFiber;
      } else {
        prevFiber.sibling = newFiber;
      }
      prevFiber = newFiber;
    });
  }
  // 返回下一个
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber?.return?.sibling;
}

function commitRoot() {
  commitWork(root.child);
}

function commitWork(fiber) {
  if (!fiber) return;
  fiber.return.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextWorkOfUnit;
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};

export default React;
