import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';

import About from "../views/about/index.js";

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

// About user test
test("User list renders without crashing", () => {
    act(() => {
        ReactDOM.render(<About/>, div)
    })
})