import React, { Component } from 'react';
import LoginForm from './accountlogin';
import './index.css';

class Login extends Component {
  constructor() {
    super();
    this.state = { };
  }
  
  render()  {
    return (
      <div className = "login-wrap">
        <h1 className="title"> HUAWEI </h1>
          <LoginForm></LoginForm>
      </div>
    );
  }
}
export default Login;