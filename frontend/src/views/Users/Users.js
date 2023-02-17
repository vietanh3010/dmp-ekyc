import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, CardFooter, Button } from 'reactstrap';
import usersData from './UsersData'
import client from '../../api';
import axios from 'axios';

function UserRow(props) {
  const user = props.user;
  const userLink = `/users/${user.id}`;

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  };

  return (
    <tr key={user.id.toString()}>
      <th scope="row"><Link to={userLink}>{user.id}</Link></th>
      <td><Link to={userLink}>{user.name}</Link></td>
      <td>{user.registered}</td>
      <td>{user.role}</td>
      <td><Link to={userLink}><Badge color={getBadge(user.status)}>{user.status}</Badge></Link></td>
    </tr>
  )
}




class Users extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    first: 'loading ...',
    second:'loading....',
    third: 'loading....',
    doneMessage:'finished!'

  };

  handleSubmit = (e) => {
    //5c36abb78335991f4cf02343
    client.post('/users')
      .then((res)=> {
        alert(res.data.msg);
      })
      .catch((err)=>{
        alert(err.response.data.msg);
        alert(err.message);
      })
    /*
    client.get('/users/5c36abb78335991f4cf02343').then((res)=> {
        alert(res.data.msg);
      });
      */
  };

  componentDidMount() {

    // method: GET /users -> Get all users
    axios.get('/api/users', {

    }).then((response) => {
      this.successShow(response);
    }).catch((error) => {
      alert(error);
    });
  }

  successShow(response) {
    // console.log(response.data);
    this.setState({
      dataTable: response.data
    });
  }

  render() {
    const { state } = this;
    const userList = usersData.filter((user) => user.id < 10)
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Users <small className="text-muted">example</small>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">name</th>
                      <th scope="col">registered</th>
                      <th scope="col">role</th>
                      <th scope="col">status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
                    )}
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                <Button color="success" block type="submit"
                        onClick={this.handleSubmit}>Check permission</Button>

                <ul>
                  {Object.keys(state)
                    .filter(key => key !=='doneMessage')
                    .map(key =>(
                      <li key ={key}>
                        <strong>{key}:</strong>
                        {state[key]}
                      </li>
                    ))
                  }
                </ul>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Users;
