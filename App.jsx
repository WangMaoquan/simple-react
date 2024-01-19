import React from './package/React';
// import Counter from './src/Counter';
// import TestDeletions from './src/TestDeletions';
// import Deletions from './src/Deletions';
// import Test from './src/Test';
// import Test1 from './src/Ta';
import TestUseState from './src/TestUseState';

// const App = React.createElement(
//   'div',
//   { class: 'text' },
//   'hi, react',
//   React.createElement('div', { class: 'text2' }, 'hi, react2'),
// );

let show = true;
function App({ num }) {
  const changeShow = () => {
    show = !show;
    React.update();
  };

  return (
    <div className="app">
      {/* <p>hi-react: {num}</p> */}
      {/* <Counter num={10}></Counter> */}
      {/* <Counter num={20}></Counter> */}
      {/* <Counter></Counter> */}
      {/* <TestDeletions /> */}
      {/* <Deletions /> */}
      {/* {show && <Test />}

      <div className="btns">
        <button onClick={changeShow}>change-show</button>
      </div> */}
      {/* <Test /> */}
      {/* <Test1 /> */}
      <TestUseState />
    </div>
  );
}

export default App;
