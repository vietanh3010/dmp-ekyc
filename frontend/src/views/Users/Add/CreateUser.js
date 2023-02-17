import React, {Component} from 'react';
import {
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  FormFeedback,
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert
} from 'reactstrap';

import isEmpty from '../../../utils/isEmpty';
import validateUserInput from '../../../utils/validateUser.js';
import client from '../../../api';

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        password: '',
        passwordConfirmation: '',
        email: '',
        phone: '',
        unit: ''
      },
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
        unitState:'',
        unitMessage:'',
        phoneState:'',
        phoneMessage:''
      },
      modal: false
    };

    this.resetValidateState = this.resetValidateState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.disableSubmit = this.disableSubmit.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);

    this.toggle = this.toggle.bind(this);
    this.resetFormFields = this.resetFormFields.bind(this);
  }


  dismissAlert = () => {
    const {validate} = this.state;
    validate.alertVisible = ! validate.alertVisible;
    this.setState({validate});
  };

  resetValidateState = (e) =>{
    const {validate} = this.state;
    const targetName = e.target.name.toLowerCase();

    if(targetName === "username") {
      validate.nameState ='';
      validate.nameMessage='';
    }

    if (targetName === "email"){
      validate.emailState = '';
      validate.emailMessage= '';
    }

    if (targetName === "passwordConfirmation") {
      validate.confirmedPasswordMessage = '';
      validate.confirmedPasswordState= '';
    }

    if (targetName === 'password') {
      validate.passwordMessage = '';
      validate.passwordState = '';
    }

    if (targetName === 'unit') {
      validate.unitState = '';
      validate.unitMessage = '';

    }

    if (targetName === 'phone') {
      validate.phoneState = '';
      validate.phoneMessage = '';
    }

    validate.errorMessage = '';
    validate.alertVisible = false;

    this.setState({validate});
  };

  showValidatorMessage =async (errors) => {
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

    if (!isEmpty(errors.unit)) {
      validate.unitState = 'has-danger';
      validate.unitMessage = errors.unit;
    }


    if (!isEmpty(errors.phone)) {
      validate.phoneState = 'has-danger';
      validate.phoneMessage = errors.phone;
    }


   await this.setState({validate});
  };

  handleChange = async (e) =>{
    this.resetValidateState(e);
    let {user} = this.state;
    user[e.target.name.trim()] =e.target.value.trim();
    await this.setState({user});
  };


  toggle() {
    this.setState({
      modal: !this.state.modal
    });
    this.props.history.push("/user/view");

  }

  resetFormFields() {
    let {user} = this.state;
    user = {
      username: '',
      password: '',
      passwordConfirmation: '',
      email: '',
      phone: '',
      unit: ''
    };

    let {validate} = this.state;
    validate = {
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
      unitState:'',
      unitMessage:'',
      phoneState:'',
      phoneMessage:''
    }

    this.setState({ user });
    this.setState({validate})
    this.setState({
      modal: false
    });
  }

  disableSubmit = () =>{
    return ( isEmpty(this.state.user.email)
    || isEmpty(this.state.user.password)
    || isEmpty(this.state.user.passwordConfirmation)
    || isEmpty(this.state.user.username)
    || isEmpty(this.state.user.phone)
    || isEmpty(this.state.user.unit)
    );
  };


  handleSubmit = (e) =>{
    e.preventDefault();
    const {user} = this.state;
    const {errors, isValid} = validateUserInput(user);
    if(!isValid) {
      this.showValidatorMessage(errors);
      return;
    }

    const {username, password, email, phone, unit} = this.state.user;

    if (this.props.match.params.id) {
      client.put('/api/users/' + this.props.match.params.id, {
        username,
        password,
        email,
        phone,
        unit
      })
        .then((result) => {
          alert("Cập nhật người dùng thành công");
          this.props.history.push("/user/view")
        });
    }
    else {
      client.post('/api/users', {
        username,
        password,
        email,
        phone,
        unit
      })
        .then((result) => {
          this.setState({modal: true});
        }).catch((err)=>{
          const {validate} = this.state;
          validate.alertVisible = true;
          if (!isEmpty(err.response.data.msg)) {
            validate.errorMessage = err.response.data.msg;
          } else {
            validate.errorMessage = err.msg;
          }
          this.setState({validate});
        });
    }
  };


  render() {
    return (
      <div className="animated fadeIn">
          <div className="card">
            <div className="card-header">
              <span className="h4 text-uppercase">Tạo Người Dùng</span>
            </div>
            <div className="card-body">
              <Form onSubmit={this.handleSubmit}>
                {/* Unit name */}
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="icon-people"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input type="text"
                         name="unit"
                         placeholder="Tên đơn vị"
                         value={this.state.user.unit}
                         onChange={this.handleChange}
                         invalid={ this.state.validate.unitState === 'has-danger' }
                    />
                  <FormFeedback>
                    {this.state.validate.unitMessage}
                  </FormFeedback>
                </InputGroup>

                {/* Username */}
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user"></i>
                      </InputGroupText>
                  </InputGroupAddon>
                    <Input type="text"
                           name="username"
                           placeholder="Tên tài khoản"
                           value={this.state.user.username}
                           onChange={this.handleChange}
                           invalid={ this.state.validate.nameState === 'has-danger' }
                      />
                    <FormFeedback>
                      {this.state.validate.nameMessage}
                    </FormFeedback>
                  </InputGroup>

                {/* Password */}
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                  </InputGroupAddon>
                    <Input type="password"
                           name="password"
                           placeholder="Mật khẩu"
                           value={this.state.user.password}
                           onChange={this.handleChange}
                           invalid={ this.state.validate.passwordState === 'has-danger' }
                      />
                    <FormFeedback>
                      {this.state.validate.passwordMessage}
                    </FormFeedback>
                  </InputGroup>

                {/* Password confirmation*/}
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="icon-lock"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                    <Input type="password"
                           name="passwordConfirmation"
                           placeholder="Xác nhận mật khẩu"
                           value={this.state.user.passwordConfirmation}
                           onChange={this.handleChange}
                           invalid={ this.state.validate.confirmedPasswordState === 'has-danger' }
                      />
                    <FormFeedback>
                      {this.state.validate.confirmedPasswordMessage}
                    </FormFeedback>
                </InputGroup>

                {/* Email */}
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>@</InputGroupText>
                  </InputGroupAddon>
                    <Input type="text"
                           name="email"
                           value={this.state.user.email}
                           placeholder="Thư điện tử"
                           onChange={this.handleChange}
                           invalid={ this.state.validate.emailState === 'has-danger' }
                      />
                    <FormFeedback>
                      {this.state.validate.emailMessage}
                    </FormFeedback>
                </InputGroup>

                {/* Phone */}
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="icon-phone"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                    <Input type="text"
                           name="phone"
                           placeholder="Điện thoại"
                           value={this.state.user.phone}
                           invalid={ this.state.validate.phoneState === 'has-danger' }
                           onChange={this.handleChange}
                      />
                    <FormFeedback>
                      {this.state.validate.phoneMessage}
                    </FormFeedback>
                </InputGroup>


                <Alert color ="danger" isOpen={this.state.validate.alertVisible} toggle={this.dismissAlert}>
                  {this.state.validate.errorMessage} </Alert>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className='modal-success'>
                  <ModalHeader toggle={this.toggle}> {this.props.match.params.id ? 'Cập nhật người dùng thành công' : 'Tạo người dùng thành công'}  </ModalHeader>
                  <ModalBody>
                    {this.props.match.params.id ? 'Cập nhật người dùng thành công' : 'Tạo người dùng thành công'}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Đóng</Button>
                  </ModalFooter>
                </Modal>
              </Form>
            </div>
          </div>


          <p className="text-center">

            <Button color="primary" className="px-4" style={{ marginRight:10 }}
                    onClick={this.handleSubmit}
                    disabled={this.disableSubmit()}
                   >{this.props.match.params.id ? 'Cập Nhật Người Dùng' : 'Tạo Người Dùng'}</Button>
            <Button color="secondary" className="px-4" onClick={this.resetFormFields}>Nhập lại từ đầu</Button>
          </p>

      </div>
    )
      ;
  }
}

export default CreateUser;
