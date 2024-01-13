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
    if (prop !== 'children') {
      el[prop] = props[prop];
    }
  });
  // 处理 children
  if (props.children.length) {
    renderChildren(props.children, container);
  }
  container.append(el);
}

function renderChildren(children, container) {
  children.forEach((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      container.append(createTextNode(child));
    }
  });
}

const React = {
  createElement,
  render,
};

export default React;
