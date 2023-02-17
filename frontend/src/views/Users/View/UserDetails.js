import React, {Component} from 'react'
import Select from 'react-select'
import client from '../../../api'
import {optionsSuperuserTypes} from "../../../constants/ActionTypes"
import isEmpty from '../../../utils/isEmpty'
import validateSuperUserInput from '../../../utils/validateSuperUser.js'

import {
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
  Alert
} from 'reactstrap'
import {Link} from "react-router-dom"

import {getStyle} from "@coreui/coreui/dist/js/coreui-utilities"
const brandPrimary = getStyle('--primary')
const brandSecondary = getStyle('--secondary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')


class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        password: '',
        passwordConfirmation: '',
        email: '',
        phone: '',
        unit: '',
        usertype: optionsSuperuserTypes[0].value,  // Normal superuser
        projects: []
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
        typeState:'',
        typeMessage:'',
        phoneState:'',
        phoneMessage:''
      },
      modal: false,
      editMode: false
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

  handleChange = async (e) =>{
    this.resetValidateState(e);
    let {user} = this.state;
    user[e.target.name.trim()] =e.target.value.trim();
    await this.setState({user});
  };

  onChangeUserType = (e) => {
    let {user} = this.state;
    user.usertype = e.value;
    this.setState({ user });
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
      nameState:'',
      nameMessage:'',
      emailState:'',
      emailMessage:'',
      passwordState:'',
      passwordMessage:'',
      confirmedPasswordState:'',
      confirmedPasswordMessage:'',
      typeState:'',
      typeMessage:'',
      phoneState:'',
      phoneMessage:''
    };

    this.setState({ user });
    this.setState({validate})
    this.setState({modal: false});
  }

  disableSubmit = () =>{
    return ( isEmpty(this.state.user.email)
      || isEmpty(this.state.user.password)
      || isEmpty(this.state.user.passwordConfirmation)
      || isEmpty(this.state.user.username)
      || isEmpty(this.state.user.phone)
      || isEmpty(this.state.user.usertype)
    );
  };

  handleSubmit = (e) =>{
    e.preventDefault();
    const {user} = this.state;
    const {errors, isValid} = validateSuperUserInput(user);
    if(!isValid) {
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


  componentDidMount() {
    client.get( '/api/users/' + this.props.match.params.id)
      .then((response) => {
        console.log(response.data)
        var { user } = this.state
        user.username = response.data.user.local.username
        user.phone    = response.data.user.local.phone
        user.email    = response.data.user.local.email
        user.unit     = response.data.user.local.unit_name
        user.usertype = response.data.user.class
        user.projects = response.data.projects

        this.setState({ user })
      })
      .catch((error) => {
        alert(error)
      });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">
            <span className="h4 text-uppercase">Thông Tin Người Dùng</span>
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
                       placeholder="Tên tài khoản"
                       value={this.state.user.username}
                       onChange={this.handleChange}
                       invalid={ this.state.validate.nameState === 'has-danger' }
                       disabled={ !this.state.editMode }
                />
                <FormFeedback>
                  {this.state.validate.nameMessage}
                </FormFeedback>
              </InputGroup>

              {/* Unit Name */}
              <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-organization"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="text"
                       name="username"
                       placeholder="Đơn vị"
                       value={this.state.user.unit}
                       //onChange={this.handleChange}
                       invalid={ this.state.validate.nameState === 'has-danger' }
                       disabled={ !this.state.editMode }
                />
                <FormFeedback>
                  {this.state.validate.nameMessage}
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
                       invalid={ this.state.validate.emailState === 'has-danger' }
                       disabled={ !this.state.editMode }
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
                       disabled={ !this.state.editMode }
                />
                <FormFeedback>
                  {this.state.validate.phoneMessage}
                </FormFeedback>
              </InputGroup>

              {/* Project List */}
              <div className="card">
                <div className="card-header">
                  <span className="h6">Danh Sách Dự Án</span>
                </div>
                <div className="card-body">
                  <table className="table">
                    <thead>
                    <tr style={{
                      flex: true,
                      alignItems:'center',
                      justifyContent:'center'
                    }}>
                      <th>Tên Dự Án</th>
                      <th>Mô Tả</th>
                      <th>Trạng Thái</th>
                      <th>Từ Khóa</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.user.projects && this.state.user.projects.map(
                      (project) => {
                        return(
                          <tr key={project._id}>
                            <td>{project.name}</td>
                            <td>{project.desc}</td>
                            <td>
                              {project.status === 0 &&
                              <a style={{color: brandDanger}}>Không Hoạt Động</a>
                              ||
                              <a style={{color: brandSuccess}}>Đang Hoạt Động</a>
                              }
                            </td>
                            <td>{project.keywords}</td>
                          </tr>
                        )
                      }
                    )}
                    </tbody>
                  </table>
                </div>
              </div>

              <Alert color ="danger" isOpen={this.state.validate.alertVisible} toggle={this.dismissAlert}>
                {this.state.validate.errorMessage} </Alert>

              <Modal isOpen={this.state.modal} toggle={this.toggle} className='modal-success'>
                <ModalHeader toggle={this.toggle}> {this.props.match.params.id ? 'Cập nhật siêu người dùng thành công' : 'Tạo siêu người dùng thành công'}  </ModalHeader>
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
          <Link to={`/user/view/`} className="btn btn-primary mr-1">Về danh sách người dùng</Link>
        </p>

      </div>
    )
      ;
  }
}

export default UserDetails;
