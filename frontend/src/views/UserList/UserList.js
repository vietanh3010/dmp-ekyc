import React, {Component} from "react";
import {
  Row, Col,
  Input,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter, CardBody, Table,
} from "reactstrap";
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import client from "../../api";

// const TOKEN = 'access_token';
// const jwtDecode = require('jwt-decode');
// const token = localStorage.getItem(TOKEN);
// const decoded = jwtDecode(token);
import moment from "moment";
import Select from "react-select";

const MAX_ROW = 10;

let text = "";

function getTotalPage(totalLength) {
  return Math.floor((totalLength - 1) / MAX_ROW) + 1;
};

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      totalPage: 1,
      keyword: "",
      search: "",
      searchID: "",
      dataTable: [],
      searchTable: [],
      checkOption: {},
      checkOptions: [],
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

    // if (this.props.match.params.id) {
    //   client.get('/api/historyManagement/' + this.props.match.params.id)
    //     .then((response) => {
    //         console.log(response.data);
    //         this.setState({
    //           dataTable: response.data,
    //           totalPage: getTotalPage(response.data.length)
    //         });
    //       }
    //     )
    //     .catch((error) => {
    //       console.log(error)
    //     });
    // } else {
    client.get('/api/userSmartDoorManagement')
      .then((response) => {
          client.get('/api/departmentManagement')
            .then((response) => {
                if (response.data) {
                  let checkOption = {value: "All", label: "Select All"};
                  let checkOptions = [{value: "All", label: "Select All"}];
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
          this.setState({
            dataTable: response.data,
            totalPage: getTotalPage(response.data.length)
          });
        }
      )
      .catch((error) => {
        console.log(error)
      });
    // }

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

  onEdit = (e, key) => {
    e.preventDefault();
    this.props.history.push('/editProfile/' + key)
  };

  onDelete = (e, key) => {
    client.delete('/api/userSmartDoorManagement/' + key)
      .then((response) => {
          alert("delete Success!");
          window.location.reload();

        }
      )
      .catch((error) => {
        console.log(error)
      });
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
        {/*<td>{video_name}</td>*/}
        <td>{data.id + ""}</td>
        <td>{data.name}</td>
        <td>{data.department}</td>
        {/*Temporary*/}
        <td>
          <Row className="text-center">
            <Col xs="2">
              <button className="btn btn-primary" onClick={(e) => this.onEdit(e, data._id)}>Sửa</button>
            </Col>
            <Col xs="2">
              <button className="btn btn-danger" onClick={(e) => this.onDelete(e, data.id)}>Xóa
              </button>
            </Col>
          </Row>
        </td>


        {/*<td>{moment(data.updated_time).format('DD/MM/YY hh:mm')}</td>*/}

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

  onChangeCheckOption = (selectedOption) => {
    const searchWord = selectedOption.value.toString();
    console.log(searchWord);
    const tmp = this.state;
    if (!searchWord) {
      // tmp.search = "";
      tmp.searchTable = [];
      tmp.view = "";
    } else {
      // tmp.search = searchWord;
      const searchTable = this.filterItemsDep(searchWord, tmp.dataTable);
      tmp.searchTable = searchTable;
      tmp.view = "search";
    }
    if (searchWord) {
      tmp.totalPage = getTotalPage(tmp.searchTable.length);
    } else {
      tmp.totalPage = getTotalPage(tmp.dataTable.length);
    }

    tmp.currentPage = 1;
    this.setState({
      checkOption: selectedOption
    });
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
    if (searchWord) {
      tmp.totalPage = getTotalPage(tmp.searchTable.length);
    } else {
      tmp.totalPage = getTotalPage(tmp.dataTable.length);
    }

    tmp.currentPage = 1;
    this.setState({type: tmp});


  };

  onChangeSearchID = (changeEvent, type) => {
    const searchWord = changeEvent.target.value.toString();
    const tmp = this.state;
    if (!searchWord) {
      tmp.searchID = "";
      tmp.searchTable = [];
      tmp.view = "";
    } else {
      tmp.searchID = searchWord;
      const searchTable = this.filterItemsId(searchWord, tmp.dataTable);
      tmp.searchTable = searchTable;
      tmp.view = "search";
    }
    if (searchWord) {
      tmp.totalPage = getTotalPage(tmp.searchTable.length);
    } else {
      tmp.totalPage = getTotalPage(tmp.dataTable.length);
    }
    tmp.currentPage = 1;
    this.setState({type: tmp});
  };

  filterItems = (query, data) => {
    return data.filter((el) =>
      el.name.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  filterItemsDep = (query, data) => {
    if (query === "All") {
      return data
    } else {
      return data.filter((el) =>
        el.department.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
      );
    }

  };

  filterItemsId = (query, data) => {
    return data.filter((el) =>
      el.id.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
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

  deActive = (e, id) => {
    e.preventDefault();
    client.put('/api/users/' + id, {email_activated: false})
      .then((response) => {
          alert("DeActive Successfully!");
          window.location.reload();
        }
      )
      .catch((error) => {
        console.log(error)
      });

  };

  active = (e, id) => {
    e.preventDefault();
    client.put('/api/users/' + id, {email_activated: true})
      .then((response) => {
          alert("Active Successfully!");
          window.location.reload();
        }
      )
      .catch((error) => {
        console.log(error)
      });

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

  render() {
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">
            <CardTitle>List Profile</CardTitle>
          </div>
          <CardBody>
            <div>
              <Row>
                <Col lg={3}>
                  <div className="input-group" style={{borderRadius: "25px"}}>
                    <div className="input-group-prepend">
                      <div className="input-group-text"><i className="fa fa-search"></i></div>
                    </div>
                    <Input className="form-control-range" name="" type="text" placeholder="search by Id"
                           value={this.state.searchID} onChange={(e) => this.onChangeSearchID(e)}/>
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="input-group" style={{borderRadius: "25px"}}>
                    <div className="input-group-prepend">
                      <div className="input-group-text"><i className="fa fa-search"></i></div>
                    </div>
                    <Input className="form-control-range" name="" type="text" placeholder="search by name"
                           value={this.state.search} onChange={(e) => this.onChangeSearch(e)}/>
                  </div>
                </Col>
                <Col lg={3}>
                  <Select class="custom-select is-invalid"
                          name="checkOption"
                          value={this.state.checkOption}
                          options={this.state.checkOptions}
                          onChange={this.onChangeCheckOption}
                          required/>
                </Col>
              </Row>
              {/*<div className="float-left">*/}
              {/*  <div className="input-group" style={{borderRadius: "25px"}}>*/}
              {/*    <div className="input-group-prepend">*/}
              {/*      <div className="input-group-text"><i className="fa fa-search"></i></div>*/}
              {/*    </div>*/}
              {/*    <Input className="form-control-range" name="" type="text" placeholder="userId"*/}
              {/*           value={this.state.search} onChange={(e) => this.onChangeSearch(e)}/>*/}
              {/*  </div>*/}
              {/*   <div className="input-group" style={{borderRadius: "25px"}}>*/}
              {/*    <div className="input-group-prepend">*/}
              {/*      <div className="input-group-text"><i className="fa fa-search"></i></div>*/}
              {/*    </div>*/}
              {/*    <Input className="form-control-range" name="" type="text" placeholder="userId"*/}
              {/*           value={this.state.search} onChange={(e) => this.onChangeSearch(e)}/>*/}
              {/*  </div>*/}
              {/*</div>*/}

            </div>
          </CardBody>
          <CardBody className="overflow-auto">
            <Table striped bordered hover size="lg">
              <thead className="thead-dark">
              <tr>
                <th>UserId</th>
                <th>Name</th>
                <th>Department</th>
                <th>Action</th>
                {/*<th>Updated_Time</th>*/}
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

export default UserList;
