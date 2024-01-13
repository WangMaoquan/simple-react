function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function render(vnode, container) {
  const { props, type } = vnode;
  const el = document.createElement(type);
  // 处理属性
  Object.keys(props).forEach((prop) => {
    if (prop === 'class') {
      el.className = props[prop];
    } else if (prop !== 'children') {
      el[prop] = props[prop];
    }
  });
  // 处理 children
  if (props.children.length) {
    renderChildren(props.children, el);
  }
  container.append(el);
}

function renderChildren(children, container) {
  children.forEach((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      container.append(createTextNode(child));
    } else {
      render(child, container);
    }
  });
}

const React = {
  createElement,
  render,
};

export default React;
