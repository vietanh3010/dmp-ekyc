import React, {Component} from 'react';
import {HashRouter, Route, Switch, Redirect, BrowserRouter} from 'react-router-dom';
import Loadable from 'react-loadable';
import './App.scss';


const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
});

// Pages
const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});

const Register = Loadable({
  loader: () => import('./views/Pages/Register'),
  loading
});

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});

// Token
const Token = Loadable({
  loader: () => import('./views/Pages/Token'),
  loading
});

class App extends Component {
  render() {
    if (localStorage.getItem('access_token') || localStorage.getItem('id_token')) {
      return (
        < BrowserRouter>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login}/>
            <Route exact path="/register" name="Register Page" component={Register}/>
            <Route exact path="/404" name="Page 404" component={Page404}/>
            <Route exact path="/500" name="Page 500" component={Page500}/>
            {/*<Route path="/oauth/redirect" name="Token" component={Token}/>*/}
            <Route path="/" name="Home" component={DefaultLayout}/>
          </Switch>
        </ BrowserRouter>
      );
    } else {
      return (
        < BrowserRouter>
          <Switch>
            <Route path="/" exact component={Login}/>
            <Route path="/register" exact component={Register}/>
            {/*<Route path="/oauth/redirect" name="Token" component={Token}/>*/}
            <Redirect to="/"/>
          </Switch>
        </ BrowserRouter>
      )
    }
  }
}

export default App;
