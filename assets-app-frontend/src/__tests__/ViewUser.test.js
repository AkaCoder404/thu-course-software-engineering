import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';

import UserList from "../views/users/UserList.js";

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

// UserList tests
test("User list renders without crashing", () => {
    act(() => {
        ReactDOM.render(<UserList/>, div)
    })
})

test ("User list table can be used", () => {
    const ref = React.createRef();
    act(() => {
        ReactDOM.render(<UserList ref={ ref } />, div)
      })
    const code = ref.current

    const data = { "key" : "testKey", "name": "testName", "username":"testUsername", "status": "lock", "department": "systemadmin", "group": "sampledepartment"}
    code.data=data
    expect(code.data).toStrictEqual({ "key" : "testKey", "name": "testName", "username":"testUsername", "status": "lock", "department": "systemadmin", "group": "sampledepartment"})
    // expect(code).toBe("test")
    //code.updater();
    code.loadData();
    

    // test functions
    // const changePass = {"target": { "value" : "test" }}
    // code.handlePassword(changePass);
    // expect(code.state.password).toBe("test");
    // code.onHandlerChange("test");
    // expect(code.state.userCategory).toBe("test");
   

    // i don't know what i am doing
    const getTableButton = div.querySelector(".userManipulateButton");
    const tr = div.querySelector("tr[data-row-key=testKey]");
    const test = div.querySelector(".ant-table tr td:first-child").textContent;
    // expect(test).toBe("testName");

})
