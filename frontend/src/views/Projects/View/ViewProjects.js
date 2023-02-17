import React, {Component} from "react";
import {
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
import client from "../../../api";

// const TOKEN = 'access_token';
// const jwtDecode = require('jwt-decode');
// const token = localStorage.getItem(TOKEN);
// const decoded = jwtDecode(token);
import moment from "moment";

const MAX_ROW = 10;

let text = "";

function getTotalPage(totalLength) {
  return Math.floor((totalLength - 1) / MAX_ROW) + 1;
};

class ViewProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    client.get('/api/users')
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

  getTableRow(index, data) {
    let role = "";
    if (data.roles === '1') {
      role = "Admin"
    } else {
      role = "User"
    }

    return (
      <tr key={index}>
        <td><a href={"/history/" + data._id}>{data.local.email}</a></td>
        <td>{role}</td>
        {data.email_activated ?
          <td><Button onClick={e => this.deActive(e, data._id)}
                      className="btn-danger">DeActive</Button></td>
          :
          <td><Button onClick={e => this.active(e, data._id)}
                      className="btn-facebook">Active</Button></td>

        }

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
      el.local.email.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
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
            <CardTitle>DANH SÁCH TÀI KHOẢN</CardTitle>
          </div>
          <CardBody>
            <div>
              <div className="float-left">
                <div className="input-group" style={{borderRadius: "25px"}}>
                  <div className="input-group-prepend">
                    <div className="input-group-text"><i className="fa fa-search"></i></div>
                  </div>
                  <Input className="form-control-range" name="" type="text" placeholder="email"
                         value={this.state.search} onChange={(e) => this.onChangeSearch(e)}/>
                </div>
              </div>

            </div>
          </CardBody>
          <CardBody className="overflow-auto">
            <Table striped bordered hover size="lg">
              <thead className="thead-dark">
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th></th>
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

export default ViewProjects;
