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
      effectiveOption: {value: 1, label: 'Ngắn hạn'},
      effectiveOptions: [
        {value: 1, label: 'Ngắn hạn'},
        {value: 2, label: 'Dài hạn'},
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
            alert('Tên sáng kiến bị trùng!!!')
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
        status_name: "Bản nháp",
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
            alert('Tên sáng kiến đã bị trùng!!!')
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
          status_name = 'Chờ sơ loại cấp CTTV'
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
              alert('Tên sáng kiến bạn chọn đã được đăng ký trước. Vui lòng đổi tên khác!')
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
          status_name: "Chờ sơ loại cấp CTTV",
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
              alert('Tên sáng kiến bạn chọn đã được đăng ký trước. Vui lòng đổi tên khác!')
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
      status_name: "Cần cập nhật đăng ký",
      updated_date: Date.now(),
    })
      .then((response) => {
        this.hideLoader();
        if (response.data.message === "OK") {
          this.toggle()
        } else {
          this.hideLoader();
          alert('Có lỗi xảy ra!!!')
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
        status_name: "Đã có kết quả",
        updated_date: Date.now(),
      })
        .then((response) => {
          this.hideLoader();
          if (response.data.message === "OK") {
            this.toggle()
          } else {
            this.hideLoader();
            alert('Có lỗi xảy ra!!!')
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
      status_name: "Chờ duyệt cấp CTTV",
      updated_date: Date.now(),
    })
      .then((response) => {
        this.hideLoader();
        if (response.data.message === "OK") {
          window.location.reload()
        } else {
          this.hideLoader();
          alert('Có lỗi xảy ra!!!')
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
      id_label = "Số GPLX";
      home_label = "Quốc Tịch";
      address_label = "Nơi Cư Trú";
      type_label = "Loại";
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
      id_label = "Số Hộ Chiếu";
      home_label = "Nơi Sinh";
      address_label = "Ngày Cấp";
      type_label = "Có giá trị đến";
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
      id_label = "Số CMT";
      home_label = "Nguyên Quán";
      address_label = "Hộ Khẩu";
      type_label = "Loại";
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
                    <Col lg="4"><span className={styles.labelStyle}>Họ Và Tên</span></Col>
                    <Col lg="7"><span>{name}</span></Col>
                    {((data.name_prob && data.name_prob < 80) || (!data.name_prob)) &&
                    <Col lg="1"> <i className="icon-close icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>Ngày Sinh</span></Col>
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
                    <Col lg="4"><span className={styles.labelStyle}>Ngày Cập Nhật</span></Col>
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
                    <Col lg="4"><span className={styles.labelStyle}>Họ Và Tên</span></Col>
                    <Col lg="7"><span>{name}</span></Col>
                    {((data.name_prob && data.name_prob < 80) || (!data.name_prob)) &&
                    <Col lg="1"> <i className="icon-close icons text-danger"></i></Col>
                    }
                  </Row>
                  <Row>
                    <Col lg="4"><span className={styles.labelStyle}>Ngày Sinh</span></Col>
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
                    <Col lg="4"><span className={styles.labelStyle}>Ngày Cập Nhật</span></Col>
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
      let modalErrorText = "Bạn vẫn còn trường chưa điền thông tin!";
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
  //       let modalErrorText = "Trùng lặp thông tin!";
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
      let modalErrorText = "Email không hợp lệ!";
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
  //       let modalErrorText = "Trùng lặp thông tin!";
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
      let modalErrorText = "Bạn vẫn còn trường chưa điền thông tin!";
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
                  <CardTitle>Duyệt Cấp CTTV</CardTitle>
                </div>
                <CardBody>
                  <Form className="was-validated">
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Giám khảo</Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="text" className="form-control-warning" name="examiner"
                               value={this.state.examiner}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Label>Hiệu quả kinh tế</Label>
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
                        <Label>Ước tính hiệu quả</Label>
                      </Col>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Input type="text" className="form-control-warning" name="effective_guess"
                               value={this.state.effective_guess}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Label>Hình thức thưởng</Label>
                      </Col>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Input type="text" className="form-control-warning" name="bonus_type"
                               value={this.state.bonus_type}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Label>Giá trị cấp thưởng</Label><span className="text-danger font-italic"> (Nhập 0 nếu sáng kiến không được duyệt)</span>
                      </Col>
                      <Col lg={6} md={6} xs={6} sm={6}>
                        <Input type="text" className="form-control-warning" name="bonus_value"
                               value={this.state.bonus_value}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <p className="text-center">
                      <Button className="btn btn-success mt-3" type="submit"
                              onClick={(e) => this.onSubmitBonus(e)}
                              style={{marginRight: 10}}>
                        Phê Duyệt
                      </Button>
                    </p>
                  </Form>

                </CardBody>
              </div>
            </Col>
            <Col sm={12} xs={12} md={12} lg={12}>
              <div className="card">
                <div className="card-header">
                  <CardTitle>Đăng ký/Cập nhật sáng kiến</CardTitle>
                </div>
                <CardBody>
                  <Form className="was-validated">
                    {(this.state.id) &&
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>Mã đăng ký</Label>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Label>{this.state.id}</Label>
                      </Col>
                    </FormGroup>
                    }
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>Tên sáng kiến</Label>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Input type="text" className="form-control-warning" name="name"
                               value={this.state.name}
                               onChange={this.onChange}
                               placeholder="tên gọi mô tả ngắn gọn sáng kiến"
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>Công ty thành viên</Label><span className="text-danger font-italic"> (chọn đúng công ty thành viên của bạn)</span>
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
                        <Label>Đơn vị</Label>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Input type="text" className="form-control-warning" name="unit"
                               value={this.state.unit}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>Phòng </Label>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Input type="text" className="form-control-warning" name="department"
                               value={this.state.department}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={3} md={3} xs={3} sm={3}>
                        <Label>Tác giả/ Nhóm tác giả </Label>
                      </Col>
                      <Col lg={9} md={9} xs={9} sm={9}>
                        <Input type="text" className="form-control-warning" name="author"
                               value={this.state.author}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <br/>
                    <Row>
                      <Col>
                        <Label className="font-weight-bold">Liên hệ:</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup row>
                          <Col lg={12} md={12} xs={12} sm={12}>
                            <Label>Tên</Label>
                          </Col>
                          <Col lg={12} md={12} xs={12} sm={12}>
                            <Input type="text" className="form-control-warning" name="author_name"
                                   value={this.state.author_name}
                                   onChange={this.onChange}
                                   required/>
                            <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                            <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup row>
                          <Col lg={12} md={12} xs={12} sm={12}>
                            <Label>SĐT</Label>
                          </Col>
                          <Col lg={12} md={12} xs={12} sm={12}>
                            <Input type="text" className="form-control-warning" name="author_phone"
                                   value={this.state.author_phone}
                                   onChange={this.onChange}
                                   required/>
                            <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                            <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
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
                            <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                            <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                          </Col>
                        </FormGroup>
                      </Col>

                    </Row>
                    <FormGroup row>
                      <Col lg={4} md={12} xs={12} sm={12}>
                        <Label>Thời điểm áp dụng được trong thực tế </Label>
                      </Col>
                      <Col lg={4} md={12} xs={12} sm={12}>
                        <DateTimePicker
                          onChange={this.onChangeDate}
                          value={this.state.apply_date}
                        />
                      </Col>
                      <Col lg={4} md={12} xs={12} sm={12}>
                        <Label className="font-italic text-danger">(Lưu ý: phải trong 12 tháng trở lại đây) </Label>
                      </Col>
                    </FormGroup>
                    <br/>
                    <h4>CHI TIẾT VỀ SÁNG KIẾN </h4>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Tình trạng trước khi có sáng kiến </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea}
                               name="status_before"
                               value={this.state.status_before}
                               onChange={this.onChange}
                               placeholder={"Nêu hiện trạng trước khi áp dụng giải pháp mới; phân tích ưu nhược điểm của giải pháp cũ"}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Mục đích của giải pháp </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea} name="aim"
                               value={this.state.aim}
                               onChange={this.onChange}
                               placeholder={"Nêu vấn đề cần giải quyết"}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Nội dung giải pháp đề nghị công nhận là sáng kiến </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea} name="content"
                               value={this.state.content}
                               onChange={this.onChange}
                               placeholder={"Nêu cách thức thực hiện, các bước thực hiện của giải pháp mới một cách cụ thể, rõ ràng cũng như các điều kiện cần thiết để áp dụng giải pháp"}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <br/>
                    <h4>PHÂN TÍCH SÁNG KIẾN </h4>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Tính hiệu quả </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea} name="effective"
                               value={this.state.effective}
                               onChange={this.onChange}
                               placeholder={"- Mô tả tính hiệu quả của sáng kiến: hiệu quả kinh tế, hiệu quả hoạt động và phân tích nhận định của tác giả vì sao sáng kiến có hiệu quả này.\n" +
                               "- Đánh giá phạm vi hiệu quả của sáng kiến (đơn vị/phòng ban, CTTV, một hoặc nhiều CTTV khác trong tập đoàn hoặc ngoài tập đoàn).\n" +
                               "- Ước tính số tiền làm lợi đã thu hoặc quy đổi được theo ý kiến của tác giả sáng kiến. Nêu rõ phương pháp tính (Lưu ý: Có thể tài liệu chứng minh kèm theo).\n" +
                               "- Ý kiến nhận xét của đại diện bộ phận/đơn vị được hưởng lợi từ sáng kiến hoặc cán bộ nhân viên trực tiếp sử dụng sáng kiến (nếu có)."}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Tính mới </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea} name="new"
                               value={this.state.new}
                               onChange={this.onChange}
                               placeholder={"- Chỉ ra tính mới, sự khác biệt của giải pháp mới so với giải pháp cũ.\n" +
                               "- Lựa chọn mức độ tính mới phù hợp và giải thích lý do."}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Tính sáng tạo </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea} name="creative"
                               value={this.state.creative}
                               onChange={this.onChange}
                               placeholder={"- Giải thích cụ thể về quá trình nghiên cứu, sáng tạo để hình thành sáng kiến.\n" +
                               "- Lựa chọn mức độ sáng tạo. \n" +
                               "- Dẫn chiếu các tài liệu tham khảo.\n" +
                               "- Thời gian nghiên cứu kể từ lúc có ý tưởng đến thời điểm phát triển thành giải pháp."}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <Row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Dự định tiếp theo (không bắt buộc) </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="text" name="next_step"
                               value={this.state.next_step}
                               onChange={this.onChange}
                        />
                      </Col>
                    </Row>
                    <br/>
                    <h4>THÔNG TIN KHÁC </h4>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Các thông tin cần được bảo mật</Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="text" className="form-control-warning" name="security_info"
                               value={this.state.security_info}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Các điều kiện cần thiết để áp dụng sáng kiến </Label>
                      </Col>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="text" className="form-control-warning" name="conditions"
                               value={this.state.conditions}
                               onChange={this.onChange}
                               required/>
                        <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                        <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Label>Đính kèm file thông tin về sáng kiến </Label>
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
                                    onClick={(e) => this.onDelete(e, listValue.link)}>Xóa</Button>
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
                             htmlFor="checkbox1"> Cam kết:
                        <br/>
                        - Đã đọc và hiểu rõ các yêu cầu, tiêu chuẩn để được công nhận là Sáng kiến trong quy định về
                        Chính
                        sách
                        khuyến khích sáng kiến nội bộ FPT.
                        <br/>
                        - Cung cấp các nội dung trung thực, chính xác trong bản đăng ký này.
                        Nếu có thông tin nào không chính xác, tôi/chúng tôi xin hoàn toàn chịu trách nhiệm.</Label>
                    </FormGroup>
                  </Col>}
                  <br/>
                  {(localStorage.getItem('role') !== '2') &&
                  <p className="text-center">

                    {((!this.props.match.params.id && this.state.is_visible) || (this.state.status === 10)) ?
                      <div>
                        <Button className="btn btn-warning mt-3" type="submit" onClick={(e) => this.onSubmitDraft(e)}
                                style={{marginRight: 10}}>
                          Lưu bản nháp
                        </Button>
                        <Button className="btn btn-success mt-3" type="submit" onClick={(e) => this.onSubmit(e)}
                                style={{marginRight: 10}}>
                          Đăng ký Sáng kiến
                        </Button>
                        <br/>
                        <br/>
                        <Label className="text-danger font-italic">* Bản nháp là bản không cần đầy đủ thông tin và sẽ
                          chưa được gửi đến phê duyệt</Label>
                      </div>
                      :
                      <Button className="btn btn-danger mt-3" onClick={(e) => this.onSubmit(e)}>Cập
                        nhật thông tin</Button>}
                  </p>}
                  <br/>
                  {((this.state.additionalData) || localStorage.getItem("role") === "2" || localStorage.getItem("role") === "0") &&
                  <div>
                    < h4> YÊU CẦU CẬP NHẬT/ BỔ SUNG THÔNG TIN </h4>
                    <Row>
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Input type="textarea" className={"form-control-warning " + styles.textarea}
                               name="additionalData"
                               value={this.state.additionalData}
                               onChange={this.onChange}
                               placeholder={"Nội dung yêu cầu: \n" +
                               "Sau khi tác giả cập nhật thông tin, tác giả trả lời nội dung yêu cầu tại đây"}
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
                      Yêu cầu bổ sung thông tin
                    </Button>
                    {this.state.status !== 10 &&
                    <Button className="btn btn-danger mt-3" onClick={(e) => this.onSubmitOK(e)}>
                      Sơ loại OK</Button>
                    }

                  </p>}
                </CardBody>
              </div>
            </Col>
          </Row>
        }


        <Modal isOpen={this.state.modal} toggle={this.toggle}
               className={'modal-success ' + this.props.className}>
          <ModalHeader toggle={this.toggle}>Thông báo</ModalHeader>
          <ModalBody>
            Cập nhật thành công!!!
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.toggle}>Ở lại trang này</Button>
            <Button color="danger" onClick={(e) => this.back(e)}>Về trang danh sách</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.danger} toggle={this.toggleDanger}
               className={'modal-warning ' + this.props.className}>
          <ModalHeader toggle={this.toggleDanger}>Thông Báo</ModalHeader>
          <ModalBody>
            Hãy điền đầy đủ thông tin cần thiết và click vào ô cam kết!
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
