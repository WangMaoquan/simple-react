import React from './React';

const ReactDOM = {
  createRoot(el) {
    const root = document.querySelector(el);
    return {
      render(app) {
        React.render(app, root);
      },
    };
  },
};

export default ReactDOM;
