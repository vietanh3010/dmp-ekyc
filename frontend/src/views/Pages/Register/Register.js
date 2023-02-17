import React, { Component } from 'react';
import { Button, Card, CardBody,
  Col, Container, Form, Input, InputGroup, InputGroupAddon,
  InputGroupText, Row, FormFeedback, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import isEmpty from '../../../utils/isEmpty';
import validateRegisterInput from '../../../utils/validateRegister';
import client from '../../../api';





class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      email:'',
      password:'',
      confirmed_password:'',
      modal: false,
      successMessage:'',
      validate: {
        errorMessage: '',
        alertVisible: false,
        nameState:'',
        nameMessage:'',
        emailState:'',
        emailMessage:'',
        passwordState:'',
        passwordMessage:'',
        confirmedPasswordState:'',
        confirmedPasswordMessage:'',
      },
    };
    this.disableSubmit = this.disableSubmit.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.resetValidateState = this.resetValidateState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showValidatorMessage = this.showValidatorMessage.bind(this);
    this.toggle= this.toggle.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
    this.props.history.push("/login");
  }

 resetValidateState = (e) =>{
   const {validate} = this.state;
   const targetName = e.target.name.toLowerCase();

   if(targetName.includes("name")) {
     validate.nameState = '';
     validate.nameMessage= '';
   }

   if (targetName.includes("email")){
     validate.emailState = '';
     validate.emailMessage= '';
   }

   if (targetName.includes("confirmed_password")) {
     validate.confirmedPasswordMessage = '';
     validate.confirmedPasswordState= '';
   }

   if (targetName === 'password') {
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
      [e.target.name.trim()]: e.target.value.trim(),
    })
  };

  resetForm = ()=>{
    this.setState({email:''});
    this.setState({name:''});
    this.setState({password:''});
    this.setState({confirmed_password:''});
  };
  showValidatorMessage = (errors) => {
    const {validate} = this.state;

    if (!isEmpty(errors.name)) {
      validate.nameState = 'has-danger';
      validate.nameMessage = errors.name;
    }

    if (!isEmpty(errors.email)) {
      validate.emailState = 'has-danger';
      validate.emailMessage = errors.email;
    }

    if (!isEmpty(errors.password)) {
      validate.passwordState = 'has-danger';
      validate.passwordMessage = errors.password;
    }

    if(!isEmpty(errors.confirmed_password)) {
      validate.confirmedPasswordState = 'has-danger';
      validate.confirmedPasswordMessage = errors.confirmed_password;
    }
    this.setState({validate});
  };
  handleSubmit = (e) =>{
      e.preventDefault();
      const {name, email, password, confirmed_password} = this.state;
      const {errors, isValid} = validateRegisterInput({name, email, password, confirmed_password});

      if(!isValid) {
        this.showValidatorMessage(errors);
        return;
      }
      client.post('/auth/register', {name, email, password, confirmed_password})
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
  dismissAlert = () => {
    const {validate} = this.state;
    validate.alertVisible = ! validate.alertVisible;
    this.setState({validate});
  };
  disableSubmit = () =>{
    return ( isEmpty(this.state.email)
          || isEmpty(this.state.password)
          || isEmpty(this.state.confirmed_password)
          || isEmpty(this.state.name)
    );
  };


  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.handleSubmit}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>

                    {/* Name*/}
                   <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Name"
                             name="name"
                             onChange = {this.handleChange}
                             invalid={ this.state.validate.nameState === 'has-danger' }
                             autoComplete="name"/>
                     <FormFeedback>
                       {this.state.validate.nameMessage}
                     </FormFeedback>
                    </InputGroup>

                    {/* Email*/}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Email"
                             name="email"
                             onChange={this.handleChange}
                             invalid={ this.state.validate.emailState === 'has-danger' }
                             autoComplete="email" />
                      <FormFeedback>
                        {this.state.validate.emailMessage}. Please input a correct email
                      </FormFeedback>
                    </InputGroup>
                    {/* Password*/}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password"
                             name="password"
                             onChange={this.handleChange}
                             invalid={ this.state.validate.passwordState === 'has-danger' }
                             autoComplete="password" />
                      <FormFeedback>
                        {this.state.validate.passwordMessage}
                      </FormFeedback>
                    </InputGroup>


                    {/* Confirmed- password*/}
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Confirmed password"
                             name="confirmed_password"
                             onChange = {this.handleChange}
                             invalid={ this.state.validate.confirmedPasswordState === 'has-danger' }
                             autoComplete="confirmed-password" />
                      <FormFeedback>
                        {this.state.validate.confirmedPasswordMessage}
                      </FormFeedback>
                    </InputGroup>

                    <Button color="success" block type="submit"
                            disabled={this.disableSubmit()}
                            >Create Account</Button>

                    <br/>

                    <Alert color ="danger" isOpen={this.state.validate.alertVisible} toggle={this.dismissAlert}>
                      {this.state.validate.errorMessage} </Alert>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className='modal-success'>
                      <ModalHeader toggle={this.toggle}> Register successfully </ModalHeader>
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
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;

