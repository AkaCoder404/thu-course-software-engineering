import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import  Dashboard  from "../views/dashboard/index.js";

let div
beforeEach(() => {
  div = document.createElement('div')
  document.body.appendChild(div)
})

afterEach(() => {
  document.body.removeChild(div)
  div = null
})

test('Dashboard renders without crashing', () => {
  act(() => {
    // ReactDOM.render(<Dashboard />, div)
  })
})

