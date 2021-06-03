import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from "./views/login/index";
import MainPageLayout from "./views/main/index";
import PrivateRouter from './components/privateRouter/index';

function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact component = {Login} path = "/"/>
          <PrivateRouter component={MainPageLayout} path = "/main"/>
        </Switch>
      </BrowserRouter>
  );
}

export default App;
