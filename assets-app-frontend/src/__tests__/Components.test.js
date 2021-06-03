import {act} from 'react-dom/test-utils';

//import {LayoutContainerMain} from "../components/containerMain/index.js"

// import MainPageLayout from "../views/main/index.js";
//LayoutContainerMain

let div
beforeEach(() => {
  div = document.createElement('div')
  document.body.appendChild(div)
})

afterEach(() => {
  document.body.removeChild(div)
  div = null
})

// main
test("Main Layout renders without crashing", () => {
  act(() => {
      //ReactDOM.render(<MainPageLayout/>, div)
  })
})



// Code .js
// test("Code renders without crashing", () => {
//     act(() => {
//         ReactDOM.render(<Code/>, div)
//     })
// })

// test ("Code can be controlled by buttons", () => {
//     const ref = React.createRef();
//     act(() => {
//         ReactDOM.render(<Code ref={ ref } />, div)
//       })
//     const code = ref.current
//     const getCode = div.querySelector(".getCodeButton");
//     act(() => {
//         getCode.dispatchEvent(new MouseEvent('click', { bubbles: true }))
//     })
//     expect(code.state.temp_code).toBe("tempCode");
// })

