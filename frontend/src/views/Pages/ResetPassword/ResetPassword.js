import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container,
  Label, CardTitle,
  Form, Input, InputGroup, InputGroupAddon, InputGroupText,
  Row, Alert, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import isEmpty from '../../../utils/isEmpty';
import validateResetPasswordInput from '../../../utils/validateResetPassword.js';
import client from '../../../api';


class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password:'',
      confirmedPassword:'',
      validate: {
        errorMessage:'',
        alertVisible:false,
        passwordState:'',
        passwordMessage:'',
        confirmedPasswordState:'',
        confirmedPasswordMessage:''
      },
      navigateInfo:{
        userId:'',
        username:'',
        referrer:''
      },
      modal:false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.resetValidateState = this.resetValidateState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggle= this.toggle.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }



  resetForm = ()=>{
    this.setState({password:''});
    this.setState({confirmedPassword:''});

    let {validate} = this.state;
    validate = {
      errorMessage:'',
      alertVisible:false,
      passwordState:'',
      passwordMessage:'',
      confirmedPasswordState:'',
      confirmedPasswordMessage:''
    }

    this.setState({validate})
    this.setState({
      modal: false
    });
  };

  resetValidateState = (e) =>{
    const {validate} = this.state;
    const targetName = e.target.name.toLowerCase();

    if (targetName ==='password'){
      validate.passwordState = '';
      validate.passwordMessage = '';
    }

    if (targetName.includes("confirm")){
      validate.confirmedPasswordState = '';
      validate.confirmedPasswordMessage = '';
    }

    validate.errorMessage = '';
    validate.alertVisible = false;
    this.setState({validate});
  };

  disableSubmit = () =>{
    return (isEmpty(this.state.password) || isEmpty(this.state.confirmPassword) || isEmpty(this.state.navigateInfo.userId));
  };

  dismissAlert = () => {
    const {validate} = this.state;
    validate.alertVisible = ! validate.alertVisible;
    this.setState({validate});
  };

  toggle() {
    this.setState({ modal: !this.state.modal});
    // push to previous page
    this.props.history.push(this.state.navigateInfo.referrer);
    //this.props.history.push("/");
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    const {password, confirmedPassword} = this.state;
    const {errors, isValid} = validateResetPasswordInput({password, confirmedPassword})

    if(!isValid || isEmpty(this.state.navigateInfo.userId)) {
      this.showValidatorMessage(errors);
      alert(this.state.navigateInfo.userId);
      return;
    }
    client.patch('/api/passwords/'+this.state.navigateInfo.userId+'?act=reset',{password})
      .then((res) => {
        this.setState({modal: true});
      }).catch((err)=>{
        alert(err);
        alert(err.response);
        const {validate} = this.state;
        validate.alertVisible = true;
        if (!isEmpty(err.response.data.msg)) {
          validate.errorMessage = err.response.data.msg;
        }
        this.setState({validate});
      });
  };


  showValidatorMessage = (errors) =>{
    const {validate} = this.state;
    if (!isEmpty(errors.password)) {
      validate.passwordState = 'has-danger';
      validate.passwordMessage = errors.password;
    }
    if (!isEmpty(errors.confirmedPassword)) {
      validate.confirmedPasswordState = 'has-danger';
      validate.confirmedPasswordMessage = errors.confirmedPassword;
    }
    this.setState({validate});
  };

  handleChange = async (e) =>{
    this.resetValidateState(e);
    await this.setState({
      [e.target.name.trim()]: e.target.value.trim()
    })
  };

  componentDidMount() {
    const {data} = this.props.location;
    const {navigateInfo} = this.state;
    navigateInfo.userId = data.id;
    navigateInfo.username = data.name;
    navigateInfo.referrer = data.referrer;
    this.setState({navigateInfo});
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <h2> Reset password </h2>
                  <div className="card">
                  <div className="card-header">
                    <CardTitle>Reset password for user: {this.state.navigateInfo.username} </CardTitle>
                  </div>
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      {/* Password*/}
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password"
                               placeholder="Mật khẩu mới"
                               name="password"
                               value={this.state.password}
                               onChange={this.handleChange}
                               invalid={ this.state.validate.passwordState === 'has-danger' }
                               autoComplete="password" />
                        <FormFeedback>
                          {this.state.validate.passwordMessage}
                        </FormFeedback>
                      </InputGroup>

                      {/* Confirm Password*/}
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Xác nhận mật khẩu"
                               name="confirmedPassword"
                               value={this.state.confirmedPassword}
                               onChange={this.handleChange}
                               invalid={ this.state.validate.confirmedPasswordState === 'has-danger' }
                               autoComplete="password"/>
                        <FormFeedback>
                          {this.state.validate.confirmedPasswordMessage}
                        </FormFeedback>
                      </InputGroup>

                      {/* Submit button */}
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" style={{ marginRight:10 }}
                                  onClick={this.handleSubmit}

                            >Reset Password</Button>

                          <Button color="secondary" className="px-4" onClick={this.resetForm}>Clear form</Button>
                        </Col>
                      </Row>

                      {/* Alert and modal */}
                      <br/>
                      <Alert color ="danger"
                             isOpen={this.state.validate.alertVisible}
                             toggle={this.dismissAlert}>{this.state.validate.errorMessage}</Alert>

                      <Modal isOpen={this.state.modal}
                             toggle={this.toggle}
                             className='modal-success'>
                        <ModalHeader toggle={this.toggle}>Reset password successfully </ModalHeader>
                        <ModalBody> Reset successuflly </ModalBody>

                        <ModalFooter>
                          <Button color="secondary" onClick={this.toggle}>Close</Button>
                        </ModalFooter>

                      </Modal>

                    </Form>
                  </CardBody>
                  </div>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }


}

export default ResetPassword;
