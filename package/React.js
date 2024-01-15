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

function preformWorkOfUnit(fiber) {
  const { props, type } = fiber;
  // functionComponent type 就是我们写的那个函数
  const isFunctionComponent = typeof fiber.type === 'function';
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      // 创建dom
      const el = (fiber.dom =
        type === 'TEXT_ELEMENT'
          ? document.createTextNode('')
          : document.createElement(type));
      // 处理 props
      updateProps(el, props);
    }
  }
  // 转换成链表
  const children = isFunctionComponent
    ? [fiber.type(fiber.props)]
    : props?.children || [];
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
  // functionComponent 包的 fiber 的sibling 也需要递归
  // return fiber?.return?.sibling;
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function commitRoot() {
  commitWork(root.child);
}

function commitWork(fiber) {
  if (!fiber) return;
  let parentFiber = fiber.return;
  // functionComponent 是不存在 DOM 的, 相当于 对元素 包了一层, 所以插入时需要去寻找存在 DOM 的return
  while (!parentFiber.dom) {
    parentFiber = parentFiber.return;
  }
  // 这里的fiber 可能是functionComponent 的fiber
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
