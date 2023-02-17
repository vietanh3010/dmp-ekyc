import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container,
  Form, Input, InputGroup, InputGroupAddon, InputGroupText,
  Row, Alert, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import isEmpty from '../../../utils/isEmpty';
import validateChangePassword from '../../../utils/validateChangePassword.js';
import client from '../../../api';


class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      email:'',
      password:'',
      index:'',
      validate: {
        errorMessage: '',
        alertVisible: false,
        nameState:'',
        nameMessage:'',
        emailState:'',
        emailMessage:'',
        passwordState:'',
        passwordMessage:'',
        indexState:'',
        indexMessage:''
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.resetValidateState = this.resetValidateState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggle= this.toggle.bind(this);
    this.resetForm = this.resetForm.bind(this);

  }

  resetForm = ()=>{
    this.setState({name:''});
    this.setState({email:''});
    this.setState({password:''});
    this.setState({index:''});

  };

  resetValidateState = (e) =>{
    const {validate} = this.state;
    const targetName = e.target.name.toLowerCase();

    if (targetName.includes("name")){
      validate.nameState = '';
      validate.nameMessage= '';
    }

    if (targetName.includes("email")){
      validate.emailState = '';
      validate.emailMessage = '';
    }

    if (targetName.includes("password")){
      validate.passwordState = '';
      validate.passwordMessage = '';
    }

    if (targetName.includes("index")) {
      validate.indexState = '';
      validate.indexMessage = '';
    }

    validate.errorMessage = '';
    validate.alertVisible = false;
    this.setState({validate});
  };

  disableSubmit = () =>{
    return (isEmpty(this.state.name) || isEmpty(this.state.email) ||isEmpty(this.state.password) ||isEmpty(this.state.index));
  };

  dismissAlert = () => {
    const {validate} = this.state;
    validate.alertVisible = ! validate.alertVisible;
    this.setState({validate});
  };


  toggle() {
    this.setState({
      modal: !this.state.modal
    });
    this.props.history.push("/");
  }


  handleSubmit = (e) =>{
    e.preventDefault();
    const {oldPassword, newPassword, confirmPassword} = this.state;
    const {errors, isValid} = validateChangePassword({oldPassword, newPassword, confirmPassword});

    if(!isValid) {
      this.showValidatorMessage(errors);
      return;
    }

    client.post('/auth/changepassword',{oldPassword, newPassword})
      .then((res)=>{
        this.setState({successMessage: res.data.msg});
        this.setState({modal: true});

      })
      .catch((err)=>{
        const {validate} = this.state;
        validate.alertVisible = true;
        if (!isEmpty(err.response.data.msg)) {
          validate.errorMessage = err.response.data.msg;
        } else {
          validate.errorMessage = err.msg;
        }
        this.setState({validate});
      });
  };

  showValidatorMessage = (errors) =>{
    const {validate} = this.state;
    if (!isEmpty(errors.oldPassword)) {
      validate.oldPasswordState = 'has-danger';
      validate.oldPasswordMessage = errors.oldPassword;
    }

    if (!isEmpty(errors.newPassword)) {
      validate.newPasswordState = 'has-danger';
      validate.newPasswordMessage = errors.newPassword;
    }

    if (!isEmpty(errors.confirmPassword)) {
      validate.confirmPasswordState = 'has-danger';
      validate.confirmPasswordMessage = errors.confirmPassword;
    }
    this.setState({validate});
  };


  handleChange = async (e) =>{
    this.resetValidateState(e);
    await this.setState({
      [e.target.name.trim()]: e.target.value.trim()
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
                      <h1>Create new customer</h1>

                      {/* Customer Name */}
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Customer name"
                               name="name"
                               value={this.state.name}
                               onChange={this.handleChange}
                               invalid={ this.state.validate.nameState === 'has-danger' }
                               autoComplete="current password"/>
                        <FormFeedback>
                          {this.state.validate.nameMessage}. Please input a customer name
                        </FormFeedback>
                      </InputGroup>

                      {/* email */}
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Email"
                               name="email"
                               value={this.state.email}
                               onChange={this.handleChange}
                               invalid={ this.state.validate.emailState === 'has-danger' }
                               autoComplete="new password" />
                        <FormFeedback>
                          {this.state.validate.emailMessage}
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
                               autoComplete="new password" />
                        <FormFeedback>
                          {this.state.validate.passwordMessage}
                        </FormFeedback>
                      </InputGroup>

                      {/* Index name */}
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Index name"
                               name="index"
                               value={this.state.index}
                               onChange={this.handleChange}
                               invalid={ this.state.validate.indexState === 'has-danger' }
                               autoComplete="confirm new password" />
                        <FormFeedback>
                          {this.state.validate.indexMessage}
                        </FormFeedback>
                      </InputGroup>

                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this.handleSubmit}
                                  disabled={this.disableSubmit()}
                            >Create</Button>
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

                      <Modal isOpen={this.state.modal} toggle={this.toggle} className='modal-success'>
                        <ModalHeader toggle={this.toggle}> Create user successfully </ModalHeader>
                        <ModalBody>
                          {this.state.successMessage}
                        </ModalBody>
                        <ModalFooter>
                          <Button color="secondary" onClick={this.toggle}>Close</Button>
                        </ModalFooter>
                      </Modal>
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

export default ChangePassword;
