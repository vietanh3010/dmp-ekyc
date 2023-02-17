import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  Button, Card, CardBody, CardGroup, Col, Container,
  Form, Input, InputGroup, InputGroupAddon, InputGroupText,
  Row, Alert, FormFeedback
} from 'reactstrap';

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
      email: '',
      password: '',
      validate: {
        errorMessage: '',
        alertVisible: false,
        emailState: '',
        emailMessage: '',
        passwordState: '',
        passwordMessage: '',
      },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.resetValidateState = this.resetValidateState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  resetValidateState = (e) => {
    const {validate} = this.state;
    const targetName = e.target.name.toLowerCase();

    if (targetName.includes("email")) {
      validate.emailState = '';
      validate.emailMessage = '';
    }

    if (targetName.includes("password")) {
      validate.passwordMessage = '';
      validate.passwordState = '';
    }
    validate.errorMessage = '';
    validate.alertVisible = false;
    this.setState({validate});
  };
  handleChange = async (e) => {
    this.resetValidateState(e);
    await this.setState({
      [e.target.name.trim()]: e.target.value.trim(),
    })
  };
  dismissAlert = () => {
    const {validate} = this.state;
    validate.alertVisible = !validate.alertVisible;
    this.setState({validate});

  };
  disableSubmit = () => {
    return (isEmpty(this.state.email) || isEmpty(this.state.password));
  };
  showValidatorMessage = (errors) => {
    const {validate} = this.state;
    if (!isEmpty(errors.email)) {
      validate.emailState = 'has-danger';
      validate.emailMessage = errors.email;
    }

    if (!isEmpty(errors.password)) {
      validate.passwordState = 'has-danger';
      validate.passwordMessage = errors.password;
    }
    this.setState({validate});
  };


  handleSubmit = (e) => {
    e.preventDefault();
    const {email, password} = this.state;
    const {errors, isValid} = validateLoginInput({email, password});
    if (!isValid) {
      this.showValidatorMessage(errors);
      return;
    }

    client.post('/auth/login', {email, password})
      .then((res) => {
        localStorage.setItem('access_token', res.data.access_token);
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        const {validate} = this.state;
        validate.alertVisible = true;
        if (!isEmpty(err.response.data.msg)) {
          validate.errorMessage = err.response.data.msg;
        } else {
          validate.errorMessage = err.msg;
        }
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
                      {/* Email */}
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Email"
                               name="email"
                               value={this.state.email}
                               onChange={this.handleChange}
                               invalid={this.state.validate.emailState === 'has-danger'}
                               autoComplete="email"/>
                        <FormFeedback>
                          {this.state.validate.emailMessage}. Please input a correct email
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
                               invalid={this.state.validate.passwordState === 'has-danger'}
                               autoComplete="current-password"/>
                        <FormFeedback>
                          {this.state.validate.passwordMessage}
                        </FormFeedback>
                      </InputGroup>

                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={e => this.handleSubmit(e)}
                                  disabled={this.disableSubmit()}
                          >Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                      <br/>
                      <Alert color="danger" isOpen={this.state.validate.alertVisible} toggle={this.dismissAlert}>
                        {this.state.validate.errorMessage} </Alert>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{width: '44%'}}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>

                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
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
