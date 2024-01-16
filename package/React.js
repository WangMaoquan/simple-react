import { createFiber } from './Fiber';
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

// 统一提交, 避免页面只显示了一部分DOM
// 借助 requestIdleCallback
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

/**
 * 当处理到 FC 最后的一个子节点时, 我们的下一个任务应该是 FC.sibling, 但是FC 最后一个子节点的sibling 是没有值的, 所以需要我们向上去寻找, 最后没有才 fiber.return
 */
function preformWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function updateProps(el, props) {
  if (!props) return;
  Object.keys(props).forEach((prop) => {
    if (prop === 'class') {
      el.className = props[prop];
    } else if (prop !== 'children') {
      el[prop] = props[prop];
    }
  });
}

/*

遍历形成fiber链表

*/
function initChildren(fiber, children) {
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
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

function updateHostComponent(fiber) {
  const { props, type } = fiber;
  if (!fiber.dom) {
    const el = (fiber.dom =
      type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(type));
    updateProps(el, props);
  }
  const children = props?.children || [];
  initChildren(fiber, children);
}

function commitRoot() {
  commitWork(root.child);
}

/**
 * 插入DOM 我们需要知道 functionComponent 是没有DOM 的
 * 所以我们需要while 循环去排除掉 functionComponent
 * 因为不存在 DOM(FC) 所以我们还需要过滤掉
 */
function commitWork(fiber) {
  if (!fiber) return;
  let parentFiber = fiber.return;
  while (!parentFiber.dom) {
    parentFiber = parentFiber.return;
  }
  if (fiber.dom) {
    parentFiber.dom.append(fiber.dom);
  }
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
