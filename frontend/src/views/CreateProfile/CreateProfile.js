import React, {Component} from "react";
import {
  Input,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter, CardBody, Row, Col, Label, Form, FormGroup, FormFeedback
} from "reactstrap";
import Select from 'react-select';
import 'rc-pagination/assets/index.css';
import client from "../../api";
import ReactPlayer from 'react-player'
import moment from "moment";
import styles from "../../views/Report/Report.css";
import Resizer from 'react-image-file-resizer';


import uploadImage from '../../assets/img/brand/face.png'

const TOKEN = 'access_token';
const jwtDecode = require('jwt-decode');
const token = localStorage.getItem(TOKEN);
const decoded = jwtDecode(token);
const Loader = () => <div className={styles.loader}></div>;
const MAX_ROW = 10;

let text = "";

function getTotalPage(totalLength) {
  return Math.floor((totalLength - 1) / MAX_ROW) + 1;
};

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgCollection: '',
      // checkOption: {value: 0, label: 'None'},
      // checkOptions: [
      //   {value: 0, label: 'None'},
      //   {value: 1, label: 'Real'},
      //   {value: 2, label: 'Fake'},
      // ],
      // typeOption: {value: 0, label: 'None'},
      // typeOptions: [
      //   {value: 0, label: 'None'},
      //   {value: 1, label: 'DeepFake'},
      //   {value: 2, label: 'ImageFake'},
      //   {value: 3, label: 'ReplayFake'},
      //   {value: 4, label: 'Other'},
      // ],
      // is_done: false,
      profile: {},
      image_root: "",
      imageSrc: "",
      imageState: 1,
      valid: 0,
      // currentPage: 1,
      // totalPage: 1,
      // keyword: "",
      // search: "",
      dataTable: [],
      file_save: [],
      view: "",
      //import file variables
      selectedImportFile: null,
      selectedImportFileName: "",
      checkImport: true,
      modal: false,
      wordEdit: "",
      selectedKey: "",
      selectedEditType: "",
      is_config: false,
      //modal error
      modalError: false,
      modalErrorText: "",
      checkOption: {},
      checkOptions: [],
    };
    this.toggle = this.toggle.bind(this);
  }

  hideLoader = () => {
    this.setState({loading: false});
  };

  showLoader = () => {
    this.setState({loading: true});
  };


  componentDidMount() {
    if (this.props.match.params.id) {
      client.get('/api/departmentManagement')
        .then((responselist) => {
            if (responselist.data) {
              let checkOption = {};
              let checkOptions = [];
              client.get('/api/userSmartDoorManagement/' + this.props.match.params.id)
                .then((response) => {
                    if (response.data) {
                      var itemsProcessed = 0;
                      responselist.data.map((res, i, array) => {
                        itemsProcessed++;
                        // console.log(response.data.department)
                        if (res.name === response.data.department) {
                          checkOption = {value: res.name, label: res.name};
                        }
                        checkOptions.push({value: res.name, label: res.name});
                        console.log(checkOptions)
                        if (itemsProcessed === array.length) {
                          this.setState({
                            profile: response.data,
                            checkOption: checkOption,
                            checkOptions: checkOptions,
                            is_config: true
                          });
                        }
                      });

                    }
                  }
                )
                .catch((error) => {
                  console.log(error)
                });
              // let checkOptions = response.data;
              this.setState({checkOption: checkOption, checkOptions: checkOptions, is_config: true});
            }
          }
        )
        .catch((error) => {
          console.log(error)
        });

    } else {
      this.setState({profile: {...this.state.profile, id: Date.now()}});
      client.get('/api/departmentManagement')
        .then((response) => {
            if (response.data) {
              let checkOption = {value: response.data[0].name, label: response.data[0].name};
              let checkOptions = [];
              response.data.map((res, i) => {
                checkOptions.push({value: res.name, label: res.name})
              });
              // let checkOptions = response.data;
              this.setState({checkOption: checkOption, checkOptions: checkOptions, is_config: true});
            }
          }
        )
        .catch((error) => {
          console.log(error)
        });

    }
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({is_mobile: window.innerWidth <= 1000});
  }

  toggle = (e, key, type) => {
    this.setState({selectedEditType: type});
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    this.setState({selectedKey: key});
  };

  toggleError = () => {
    this.setState(prevState => ({
      modalError: !prevState.modalError
    }));
  };

  onChangeEdit = changeEvent => {
    const wordEdit = changeEvent.target.value;
    this.setState({wordEdit});
  };

  onSubmit = e => {
    if ((this.state.profile.name && this.state.imgCollection && Object.keys(this.state.checkOption).length !== 0) || (this.state.profile.name && this.state.profile.image_link && Object.keys(this.state.checkOption).length !== 0)) {
      this.showLoader();
      e.preventDefault();
      if (this.props.match.params.id) {
        if (!this.state.imgCollection) {
          client.put('/api/userSmartDoorManagement/' + this.state.profile.id, {
            id: this.state.profile.id,
            name: this.state.profile.name,
            department: this.state.checkOption.value,
            image_link: this.state.profile.image_link,
            // created_time: Date.now(),
            updated_time: Date.now(),
            // file_link: this.state.profile.image_link
          })
            .then((response) => {
              console.log(response);
              this.hideLoader();
              if (response.data.message === 'OK') {
                this.toggle();
              } else {
                alert(response.data.message);
              }
            })
        } else {
          var formData1 = new FormData();
          formData1.append('imgCollection', this.state.imgCollection);
          client.post("/api/uploadFile", formData1, {})
            .then(res => {
              console.log(res.data.data);
              client.put('/api/userSmartDoorManagement/' + this.state.profile.id, {
                id: this.state.profile.id,
                name: this.state.profile.name,
                department: this.state.checkOption.value,
                image_link: res.data.data.link,
                // created_time: Date.now(),
                updated_time: Date.now(),
                filename: res.data.data.filename
              })
                .then((response) => {
                  console.log(response);
                  this.hideLoader();
                  if (response.data.message === 'OK') {
                    this.toggle();
                  } else {
                    alert(response.data.message);
                  }
                })

            })
            .catch((error) => {
              this.hideLoader();
              alert(error);
              // this.setState({modalErrorText: error});
              // this.toggleError()
            });
        }

      } else {
        var formData = new FormData();
        formData.append('imgCollection', this.state.imgCollection);
        // let list_file = this.state.dataTable;
        // let list_file_save = this.state.file_save;
        client.post("/api/uploadFile", formData, {})
          .then(res => {
            console.log(res.data.data);
            client.post('/api/userSmartDoorManagement', {
              id: this.state.profile.id,
              name: this.state.profile.name,
              department: this.state.checkOption.value,
              image_link: res.data.data.link,
              created_time: Date.now(),
              updated_time: Date.now(),
              filename: res.data.data.filename
            })
              .then((response) => {
                console.log(response);
                this.hideLoader();
                if (response.data.message === 'OK') {
                  this.toggle();
                } else {
                  alert(response.data.message);
                }
              })

          })
          .catch((error) => {
            this.hideLoader();
            alert(error);
            // this.setState({modalErrorText: error});
            // this.toggleError()
          });
        // client.post('/api/userSmartDoorManagement', {
        //   id: this.state.profile.id,
        //   name: this.state.profile.name,
        //   department: this.state.profile.department,
        //   created_time: Date.now(),
        //   updated_time: Date.now(),
        // })
        //   .then((response) => {
        //     alert("success")
        //   })
        //   .catch((error) => {
        //     alert(error)
        //   });
      }

    } else {
      this.setState({modalErrorText: "Bạn vẫn còn trường chưa điền thông tin"});
      this.toggleError()
    }

  };

  getTableRow(index, data) {

    if (data.status === 10) data.status_name = "Bản nháp"
    if (data.status === 0) data.status_name = "Chờ sơ loại cấp CTTV"
    if (data.status === 1) data.status_name = "Cần cập nhật đăng ký"
    if (data.status === 3) data.status_name = "Đã có kết quả"
    if (data.status === 2) data.status_name = "Chờ duyệt cấp CTTV"

    if (this.state.is_mobile) {
      return (
        <tr key={index} onClick={e => this.props.history.push("/project/edit/" + data._id)}>
          <td>{data.name}</td>
          {(localStorage.getItem('role') === '2' || localStorage.getItem('role') === '0') ?
            <td><Button onClick={e => this.props.history.push("/project/edit/" + data._id)}
                        className="btn-facebook">Phê Duyệt</Button></td>
            :
            <td><Button onClick={e => this.props.history.push("/project/edit/" + data._id)}
                        className="btn-facebook">Sửa</Button></td>
          }
        </tr>
      )
    } else {
      return (
        <tr key={index} onClick={e => this.props.history.push("/project/edit/" + data._id)}>
          <td>{data.id}</td>
          <td>{data.cttv_name}</td>
          <td>{data.name}</td>
          <td>{data.author}</td>
          <td>{moment(data.created_date).format('DD/MMM/YYYY hh:mm')}</td>
          <td>{moment(data.updated_date).format('DD/MMM/YYYY hh:mm')}</td>
          <td>{data.status_name}</td>
          {(localStorage.getItem('role') === '2' || localStorage.getItem('role') === '0') ?
            <td><Button onClick={e => this.props.history.push("/project/edit/" + data._id)}
                        className="btn-facebook">Phê Duyệt</Button></td>
            :
            <td><Button onClick={e => this.props.history.push("/project/edit/" + data._id)}
                        className="btn-facebook">Sửa</Button></td>
          }
        </tr>
      )
    }

  }

  editSelectedRow = (e, key, type) => {
    let word = this.state.wordEdit;
    if (word) {
      this.handleEditRow(type, word, key);
      this.toggle();
    } else {
      let modalErrorText = "Bạn vẫn còn trường chưa điền thông tin!";
      this.setState({modalErrorText});
      this.toggleError();
    }
  };

  handleEditRow = (type, word, id) => {
    // axios.put(API_URL + '/api/' + type + 'Management/' + id, {
    //   name: word.trim(),
    //   user_id: user_id,
    // }).then((response) => {
    //   this.setState({wordEdit: ""});
    //   if (response.data.message === "BAD") {
    //     let modalErrorText = "Trùng lặp thông tin!";
    //     this.setState({modalErrorText});
    //     this.toggleError();
    //   } else {
    //     window.location.reload();
    //   }
    // })
    //   .catch((error) => alert(error));
  };

  deleteSelectedRow = (e, key, type) => {
    this.handleDeleteRow(type, key);
  };

  handleDeleteRow = (type, id) => {

  };

  onChangeSearch = (changeEvent, type) => {
    const searchWord = changeEvent.target.value.toString();
    const tmp = this.state;
    if (!searchWord) {
      tmp.search = "";
      tmp.searchTable = [];
      tmp.view = "";
    } else {
      tmp.search = searchWord;
      const searchTable = this.filterItems(searchWord, tmp.dataTable);
      tmp.searchTable = searchTable;
      tmp.view = "search";
    }
    tmp.totalPage = getTotalPage(tmp.dataTable.length);
    tmp.currentPage = 1;
    this.setState({type: tmp});
  };

  filterItems = (query, data) => {
    return data.filter((el) =>
      el.name.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };


  addKeyword = keywordSubmit => {
    keywordSubmit.preventDefault();
    const type = keywordSubmit.target.id;
    let formValid = false;
    const tmp = this.state[type];
    const keyword = tmp.keyword;
    if (keyword) formValid = true;
    if (formValid) {
      this.handleFormAddKeyword(type, keyword);
    } else {
      let modalErrorText = "Bạn vẫn còn trường chưa điền thông tin!";
      this.setState({modalErrorText});
      this.toggleError();
    }
  };

  handleFormAddKeyword = (type, keyword) => {
    // axios.post(API_URL + '/api/' + type + 'Management', {
    //   name: keyword.trim(),
    //   user_id: user_id,
    // }).then(response => {
    //   if (response.data.message === "BAD") {
    //     let modalErrorText = "Trùng lặp thông tin!";
    //     this.setState({modalErrorText});
    //     this.toggleError();
    //   } else {
    //     window.location.reload();
    //   }
    // }).catch(error => {
    //   alert(error);
    // })
  };

  handlePageClick = (pageClick) => {
    this.setState({currentPage: pageClick});
  };

  switchView = () => {
    if (this.state.view === "search") {
      return (
        this.state.searchTable.filter((data, index) => (index < (this.state.currentPage * MAX_ROW)) && (index >= (this.state.currentPage * MAX_ROW) - MAX_ROW)).map((data, index) =>
          this.getTableRow(index, data))
      )
    } else {
      return (
        this.state.dataTable.filter((data, index) => (index < (this.state.currentPage * MAX_ROW)) && (index >= (this.state.currentPage * MAX_ROW) - MAX_ROW)).map((data, index) =>
          this.getTableRow(index, data)
        )
      )
    }
  };

  handleImport = event => {
    event.preventDefault();
    const type = event.target.id;
    let tmp = this.state[type];
    let importText = "";
    if (tmp.selectedImportFile) {
      importText = text;
    }
    if (importText) {
      let splitText = importText.split("\n");
      for (let i = 0; i < splitText.length; i++) {
        let keyword = splitText[i];
        this.handleFormImportKeyword(type, keyword);
      }
      tmp.selectedImportFile = null;
      tmp.selectedImportFileName = "";
      tmp.checkImport = true;
      this.setState({type: tmp});
    } else {
      let modalErrorText = "Bạn vẫn còn trường chưa điền thông tin!";
      this.setState({modalErrorText});
      this.toggleError();
    }
  };

  handleFormImportKeyword = (type, keyword) => {
    // axios.post(API_URL + '/api/' + type + 'Management', {
    //   name: keyword.trim(),
    //   user_id: user_id,
    // })
    //   .then((response) => {
    //     let tmp = this.state[type];
    //     if (response.data.message === "BAD") {
    //       if (tmp.checkImport) {
    //         let modalErrorText = "Đã loại bỏ các thông tin trùng lặp!";
    //         this.setState({modalErrorText});
    //         this.toggleError();
    //         tmp.checkImport = false;
    //         this.setState({type: tmp});
    //       }
    //     } else if (response.data.message === "OK") {
    //       tmp.dataTable = response.data.data;
    //       tmp.totalPage = getTotalPage(tmp.dataTable.length);
    //       this.setState({type: tmp});
    //     }
    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });
  };

  handleSelectedFile = (event, type) => {
    let tmp = this.state[type];
    tmp.selectedImportFile = event.target.files[0];
    tmp.selectedImportFileName = event.target.files[0].name;
    this.setState({type: tmp});
    let reader = new FileReader();
    reader.onload = function () {
      text = reader.result;
    };
    reader.readAsText(event.target.files[0]);
    event.target.value = "";
  };

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    var profile = {...this.state.profile};
    profile[name] = value;
    this.setState({profile})
  };

  validateSingleInput(oInput) {
    var _validFileExtensions = [".jpg", ".jpeg", ".png"];
    if (oInput.type == "file") {
      var sFileName = oInput.value;
      if (sFileName.length > 0) {
        var blnValid = false;
        for (var j = 0; j < _validFileExtensions.length; j++) {
          var sCurExtension = _validFileExtensions[j];
          if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
            blnValid = true;
            break;
          }
        }

        if (!blnValid) {
          alert("Sorry, " + sFileName + " is invalid, allowed extensions are: " + _validFileExtensions.join(", "));
          oInput.value = "";
          return false;
        }
      }
    }
    return true;
  }

  onFileChange = (evt) => {
    var self = this;
    var reader = new FileReader();
    var file = evt.target.files[0];
    this.setState({
      imgCollection: file,
      profile: {
        ...this.state.profile, image_link: null
      }
    });
    if (this.validateSingleInput(evt.target)) {
      try {
        reader.onload = function (upload) {
          Resizer.imageFileResizer(
            file,
            400, // height
            400, // width
            'JPEG',
            90,// quality
            0,
            uri => {
              self.setState({
                image_root: upload.target.result,
                imageSrc: uri,
                imageState: 0,
                valid: 1
              }, function () {
              });
            },
            'base64'
          );
        };
        reader.readAsDataURL(file);
      } catch (e) {
        alert("Wrong type Upload!!!")
      }
    }
  };

  onChangeCheckOption = (selectedOption) => {
    this.setState({
      checkOption: selectedOption
    });
  };

  onclick = e => {
    e.preventDefault();
    document.getElementById('file-input').click();
  };

  render() {
    return (
      <div className="animated fadeIn">
        {(this.state.loading) ? <Loader/> :
          <Row>
            <Col lg={11}>
              <div className="card">
                <div className="card-header">
                  <CardTitle>Add User's profile</CardTitle>
                </div>


                <CardBody>
                  {!this.state.is_config &&
                  <Row>
                    <Col lg={12} className="text-center">
                      <Label className="text-danger">
                        Please config department before add profile
                      </Label>
                    </Col>
                  </Row>

                  }
                  <br/>
                  <Row>
                    <Col lg={4}>
                      <Row>
                        <Col className="text-center">
                          <Input type="file" id="file-input" name="file-input"
                                 className={styles.hiddenInputStyle}
                                 onChange={this.onFileChange}
                            // onChange={handleChangeImage}
                                 accept="image/*"/>
                        </Col>
                      </Row>
                      {this.state.profile.image_link ?
                        <Row>
                          <Col className="text-center">
                            <img src={this.state.profile.image_link} className={styles.imageStyle} alt="N/A"
                                 onClick={this.onclick}/>
                          </Col>
                        </Row> :
                        [this.state.valid === 0 ?
                          <Row>
                            <Col className={"text-center " + styles.imageStyle}>
                              <img src={uploadImage} alt="N/A" className={styles.imageStyle} onClick={this.onclick}/>
                            </Col>
                          </Row>
                          :
                          <Row>
                            <Col className="text-center">
                              <img src={this.state.image_root} className={styles.imageStyle} alt="N/A"
                                   hidden={this.state.imageState} onClick={this.onclick}/>
                            </Col>
                          </Row>]}


                      <br/>
                      <Row>
                        <Col className="text-center">
                          <Button onClick={this.onclick}
                                  className="btn-primary">Choose image
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={8}>
                      <Form className="was-validated">
                        <FormGroup row>
                          <Col lg={3} md={4} xs={6} sm={12}>
                            <Label>UserId</Label>
                          </Col>
                          <Col lg={9} md={8} xs={6} sm={12}>
                            <Label>{this.state.profile.id}</Label>
                            {/*<Input type="text" className="form-control-warning" name="id"*/}
                            {/*       value={this.state.profile.id}*/}
                            {/*       onChange={this.onChange}*/}
                            {/*       required/>*/}
                            {/*<FormFeedback className="help-block">Chưa có thông tin</FormFeedback>*/}
                            {/*<FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>*/}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col lg={3} md={4} xs={6} sm={12}>
                            <Label>User Name</Label>
                          </Col>
                          <Col lg={9} md={8} xs={6} sm={12}>
                            <Input type="text" className="form-control-warning" name="name"
                                   value={this.state.profile.name}
                                   onChange={this.onChange}
                                   required/>
                            <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                            <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col lg={3} md={4} xs={6} sm={12}>
                            <Label>User Department</Label>
                          </Col>
                          <Col lg={9} md={8} xs={6} sm={12}>
                            <Select class="custom-select is-invalid"
                                    name="checkOption"
                                    value={this.state.checkOption}
                                    options={this.state.checkOptions}
                                    onChange={this.onChangeCheckOption}
                                    required/>
                          </Col>
                        </FormGroup>
                      </Form>
                    </Col>
                  </Row>
                  <br/>
                  <Row>
                    <Col className="text-center">
                      <Button className="btn btn-success mt-3" onClick={(e) => this.onSubmit(e)}>
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </CardBody>

              </div>
            </Col>
          </Row>
        }

        {/*<Modal isOpen={this.state.modal} toggle={this.toggle}>*/}
        {/*  <ModalHeader toggle={this.toggle}>Edit Selected Word</ModalHeader>*/}
        {/*  <ModalBody>*/}
        {/*    <Input value={this.state.wordEdit} onChange={this.onChangeEdit} type="text"/>*/}
        {/*  </ModalBody>*/}
        {/*  <ModalFooter>*/}
        {/*    <Button color="primary"*/}
        {/*            onClick={(e) => this.editSelectedRow(e, this.state.selectedKey, this.state.selectedEditType)}>Edit</Button>{' '}*/}
        {/*    <Button color="secondary" onClick={this.toggle}>Cancel</Button>*/}
        {/*  </ModalFooter>*/}
        {/*</Modal>*/}

        <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-success">
          <ModalHeader toggle={this.toggle}>Thông báo</ModalHeader>
          <ModalBody>
            Bạn đã Tạo/Cập nhật Profile thành công!
          </ModalBody>
          <ModalFooter>
            <Button color="primary"
                    onClick={(e) => this.props.history.push("/userList")}>OK</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.modalError}
          toggle={this.toggleError}
          className="modal-danger"
        >
          <ModalHeader toggle={this.toggleError}>Thông Báo</ModalHeader>
          <ModalBody>
            {this.state.modalErrorText}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleError}>
              Hủy
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CreateProfile;
