import React, {Component} from "react";
import {
  Input,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter, CardBody, Row, Col, Label
} from "reactstrap";
import Select from 'react-select';
import 'rc-pagination/assets/index.css';
import client from "../../api";
import ReactPlayer from 'react-player'
import moment from "moment";


const TOKEN = 'access_token';
const jwtDecode = require('jwt-decode');
const token = localStorage.getItem(TOKEN);
const decoded = jwtDecode(token);

const MAX_ROW = 10;

let text = "";

function getTotalPage(totalLength) {
  return Math.floor((totalLength - 1) / MAX_ROW) + 1;
};

class CheckVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkOption: {value: 0, label: 'None'},
      checkOptions: [
        {value: 0, label: 'None'},
        {value: 1, label: 'Real'},
        {value: 2, label: 'Fake'},
      ],
      typeOption: {value: 0, label: 'None'},
      typeOptions: [
        {value: 0, label: 'None'},
        {value: 1, label: 'DeepFake'},
        {value: 2, label: 'ImageFake'},
        {value: 3, label: 'ReplayFake'},
        {value: 4, label: 'Other'},
      ],
      is_done: false,
      video: {},
      currentPage: 1,
      totalPage: 1,
      keyword: "",
      search: "",
      dataTable: [],
      searchTable: [],
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
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      client.get('/api/videoTaggingManagement/' + this.props.match.params.id)
        .then((response) => {
            if (response.data && response.data.url_video) {
              this.setState({video: response.data});
              for (let item of this.state.typeOptions) {
                if (response.data.type_fake === item.value.toString()) {
                  this.setState({
                    typeOption: item
                  });
                }
              }
              if (response.data.is_real && (response.data.is_real === true)) {
                this.setState({
                  checkOption: {value: 1, label: 'Real'},
                });
              } else if (response.data.is_real && (response.data.is_real === false)) {
                this.setState({
                  checkOption: {value: 2, label: 'Fake'},
                });
              }
            } else {
              this.setState({is_done: true})
            }
          }
        )
        .catch((error) => {
          console.log(error)
        });
    } else {
      client.get('/api/videoTaggingManagement')
        .then((response) => {
            if (response.data && response.data.url_video) {
              this.setState({video: response.data});
              for (let item of this.state.typeOptions) {
                if (response.data.type_fake === item.value.toString()) {
                  this.setState({
                    typeOption: item
                  });
                }
              }
              if (response.data.is_real && (response.data.is_real === true)) {
                this.setState({
                  checkOption: {value: 1, label: 'Real'},
                });
              } else if (response.data.is_real && (response.data.is_real === false)) {
                this.setState({
                  checkOption: {value: 2, label: 'Fake'},
                });
              }
            } else {
              // alert(1);
              this.setState({is_done: true})
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

  nextVideo = e => {
    e.preventDefault();
    if ((this.state.checkOption.value === 1) || (this.state.typeOption.value !== 0 && this.state.checkOption.value !== 0)) {
      let is_real = false;
      if (this.state.checkOption.value === 1) {
        is_real = true;
      } else if (this.state.checkOption.value === 2) {
        is_real = false;
      }
      client.put('/api/videoTaggingManagement/' + this.state.video._id, {
        user_id: decoded.id,
        is_real: is_real,
        type_fake: this.state.typeOption.value,
        is_processed: true,
        updated_time: Date.now(),
      })
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          alert(error)
        });
    } else {
      alert("Hãy chọn đầy đủ thông tin")
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

  onChangeCheckOption = (selectedOption) => {
    this.setState({
      checkOption: selectedOption
    });
  };

  onChangeTypeOption = (selectedOption) => {
    this.setState({
      typeOption: selectedOption
    });
  };

  render() {
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">
            <CardTitle>CHECK VIDEO</CardTitle>
          </div>
          {this.state.is_done ?
            <CardBody>
              <h3 className="text-danger">Đã hết video cần xử lý!</h3>
              <video width='640' height='480' controls>
                <source src='http://10.3.9.222:3920/vpb_live_isMatch_09h45Sep10-to-09h45Sep14/00827651-c830-461f-b0e0-d6f76e45990a_2_52479297_livenesseb3f5314-f4a0-11ea-b46b-0242c0a80002.mp4' type='video/mp4;codecs="avc1.42E01E, mp4a.40.2"'/>
              </video>
            </CardBody>
            :
            <CardBody>
              <div className='player-wrapper '>

                <ReactPlayer
                  className='react-player'
                  url={this.state.video.url_video}
                  width='100%'
                  playing={true}
                  loop={true}
                  controls={true}
                  // light={true}
                  // controls={true}
                />
              </div>
              <br/><br/>
              <Row>
                <Col md={6} xs={12}>
                  <Row>
                    <Col md={6} className="text-right">
                      <Label>
                        Kiểm tra thật hay giả <br/><span className="text-danger">(xác định video là thật hay giả)</span>
                      </Label>
                    </Col>
                    <Col md={6} className="text-left">
                      <Select class="custom-select is-invalid"
                              name="checkOption"
                              value={this.state.checkOption}
                              options={this.state.checkOptions}
                              onChange={this.onChangeCheckOption}
                              required
                      />
                    </Col>
                  </Row>
                </Col>
                <Col md={6} xs={12}>
                  {this.state.checkOption.value === 2 &&
                  <Row>
                    <Col md={6} className="text-right">
                      <Label>
                        Kiểu Fake <br/><span className="text-danger">(xác định kiểu làm giả)</span>
                      </Label>
                    </Col>
                    <Col md={6} className="text-left">
                      <Select class="custom-select is-invalid"
                              name="typeOption"
                              value={this.state.typeOption}
                              options={this.state.typeOptions}
                              onChange={this.onChangeTypeOption}
                              required
                      />
                    </Col>
                  </Row>
                  }

                </Col>
              </Row>
              <br/>
              <br/>
              <Row>
                <Col className="text-center">
                  <Button className="btn btn-success mt-3" onClick={(e) => this.nextVideo(e)}>
                    Video Tiếp theo
                  </Button>
                </Col>
              </Row>
            </CardBody>}

        </div>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Edit Selected Word</ModalHeader>
          <ModalBody>
            <Input value={this.state.wordEdit} onChange={this.onChangeEdit} type="text"/>
          </ModalBody>
          <ModalFooter>
            <Button color="primary"
                    onClick={(e) => this.editSelectedRow(e, this.state.selectedKey, this.state.selectedEditType)}>Edit</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.modalError}
          toggle={this.toggleError}
          className={this.props.className}
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

export default CheckVideo;
