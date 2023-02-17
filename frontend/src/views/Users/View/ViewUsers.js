import React, {Component} from 'react';
//import {rgbToHex} from '@coreui/coreui/dist/js/coreui-utilities'
import {Link} from 'react-router-dom'
import {
  Button,
  Col,
  Input,
} from 'reactstrap';
import Select from 'react-select';
import {optionsStatus} from "../../../constants/ActionTypes";

import client from '../../../api';

// Filter options for displaying users of different statuses
const optionsFilter = [{value: 'all', label: 'Tất cả'}].concat(optionsStatus);

class ViewUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      // Checkboxes
      rowsSelected: {},
      numRowsSelected: 0,
      selectAll: 0, // 0 = no row selected,
                    // 1 = all selected,
                    // 2 = indeterminate (some rows selected)
      // Filter
      filterBy: optionsFilter[0],
      isActiveFilter: '',
    };

    this.toggleRow = this.toggleRow.bind(this);
    this.setValueToAllCheckboxes = this.setValueToAllCheckboxes.bind(this);
    this.renderSwitchBySelectedRows = this.renderSwitchBySelectedRows.bind(this);
    this.deleteMultipleUsers = this.deleteMultipleUsers.bind(this);
    this.onChangeUserStatus = this.onChangeUserStatus.bind(this);
  }

  toggleRow(index) {
    //const newSelected = Object.assign({}, this.state.rowsSelected);
    let { rowsSelected, numRowsSelected } = this.state;

    rowsSelected[index] = !rowsSelected[index];
    rowsSelected[index] ? numRowsSelected += 1 : numRowsSelected -= 1;

    if (this.state.users === 'undefined' || numRowsSelected === 0) {
      this.setState({
        rowsSelected: rowsSelected,
        numRowsSelected: numRowsSelected,
        selectAll: 0
      }, () => {});

    } else if (this.state.users && numRowsSelected === this.state.users.length ) {
      this.setState({
        rowsSelected: rowsSelected,
        numRowsSelected: numRowsSelected,
        selectAll: 1
      }, () => {});

    } else {
      this.setState({
        rowsSelected: rowsSelected,
        numRowsSelected: numRowsSelected,
        selectAll: 2
      }, () => {});
    }
  }

  toggleSelectAll() {
    this.state.selectAll === 0 ? this.setValueToAllCheckboxes(true) :
      this.setValueToAllCheckboxes(false);
  }

  setValueToAllCheckboxes(val) {
    let selection = [];
    this.state.users.forEach((user, id) => { selection[id] = val; });
    this.setState({
      rowsSelected: selection,
      selectAll: val ? 1 : 0,
      numRowsSelected: val && this.state.users ? this.state.users.length : 0
    }, () => {});
  }

  componentDidMount() {
    client.get('/api/users')
      .then((response) => {
        this.successShow(response);
      })
      .catch((error) => {
        alert(error);
        this.successShow(error);
      });

    // Initialize the checkboxes
    this.setValueToAllCheckboxes(false);
  }

  successShow(response) {
    this.setState({ users: response.data });
  }

  delete(userId) {
    client.delete('/api/users/' + userId)
      .then((result) => {
        window.location.reload();
      });
  }

  deleteMultipleUsers() {
    for (var r in this.state.rowsSelected) {
      if (this.state.rowsSelected[r]) {
        this.delete(this.state.users[r]._id)
      }
    }
    window.location.reload();
  }

  onChangeUserStatus(userId) {
    let { users } = this.state;

    // Find the selected user in user list
    let userIndex = -1;
    for (var i = 0; i < users.length; i++) {
      if (users[i]._id === userId) {
        userIndex = i;
        break;
      }
    }

    // Update database
    if (users[userIndex].is_active) {
      client.patch('/api/users/' + userId + '?act=deactivate')
        .then(console.log)
        .catch(console.log)
    } else {
      client.patch('/api/users/' + userId + '?act=activate')
        .then(console.log)
        .catch(console.log)
    }

    // Update the GUI
    users[userIndex].is_active = !users[userIndex].is_active;
    this.setState({ users });
  }

  onChangeFilter = (selectedOption) => {
    switch(selectedOption.value) {
      case 1:
        this.setState({ filterBy: selectedOption, isActiveFilter: true });
        break;
      case 0:
        this.setState({ filterBy: selectedOption, isActiveFilter: false });
        break;
      default:
        this.setState({ filterBy: selectedOption, isActiveFilter: '' });
    }
  }

  statusLabel(userStatus) {
    return userStatus ? optionsStatus[0].label : optionsStatus[1].label
  }

  renderSwitchBySelectedRows() {
    if (this.state.numRowsSelected > 1) {
      return (
        <React.Fragment>
        <Link to='#' className="btn btn-primary mr-1">Thiết lập lại mật khẩu</Link>
        <Button color="danger" onClick={() => window.confirm("Bạn có thực sự muốn xóa những người dùng được chọn?") && this.deleteMultipleUsers()} className="mr-1">Xóa</Button>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">
            <span className="h4 text-uppercase">Quản Lý Người Dùng</span>
          </div>
          <div className="card-body">
            <div className="row" style={{ marginBottom: 10 }}>
              <Col md="9">
                <Link to="/user/create" className="btn btn-primary mr-1">Thêm Người Dùng</Link>
                {this.renderSwitchBySelectedRows()}
              </Col>
              <Col md="3">
                <Select
                  defaultValue={optionsFilter[0]} // Display all users
                  value={this.state.filterBy}
                  options={optionsFilter}
                  onChange={this.onChangeFilter}
                />
              </Col>
            </div>

            <table className="table">
              <thead>
              <tr style={{
                flex: true,
                alignItems:'center',
                justifyContent:'center'
              }}>
                <th>
                  <Input
                    type="checkbox"
                    checked={this.state.selectAll === 1}
                    ref={input => {
                      if (input) {
                        input.indeterminate = (this.state.selectAll === 2);
                      }
                    }}
                    onChange = {() => this.toggleSelectAll()}
                  />
                </th>
                <th>Tên Người Dùng</th>
                <th>Đơn vị</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
              </thead>
              <tbody>
              {this.state.users && this.state.users.map(
                (user, index) => {
                  if (this.state.isActiveFilter === '' || this.state.isActiveFilter === user.is_active) {
                    return (
                      <tr key={user._id}>
                        <td>
                          <Input
                            type="checkbox"
                            checked={this.state.rowsSelected[index] === true}
                            onChange={() => this.toggleRow(index)}
                          />
                        </td>
                        <td><Link to={`/user/edit/${user._id}`}>{user.local.username}</Link></td>
                        <td>{user.local.unit_name}</td>
                        <td>{user.local.email}</td>
                        <td>{user.local.phone}</td>
                        <td>{this.statusLabel(user.is_active)}</td>
                        <td>

                          <Link to={{
                                  pathname:`/resetPassword`,
                                  data:{id:user._id, name:user.local.username, referrer:'/user/view'}}}
                                color="primary"
                                className="btn btn-primary mr-1">Thiết lập lại mật khẩu</Link>

                          <Button className="btn btn-primary mr-1"
                                  onClick={() => window.confirm("Bạn có thực sự muốn thay đổi trạng thái của người dùng này?") && this.onChangeUserStatus(user._id)}>Đổi
                            trạng thái</Button>
                          <Button color="danger"
                                  onClick={() => window.confirm("Bạn có thực sự muốn xóa người dùng này?") && this.delete(user._id)}
                                  className="mr-1">Xóa</Button>
                        </td>
                      </tr>
                    )
                  }
                }
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewUsers;
