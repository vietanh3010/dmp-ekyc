import React, {Component} from 'react';
import {
  Col, Row,
  FormGroup,
  Input,
  Label,
  FormFeedback,
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card, CardBody, CardHeader
} from 'reactstrap';

import Select from 'react-select';
import client from '../../../api';
import styles from '../../Report/Report.css';
import {API_URL, optionsStatus, ID_TOKEN} from "../../../constants/ActionTypes";

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.KeyWordRef = React.createRef();
    this.PageGroupRef = React.createRef();
    this.InfRef = React.createRef();
    this.state = {
      project: {
        id: "",
        id_prob: "",
        name: "",
        name_prob: "",
        dob: "",
        dob_prob: "",
        sex: "",
        sex_prob: "",
        nationality: "",
        nationality_prob: "",
        home: "",
        home_prob: "",
        address: "",
        address_prob: "",
        type_new: "",
        doe: "",
        doe_prob: "",
        type: "",
        ethnicity: "",
        ethnicity_prob: "",
        religion: "",
        religion_prob: "",
        features: "",
        features_prob: "",
        issue_date: "",
        issue_date_prob: "",
        issue_loc: "",
        issue_loc_prob: "",
        isMatch: true,
        similarity: 0,
        creator_ip: "",
        creator_hostname: "",
        upload_id: "",
        upload_name: "",
        status: 0,
        keywords: [],
        pob: "",
        pob_prob: "",
        passport_number: "",
        passport_number_prob: "",
        id_number: "",
        id_number_prob: "",
        doi: "",
        doi_prob: "",
        document_type: 0,
        nation: "",
        nation_prob: "",
        place_issue: "",
        place_issue_prob: "",
        date: "",
        date_prob: "",
        class: "",
        class_prob: "",
      },
      searchOption: {value: 1, label: 'Có'},
      searchOptions: [
        {value: 1, label: 'Có'},
        {value: 2, label: 'Không'}
      ],
      image_full: "",
      is_change: false,
      status: optionsStatus[0],
      keyword_active: true,
      group_active: false,
      fb_active: false,
    };
    this.toggle = this.toggle.bind(this);
    this.toggleDanger = this.toggleDanger.bind(this);
    this.resetFormFields = this.resetFormFields.bind(this);
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

  toggleError = (e, src) => {
    this.setState(prevState => ({
      modalError: !prevState.modalError,
      image_full: src
    }));
  };

  onChange = (e) => {
    let {project} = this.state;
    const name = e.target.name;
    const value = e.target.value;
    project[name] = value;
    this.setState({
      project
    });
  }

  onChangeStatus = (selectedOption) => {
    this.setState({
      status: selectedOption
    });
  }

  onChangeSearchOption = (selectedOption) => {
    this.setState({
      searchOption: selectedOption,
      is_change: true
    });
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      client.get('/api/profileManagement/' + this.props.match.params.id)
        .then((response) => {
            this.setSourceImage('image_path_id_back', response.data.image_path_id_back);
            this.setSourceImage('image_path_id_front', response.data.image_path_id_front);
            this.setSourceImage('image_path_face', response.data.image_path_face);
            this.setSourceImage('image_path_id_front_cropped', response.data.image_path_id_front_cropped);
            this.setState({
              project: response.data
            });
            if (response.data.similarity && response.data.similarity >= 80) {
              this.setState({
                searchOption: {value: 1, label: 'Có'}
              });
            } else {
              this.setState({
                searchOption: {value: 2, label: 'Không'}
              });
            }
          }
        )
        .catch((error) => {
          this.successShow(error);
        });
    }
  }

  successShow(response) {
    this.setState({
      audience: response.data
    });
  }

  resetFormFields(e) {
    e.preventDefault();
    this.props.history.push("/project/view")
  }

  onDelete(e, id) {
    if (this.props.match.params.id) {
      client.delete(API_URL + '/api/profileManagement/' + this.props.match.params.id)
        .then((result) => {
          this.props.history.push("/project/view");
        });
    }
  }

  setSourceImage(name, image_link) {
    fetch(image_link, {
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
              let project = {...this.state.project};
              project[name] = base64data;
              this.setState({project});
            };

            //ReactDOM.render(<Gallery photos={url}/>, document.getElementById('root'));
          });
      })
    ;
  }


  onSubmit = (e) => {
    const {
      id,
      name,
      dob,
      sex,
      nationality,
      nation,
      doi,
      pob,
      id_number,
      passport_number,
      home,
      address,
      doe,
      ethnicity,
      religion,
      features,
      issue_date,
      issue_loc,
      creator_ip,
      creator_hostname,
      upload_id
    } = this.state.project;
    let similarity = null;
    if (this.state.is_change && this.state.searchOption.value == 1) {
      similarity = 100;
    } else if (this.state.is_change && this.state.searchOption.value == 2) {
      similarity = 0;
    } else {
      similarity = this.state.project.similarity;
    }
    if (this.props.match.params.id) {
      client.put('/api/profileManagement/' + this.props.match.params.id, {
        id,
        name,
        dob,
        sex,
        nationality,
        home,
        address,
        doe,
        ethnicity,
        religion,
        features,
        issue_date,
        issue_loc,
        creator_ip,
        creator_hostname,
        similarity,
        nation,
        doi,
        pob,
        id_number,
        passport_number,
      })
        .then((result) => {
          client.post('/api/historyManagement', {
            upload_id
          })
            .then((result) => {
              alert("Cập nhật thông tin thành công");
              this.props.history.push("/project/view")
            });

        });


    }
  };


  render() {
    return (
      <div className="animated fadeIn">
        <div className="card">
          <div className="card-header">
            <span className="h4 text-uppercase">DETAIL</span>
          </div>
          <div className="card-body">
            <Row>
              {(this.state.project.similarity >= 80) ?
                <Col lg={12} className={styles.titleStyleDetailSuccess}>Trùng
                  Khớp({this.state.project.similarity ? this.state.project.similarity.toString().substring(0, 5) : this.state.project.similarity})</Col>
                :
                <Col lg={12} className={styles.titleStyleDetailDanger}>Không Trùng
                  Khớp({this.state.project.similarity ? this.state.project.similarity.toString().substring(0, 5) : this.state.project.similarity})</Col>
              }

            </Row>
            <br/>
            <Row>
              <Col lg={3}> <img src={this.state.project.image_path_face}
                                className={styles.imageStyleView}
                                onClick={(e) => this.toggleError(e, this.state.project.image_path_face)}
                                alt="N/A"/></Col>
              <Col lg={3}> <img src={(this.state.project.image_path_id_back)}
                                className={styles.imageStyleView}
                                onClick={(e) => this.toggleError(e, this.state.project.image_path_id_back)}
                                alt="N/A"/></Col>
              <Col lg={3}> <img src={(this.state.project.image_path_id_front)}
                                className={styles.imageStyleView}
                                onClick={(e) => this.toggleError(e, this.state.project.image_path_id_front)}
                                alt="N/A"/></Col>
              <Col lg={3}> <img src={(this.state.project.image_path_id_front_cropped)}
                                className={styles.imageStyleView}
                                onClick={(e) => this.toggleError(e, this.state.project.image_path_id_front_cropped)}
                                alt="N/A"/></Col>
            </Row>
            <Row>
              <Col xs="3"> <i className="icon-close icons text-danger "></i><i> Trường thông tin có tỷ lệ OCR
                thấp</i></Col>
            </Row>
            <br/>
            {this.state.project.document_type === 1 &&
            <Row>
              <Col xs="12" sm="12" md="12" lg="6">
                <Card>
                  <CardHeader>
                    Basic Info
                    <div className="card-header-actions">
                      <i className="fa fa-check float-right"></i>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Form className="was-validated">
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Số GPLX</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="id"
                                 value={this.state.project.id}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.id_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.id_prob && this.state.project.id_prob < 80) || (!this.state.project.id_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Họ Và Tên</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="name"
                                 value={this.state.project.name}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.name_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.name_prob && this.state.project.name_prob < 80) || (!this.state.project.name_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Ngày Sinh</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="dob"
                                 value={this.state.project.dob}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.dob_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.dob_prob && this.state.project.dob_prob < 80) || (!this.state.project.dob_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Quốc Tịch</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="nation"
                                 value={this.state.project.nation}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.nation_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.nation_prob && this.state.project.nation_prob < 80) || (!this.state.project.nation_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Nơi Cư Trú</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="address"
                                 value={this.state.project.address}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.address_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.address_prob && this.state.project.address_prob < 80) || (!this.state.project.address_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Trùng Khớp</Label>
                        </Col>
                        <Col md="8">
                          <Select
                            name="searchOption"
                            value={this.state.searchOption}
                            options={this.state.searchOptions}
                            onChange={this.onChangeSearchOption}
                          />
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12" sm="12" md="12" lg="6">
                <Card>
                  <CardHeader>
                    Additional Info
                    <div className="card-header-actions">
                      <i className="fa fa-check float-right"></i>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Form className="was-validated">
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Ngày Hết Hạn</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="doe"
                                 value={this.state.project.doe}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.doe_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.doe_prob && this.state.project.doe_prob < 80) || (!this.state.project.doe_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>

                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Ngày</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="date"
                                 value={this.state.project.date}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.date_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.date_prob && this.state.project.date_prob < 80) || (!this.state.project.date_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Hạng</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="class"
                                 value={this.state.project.class}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.class_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.class_prob && this.state.project.class_prob < 80) || (!this.state.project.class_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">IP Máy Tải Lên</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="creator_ip"
                                 value={this.state.project.creator_ip}
                                 onChange={this.onChange}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Tên Máy Tải Lên</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="creator_hostname"
                                 value={this.state.project.creator_hostname}
                                 onChange={this.onChange}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            }
            {this.state.project.document_type === 2 &&
            <Row>
              <Col xs="12" sm="12" md="12" lg="6">
                <Card>
                  <CardHeader>
                    Basic Info
                    <div className="card-header-actions">
                      <i className="fa fa-check float-right"></i>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Form className="was-validated">
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Số Hộ Chiếu</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="id"
                                 value={this.state.project.passport_number}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.passport_number_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.passport_number_prob && this.state.project.passport_number_prob < 80) || (!this.state.project.passport_number_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Họ Và Tên</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="name"
                                 value={this.state.project.name}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.name_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.name_prob && this.state.project.name_prob < 80) || (!this.state.project.name_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Ngày Sinh</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="dob"
                                 value={this.state.project.dob}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.dob_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.dob_prob && this.state.project.dob_prob < 80) || (!this.state.project.dob_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Giới Tính</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="sex"
                                 value={this.state.project.sex}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.sex_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.sex_prob && this.state.project.sex_prob < 80) || (!this.state.project.sex_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Nơi Sinh</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="nationality"
                                 value={this.state.project.pob}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.pob_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.pob_prob && this.state.project.pob_prob < 80) || (!this.state.project.pob_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Trùng Khớp</Label>
                        </Col>
                        <Col md="8">
                          <Select
                            name="searchOption"
                            value={this.state.searchOption}
                            options={this.state.searchOptions}
                            onChange={this.onChangeSearchOption}
                          />
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12" sm="12" md="12" lg="6">
                <Card>
                  <CardHeader>
                    Additional Info
                    <div className="card-header-actions">
                      <i className="fa fa-check float-right"></i>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Form className="was-validated">
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Ngày Hết Hạn</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="doe"
                                 value={this.state.project.doe}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.doe_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.doe_prob && this.state.project.doe_prob < 80) || (!this.state.project.doe_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Ngày Cấp</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="doi"
                                 value={this.state.project.doi}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.doi_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.doi_prob && this.state.project.doi_prob < 80) || (!this.state.project.doi_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Số GCMND</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="id_number"
                                 value={this.state.project.id_number}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.id_number_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.id_number_prob && this.state.project.id_number_prob < 80) || (!this.state.project.id_number_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">IP Máy Tải Lên</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="creator_ip"
                                 value={this.state.project.creator_ip}
                                 onChange={this.onChange}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Tên Máy Tải Lên</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="creator_hostname"
                                 value={this.state.project.creator_hostname}
                                 onChange={this.onChange}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            }
            {this.state.project.document_type === 0 &&
            <Row>
              <Col xs="12" sm="12" md="12" lg="6">
                <Card>
                  <CardHeader>
                    Basic Info
                    <div className="card-header-actions">
                      <i className="fa fa-check float-right"></i>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Form className="was-validated">
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Số CMT</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="id"
                                 value={this.state.project.id}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.id_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.id_prob && this.state.project.id_prob < 80) || (!this.state.project.id_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Họ Và Tên</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="name"
                                 value={this.state.project.name}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.name_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.name_prob && this.state.project.name_prob < 80) || (!this.state.project.name_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Ngày Sinh</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="dob"
                                 value={this.state.project.dob}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.dob_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.dob_prob && this.state.project.dob_prob < 80) || (!this.state.project.dob_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Giới Tính</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="sex"
                                 value={this.state.project.sex}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.sex_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.sex_prob && this.state.project.sex_prob < 80) || (!this.state.project.sex_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Quốc Tịch</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="nationality"
                                 value={this.state.project.nationality}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.nationality_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.nationality_prob && this.state.project.nationality_prob < 80) || (!this.state.project.nationality_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Nguyên Quán</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="home"
                                 value={this.state.project.home}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.home_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.home_prob && this.state.project.home_prob < 80) || (!this.state.project.home_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Địa Chỉ</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="address"
                                 value={this.state.project.address}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.address_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.address_prob && this.state.project.address_prob < 80) || (!this.state.project.address_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Trùng Khớp</Label>
                        </Col>
                        <Col md="8">
                          <Select
                            name="searchOption"
                            value={this.state.searchOption}
                            options={this.state.searchOptions}
                            onChange={this.onChangeSearchOption}
                          />
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12" sm="12" md="12" lg="6">
                <Card>
                  <CardHeader>
                    Additional Info
                    <div className="card-header-actions">
                      <i className="fa fa-check float-right"></i>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Form className="was-validated">
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Ngày Hết Hạn</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="doe"
                                 value={this.state.project.doe}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.doe_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.doe_prob && this.state.project.doe_prob < 80) || (!this.state.project.doe_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Dân Tộc</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="ethnicity"
                                 value={this.state.project.ethnicity}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.ethnicity_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.ethnicity_prob && this.state.project.ethnicity_prob < 80) || (!this.state.project.ethnicity_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Tôn Giáo</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="religion"
                                 value={this.state.project.religion}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.religion_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.religion_prob && this.state.project.religion_prob < 80) || (!this.state.project.religion_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Dấu Vết Riêng Và Dị Hình</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="features"
                                 value={this.state.project.features}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.features_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.features_prob && this.state.project.features_prob < 80) || (!this.state.project.features_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Ngày Cấp</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="issue_date"
                                 value={this.state.project.issue_date}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.issue_loc_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.issue_date_prob && this.state.project.issue_date_prob < 80) || (!this.state.project.issue_loc_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Nơi Cấp</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="issue_loc"
                                 value={this.state.project.issue_loc}
                                 onChange={this.onChange}
                                 data-toggle="tooltip" data-placement="right"
                                 title={"OCR: " + this.state.project.issue_loc_prob + "%"}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                        {((this.state.project.issue_loc_prob && this.state.project.issue_loc_prob < 80) || (!this.state.project.issue_loc_prob)) &&
                        <Col xs="1"> <i className="icon-close icons text-danger font-3xl "></i></Col>
                        }
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">IP Máy Tải Lên</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="creator_ip"
                                 value={this.state.project.creator_ip}
                                 onChange={this.onChange}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col md="3">
                          <Label id="model">Tên Máy Tải Lên</Label>
                        </Col>
                        <Col md="8">
                          <Input type="text" className="form-control-warning" name="creator_hostname"
                                 value={this.state.project.creator_hostname}
                                 onChange={this.onChange}
                                 required/>
                          <FormFeedback className="help-block">Chưa có thông tin</FormFeedback>
                          <FormFeedback valid className="help-block">Đã điền thông tin</FormFeedback>
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            }


          </div>
        </div>


        <p className="text-center">
          <button className="btn btn-primary mt-3" type="submit" onClick={(e) => this.onSubmit(e)}
                  style={{marginRight: 10}}>
            Cập Nhật Thông Tin
          </button>

          <Button color="secondary" className="btn btn-default mt-3" onClick={(e) => this.resetFormFields(e)}>Quay
            lại</Button>
        </p>

        <Modal isOpen={this.state.danger} toggle={this.toggleDanger}
               className={'modal-warning ' + this.props.className}>
          <ModalHeader toggle={this.toggleDanger}>Cảnh báo</ModalHeader>
          <ModalBody>
            Bạn có chắc chắn muốn Xóa bản ghi này!
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={(e) => this.onDelete(e)}>Có</Button>
            <Button color="secondary" onClick={this.toggleDanger}>Hủy</Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.modalError}
          toggle={this.toggleError}
          className={'modal-warning ' + 'modal-lg ' + this.props.className}
        >
          <ModalHeader toggle={this.toggleError}>Phóng To</ModalHeader>
          <ModalBody>
            <img src={this.state.image_full} className={styles.imageStyleView}
                 alt="N/A"/>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleError}>
              Đóng
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
      ;
  }
}

export default CreateProject;
