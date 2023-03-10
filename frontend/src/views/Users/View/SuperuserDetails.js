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

class SuperuserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        password: '',
        passwordConfirmation: '',
        email: '',
        phone: '',
        usertype: optionsSuperuserTypes[0].value,  // Normal superuser
        subordinates: [],
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
          alert("C???p nh???t si??u ng?????i d??ng th??nh c??ng");

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

    return

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
            alert("C???p nh???t si??u ng?????i d??ng th??nh c??ng");
            this.props.history.push("/superuser/view")
          });
      }
      else {
        client.post('/api/superusers', {username, password, email, phone, usertype})
          .then((result) => {
            alert("T???o si??u ng?????i d??ng m???i th??nh c??ng");
            this.props.history.push("/superuser/view")
          });
      }
    }
    else {
      this.toggleDanger();
    }

  };


  componentDidMount() {
    // Get user info & his/her subordinates
    client.get( '/api/superusers/' + this.props.match.params.id)
      .then((response) => {
        console.log(response.data)
        var { user }      = this.state
        user.username     = response.data.user.local.username
        user.phone        = response.data.user.local.phone
        user.email        = response.data.user.local.email
        user.usertype     = response.data.class
        user.subordinates = response.data.users
        user.projects     = response.data.projects

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
            <span className="h4 text-uppercase">Th??ng Tin Si??u Ng?????i D??ng</span>
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
                       placeholder="T??n t??i kho???n"
                       value={this.state.user.username}
                       //onChange={this.handleChange}
                       invalid={ this.state.validate.nameState === 'has-danger' }
                       disabled={ !this.state.editMode }
                />
                <FormFeedback>
                  {this.state.validate.nameMessage}
                </FormFeedback>
              </InputGroup>

              {/* Class */}
              <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-badge"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="text"
                       name="username"
                       placeholder="Lo???i t??i kho???n"
                       value={this.state.user.usertype}
                       //onChange={this.handleChange}
                       //invalid={ this.state.validate.nameState === 'has-danger' }
                       disabled={ !this.state.editMode }
                />
                <FormFeedback>
                  {this.state.validate.nameMessage}
                </FormFeedback>
              </InputGroup>

              {/* type
                <FormGroup row>
                  <Col md="3">
                    <Label id="model">Lo???i T??i Kho???n</Label>
                  </Col>
                  <Col md="9">
                    <Select
                      defaultValue={optionsSuperuserTypes[0]}
                      value={this.usertypeLabel(this.state.user.usertype)}
                      options={optionsSuperuserTypes}
                      onChange={this.onChangeUserType}
                    />
                    <FormFeedback className="help-block">H??y nh???p ?????a ch??? th?? ??i???n t???</FormFeedback>
                    <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
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
                       placeholder="Th?? ??i???n t???"
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
                       placeholder="??i???n tho???i"
                       value={this.state.user.phone}
                       invalid={ this.state.validate.phoneState === 'has-danger' }
                       onChange={this.handleChange}
                       disabled={ !this.state.editMode }
                />
                <FormFeedback>
                  {this.state.validate.phoneMessage}
                </FormFeedback>
              </InputGroup>

              {/* User List */}
              <div className="card">
                <div className="card-header">
                  <span className="h6">Danh S??ch Ng?????i D??ng</span>
                </div>
                <div className="card-body">
                  <table className="table">
                    <thead>
                    <tr style={{
                      flex: true,
                      alignItems:'center',
                      justifyContent:'center'
                    }}>
                      <th>T??n Ng?????i D??ng</th>
                      <th>????n V???</th>
                      <th>Tr???ng Th??i</th>
                      <th>S??? ??i???n Tho???i</th>
                      <th>Th?? ??i???n T???</th>
                    </tr>
                    </thead>
                    <tbody>
                      {this.state.user.subordinates && this.state.user.subordinates.map(
                        (subordinate) => {
                          return(
                            <tr key={subordinate._id}>
                              <td>{subordinate.local.username}</td>
                              <td>{subordinate.local.unit_name}</td>
                              <td>
                                {subordinate.is_active &&
                                <a style={{color: brandSuccess}}>??ang Ho???t ?????ng</a>
                                ||
                                <a style={{color: brandDanger}}>Kh??ng Ho???t ?????ng</a>
                                }
                              </td>
                              <td>{subordinate.local.phone}</td>
                              <td>{subordinate.local.email}</td>
                            </tr>
                          )
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Project List */}
              <div className="card">
                <div className="card-header">
                  <span className="h6">Danh S??ch D??? ??n</span>
                </div>
                <div className="card-body">
                  <table className="table">
                    <thead>
                    <tr style={{
                      flex: true,
                      alignItems:'center',
                      justifyContent:'center'
                    }}>
                      <th>T??n D??? ??n</th>
                      <th>M?? T???</th>
                      <th>Tr???ng Th??i</th>
                      <th>T??? Kh??a</th>
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
                                  <a style={{color: brandDanger}}>Kh??ng Ho???t ?????ng</a>
                                  ||
                                  <a style={{color: brandSuccess}}>??ang Ho???t ?????ng</a>
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
                <ModalHeader toggle={this.toggle}> {this.props.match.params.id ? 'C???p nh???t si??u ng?????i d??ng th??nh c??ng' : 'T???o si??u ng?????i d??ng th??nh c??ng'}  </ModalHeader>
                <ModalBody>
                  {this.props.match.params.id ? 'C???p nh???t si??u ng?????i d??ng th??nh c??ng' : 'T???o si??u ng?????i d??ng th??nh c??ng'}
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={this.toggle}>????ng</Button>
                </ModalFooter>
              </Modal>

            </Form>
          </div>
        </div>

        <p className="text-center">
          <Link to={`/superuser/view/`} className="btn btn-primary mr-1">V??? danh s??ch si??u ng?????i d??ng</Link>
        </p>
      </div>
    )
  }
}

export default SuperuserDetails;
