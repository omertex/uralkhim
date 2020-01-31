import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.scss';
import { AuthContext } from './AuthContext/AuthContext';
import ApolloContext from './ApolloContext/ApolloContext';
import Normalize from 'react-normalize';
import { Provider } from 'react-redux';
import store from './Redux/store'

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = React.lazy(() =>
  import('./shared_components/DefaultLayout/DefaultLayout')
);

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Logout = React.lazy(() => import('./views/Pages/Logout/Logout'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

class App extends Component {
  constructor(props) {
    super();

    this.setIsAuth = isAuth => {
      this.setState({ isAuth });
    };

    this.state = {
      isAuth: false,
      setIsAuth: this.setIsAuth
    };
  }

  RouteAuthCheck = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        this.state.isAuth ? (
          <ApolloContext>
            <Component {...props} />
          </ApolloContext>
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );

  render() {
    return (
      <Provider store={store}>
        <AuthContext.Provider value={this.state}>
          <Normalize />
          <BrowserRouter>
            <React.Suspense fallback={loading()}>
              <Switch>
                <Route
                  exact
                  path="/login"
                  name="Login Page"
                  render={props => <Login {...props} />}
                />
                <Route
                  exact
                  path="/logout"
                  name="Logout Page"
                  render={props => <Logout {...props} />}
                />
                <Route
                  exact
                  path="/register"
                  name="Register Page"
                  render={props => <Register {...props} />}
                />
                <Route
                  exact
                  path="/404"
                  name="Page 404"
                  render={props => <Page404 {...props} />}
                />
                <Route
                  exact
                  path="/500"
                  name="Page 500"
                  render={props => <Page500 {...props} />}
                />
                <this.RouteAuthCheck
                  path="/"
                  name="Home"
                  component={DefaultLayout}
                />
              </Switch>
            </React.Suspense>
          </BrowserRouter>
        </AuthContext.Provider>
      </Provider>
    );
  }
}

export default App;
