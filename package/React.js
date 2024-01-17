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

let workInProgress = null;
let currentRoot = null;
let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = preformWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 统一提交
  if (!nextWorkOfUnit && workInProgress) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function updateProps(el, nextProps, prevProps) {
  if (!nextProps) return;
  // 新没有 旧有
  Object.keys(prevProps).forEach((prop) => {
    if (prop !== 'children') {
      if (!(prop in nextProps)) {
        if (prop === 'className') {
          el.removeAttribute('class');
        } else {
          el.removeAttribute(prop);
        }
      }
    }
  });
  // 新有 旧没有
  // 新有 旧有

  Object.keys(nextProps).forEach((prop) => {
    if (prop !== 'children') {
      if (prop.startsWith('on')) {
        const eventType = prop.toLowerCase().slice(2);
        el.removeEventListener(eventType, prevProps[prop]);
        el.addEventListener(eventType, nextProps[prop]);
      } else if (prop === 'class') {
        el.className = nextProps[prop];
      } else {
        el[prop] = nextProps[prop];
      }
    }
  });
}

// 转换成链表
function reconcileChildren(fiber, children) {
  if (children.length) {
    let prevChild = null;
    let oldFiber = fiber?.alternate?.child;
    children.forEach((child, index) => {
      const isSameType = oldFiber && child.type === oldFiber.type;
      const newFiber = createFiber(child);
      newFiber.return = fiber;
      if (isSameType) {
        // update
        newFiber.dom = oldFiber.dom;
        newFiber.effectTag = 'update';
        newFiber.alternate = oldFiber;
      } else {
        newFiber.effectTag = 'placement';
      }
      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }
      if (index === 0) {
        fiber.child = newFiber;
      } else {
        prevChild.sibling = newFiber;
      }
      prevChild = newFiber;
    });
  }
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  const { props, type } = fiber;
  if (!fiber.dom) {
    // 创建dom
    const el = (fiber.dom =
      type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(type));
    // 处理 props
    updateProps(el, props, {});
  }
  const children = props?.children || [];
  reconcileChildren(fiber, children);
}

function preformWorkOfUnit(fiber) {
  // functionComponent type 就是我们写的那个函数
  const isFunctionComponent = typeof fiber.type === 'function';
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
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
  commitWork(workInProgress.child);
  currentRoot = workInProgress;
  workInProgress = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let parentFiber = fiber.return;
  // functionComponent 是不存在 DOM 的, 相当于 对元素 包了一层, 所以插入时需要去寻找存在 DOM 的return
  while (!parentFiber.dom) {
    parentFiber = parentFiber.return;
  }
  if (fiber.effectTag === 'placement') {
    // 这里的fiber 可能是functionComponent 的fiber
    if (fiber.dom) {
      parentFiber.dom.append(fiber.dom);
    }
  } else if (fiber.effectTag === 'update' && fiber.dom) {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props || {});
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 触发更新的
function update() {
  workInProgress = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };
  nextWorkOfUnit = workInProgress;
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  workInProgress = nextWorkOfUnit;
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
  update,
};

export default React;
