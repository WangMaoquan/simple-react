import React from './package/React.js';

const App = React.createElement(
  'div',
  { class: 'text' },
  'hi, react',
  React.createElement('div', { class: 'text2' }, 'hi, react2'),
);

console.log(App);

export default App;
