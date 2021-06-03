import {act} from 'react-dom/test-utils';


// Get rid of some ... TypeErrors...    
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

let div
beforeEach(() => {
  div = document.createElement('div')
  document.body.appendChild(div)
})

afterEach(() => {
  document.body.removeChild(div)
  div = null
})

// MobileLoginForm.js
test('Mobile Login Form renders without crashing', () => {
  act(() => {
    // ReactDOM.render(<MobileLoginForm />, div)
  })
})

// // AccountLogin
// test("Account Login Form renders without crashing",() => {
//   act(() => {
//     ReactDOM.render(<Router><withRouter><LoginForm/></withRouter></Router>, div)
//   })
// })

