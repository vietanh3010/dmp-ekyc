import React, {Component} from 'react';
import Select from 'react-select';
import client from '../../../api';
import {optionsSuperuserTypes} from "../../../constants/ActionTypes";
import isEmpty from '../../../utils/isEmpty';
import validateSuperUserInput from '../../../utils/validateSuperUser.js';

import {
  Col,
  FormGroup,
  Label,
  FormFeedback,
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Alert
} from 'reactstrap';

const customStyles = {
  control: (base, state) => ({
    ...base,
    width: "100vh",
  })

};

class CreateSuperuser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        password: '',
        passwordConfirmation: '',
        email: '',
        phone: '',
        usertype: optionsSuperuserTypes[0].value  // Normal superuser
      },
      validate: {
        errorMessage: '',
        alertVisible: false,
        nameState: '',
        nameMessage: '',
        emailState: '',
        emailMessage: '',
        passwordState: '',
        passwordMessage: '',
        confirmedPasswordState: '',
        confirmedPasswordMessage: '',
        typeState: '',
        typeMessage: '',
        phoneState: '',
        phoneMessage: ''
      },
      modal: false
    };
    this.toggle = this.toggle.bind(this);
    this.resetFormFields = this.resetFormFields.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeUserType = this.onChangeUserType.bind(this);
    this.disableSubmit = this.disableSubmit.bind(this);

  }


  toggle() {
    this.setState({modal: !this.state.modal});
    this.props.history.push("/superuser/view")
  }

  dismissAlert = () => {
    const {validate} = this.state;
    validate.alertVisible = !validate.alertVisible;
    this.setState({validate});
  };

  resetValidateState = (e) => {
    const {validate} = this.state;
    const targetName = e.target.name.toLowerCase();

    if (targetName === "username") {
      validate.nameState = '';
      validate.nameMessage = '';
    }

    if (targetName === "email") {
      validate.emailState = '';
      validate.emailMessage = '';
    }

    if (targetName === "passwordConfirmation") {
      validate.confirmedPasswordMessage = '';
      validate.confirmedPasswordState = '';
    }

    if (targetName === 'password') {
      validate.passwordMessage = '';
      validate.passwordState = '';
    }

    if (targetName === '') {
      validate.typeState = '';
      validate.typeMessage = '';

    }

    if (targetName === 'phone') {
      validate.phoneState = '';
      validate.phoneMessage = '';
    }

    validate.errorMessage = '';
    validate.alertVisible = false;

    this.setState({validate});
  };

  showValidatorMessage = async (errors) => {
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

    if (!isEmpty(errors.confirmed_password)) {
      validate.confirmedPasswordState = 'has-danger';
      validate.confirmedPasswordMessage = errors.confirmed_password;
    }

    if (!isEmpty(errors.type)) {
      validate.typeState = 'has-danger';
      validate.typeMessage = errors.unit;
    }


    if (!isEmpty(errors.phone)) {
      validate.phoneState = 'has-danger';
      validate.phoneMessage = errors.phone;
    }

    this.setState({validate});
  };

  handleChange = async (e) => {
    this.resetValidateState(e);
    let {user} = this.state;
    user[e.target.name.trim()] = e.target.value.trim();
    await this.setState({user});
  };

  onChangeUserType = (e) => {
    let {user} = this.state;
    user.usertype = e.value;
    this.setState({user});
  }


  usertypeLabel(usertypeValue) {
    for (var usertype in optionsSuperuserTypes) {
      if (usertype.value === usertypeValue) {
        return {value: usertype.value, label: usertype.label};
      }
    }
  }

  resetFormFields() {
    let {user} = this.state;
    user = {
      username: '',
      password: '',
      passwordConfirmation: '',
      email: '',
      phone: '',
      usertype: optionsSuperuserTypes[0].value  // Normal superuser
    };

    let {validate} = this.state;
    validate = {
      errorMessage: '',
      alertVisible: false,
      nameState: '',
      nameMessage: '',
      emailState: '',
      emailMessage: '',
      passwordState: '',
      passwordMessage: '',
      confirmedPasswordState: '',
      confirmedPasswordMessage: '',
      typeState: '',
      typeMessage: '',
      phoneState: '',
      phoneMessage: ''
    };

    this.setState({user});
    this.setState({validate})
    this.setState({modal: false});
  }

  disableSubmit = () => {
    return (isEmpty(this.state.user.email)
      || isEmpty(this.state.user.password)
      || isEmpty(this.state.user.passwordConfirmation)
      || isEmpty(this.state.user.username)
      || isEmpty(this.state.user.phone)
      || isEmpty(this.state.user.usertype)
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {user} = this.state;
    const {errors, isValid} = validateSuperUserInput(user);
    if (!isValid) {
      this.showValidatorMessage(errors);
      return;
    }

    const {username, password, email, phone, usertype} = this.state.user;
    if (this.props.match.params.id) {
      client.put('/api/superusers/' + this.props.match.params.id, {
        username,
        password,
        email,
        phone,
        usertype
      })
        .then((result) => {
          alert("Cập nhật siêu người dùng thành công");

        });
    }
    else {
      client.post('/api/superusers', {username, password, email, phone, usertype})
        .then((result) => {
          this.setState({modal: true});
        }).catch((err) => {
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


  onSubmit = (e) => {
    e.preventDefault();
    const {username, password, passwordConfirmation, email, phone, usertype} = this.state.user;

    //check valid form
    let formValid = (username && password && passwordConfirmation && email && phone && usertype);

    if (formValid) {
      if (this.props.match.params.id) {
        client.put('/api/superusers/' + this.props.match.params.id, {
          username,
          password,
          email,
          phone,
          usertype
        })
          .then((result) => {
            alert("Cập nhật siêu người dùng thành công");
            this.props.history.push("/superuser/view")
          });
      }
      else {
        client.post('/api/superusers', {username, password, email, phone, usertype})
          .then((result) => {
            alert("Tạo siêu người dùng mới thành công");
            this.props.history.push("/superuser/view")
          });
      }
    }
    else {
      this.toggleDanger();
    }

  };

  render() {
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">
            <span className="h4 text-uppercase">Tạo Siêu Người Dùng</span>
          </div>
          <div className="card-body">
            <Form>

              {/* Username */}
              <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-user"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="text"
                       name="username"
                       placeHolder="Tên tài khoản"
                       value={this.state.user.username}
                       onChange={this.handleChange}
                       invalid={this.state.validate.nameState === 'has-danger'}
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
                       invalid={this.state.validate.passwordState === 'has-danger'}
                />
                <FormFeedback>
                  {this.state.validate.passwordMessage}
                </FormFeedback>
              </InputGroup>

              {/* password confirmation*/}
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
                       invalid={this.state.validate.confirmedPasswordState === 'has-danger'}
                />
                <FormFeedback>
                  {this.state.validate.confirmedPasswordMessage}
                </FormFeedback>
              </InputGroup>

              {/* account types*/}
              <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-options"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Select options={optionsSuperuserTypes}
                        placeholder="Loại tài khoản"
                        defaultValue={optionsSuperuserTypes[0]}
                        value={this.usertypeLabel(this.state.user.usertype)}
                        onChange={this.onChangeUserType}
                        styles={customStyles}
                />
                <FormFeedback>
                  {this.state.validate.typeMessage}
                </FormFeedback>
              </InputGroup>

              {/* type
                <FormGroup row>
                  <Col md="3">
                    <Label id="model">Loại Tài Khoản</Label>
                  </Col>
                  <Col md="9">
                    <Select
                      defaultValue={optionsSuperuserTypes[0]}
                      value={this.usertypeLabel(this.state.user.usertype)}
                      options={optionsSuperuserTypes}
                      onChange={this.onChangeUserType}
                    />
                    <FormFeedback className="help-block">Hãy nhập địa chỉ thư điện tử</FormFeedback>
                    <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                  </Col>
                </FormGroup>
                 */}

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
                       invalid={this.state.validate.emailState === 'has-danger'}
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
                       invalid={this.state.validate.phoneState === 'has-danger'}
                       onChange={this.handleChange}
                />
                <FormFeedback>
                  {this.state.validate.phoneMessage}
                </FormFeedback>
              </InputGroup>


              <Alert color="danger" isOpen={this.state.validate.alertVisible} toggle={this.dismissAlert}>
                {this.state.validate.errorMessage} </Alert>

              <Modal isOpen={this.state.modal} toggle={this.toggle} className='modal-success'>
                <ModalHeader
                  toggle={this.toggle}> {this.props.match.params.id ? 'Cập nhật siêu người dùng thành công' : 'Tạo siêu người dùng thành công'}  </ModalHeader>
                <ModalBody>
                  {this.props.match.params.id ? 'Cập nhật siêu người dùng thành công' : 'Tạo siêu người dùng thành công'}
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={this.toggle}>Đóng</Button>
                </ModalFooter>
              </Modal>

            </Form>
          </div>
        </div>

        <p className="text-center">
          <Button color="primary" className="px-4" style={{marginRight: 10}}
                  onClick={this.handleSubmit}
                  disabled={this.disableSubmit()}
          >{this.props.match.params.id ? 'Cập Nhật Siêu Người Dùng' : 'Tạo Siêu Người Dùng'}</Button>
          <Button color="secondary" className="px-4" onClick={this.resetFormFields}>Nhập lại từ đầu</Button>
        </p>

      </div>
    )
      ;
  }
}

export default CreateSuperuser;
