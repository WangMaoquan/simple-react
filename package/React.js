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

let deletions = [];
let workInProgress = null;
let currentRoot = null;
let nextWorkOfUnit = null;
let currentUpdateFiber = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = preformWorkOfUnit(nextWorkOfUnit);
    if (workInProgress?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = null;
    }
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
        if (oldFiber) {
          deletions.push(oldFiber);
        }
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

    // 处理完 newFiber children 后, 如果 oldFiber 还有值 说明还需要处理
    while (oldFiber) {
      deletions.push(oldFiber);
      oldFiber = oldFiber.sibling;
    }
  }
}

function updateFunctionComponent(fiber) {
  currentUpdateFiber = fiber;
  const children = [fiber.type(fiber.props)].filter((child) => !!child);
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
  const children = (props?.children || []).filter((child) => !!child);
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
  deletions.forEach(commitDeletions);
  currentRoot = workInProgress;
  workInProgress = null;
  deletions = [];
}

/**
 * 删除也就是们需要拿到 当前fiber.dom 然后通过 fiber.return.dom.removeChild 去删除
 * 这时就会遇到两个问题 fiber 是 FC 也就是我们拿不到 dom 所以我们需要往下也就是 fiber.child
 * 此时的fiber存在 dom, 但是它的 return 是 FC 所以我们需要啊 fiber.return.return 一直找到存在 dom 的
 */
function commitDeletions(fiber) {
  if (fiber.dom) {
    let parentFiber = fiber.return;
    while (!parentFiber.dom) {
      parentFiber = parentFiber.return;
    }
    parentFiber.dom.removeChild(fiber.dom);
  } else {
    commitDeletions(fiber.child);
  }
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
  let fiber = currentUpdateFiber;
  return () => {
    workInProgress = {
      ...fiber,
      alternate: fiber,
    };
    nextWorkOfUnit = workInProgress;
  };
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
