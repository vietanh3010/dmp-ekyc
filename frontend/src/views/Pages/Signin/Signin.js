import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container,
  Form, Input, InputGroup, InputGroupAddon, InputGroupText,
  Row, Alert, FormFeedback } from 'reactstrap';

import isEmpty from '../../../utils/isEmpty';
import validateLoginInput from '../../../utils/validateLogin';
import client from '../../../api';
// https://hackernoon.com/m-e-r-n-stack-application-using-passport-for-authentication-920b1140a134

class Login extends Component {
  // axios
  // https://forum.vuejs.org/t/axios-doesnt-retrieve-the-error-messages/43363/6
  // https://github.com/alligatorio/Fancy-Form-Example/blob/master/src/App.js
  constructor(props) {
    super(props);
    this.state = {
      username:'',
      password:'',
      validate: {
        errorMessage: '',
        alertVisible: false,
        usernameState:'',
        usernameMessage:'',
        passwordState:'',
        passwordMessage:''
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.resetValidateState = this.resetValidateState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  resetValidateState = (e) =>{
    const {validate} = this.state;
    const targetName = e.target.name.toLowerCase();

    if (targetName.includes("username")){
      validate.usernameState = '';
      validate.usernameMessage= '';
    }

    if (targetName.includes("password")) {
      validate.passwordMessage = '';
      validate.passwordState = '';
    }
    validate.errorMessage = '';
    validate.alertVisible = false;
    this.setState({validate});
  };
  handleChange = async (e) =>{
    this.resetValidateState(e);
    await this.setState({
      [e.target.name.trim()]: e.target.value.trim()
    })
  };
  dismissAlert = () => {
    const {validate} = this.state;
    validate.alertVisible = ! validate.alertVisible;
    this.setState({validate});

  };
  disableSubmit = () =>{
    return (isEmpty(this.state.username) || isEmpty(this.state.password));
  };
  showValidatorMessage = (errors) =>{
    const {validate} = this.state;
    if (!isEmpty(errors.username)) {
      validate.usernameState = 'has-danger';
      validate.usernameMessage = errors.username;
    }

    if (!isEmpty(errors.password)) {
      validate.passwordState = 'has-danger';
      validate.passwordMessage = errors.password;
    }
    this.setState({validate});
  };


  handleSubmit =(e) =>{
    e.preventDefault();
    const {username, password} = this.state;
    const {errors, isValid} = validateLoginInput({username, password});

    if (!isValid) {
      this.showValidatorMessage(errors);
      return;
    }


    client.post('/auth/signin', {username, password})
      .then((res) => {
        localStorage.setItem('access_token', res.data.access_token);
        window.location.href = "/";
      })
      .catch((err) =>{
        const {validate} = this.state;
        validate.alertVisible = true;
        validate.errorMessage = err.msg;
        this.setState({validate});
      })
  };
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      {/* Username */}
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username"
                               name="username"
                               value={this.state.username}
                               onChange={this.handleChange}
                               invalid={ this.state.validate.usernameState === 'has-danger' }
                               autoComplete="username"/>
                        <FormFeedback>
                          {this.state.validate.usernameMessage}. Please input your username
                        </FormFeedback>
                      </InputGroup>

                      {/* Password*/}
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password"
                               name="password"
                               value={this.state.password}
                               onChange={this.handleChange}
                               invalid={ this.state.validate.passwordState === 'has-danger' }
                               autoComplete="current-password" />
                        <FormFeedback>
                          {this.state.validate.passwordMessage}
                        </FormFeedback>
                      </InputGroup>

                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this.handleSubmit}
                                  disabled={this.disableSubmit()}
                            >Login</Button>
                        </Col>
                        {/*
                         <Col xs="6" className="text-right">
                         <Button color="link" className="px-0">Forgot password?</Button>
                         </Col>
                         */}
                      </Row>
                      <br/>
                      <Alert color ="danger" isOpen={this.state.validate.alertVisible} toggle={this.dismissAlert}>
                        {this.state.validate.errorMessage} </Alert>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
