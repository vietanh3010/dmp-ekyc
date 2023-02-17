import React from 'react';
import client from "../../../api";
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from "reactstrap";
import styles from "../../Report/Report.css";
import {emailList, specialEmail} from "../../../constants/ActionTypes";

const jwtDecode = require('jwt-decode');


const Loader = () => <div className={styles.loader}></div>;

class Token extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.toggle = this.toggle.bind(this);
    this.toggleDanger = this.toggleDanger.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleDanger() {
    this.setState({
      danger: !this.state.danger
    });
  }

  back = e => {
    e.preventDefault();
    window.location.href = "/";
  };


  hideLoader = () => {
    this.setState({loading: false});
  };

  showLoader = () => {
    this.setState({loading: true});
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Loader/>
        <Modal isOpen={this.state.danger} toggle={this.toggleDanger}
               className={'modal-warning ' + this.props.className}>
          <ModalHeader toggle={this.toggleDanger}>Thông báo</ModalHeader>
          <ModalBody>
            Đăng nhập thất bại!
          </ModalBody>
          <ModalFooter className="text-center">
            <Button color="secondary" onClick={this.back}>OK</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

  // constructor(props) {
  //   super(props);
  // }
  componentDidMount() {
    this.showLoader();
    if (window.location.href.indexOf("=") != -1) {
      const url = new URL(window.location.href);
      var hash = url.searchParams.get("code");
      // const hash = url.split('=')[1];
      // console.log(hash);
      // let auth_data = qs.stringify({
      //   "client_id": "bcnfpt",
      //   "client_secret": "wyzL_rjzqDK8124A7KpyFlIBXmxzc-7A9VawyEka",
      //   "grant_type": "authorization_code",
      //   "code": hash,
      //   "redirect_uri": 'http://localhost:3000/oauth/redirect'
      // });
      // const config = {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   }
      // };

      client.post('/api/login', {
        hash
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.message === "OK") {
            window.localStorage.setItem("id_token", response.data.id_token);
            window.localStorage.setItem("access_token", response.data.id_token);
            const token = response.data.id_token;
            const decoded = jwtDecode(token);
            const email = decoded.upn;
            for (let item of emailList) {
              if (email.toLowerCase() === item.label.toLowerCase()) {
                window.localStorage.setItem("role", 2);// 2 is examiner
                window.localStorage.setItem("cttv", item.value);
              }
            }
            for (let item of specialEmail) {
              if (email.toLowerCase() === item.label.toLowerCase()) {
                window.localStorage.setItem("role", 0);// 2 is boss
                window.localStorage.setItem("cttv", item.value);
              }
            }
            window.location.href = "/project/view";
          } else {
            this.toggleDanger();
          }
        })
        .catch((error) => {
          this.toggleDanger();
        });


      // client.post('https://cors-anywhere.herokuapp.com/https://adfs.fpt.com.vn/adfs/oauth2/token', auth_data,
      //   config)
      //   .then((response) => {
      //       this.hideLoader();
      //       window.localStorage.setItem("id_token", response.data.id_token);
      //       window.localStorage.setItem("access_token", response.data.id_token);
      //       const token = response.data.id_token;
      //       const decoded = jwtDecode(token);
      //       const email = decoded.upn;
      //       for (let item of emailList) {
      //         if (email.toLowerCase() === item.label.toLowerCase()) {
      //           window.localStorage.setItem("role", 2);// 2 is examiner
      //           window.localStorage.setItem("cttv", item.value);
      //         }
      //       }
      //       window.location.href = "/project/view";
      //     }
      //   )
      //   .catch((error) => {
      //     this.hideLoader();
      //     console.log(error)
      //   });
      // this.props.history.push("/login");
    } else {
      this.toggleDanger();
    }
    /*
    const query = queryString.parse(this.props.location.search);
    if (query.token) {
      window.localStorage.setItem("access_token", query.token);
      this.props.history.push("/#/dashboard");
    }
    */
  }
}

export default Token;
