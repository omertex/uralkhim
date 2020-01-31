import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';
import { AuthContext } from '../../../AuthContext/AuthContext';
import { loginVerification } from './Login.services';
import { connect } from 'react-redux';

class Login extends Component {
  state = { userName: '', password: '' };

  userNameHandler = e => {
    this.setState({ userName: e.target.value });
  };
  passwordHandler = e => {
    this.setState({ password: e.target.value });
  };

  loginHandler = async () => {
    const [err, loginInfo] = await loginVerification({
      userName: this.state.userName,
      password: this.state.password
    });
    const parsedToken = JSON.parse(atob(loginInfo.accessToken.split('.')[1]));
    const {
      'https://hasura.io/jwt/claims': { 'x-hasura-default-role': role }
    } = parsedToken;
    console.log('err', err);
    console.log('loginInfo', loginInfo, role);
    if (!err && loginInfo) {
      this.props.dispatch({type: 'SET_USER', userId: loginInfo.userId, role});
      sessionStorage.setItem('accessToken', loginInfo.accessToken);
      this.context.setIsAuth(true);
    }
  };

  render() {
    console.log('this.props.user', this.props.user);
    return (
      <>
        {this.context.isAuth && <Redirect to={{ pathname: '/' }} />}
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form>
                        <h1>Login</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Username"
                            autoComplete="username"
                            value={this.state.userName}
                            onChange={this.userNameHandler}
                          />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={this.state.password}
                            onChange={this.passwordHandler}
                          />
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button
                              color="primary"
                              className="px-4"
                              onClick={this.loginHandler}
                            >
                              Login
                            </Button>
                          </Col>
                          <Col xs="6" className="text-right">
                            <Button color="link" className="px-0">
                              Forgot password?
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

Login.contextType = AuthContext;

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Login);
