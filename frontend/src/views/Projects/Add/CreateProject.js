import React, {Component} from "react";
import {
  Card, CardHeader, CardFooter,
  Input,
  CardTitle,
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter, CardBody, Label, FormFeedback, FormGroup, Form
} from "reactstrap";
import Select from 'react-select';
import styles from '../../Report/Report.css';
import DateTimePicker from 'react-datetime-picker';
import 'rc-pagination/assets/index.css';
import {ID_TOKEN} from "../../../constants/ActionTypes";
import {getStyle} from "@coreui/coreui/dist/js/coreui-utilities";
import client from '../../../api';

// const TOKEN = 'access_token';
// const jwtDecode = require('jwt-decode');
// const token = localStorage.getItem(TOKEN);
// const decoded = jwtDecode(token);
const brandSuccess = getStyle('--success')
const brandDanger = getStyle('--danger')
const Loader = () => <div className={styles.loader}></div>;

const MAX_ROW = 9;

let text = "";

function getTotalPage(totalLength) {
  return Math.floor((totalLength - 1) / MAX_ROW) + 1;
}

function formatDate(string) {
  var options = {year: 'numeric', month: 'numeric', day: 'numeric'};
  return new Date(string).toLocaleDateString([], options);
}

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_visible: true,
      loading: false,
      id: "",
      name: "",
      cttv: 1,
      unit: "",
      department: "",
      author: "",
      author_name: "",
      author_phone: "",
      author_email: "",
      apply_date: null,
      status_before: "",
      aim: "",
      content: "",
      effective: "",
      new: "",
      creative: "",
      next_step: "",
      security_info: "",
      conditions: "",
      dataTable: [],
      file_save: [],
      additionalData: "",
      examiner: "",
      status: 0,
      economy_effective: null,
      effective_guess: "",
      bonus_type: "",
      bonus_value: "",
      status_name: "",
      cttv_name: "",
      is_ikhien: 0,
      is_hidden: true,
      created_date: Date.now(),
      updated_date: Date.now(),
      companyOption: {value: 1, label: 'FSOFT'},
      companyOptions: [
        {value: 1, label: 'FSOFT'},
        {value: 2, label: 'FIS'},
        {value: 3, label: 'FTEL'},
        {value: 4, label: 'FTG'},
        {value: 5, label: 'FRT'},
        {value: 6, label: 'FO'},
        {value: 7, label: 'FE'},
        {value: 8, label: 'FHO'},
      ],
      effectiveOption: {value: 1, label: 'Ng???n h???n'},
      effectiveOptions: [
        {value: 1, label: 'Ng???n h???n'},
        {value: 2, label: 'D??i h???n'},
      ],
      modal: false,
      wordEdit: "",
      selectedKey: "",
      selectedEditType: "",
      image_full: "",

      //modal error
      modalError: false,
      modalErrorText: "",
      is_read: false,
      imgCollection: ''
    };
    this.toggle = this.toggle.bind(this);
    this.toggleDanger = this.toggleDanger.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmitFile = this.onSubmitFile.bind(this);
  }

  onSubmitFile(e) {
    e.preventDefault()

    var formData = new FormData();
    for (const key of Object.keys(this.state.imgCollection)) {
      formData.append('imgCollection', this.state.imgCollection[key])
    }
    let list_file = this.state.dataTable;
    let list_file_save = this.state.file_save;
    client.post("/api/uploadFile", formData, {}).then(res => {
      if (res.data && res.data.data[0]) {
        var pieces = res.data.data[0].split('-');
        list_file_save.push(res.data.data[0]);
        list_file.push({name: pieces[pieces.length - 1], link: res.data.data[0]});
        this.setState({dataTable: list_file, file_save: list_file_save});
      }
    })
  }


  toggleDanger() {
    this.setState({
      danger: !this.state.danger
    });
  }

  hideLoader = () => {
    this.setState({loading: false});
  };

  showLoader = () => {
    this.setState({loading: true});
  };

  onDelete = (e, id) => {
    e.preventDefault();
    let list_file = this.state.dataTable;
    let list_file_save = this.state.file_save;
    let count = 0;
    let count_1 = 0;
    for (let item of list_file) {
      if (item.link === id) {
        list_file.splice(count, 1);
        // console.log(count)
      }
      count += 1;
    }

    for (let item of list_file_save) {
      if (item === id) {
        list_file_save.splice(count_1, 1);
        // console.log(count)
      }
      count_1 += 1;
    }
    this.setState({dataTable: list_file, file_save: list_file_save});
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.setState({is_read: true});
      client.get('/api/projectManagement/' + this.props.match.params.id)
        .then((response) => {

            for (let item of this.state.companyOptions) {
              if (response.data.cttv == item.value.toString()) {
                this.setState({
                  companyOption: item
                });
              }
            }
            let list_file = this.state.dataTable;
            // console.log(response.data.file)
            for (let item of response.data.file) {
              var pieces = item.split('-');
              list_file.push({name: pieces[pieces.length - 1], link: item});
            }
            this.setState({dataTable: list_file});

            for (let item of this.state.effectiveOptions) {
              if (response.data.economy_effective == item.value.toString()) {
                this.setState({
                  effectiveOption: item
                });
              }
            }

            if (response.data.status === 2 || response.data.status === 3) {
              this.setState({is_hidden: false})
            }
            this.setState(
              {
                id: response.data.id,
                name: response.data.name,
                cttv: response.data.cttv,
                unit: response.data.unit,
                department: response.data.department,
                author: response.data.author,
                author_name: response.data.author_name,
                author_phone: response.data.author_phone,
                author_email: response.data.author_email,
                apply_date: new Date(response.data.apply_date),
                status_before: response.data.status_before,
                aim: response.data.aim,
                content: response.data.content,
                effective: response.data.effective,
                new: response.data.new,
                creative: response.data.creative,
                next_step: response.data.next_step,
                security_info: response.data.security_info,
                conditions: response.data.conditions,
                file_save: response.data.file,
                additionalData: response.data.additionalData,
                examiner: response.data.examiner,
                status: response.data.status,
                economy_effective: response.data.economy_effective,
                effective_guess: response.data.effective_guess,
                bonus_type: response.data.bonus_type,
                bonus_value: response.data.bonus_value,
                is_ikhien: response.data.is_ikhien,
                created_date: response.data.created_date,
                updated_date: response.data.updated_date,
              }
            )

          }
        )
        .catch((error) => {
          alert(error);
        });
    }
  }

  onFileChange(e) {
    this.setState({imgCollection: e.target.files})
  }

  onSubmitDraft = e => {
    if (this.props.match.params.id) {
      //console.log(this.state.apply_date);
      this.showLoader();
      client.put('/api/projectManagement/' + this.props.match.params.id, {
        //id: this.state.id,
        name: this.state.name,
        cttv: this.state.companyOption.value,
        unit: this.state.unit,
        department: this.state.department,
        author: this.state.author,
        author_name: this.state.author_name,
        author_phone: this.state.author_phone,
        author_email: this.state.author_email,
        apply_date: this.state.apply_date,
        status_before: this.state.status_before,
        aim: this.state.aim,
        content: this.state.content,
        effective: this.state.effective,
        new: this.state.new,
        creative: this.state.creative,
        next_step: this.state.next_step,
        security_info: this.state.security_info,
        conditions: this.state.conditions,
        file: this.state.file_save,
        additionalData: this.state.additionalData,
        examiner: this.state.examiner,
        status: this.state.status,
        economy_effective: this.state.economy_effective,
        effective_guess: this.state.effective_guess,
        bonus_type: this.state.bonus_type,
        bonus_value: this.state.bonus_value,
        is_ikhien: this.state.is_ikhien,
        cttv_name: this.state.companyOption.label,
        updated_date: Date.now(),
      })
        .then((response) => {
          this.hideLoader();
          if (response.data.message === "OK") {
            this.toggle()
          } else {
            this.hideLoader();
            alert('T??n s??ng ki???n b??? tr??ng!!!')
          }
        })
        .catch((error) => {
          this.hideLoader();
          alert(error)
        });
    } else {
      this.showLoader();
      client.post('/api/projectManagement', {
        //id: this.state.id,
        name: this.state.name,
        cttv: this.state.companyOption.value,
        unit: this.state.unit,
        department: this.state.department,
        author: this.state.author,
        author_name: this.state.author_name,
        author_phone: this.state.author_phone,
        author_email: this.state.author_email,
        apply_date: this.state.apply_date,
        status_before: this.state.status_before,
        aim: this.state.aim,
        content: this.state.content,
        effective: this.state.effective,
        new: this.state.new,
        creative: this.state.creative,
        next_step: this.state.next_step,
        security_info: this.state.security_info,
        conditions: this.state.conditions,
        file: this.state.file_save,
        additionalData: this.state.additionalData,
        examiner: this.state.examiner,
        status: 10,// draft
        economy_effective: this.state.economy_effective,
        effective_guess: this.state.effective_guess,
        bonus_type: this.state.bonus_type,
        bonus_value: this.state.bonus_value,
        is_ikhien: this.state.is_ikhien,
        status_name: "B???n nh??p",
        cttv_name: this.state.companyOption.label,
        created_date: Date.now(),
        updated_date: Date.now(),
      })
        .then((response) => {
          this.hideLoader();
          if (response.data.message === "OK") {
            this.setState({is_visible: false});
            window.location.href = "/";
          } else {
            this.hideLoader();
            alert('T??n s??ng ki???n ???? b??? tr??ng!!!')
          }
        })
        .catch((error) => {
          this.hideLoader();
          console.log(error);
        });
    }
  };

  onSubmit = e => {
    let formValid = false;
    if (this.state.name && this.state.unit && this.state.department && this.state.author && this.state.author_name && this.state.author_phone && this.state.author_email &&
      this.state.status_before && this.state.aim && this.state.content && this.state.effective && this.state.new && this.state.creative && this.state.is_read && this.state.security_info && this.state.conditions) {
      formValid = true
    }
    if (formValid) {
      if (this.props.match.params.id) {
        let status, status_name;
        if (this.state.status === 10) {
          status = 0;
          status_name = 'Ch??? s?? lo???i c???p CTTV'
          this.setState({status: 0})
        } else {
          status = this.state.status;
          status_name = this.state.status_name;
        }
        //console.log(this.state.apply_date);
        this.showLoader();
        client.put('/api/projectManagement/' + this.props.match.params.id, {
          //id: this.state.id,
          name: this.state.name,
          cttv: this.state.companyOption.value,
          unit: this.state.unit,
          department: this.state.department,
          author: this.state.author,
          author_name: this.state.author_name,
          author_phone: this.state.author_phone,
          author_email: this.state.author_email,
          apply_date: this.state.apply_date,
          status_before: this.state.status_before,
          aim: this.state.aim,
          content: this.state.content,
          effective: this.state.effective,
          new: this.state.new,
          creative: this.state.creative,
          next_step: this.state.next_step,
          security_info: this.state.security_info,
          conditions: this.state.conditions,
          file: this.state.file_save,
          additionalData: this.state.additionalData,
          examiner: this.state.examiner,
          status: status,
          status_name: status_name,
          economy_effective: this.state.economy_effective,
          effective_guess: this.state.effective_guess,
          bonus_type: this.state.bonus_type,
          bonus_value: this.state.bonus_value,
          is_ikhien: this.state.is_ikhien,
          cttv_name: this.state.companyOption.label,
          updated_date: Date.now(),
        })
          .then((response) => {
            this.hideLoader();
            if (response.data.message === "OK") {
              this.setState({is_visible: false});
              this.toggle()
            } else {
              this.hideLoader();
              alert('T??n s??ng ki???n b???n ch???n ???? ???????c ????ng k?? tr?????c. Vui l??ng ?????i t??n kh??c!')
            }
          })
          .catch((error) => {
            this.hideLoader();
            alert(error)
          });
      } else {
        this.showLoader();
        client.post('/api/projectManagement', {
          //id: this.state.id,
          name: this.state.name,
          cttv: this.state.companyOption.value,
          unit: this.state.unit,
          department: this.state.department,
          author: this.state.author,
          author_name: this.state.author_name,
          author_phone: this.state.author_phone,
          author_email: this.state.author_email,
          apply_date: this.state.apply_date,
          status_before: this.state.status_before,
          aim: this.state.aim,
          content: this.state.content,
          effective: this.state.effective,
          new: this.state.new,
          creative: this.state.creative,
          next_step: this.state.next_step,
          security_info: this.state.security_info,
          conditions: this.state.conditions,
          file: this.state.file_save,
          additionalData: this.state.additionalData,
          examiner: this.state.examiner,
          status: 0,
          economy_effective: this.state.economy_effective,
          effective_guess: this.state.effective_guess,
          bonus_type: this.state.bonus_type,
          bonus_value: this.state.bonus_value,
          is_ikhien: this.state.is_ikhien,
          status_name: "Ch??? s?? lo???i c???p CTTV",
          cttv_name: this.state.companyOption.label,
          created_date: Date.now(),
          updated_date: Date.now(),
        })
          .then((response) => {
            this.hideLoader();
            if (response.data.message === "OK") {
              this.setState({is_visible: false});
              this.toggle();
            } else {
              this.hideLoader();
              alert('T??n s??ng ki???n b???n ch???n ???? ???????c ????ng k?? tr?????c. Vui l??ng ?????i t??n kh??c!')
            }
          })
          .catch((error) => {
            this.hideLoader();
            console.log(error);
          });
      }
    } else {
      //this.hideLoader();
      this.toggleDanger();
    }


  };


  onSubmitRequest = e => {
    this.showLoader();
    client.put('/api/projectManagement/' + this.props.match.params.id, {
      additionalData: this.state.additionalData,
      status: 1,
      status_name: "C???n c???p nh???t ????ng k??",
      updated_date: Date.now(),
    })
      .then((response) => {
        this.hideLoader();
        if (response.data.message === "OK") {
          this.toggle()
        } else {
          this.hideLoader();
          alert('C?? l???i x???y ra!!!')
        }
      })
      .catch((error) => {
        alert(error);
        this.hideLoader();
        alert(error)
      });
  };

  onSubmitBonus = e => {
    this.showLoader();
    let formValid = false;
    if (this.state.effective_guess && this.state.examiner && this.state.bonus_type && this.state.bonus_value) {
      formValid = true
    }
    if (formValid) {
      client.put('/api/projectManagement/' + this.props.match.params.id, {
        effective_guess: this.state.effective_guess,
        examiner: this.state.examiner,
        bonus_type: this.state.bonus_type,
        bonus_value: this.state.bonus_value,
        economy_effective: this.state.effectiveOption.value,
        status: 3,
        status_name: "???? c?? k???t qu???",
        updated_date: Date.now(),
      })
        .then((response) => {
          this.hideLoader();
          if (response.data.message === "OK") {
            this.toggle()
          } else {
            this.hideLoader();
            alert('C?? l???i x???y ra!!!')
          }
        })
        .catch((error) => {
          this.hideLoader();
          alert(error)
        });
    } else {
      this.hideLoader();
      this.toggleDanger();
    }

  };

  onSubmitOK = e => {
    this.showLoader();
    client.put('/api/projectManagement/' + this.props.match.params.id, {
      status: 2,
      status_name: "Ch??? duy???t c???p CTTV",
      updated_date: Date.now(),
    })
      .then((response) => {
        this.hideLoader();
        if (response.data.message === "OK") {
          window.location.reload()
        } else {
          this.hideLoader();
          alert('C?? l???i x???y ra!!!')
        }
      })
      .catch((error) => {
        alert(error);
        this.hideLoader();
        alert(error)
      });
  };

  getData(page) {
    client.get('/api/profileManagement', {
      params: {
        max_row: MAX_ROW,
        page: page
      }
    }).then((response) => {
      const profile = this.state.profile;
      // console.log(response.data.data)
      profile.dataTable = response.data.data;
      profile.totalPage = getTotalPage(response.data.count);
      profile.count_pos = response.data.count_pos;
      profile.count_neg = response.data.count_neg;
      this.setState({profile},
        () => {
          this.state.profile.dataTable.map((data, i) => {
            fetch(data.image_path_face, {
              method: 'GET',
              headers: {
                'id_token': ID_TOKEN,
              },
            })
              .then((response) => {
                response.blob()
                  .then((img) => {
                    let base64data;
                    const fileReaderInstance = new FileReader();
                    fileReaderInstance.readAsDataURL(img);
                    fileReaderInstance.onload = () => {
                      base64data = fileReaderInstance.result;
                      let profile = {...this.state.profile};
                      profile.dataTable[i].image_path_face = base64data;
                      this.setState({profile});
                    };
                  });
              })
            ;
          });
        });
    }).catch((error) => {
      alert(error);
    });
  }


  toggle = (e, key, type) => {
    this.setState({selectedEditType: type});
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    this.setState({selectedKey: key});
  };

  toggleError = (e, src) => {
    this.setState(prevState => ({
      modalError: !prevState.modalError,
      image_full: src
    }));
  };

  onChangeEdit = changeEvent => {
    const wordEdit = changeEvent.target.value;
    this.setState({wordEdit});
  };

  onClick = (e, data_id) => {
    e.preventDefault();
    this.props.history.push("/project/edit/" + data_id);

  };

  getTableRow(index, data, type) {
    let id_id = "", id_prob = "", name = "", dob = "", home = "", home_prob = "", address = "", address_prob = "",
      type_id = "",
      updated_time = "";
    let id_label = "", home_label = "", address_label = "", type_label = "";
    if (data.document_type && data.document_type === 1) {
      id_label = "S??? GPLX";
      home_label = "Qu???c T???ch";
      address_label = "N??i C?? Tr??";
      type_label = "Lo???i";
      if (data.id) {
        id_id = data.id;
        id_prob = data.id_prob;
      }
      if (data.nation) {
        home = data.nation;
        home_prob = data.nation_prob;
      }
      if (data.address) {
        address = data.address;
        address_prob = data.address_prob
      }

      if (data.type) {
        type_id = data.type;
      }
    } else if (data.document_type && data.document_type === 2) {
      id_label = "S??? H??? Chi???u";
      home_label = "N??i Sinh";
      address_label = "Ng??y C???p";
      type_label = "C?? gi?? tr??? ?????n";
      if (data.passport_number) {
        id_id = data.passport_number;
        id_prob = data.passport_number_prob;
      }
      if (data.pob) {
        home = data.pob;
        home_prob = data.pob_prob;
      }
      if (data.doi) {
        address = data.doi;
        address_prob = data.doi_prob
      }
      if (data.doe) {
        type_id = data.doe;
      }
    } else {
      id_label = "S??? CMT";
      home_label = "Nguy??n Qu??n";
      address_label = "H??? Kh???u";
      type_label = "Lo???i";
      if (data.id) {
        id_id = data.id;
        id_prob = data.id_prob;
      }
      if (data.home) {
        home = data.home;
        home_prob = data.home_prob;
      }
      if (data.address) {
        address = data.address;
        address_prob = data.address_prob
      }
      if (data.type) {
        type_id = data.type;
      }
    }

    if (data.name) {
      name = data.name;
    }
    if (data.dob) {
      dob = data.dob;
    }

    if (data.updated_time) {
      updated_time = formatDate(data.updated_time);
    }


    if (data.similarity && data.similarity >= 80) {
      return (
        <Col key={data._id} xs="12" md="6" sm="6" lg="4">
          <Card className={styles.cardStylePositive}>
            <CardHeader className={styles.headerStyle}>
              <span style={{color: brandSuccess}}>Score: {data.similarity.toString().substring(0, 5)}</span>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="3">
                  <img src={data.image_path_face} className={styles.imageStyle}
                       onClick={(e) => this.toggleError(e, data.image_path_face)}
                       alt="N/A"/>
                </Col>
                <Col>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>{id_label}</span></Col>
                    <Col lg="7"><span>{id_id}</span></Col>
                    {((id_prob && id_prob < 80) || (!id_prob)) &&
                    <Col lg="1"> <i className="icon-close icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>H??? V?? T??n</span></Col>
                    <Col lg="7"><span>{name}</span></Col>
                    {((data.name_prob && data.name_prob < 80) || (!data.name_prob)) &&
                    <Col lg="1"> <i className="icon-close icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>Ng??y Sinh</span></Col>
                    <Col lg="7"><span>{dob}</span></Col>
                    {((data.dob_prob && data.dob_prob < 80) || (!data.dob_prob)) &&
                    <Col lg="1"> <i className="icon-close icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>{home_label}</span></Col>
                    <Col lg="7"><span>{home}</span></Col>
                    {((home_prob && home_prob < 80) || (!home_prob)) &&
                    <Col lg="1"> <i className="cui-delete icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>{address_label}</span></Col>
                    <Col lg="7"><span>{address}</span></Col>
                    {((address_prob && address_prob < 80) || (!address_prob)) &&
                    <Col lg="1"> <i className="icon-close icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>{type_label}</span></Col>
                    <Col lg="7"><span>{type_id.toUpperCase()}</span></Col>
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>Ng??y C???p Nh???t</span></Col>
                    <Col lg="7"><span>{updated_time}</span></Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
            <CardFooter><span style={{color: brandSuccess}}><i
              className="fa fa-smile-o"></i> Success</span>
              <button className="btn btn-primary float-right" type="submit" onClick={(e) => this.onClick(e, data._id)}>
                Edit
              </button>
            </CardFooter>
          </Card>
        </Col>)

    } else {
      return (
        <Col key={data._id} xs="12" md="6" sm="6" lg="4">
          <Card className={styles.cardStyleNegative}>
            <CardHeader className={styles.headerStyle}>
              <span
                style={{color: brandDanger}}>Score: {data.similarity ? data.similarity.toString().substring(0, 5) : data.similarity}</span>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="3">
                  <img src={data.image_path_face} className={styles.imageStyle}
                       onClick={(e) => this.toggleError(e, data.image_path_face)}
                       alt="N/A"/>
                </Col>
                <Col>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>{id_label}</span></Col>
                    <Col lg="7"><span>{id_id}</span></Col>
                    {((id_prob && id_prob < 80) || (!id_prob)) &&
                    <Col lg="1"> <i className="icon-close icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>H??? V?? T??n</span></Col>
                    <Col lg="7"><span>{name}</span></Col>
                    {((data.name_prob && data.name_prob < 80) || (!data.name_prob)) &&
                    <Col lg="1"> <i className="icon-close icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>Ng??y Sinh</span></Col>
                    <Col lg="7"><span>{dob}</span></Col>
                    {((data.dob_prob && data.dob_prob < 80) || (!data.dob_prob)) &&
                    <Col lg="1"> <i className="icon-close icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>{home_label}</span></Col>
                    <Col lg="7"><span>{home}</span></Col>
                    {((home_prob && home_prob < 80) || (!home_prob)) &&
                    <Col lg="1"> <i className="cui-delete icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>{address_label}</span></Col>
                    <Col lg="7"><span>{address}</span></Col>
                    {((address_prob && address_prob < 80) || (!address_prob)) &&
                    <Col lg="1"> <i className="icon-close icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>{type_label}</span></Col>
                    <Col lg="7"><span>{type_id.toUpperCase()}</span></Col>
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>Ng??y C???p Nh???t</span></Col>
                    <Col lg="7"><span>{updated_time}</span></Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
            <CardFooter><span style={{color: brandDanger}}><i
              className="fa fa-frown-o"></i> Fail</span>
              <button className="btn btn-primary float-right" type="submit" onClick={(e) => this.onClick(e, data._id)}>
                Edit
              </button>
            </CardFooter>
          </Card>
        </Col>)
    }

  }

  editSelectedRow = (e, key, type) => {
    let word = this.state.wordEdit;
    if (word) {
      this.handleEditRow(type, word, key);
      this.toggle();
    } else {
      let modalErrorText = "B???n v???n c??n tr?????ng ch??a ??i???n th??ng tin!";
      this.setState({modalErrorText});
      this.toggleError();
    }
  };

  // handleEditRow = (type, word, id) => {
  //   axios.put(API_URL + '/api/' + type + 'Management/' + id, {
  //     name: word.trim(),
  //     user_id: user_id,
  //   }).then((response) => {
  //     this.setState({wordEdit: ""});
  //     if (response.data.message === "BAD") {
  //       let modalErrorText = "Tr??ng l???p th??ng tin!";
  //       this.setState({modalErrorText});
  //       this.toggleError();
  //     } else {
  //       window.location.reload();
  //     }
  //   })
  //     .catch((error) => alert(error));
  // };

  deleteSelectedRow = (e, key, type) => {
    this.handleDeleteRow(type, key);
  };

  // handleDeleteRow = (type, id) => {
  //   axios.delete(API_URL + '/api/' + type + 'Management/' + id, {
  //     params: {
  //       user_id: user_id
  //     }
  //   })
  //     .then((response) => {
  //       window.location.reload();
  //     }).catch((error) => alert(error));
  // };

  onChangeKeyword = (changeEvent, type) => {
    if (type === "email") {
      const email = this.state.profile;
      email.keyword = changeEvent.target.value;
      this.setState({email});
    } else if (type === "phone") {
      const phone = this.state.phone;
      phone.keyword = changeEvent.target.value;
      this.setState({phone});
    }

  };

  onChangeSearch = (changeEvent, type) => {
    const searchWord = changeEvent.target.value.toString();
    const tmp = this.state[type];
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
    tmp.totalPage = Math.floor(tmp.dataTable.length / MAX_ROW) + 1;
    tmp.currentPage = 1;
    this.setState({type: tmp});
  };

  filterItemsInPage = (data) => {
    // this.getData();
    // console.log(data
    //   .filter((data, index) => (index < (this.state.currentPage * MAX_ROW)) && (index >= (this.state.currentPage * MAX_ROW) - MAX_ROW)));
    return data
      .map((data, index) => this.getTableRow(index, data))
  };


  filterItems = (query, data) => {
    switch (this.state.searchOption.value) {
      case 1:
        return data.filter((el) =>
          el.id && el.id.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
        );
      case 2:
        return data.filter((el) =>
          el.name && el.name.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
        );
      case 3:
        return data.filter((el) =>
          el.creator_ip && el.creator_ip.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
        );
      case 4:
        return data.filter((el) =>
          el.creator_hostname && el.creator_hostname.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
        );
      case 6:
        return data.filter((el) =>
          el.upload_id && el.upload_id.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
        );
      case 5:
        return data.filter((el) =>
          el.upload_name && el.upload_name.toString().toLowerCase().indexOf(query.toLowerCase()) > -1
        );
      default :
        return null;
    }

  };


  addKeyword = keywordSubmit => {
    keywordSubmit.preventDefault();
    const type = keywordSubmit.target.id;
    let formValid = false;
    const tmp = this.state[type];
    const keyword = tmp.keyword;
    if (keyword) {
      if (typeof keyword !== "undefined") {
        let lastAtPos = keyword.lastIndexOf('@');
        let lastDotPos = keyword.lastIndexOf('.');

        if ((lastAtPos < lastDotPos && lastAtPos > 0 && keyword.indexOf('@@') == -1 && lastDotPos > 2 && (keyword.length - lastDotPos) > 2)) {
          formValid = true;
        }
      }
    }
    if (formValid) {
      this.handleFormAddKeyword(type, keyword);
    } else {
      let modalErrorText = "Email kh??ng h???p l???!";
      this.setState({modalErrorText});
      this.toggleError();
    }
  };

  // handleFormAddKeyword = (type, keyword) => {
  //   axios.post(API_URL + '/api/' + type + 'Management', {
  //     name: keyword.trim(),
  //     user_id: user_id,
  //   }).then(response => {
  //     if (response.data.message === "BAD") {
  //       let modalErrorText = "Tr??ng l???p th??ng tin!";
  //       this.setState({modalErrorText});
  //       this.toggleError();
  //     } else {
  //       window.location.reload();
  //     }
  //   }).catch(error => {
  //     alert(error);
  //   })
  // };

  handlePageClick = (pageClick, type) => {
    const tmp = this.state[type];
    tmp["currentPage"] = pageClick;
    this.getData(pageClick);
    this.setState({type: tmp});
  };

  switchView = (type) => {
    if (this.state[type].view === "search") {
      return (
        this.filterItemsInPage(this.state[type].searchTable)
      )
    } else {
      return (
        this.filterItemsInPage(this.state[type].dataTable)
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
      let modalErrorText = "B???n v???n c??n tr?????ng ch??a ??i???n th??ng tin!";
      this.setState({modalErrorText});
      this.toggleError();
    }
  };


  handleSelectedFile = (event, type) => {
    let tmp = this.state[type];
    tmp.selectedImportFile = event.target.files[0];
    tmp.selectedImportFileName = event.target.files[0].name;
    this.setState({type: tmp});
    // this.setState({selectedImportFile: event.target.files[0], selectedImportFileName: event.target.files[0].name});
    let reader = new FileReader();
    reader.onload = function () {
      text = reader.result;
    };
    reader.readAsText(event.target.files[0]);
    event.target.value = "";
  };

  // sendEmail = () => {
  //   axios.post(API_URL + '/api/testSendMail/sendMail', {
  //     params: {
  //       user_id: user_id,
  //     },
  //   }).then(response => {
  //     // console.log(response);
  //   }).catch(error => {
  //     alert(error);
  //   })
  // };

  onChangeSearchOption = (selectedOption) => {
    this.setState({
      companyOption: selectedOption
    });
  };

  onChangeEffectiveOption = (selectedOption) => {
    this.setState({
      effectiveOption: selectedOption
    });
  };

  onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  handleCheckbox1Change = (e) => {
    this.setState({is_read: !this.state.is_read})
  };


  onChangeDate = (apply_date) => {
    // console.log(apply_date);
    this.setState({apply_date})
  };

  back = e => {
    e.preventDefault();
    this.props.history.push('/project/view');
  };


  render() {
    return (
      <div className="animated fadeIn">
        {(this.state.loading) ? <Loader/> :
          <Row>
            <Col sm={12} xs={12} md={12} lg={12} hidden={this.state.is_hidden}>
              <div className="card">
                <div className="card-header">
                  <CardTitle>Duy???t C???p CTTV</CardTitle>
                </div>
                <CardBody>
                  <Form className="was-validated">
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Gi??m kh???o</Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="text" className="form-control-warning" name="examiner"
                               value={this.state.examiner}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Label>Hi???u qu??? kinh t???</Label>
                      </Col>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Select class="custom-select is-invalid"
                                name="effectiveOption"
                                value={this.state.effectiveOption}
                                options={this.state.effectiveOptions}
                                onChange={this.onChangeEffectiveOption}
                                required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Label>?????c t??nh hi???u qu???</Label>
                      </Col>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Input type="text" className="form-control-warning" name="effective_guess"
                               value={this.state.effective_guess}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Label>H??nh th???c th?????ng</Label>
                      </Col>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Input type="text" className="form-control-warning" name="bonus_type"
                               value={this.state.bonus_type}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Label>Gi?? tr??? c???p th?????ng</Label><span className="text-danger font-italic"> (Nh???p 0 n???u s??ng ki???n kh??ng ???????c duy???t)</span>
                      </Col>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Input type="text" className="form-control-warning" name="bonus_value"
                               value={this.state.bonus_value}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <p className="text-center">
                      <Button className="btn btn-success mt-3" type="submit"
                              onClick={(e) => this.onSubmitBonus(e)}
                              style={{marginRight: 10}}>
                        Ph?? Duy???t
                      </Button>
                    </p>
                  </Form>

                </CardBody>
              </div>
            </Col>
            <Col sm={12} xs={12} md={12} lg={12}>
              <div className="card">
                <div className="card-header">
                  <CardTitle>????ng k??/C???p nh???t s??ng ki???n</CardTitle>
                </div>
                <CardBody>
                  <Form className="was-validated">
                    {(this.state.id) &&
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>M?? ????ng k??</Label>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Label>{this.state.id}</Label>
                      </Col>
                    </FormGroup>
                    }
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>T??n s??ng ki???n</Label>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Input type="text" className="form-control-warning" name="name"
                               value={this.state.name}
                               onChange={this.onChange}
                               placeholder="t??n g???i m?? t??? ng???n g???n s??ng ki???n"
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>C??ng ty th??nh vi??n</Label><span className="text-danger font-italic"> (ch???n ????ng c??ng ty th??nh vi??n c???a b???n)</span>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Select class="custom-select is-invalid"
                                name="searchOption"
                                value={this.state.companyOption}
                                options={this.state.companyOptions}
                                onChange={this.onChangeSearchOption}
                                required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>????n v???</Label>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Input type="text" className="form-control-warning" name="unit"
                               value={this.state.unit}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>Ph??ng </Label>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Input type="text" className="form-control-warning" name="department"
                               value={this.state.department}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>T??c gi???/ Nh??m t??c gi??? </Label>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Input type="text" className="form-control-warning" name="author"
                               value={this.state.author}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <br/>
                    <Row>
                      <Col>
                        <Label className="font-weight-bold">Li??n h???:</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup row>
                          <Col lg={12} md={12} xs={12} sm={12}>
                            <Label>T??n</Label>
                          </Col>
                          <Col lg={12} md={12} xs={12} sm={12}>
                            <Input type="text" className="form-control-warning" name="author_name"
                                   value={this.state.author_name}
                                   onChange={this.onChange}
                                   required/>
                            <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                            <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup row>
                          <Col lg={12} md={12} xs={12} sm={12}>
                            <Label>S??T</Label>
                          </Col>
                          <Col lg={12} md={12} xs={12} sm={12}>
                            <Input type="text" className="form-control-warning" name="author_phone"
                                   value={this.state.author_phone}
                                   onChange={this.onChange}
                                   required/>
                            <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                            <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup row>
                          <Col lg={12} md={12} xs={12} sm={12}>
                            <Label>Email</Label>
                          </Col>
                          <Col lg={12} md={12} xs={12} sm={12}>
                            <Input type="text" className="form-control-warning" name="author_email"
                                   value={this.state.author_email}
                                   onChange={this.onChange}
                                   required/>
                            <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                            <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                          </Col>
                        </FormGroup>
                      </Col>

                    </Row>
                    <FormGroup row>
                      <Col lg={4} md={12} xs={12} sm={12}>
                        <Label>Th???i ??i???m ??p d???ng ???????c trong th???c t??? </Label>
                      </Col>
                      <Col lg={4} md={12} xs={12} sm={12}>
                        <DateTimePicker
                          onChange={this.onChangeDate}
                          value={this.state.apply_date}
                        />
                      </Col>
                      <Col lg={4} md={12} xs={12} sm={12}>
                        <Label className="font-italic text-danger">(L??u ??: ph???i trong 12 th??ng tr??? l???i ????y) </Label>
                      </Col>
                    </FormGroup>
                    <br/>
                    <h4>CHI TI???T V??? S??NG KI???N </h4>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>T??nh tr???ng tr?????c khi c?? s??ng ki???n </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea}
                               name="status_before"
                               value={this.state.status_before}
                               onChange={this.onChange}
                               placeholder={"N??u hi???n tr???ng tr?????c khi ??p d???ng gi???i ph??p m???i; ph??n t??ch ??u nh?????c ??i???m c???a gi???i ph??p c??"}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>M???c ????ch c???a gi???i ph??p </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea} name="aim"
                               value={this.state.aim}
                               onChange={this.onChange}
                               placeholder={"N??u v???n ????? c???n gi???i quy???t"}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>N???i dung gi???i ph??p ????? ngh??? c??ng nh???n l?? s??ng ki???n </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea} name="content"
                               value={this.state.content}
                               onChange={this.onChange}
                               placeholder={"N??u c??ch th???c th???c hi???n, c??c b?????c th???c hi???n c???a gi???i ph??p m???i m???t c??ch c??? th???, r?? r??ng c??ng nh?? c??c ??i???u ki???n c???n thi???t ????? ??p d???ng gi???i ph??p"}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <br/>
                    <h4>PH??N T??CH S??NG KI???N </h4>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>T??nh hi???u qu??? </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea} name="effective"
                               value={this.state.effective}
                               onChange={this.onChange}
                               placeholder={"- M?? t??? t??nh hi???u qu??? c???a s??ng ki???n: hi???u qu??? kinh t???, hi???u qu??? ho???t ?????ng v?? ph??n t??ch nh???n ?????nh c???a t??c gi??? v?? sao s??ng ki???n c?? hi???u qu??? n??y.\n" +
                               "- ????nh gi?? ph???m vi hi???u qu??? c???a s??ng ki???n (????n v???/ph??ng ban, CTTV, m???t ho???c nhi???u CTTV kh??c trong t???p ??o??n ho???c ngo??i t???p ??o??n).\n" +
                               "- ?????c t??nh s??? ti???n l??m l???i ???? thu ho???c quy ?????i ???????c theo ?? ki???n c???a t??c gi??? s??ng ki???n. N??u r?? ph????ng ph??p t??nh (L??u ??: C?? th??? t??i li???u ch???ng minh k??m theo).\n" +
                               "- ?? ki???n nh???n x??t c???a ?????i di???n b??? ph???n/????n v??? ???????c h?????ng l???i t??? s??ng ki???n ho???c c??n b??? nh??n vi??n tr???c ti???p s??? d???ng s??ng ki???n (n???u c??)."}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>T??nh m???i </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea} name="new"
                               value={this.state.new}
                               onChange={this.onChange}
                               placeholder={"- Ch??? ra t??nh m???i, s??? kh??c bi???t c???a gi???i ph??p m???i so v???i gi???i ph??p c??.\n" +
                               "- L???a ch???n m???c ????? t??nh m???i ph?? h???p v?? gi???i th??ch l?? do."}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>T??nh s??ng t???o </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea} name="creative"
                               value={this.state.creative}
                               onChange={this.onChange}
                               placeholder={"- Gi???i th??ch c??? th??? v??? qu?? tr??nh nghi??n c???u, s??ng t???o ????? h??nh th??nh s??ng ki???n.\n" +
                               "- L???a ch???n m???c ????? s??ng t???o. \n" +
                               "- D???n chi???u c??c t??i li???u tham kh???o.\n" +
                               "- Th???i gian nghi??n c???u k??? t??? l??c c?? ?? t?????ng ?????n th???i ??i???m ph??t tri???n th??nh gi???i ph??p."}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <Row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>D??? ?????nh ti???p theo (kh??ng b???t bu???c) </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="text" name="next_step"
                               value={this.state.next_step}
                               onChange={this.onChange}
                        />
                      </Col>
                    </Row>
                    <br/>
                    <h4>TH??NG TIN KH??C </h4>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>C??c th??ng tin c???n ???????c b???o m???t</Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="text" className="form-control-warning" name="security_info"
                               value={this.state.security_info}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>C??c ??i???u ki???n c???n thi???t ????? ??p d???ng s??ng ki???n </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="text" className="form-control-warning" name="conditions"
                               value={this.state.conditions}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Ch??a c?? th??ng tin</FormFeedback>
                        <FormFeedback valid className="help-block">???? ??i???n th??ng tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>????nh k??m file th??ng tin v??? s??ng ki???n </Label>
                      </Col>
                      {(localStorage.getItem('role') !== '2') &&
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <input type="file" name="imgCollection" onChange={this.onFileChange}/>
                        <button className="btn btn-primary" onClick={this.onSubmitFile}>Upload</button>
                      </Col>}
                    </FormGroup>
                    {this.state.dataTable.map((listValue, index) => {
                      return (
                        <Row>
                          <Col>
                            <a href={listValue.link} key={listValue.link}>{listValue.name}</a>
                          </Col>
                          {(localStorage.getItem('role') !== '2') &&
                          <Col>
                            <Button className="btn-danger"
                                    onClick={(e) => this.onDelete(e, listValue.link)}>X??a</Button>
                          </Col>}
                          <br/></Row>
                      );
                    })}
                    <br/>
                  </Form>
                  {(!this.props.match.params.id && this.state.is_visible) &&
                  <Col className="">
                    <FormGroup check className="checkbox">
                      <Input className={"form-check-input " + styles.contentStyle} type="checkbox" id="checkbox1"
                             name="checkbox1"
                             onChange={this.handleCheckbox1Change}
                      />
                      <Label check className={"form-check-label text-success " + styles.contentStyle}
                             htmlFor="checkbox1"> Cam k???t:
                        <br/>
                        - ???? ?????c v?? hi???u r?? c??c y??u c???u, ti??u chu???n ????? ???????c c??ng nh???n l?? S??ng ki???n trong quy ?????nh v???
                        Ch??nh
                        s??ch
                        khuy???n kh??ch s??ng ki???n n???i b??? FPT.
                        <br/>
                        - Cung c???p c??c n???i dung trung th???c, ch??nh x??c trong b???n ????ng k?? n??y.
                        N???u c?? th??ng tin n??o kh??ng ch??nh x??c, t??i/ch??ng t??i xin ho??n to??n ch???u tr??ch nhi???m.</Label>
                    </FormGroup>
                  </Col>}
                  <br/>
                  {(localStorage.getItem('role') !== '2') &&
                  <p className="text-center">

                    {((!this.props.match.params.id && this.state.is_visible) || (this.state.status === 10)) ?
                      <div>
                        <Button className="btn btn-warning mt-3" type="submit" onClick={(e) => this.onSubmitDraft(e)}
                                style={{marginRight: 10}}>
                          L??u b???n nh??p
                        </Button>
                        <Button className="btn btn-success mt-3" type="submit" onClick={(e) => this.onSubmit(e)}
                                style={{marginRight: 10}}>
                          ????ng k?? S??ng ki???n
                        </Button>
                        <br/>
                        <br/>
                        <Label className="text-danger font-italic">* B???n nh??p l?? b???n kh??ng c???n ?????y ????? th??ng tin v?? s???
                          ch??a ???????c g???i ?????n ph?? duy???t</Label>
                      </div>
                      :
                      <Button className="btn btn-danger mt-3" onClick={(e) => this.onSubmit(e)}>C???p
                        nh???t th??ng tin</Button>}
                  </p>}
                  <br/>
                  {((this.state.additionalData) || localStorage.getItem("role") === "2" || localStorage.getItem("role") === "0") &&
                  <div>
                    < h4> Y??U C???U C???P NH???T/ B??? SUNG TH??NG TIN </h4>
                    <Row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea}
                               name="additionalData"
                               value={this.state.additionalData}
                               onChange={this.onChange}
                               placeholder={"N???i dung y??u c???u: \n" +
                               "Sau khi t??c gi??? c???p nh???t th??ng tin, t??c gi??? tr??? l???i n???i dung y??u c???u t???i ????y"}
                        />
                      </Col>
                    </Row>
                  </div>
                  }

                  <br/>
                  {((localStorage.getItem('role') === '2' && this.state.is_hidden === true) || (localStorage.getItem('role') === '0' && this.state.is_hidden === true)) &&
                  <p className="text-center">

                    <Button className="btn btn-success mt-3" type="submit" onClick={(e) => this.onSubmitRequest(e)}
                            style={{marginRight: 10}}>
                      Y??u c???u b??? sung th??ng tin
                    </Button>
                    {this.state.status !== 10 &&
                    <Button className="btn btn-danger mt-3" onClick={(e) => this.onSubmitOK(e)}>
                      S?? lo???i OK</Button>
                    }

                  </p>}
                </CardBody>
              </div>
            </Col>
          </Row>
        }


        <Modal isOpen={this.state.modal} toggle={this.toggle}
               className={'modal-success ' + this.props.className}>
          <ModalHeader toggle={this.toggle}>Th??ng b??o</ModalHeader>
          <ModalBody>
            C???p nh???t th??nh c??ng!!!
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.toggle}>??? l???i trang n??y</Button>
            <Button color="danger" onClick={(e) => this.back(e)}>V??? trang danh s??ch</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.danger} toggle={this.toggleDanger}
               className={'modal-warning ' + this.props.className}>
          <ModalHeader toggle={this.toggleDanger}>Th??ng B??o</ModalHeader>
          <ModalBody>
            H??y ??i???n ?????y ????? th??ng tin c???n thi???t v?? click v??o ?? cam k???t!
          </ModalBody>
          <ModalFooter className="text-center">
            <Button color="secondary" onClick={this.toggleDanger}>OK</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CreateProject;
