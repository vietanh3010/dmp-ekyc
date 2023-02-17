import React, {Component} from "react";
import {
  Input,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter, CardBody, Row, Col, Label, Form, FormGroup, FormFeedback, Table
} from "reactstrap";
import Select from 'react-select';
import 'rc-pagination/assets/index.css';
import client from "../../api";
import ReactPlayer from 'react-player'
import moment from "moment";
import styles from "../../views/Report/Report.css";
import Resizer from 'react-image-file-resizer';


import uploadImage from '../../assets/img/brand/face.png'
import Pagination from "rc-pagination";

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

class Department extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      totalPage: 1,
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
      searchTable: [],
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

      //modal error
      modalError: false,
      modalErrorText: "",
      // checkOption: {value: 1, label: 'FCI'},
      // checkOptions: [
      //   {value: 1, label: 'FCI'},
      // ],
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
    client.get('/api/departmentManagement')
      .then((response) => {
          this.setState({
            dataTable: response.data,
            totalPage: getTotalPage(response.data.length)
          });
        }
      )
      .catch((error) => {
        console.log(error)
      });
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
    client.post('/api/departmentManagement', {
      name: this.state.name,
      desc: this.state.desc,
      updated_time: new Date().getTime(),
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


  };


  getTableRow(index, data) {
    // console.log(data.is_real);
    // let video_name = "";
    // if (data.url_video.indexOf("/") > -1) {
    //   const pieces = data.url_video.split("/");
    //   video_name = pieces[pieces.length - 1];
    // } else {
    //   video_name = data.url_video;
    // }
    return (
      <tr key={index}>
        <td>{data.name}</td>
        <td>{data.desc}</td>
        <td>
          <Row className="text-center">
            <Col xs="2">
              <button className="btn btn-danger" onClick={(e) => this.onDelete(e, data._id)}>Xóa
              </button>
            </Col>
          </Row>
        </td>
      </tr>
    )

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
    this.setState({[name]: value})
  };

  onDelete = (e, key) => {
    client.delete('/api/departmentManagement/' + key)
      .then((response) => {
          alert("delete Success!");
          window.location.reload();

        }
      )
      .catch((error) => {
        console.log(error)
      });
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
                  <CardTitle>Config Deparment</CardTitle>
                </div>


                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Form className="was-validated">
                        <FormGroup row>
                          <Col lg={3} md={4} xs={6} sm={12}>
                            <Input type="text" className="form-control-warning" name="name"
                                   placeholder="Department's name"
                              // value={this.state.profile.id}
                                   onChange={this.onChange}
                                   required/>
                            <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                            <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                          </Col>
                          <Col lg={3} md={4} xs={6} sm={12}>
                            <Input type="text" name="desc"
                                   placeholder="Department's description"
                              // value={this.state.profile.id}
                                   onChange={this.onChange}
                                   required/>
                            <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                            <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                          </Col>
                          <Col lg={3} md={4} xs={6} sm={12}>
                            <Button className="btn btn-facebook" onClick={(e) => this.onSubmit(e)}>
                              Add Department
                            </Button>
                          </Col>
                          {/*<Col lg={3} md={4} xs={6} sm={12}>*/}
                          {/* */}
                          {/*</Col>*/}
                        </FormGroup>
                      </Form>
                    </Col>
                  </Row>
                  <Row>
                    <CardBody className="overflow-auto">
                      <Table striped bordered hover size="lg">
                        <thead className="thead-dark">
                        <tr>
                          <th>Name</th>
                          {/*<th>Department</th>*/}
                          <th>Description</th>
                          <th>Action</th>
                        </tr>
                        </thead>
                        {this.state.dataTable.length > 0 &&
                        <tbody>
                        {this.switchView()}
                        </tbody>
                        }
                      </Table>
                      <Pagination onChange={(pageClick) => this.handlePageClick(pageClick)}
                                  current={this.state.currentPage}
                                  total={this.state.totalPage * 10}/>
                    </CardBody>

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
            Successful!
          </ModalBody>
          <ModalFooter>
            <Button color="primary"
                    onClick={(e) => window.location.reload()}>OK</Button>{' '}
            {/*<Button color="secondary" onClick={this.toggle}>Cancel</Button>*/}
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

export default Department;
