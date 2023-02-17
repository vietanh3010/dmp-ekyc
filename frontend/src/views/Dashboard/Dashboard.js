import React, {Component} from 'react';
import {Line, Doughnut} from 'react-chartjs-2';
import {
  ButtonDropdown,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  CardDeck,
} from 'reactstrap';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {getStyle} from '@coreui/coreui/dist/js/coreui-utilities'
import client from "../../api";
import {KONG_URL} from "../../constants/ActionTypes";
import axios from "axios/index";
import moment from "moment/moment";
import Select from 'react-select';

const TOKEN = 'access_token';
const jwtDecode = require('jwt-decode');
const token = localStorage.getItem(TOKEN);
const decoded = jwtDecode(token);
const user_id = decoded.id;
const role = decoded.role;
const brandPrimary = getStyle('--primary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandSecondary = getStyle('--secondary')


const optDoughnut = {
  tooltips: {
    mode: "single",
  },
  legend: {
    position: "bottom"
  }
};


const mainChartOpts = {
  tooltips: {
    enabled: true,
    mode: 'index',
  },
  maintainAspectRatio: false,
  legend: {
    display: true,
  },
  scales: {
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Buzz'
      },
      ticks: {
        beginAtZero: true,
      },
    }],
    xAxes: [{
      gridLines: {
        drawOnChartArea: false,
      },
    }],
  },
  responsive: true,
};


// const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')

// Card Chart 1
const cardChartData1 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandPrimary,
      borderColor: 'rgba(255,255,255,.55)',
      data: [65, 59, 84, 84, 51, 55, 40],
    },
  ],
};

const cardChartOpts1 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      borderWidth: 1,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}


// Card Chart 2
const cardChartData2 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [1, 18, 9, 17, 34, 22, 11],
    },
  ],
};

const cardChartOpts2 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

// Card Chart 3
const cardChartData3 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40],
    },
  ],
};

const cardChartOpts3 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

// Card Chart 4
const cardChartData4 = {
  labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.3)',
      borderColor: 'transparent',
      data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98],
    },
  ],
};

const cardChartOpts4 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false,
        barPercentage: 0.6,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
};

// Social Box Chart
const socialBoxData = [
  {data: [65, 59, 84, 84, 51, 55, 40], label: 'facebook'},
  {data: [1, 13, 9, 17, 34, 41, 38], label: 'twitter'},
  {data: [78, 81, 80, 45, 34, 12, 40], label: 'linkedin'},
  {data: [35, 23, 56, 22, 97, 23, 64], label: 'google'},
];

const makeSocialBoxData = (dataSetNo) => {
  const dataset = socialBoxData[dataSetNo];
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        backgroundColor: 'rgba(255,255,255,.1)',
        borderColor: 'rgba(255,255,255,.55)',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: dataset.data,
        label: dataset.label,
      },
    ],
  };
  return () => data;
};

const socialChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
};

// sparkline charts
const sparkLineChartData = [
  {
    data: [35, 23, 56, 22, 97, 23, 64],
    label: 'New Clients',
  },
  {
    data: [65, 59, 84, 84, 51, 55, 40],
    label: 'Recurring Clients',
  },
  {
    data: [35, 23, 56, 22, 97, 23, 64],
    label: 'Pageviews',
  },
  {
    data: [65, 59, 84, 84, 51, 55, 40],
    label: 'Organic',
  },
  {
    data: [78, 81, 80, 45, 34, 12, 40],
    label: 'CTR',
  },
  {
    data: [1, 13, 9, 17, 34, 41, 38],
    label: 'Bounce Rate',
  },
];

const makeSparkLineData = (dataSetNo, variant) => {
  const dataset = sparkLineChartData[dataSetNo];
  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        backgroundColor: 'transparent',
        borderColor: variant ? variant : '#c2cfd6',
        data: dataset.data,
        label: dataset.label,
      },
    ],
  };
  return () => data;
};

const sparklineChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    xAxes: [
      {
        display: false,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
  legend: {
    display: false,
  },
};

// Main Chart

//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(65);
}


const mainChart = {
  labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'transparent',
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data1,
    },
    {
      label: 'My Second dataset',
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data2,
    },
    {
      label: 'My Third dataset',
      backgroundColor: 'transparent',
      borderColor: brandDanger,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5],
      data: data3,
    },
  ],
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      dataDoughnut: {
        datasets: [{
          data: [10, 20, 30],
          backgroundColor: [
            brandSecondary, brandDanger, brandSuccess
          ]
        }],

        labels: [
          'demo1',
          'demo2',
          'demo3'
        ]
      },
      project_num: null,
      user_num: null,
      keyword_num: null,
      trending: [],
      mainChart: {},
      general_card: [],
      total_good: 0,
      total_warning: 0,
      total_bad: 0,
      time: moment(new Date().toString()).format('DD MMM YYYY'),
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  componentDidMount() {
    if (role === "1") {
      client.get('/api/superusers')
        .then((response) => {
          this.setState({
            user_num: response.data.length
          })
        })
        .catch((error) => {
          alert(error);
        });

    }
    else if (role === "10") {
      client.get('/api/users')
        .then((response) => {
          this.setState({
            user_num: response.data.length
          })
        })
        .catch((error) => {
          alert(error);
        });
      client.get('/api/projects')
        .then((response) => {
          this.getGeneral(response.data);
          var tmp_num = 0;
          for (let i = 0; i < response.data.length; i++) {
            tmp_num += response.data[i].keywords.split("),").length;
          }
          this.setState({
            project_num: response.data.length,
            keyword_num: tmp_num
          })
        })
        .catch((error) => {
          alert(error);
        });

    }
    else if (role === "100") {
      client.get('/api/projects')
        .then((response) => {
          var tmp_num = 0;
          for (let i = 0; i < response.data.length; i++) {
            tmp_num += response.data[i].keywords.split("),").length;
          }
          this.setState({
            project_num: response.data.length,
            keyword_num: tmp_num
          })
        })
        .catch((error) => {
          alert(error);
        });

    }

    this.getTrending();
  }

  async getGeneral(data) {
    var general_card = [], total_good = 0, total_warning = 0, total_bad = 0;
    for (let i = 0; i < data.length; i++) {
      var bg_color = "#dff0d8"; //xanh
      var project_name = data[i].name;
      var mainChartOpts = {
        tooltips: {
          enabled: true,
          mode: 'index',
        },
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: project_name
            },
            ticks: {
              beginAtZero: true,
            },
          }],
          xAxes: [{
            gridLines: {
              drawOnChartArea: false,
            },
          }],
        },
        responsive: true,


      };
      var total_buzz = 0, num_positive = 0, num_negative = 0;
      var info = await this.getGeneralInfo(data[i]._id);
      var line_chart = await this.getLineChart(data[i]._id);
      if (info) {
        total_buzz = info.total;
        num_positive = info.num_positive;
        num_negative = info.num_negative;
      }
      if (num_negative > num_positive && num_negative > 10) {
        bg_color = "#FCDAD5";
        total_bad += 1;
      }
      else if (num_negative > num_positive && num_negative <= 10) {
        bg_color = "#fcf8e3";
        total_warning += 1;
      }
      else {
        total_good += 1;
      }
      //dff0d8 xanh ---  fcf8e3 vàng --- FCDAD5 đỏ
      general_card.push(<Card key={data[i]._id} style={{
        backgroundColor: bg_color, border: 0
      }}>
        <CardBody style={{padding: 0}}>
          {/*<div className={"h5"} style={{color: "#98B268", textAlign: "center"}}>{project_name}</div>*/}
          <Row>
            <Col md="7">
              <div className="chart-wrapper" style={{height: 110 + 'px', marginTop: 10 + 'px'}}>
                <Line data={line_chart} options={mainChartOpts} height={300}/>
              </div>

            </Col>
            <Col md="5">
              <CardDeck style={{textAlign: "center"}}>
                <Card style={{backgroundColor: bg_color, border: 0}}>
                  <CardBody>
                    <CardTitle>
                        <span className="cui-globe" aria-hidden="true"
                              style={{color: "#10A1A2", fontSize: 50}}></span><br/>
                      <span style={{color: "#365899"}}>{total_buzz}</span><br/>
                      <i style={{color: "#8D9AAA", fontSize: 10, fontWeight: 500}}>TỔNG ĐỀ
                        CẬP</i><br/></CardTitle>
                  </CardBody>
                </Card>
                <Card style={{backgroundColor: bg_color, border: 0}}>
                  <CardBody>
                    <CardTitle>
                        <span className="cui-thumb-up" aria-hidden="true"
                              style={{color: "green", fontSize: 50}}></span><br/>
                      <span style={{color: "#365899"}}>{num_positive}</span><br/>
                      <i style={{color: "#8D9AAA", fontSize: 10, fontWeight: 500}}>TÍCH
                        CỰC</i><br/></CardTitle>
                  </CardBody>
                </Card>
                <Card style={{backgroundColor: bg_color, border: 0}}>
                  <CardBody>
                    <CardTitle>
                        <span className="cui-thumb-down" aria-hidden="true"
                              style={{color: "red", fontSize: 50}}></span><br/>
                      <span style={{color: "#365899"}}>{num_negative}</span><br/>
                      <i style={{color: "#8D9AAA", fontSize: 10, fontWeight: 500}}>TIÊU
                        CỰC</i><br/></CardTitle>
                  </CardBody>
                </Card>
              </CardDeck>
            </Col>
          </Row>
        </CardBody>
      </Card>);
    }
    this.setState({general_card, total_good, total_bad, total_warning});
  }

  async getGeneralInfo(projectId) {
    var info = {}
    var param = {
      params: {
        start: new Date(moment().subtract(1, 'days').toString()).getTime(),
        end: new Date().getTime(),
        userId: user_id,  //"5cefa8f28d31d700064ddf71",//user_id,
        projectId: projectId  //"5cefa9618d31d700064ddf72"//projectId
      }
    };
    await axios.get(KONG_URL + '/totalByPoNeuNe', param).then((response) => {
      info = this.successShowPos(response);
    }).catch((error) => {
      //alert(error);
    });
    return info;
  }

  async getLineChart(projectId) {
    var line_chart = {};
    var param = {
      params: {
        userId: user_id,  //"5cefa8f28d31d700064ddf71",//user_id,
        projectId: projectId  //"5cefa9618d31d700064ddf72"//projectId
      }
    };
    //get line chart
    await axios.get(KONG_URL + '/get7DaysTrending', param).then((response) => {
      line_chart = this.successShowLineChart(response);
    }).catch((error) => {
      //alert(error);
    });
    return line_chart;
  }

  successShowLineChart(response) {
    if (response.data && response.data.data) {
      var data = response.data.data;
      var listKeyword = [];
      var listNumberNegative = [];
      //var listNumberNeutral = [];
      var listNumberPositive = [];
      for (let i = 0; i < data.length; i++) {
        var date = new Date(data[i].key);
        listKeyword.push(moment(date).format('DD MMM YY'));
        listNumberNegative.push(data[i].detail.Negative);
        //listNumberNeutral.push(data[i].detail.Neutral)
        listNumberPositive.push(data[i].detail.Positive)
      }

      return {
        labels: listKeyword,
        datasets: [
          // {
          //   label: 'Neutral',
          //   backgroundColor: 'transparent',
          //   borderColor: brandInfo,
          //   pointHoverBackgroundColor: '#fff',
          //   borderWidth: 2,
          //   data: listNumberNeutral,
          // },
          {
            label: 'Positive',
            backgroundColor: 'transparent',
            borderColor: brandSuccess,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: listNumberPositive,
          },
          {
            label: 'Negative',
            backgroundColor: 'transparent',
            borderColor: brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: listNumberNegative,
          },
        ],
      };
    }

  }

  successShowPos(response) {
    // console.log(response.data.total_detail[0].doc_count);
    var num_positive = 0, num_negative = 0, total_buzz = 0;
    if (response.data) {
      total_buzz = response.data.total_buzz;
    }
    if (response.data && response.data.total_detail[1]) {
      num_positive = response.data.total_detail[1].doc_count;
    }
    if (response.data && response.data.total_detail[2]) {
      num_negative = response.data.total_detail[2].doc_count;
    }

    return {total: total_buzz, num_positive: num_positive, num_negative: num_negative};
  }

  getTrending() {
    var string = "";
    axios.get(KONG_URL + '/topTrendingKeywords').then((response) => {
      string = response.data.data;
      //console.log(string);
      if (string) {
        var array = string.replace(/_/g, " ").split(",");
        var items = ["#fcf8e3", "#dff0d8", "#DDF4FF", "#d6dde7"];
        var a = [], b = [], c = [], d = [], e = [];
        for (let i = 0; i < 10; i++) {
          var item = items[Math.floor(Math.random() * items.length)];
          a.push(<code key={i}
                       style={{
                         background: item,
                         color: '#' + Math.random().toString(16).substr(-6)
                       }}>{array[i]}</code>);
          a.push(<span key={i + 100}>&nbsp;&nbsp;</span>)
        }
        for (let i = 10; i < 20; i++) {
          var item = items[Math.floor(Math.random() * items.length)];
          b.push(<code key={i}
                       style={{
                         background: item,
                         color: '#' + Math.random().toString(16).substr(-6)
                       }}>{array[i]}</code>);
          b.push(<span key={i + 100}>&nbsp;&nbsp;</span>)
        }
        for (let i = 20; i < 30; i++) {
          var item = items[Math.floor(Math.random() * items.length)];
          c.push(<code key={i}
                       style={{
                         background: item,
                         color: '#' + Math.random().toString(16).substr(-6)
                       }}>{array[i]}</code>);
          c.push(<span key={i + 100}>&nbsp;&nbsp;</span>)
        }
        for (let i = 30; i < 45; i++) {
          var item = items[Math.floor(Math.random() * items.length)];
          d.push(<code key={i}
                       style={{
                         background: item,
                         color: '#' + Math.random().toString(16).substr(-6)
                       }}>{array[i]}</code>);
          d.push(<span key={i + 100}>&nbsp;&nbsp;</span>)
        }
        for (let i = 45; i < 80; i++) {
          var item = items[Math.floor(Math.random() * items.length)];
          e.push(<code key={i}
                       style={{
                         background: item,
                         color: '#' + Math.random().toString(16).substr(-6)
                       }}>{array[i]}</code>);
          e.push(<span key={i + 100}>&nbsp;&nbsp;</span>)
        }
        var trending = <div className="bd-example">
          <p className="h1">{a}</p>
          <p className="h2">{b}</p>
          <p className="h3">{c}</p>
          <p className="h4">{d}</p>
          <p className="h5">{e}</p>
        </div>
        this.setState({trending})
      }
    }).catch((error) => {
      alert(error);
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          {this.state.project_num != null &&
          <Col xs="12" sm="6" lg="6">
            <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <ButtonDropdown id='card1' isOpen={this.state.card1} toggle={() => {
                    this.setState({card1: !this.state.card1});
                  }}>
                    <DropdownToggle caret className="p-0" color="transparent">
                      <i className="icon-settings"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem href={"#/project/view"}>Quản lý dự án</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </ButtonGroup>
                <div className="text-value">{this.state.project_num}</div>
                <div>Awaiting Action</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{height: '70px'}}>
                <Line data={cardChartData2} options={cardChartOpts2} height={70}/>
              </div>
            </Card>
          </Col>
          }

          {this.state.user_num != null &&
          <Col xs="12" sm="6" lg="6">
            <Card className="text-white bg-primary">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <Dropdown id='card2' isOpen={this.state.card2} toggle={() => {
                    this.setState({card2: !this.state.card2});
                  }}>
                    <DropdownToggle className="p-0" color="transparent">
                      <i className="icon-settings"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem href={"#/user/view"}>Quản lý User</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </ButtonGroup>
                <div className="text-value">{this.state.user_num}</div>
                <div>Awaiting applicant</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{height: '70px'}}>
                <Line data={cardChartData1} options={cardChartOpts1} height={70}/>
              </div>
            </Card>
          </Col>
          }
        </Row>
        <Row>
          {this.state.keyword_num != null &&
          <Col xs="12" sm="6" lg="6">
            <Card className="text-white bg-warning">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.keyword_num}</div>
                <div>In Progress</div>
              </CardBody>
              <div className="chart-wrapper" style={{height: '70px'}}>
                <Line data={cardChartData3} options={cardChartOpts3} height={70}/>
              </div>
            </Card>
          </Col>
          }
          {this.state.keyword_num != null &&
          <Col xs="12" sm="6" lg="6">
            <Card className="text-white bg-danger">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.keyword_num}</div>
                <div>Form reopened</div>
              </CardBody>
              <div className="chart-wrapper" style={{height: '70px'}}>
                <Line data={cardChartData3} options={cardChartOpts3} height={70}/>
              </div>
            </Card>
          </Col>
          }
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Volumn of checks</CardTitle>
                    <div className="small text-muted">{this.state.time}</div>
                  </Col>
                  <Col md="7" className="text-center">
                    {/*<Row>*/}
                    {/*<Col md="4">*/}
                    {/*<div className="text-muted">Good</div>*/}
                    {/*<strong>{this.state.total_good}</strong>*/}
                    {/*<Progress className="progress-xs mt-2" color="success" value="100"/>*/}
                    {/*</Col>*/}
                    {/*<Col md="4">*/}
                    {/*<div className="text-muted">Warning</div>*/}
                    {/*<strong>{this.state.total_warning}</strong>*/}
                    {/*<Progress className="progress-xs mt-2" color="warning" value="100"/>*/}
                    {/*</Col>*/}
                    {/*<Col md="4">*/}
                    {/*<div className="text-muted">Dangerous</div>*/}
                    {/*<strong>{this.state.total_bad}</strong>*/}
                    {/*<Progress className="progress-xs mt-2" color="danger" value="100"/>*/}
                    {/*</Col>*/}
                    {/*</Row>*/}
                    <Select
                      name="lineOption"
                      // value={this.state.lineOption}
                      // options={this.state.lineOptions}
                      // onChange={this.onChangeLineChart}
                    />

                  </Col>

                </Row>
              </CardBody>
              <CardFooter>
                {/*<span className="h1" style={{background: '#'+Math.random().toString(16).substr(-6)}}>213123</span>*/}
                {/*<span className="h1 backg">213123</span>*/}
                <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
                  {/*<Line data={this.state.mainChart} options={mainChartOpts} height={300}/>*/}
                  <Line options={mainChartOpts}/>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Total Checks</CardTitle>
                    <div className="small text-muted">{this.state.time}</div>
                  </Col>
                  <Col md="7" className="text-center">
                    {/*<Row>*/}
                    {/*<Col md="4">*/}
                    {/*<div className="text-muted">Good</div>*/}
                    {/*<strong>{this.state.total_good}</strong>*/}
                    {/*<Progress className="progress-xs mt-2" color="success" value="100"/>*/}
                    {/*</Col>*/}
                    {/*<Col md="4">*/}
                    {/*<div className="text-muted">Warning</div>*/}
                    {/*<strong>{this.state.total_warning}</strong>*/}
                    {/*<Progress className="progress-xs mt-2" color="warning" value="100"/>*/}
                    {/*</Col>*/}
                    {/*<Col md="4">*/}
                    {/*<div className="text-muted">Dangerous</div>*/}
                    {/*<strong>{this.state.total_bad}</strong>*/}
                    {/*<Progress className="progress-xs mt-2" color="danger" value="100"/>*/}
                    {/*</Col>*/}
                    {/*</Row>*/}
                    <Select
                      name="lineOption"
                      // value={this.state.lineOption}
                      // options={this.state.lineOptions}
                      // onChange={this.onChangeLineChart}
                    />

                  </Col>

                </Row>
              </CardBody>
              <CardFooter>
                {/*<span className="h1" style={{background: '#'+Math.random().toString(16).substr(-6)}}>213123</span>*/}
                {/*<span className="h1 backg">213123</span>*/}
                <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
                  {/*<Line data={this.state.mainChart} options={mainChartOpts} height={300}/>*/}
                  <Line options={mainChartOpts}/>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Rate</CardTitle>
                    <div className="small text-muted">{this.state.time}</div>
                  </Col>
                  <Col md="7" className="text-center">
                    {/*<Row>*/}
                    {/*<Col md="4">*/}
                    {/*<div className="text-muted">Good</div>*/}
                    {/*<strong>{this.state.total_good}</strong>*/}
                    {/*<Progress className="progress-xs mt-2" color="success" value="100"/>*/}
                    {/*</Col>*/}
                    {/*<Col md="4">*/}
                    {/*<div className="text-muted">Warning</div>*/}
                    {/*<strong>{this.state.total_warning}</strong>*/}
                    {/*<Progress className="progress-xs mt-2" color="warning" value="100"/>*/}
                    {/*</Col>*/}
                    {/*<Col md="4">*/}
                    {/*<div className="text-muted">Dangerous</div>*/}
                    {/*<strong>{this.state.total_bad}</strong>*/}
                    {/*<Progress className="progress-xs mt-2" color="danger" value="100"/>*/}
                    {/*</Col>*/}
                    {/*</Row>*/}
                    <Select
                      name="lineOption"
                      // value={this.state.lineOption}
                      // options={this.state.lineOptions}
                      // onChange={this.onChangeLineChart}
                    />

                  </Col>

                </Row>
              </CardBody>
              <CardFooter>
                {/*<span className="h1" style={{background: '#'+Math.random().toString(16).substr(-6)}}>213123</span>*/}
                {/*<span className="h1 backg">213123</span>*/}
                <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
                  {/*<Line data={this.state.mainChart} options={mainChartOpts} height={300}/>*/}
                  <Doughnut options={optDoughnut}/>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        {/*<Row>*/}
        {/*<Col>*/}
        {/*<Card>*/}
        {/*<CardBody>*/}
        {/*<Row>*/}
        {/*<Col sm="5">*/}
        {/*<CardTitle className="mb-0"> Trending Words </CardTitle>*/}
        {/*<div className="small text-muted">{this.state.time}</div>*/}
        {/*</Col>*/}
        {/*</Row>*/}
        {/*</CardBody>*/}
        {/*<CardFooter>*/}
        {/*/!*<span className="h1" style={{background: '#'+Math.random().toString(16).substr(-6)}}>213123</span>*!/*/}
        {/*/!*<span className="h1 backg">213123</span>*!/*/}
        {/*<p><code className="highlighter-rouge">trending v0.1</code></p>*/}
        {/*{this.state.trending}*/}
        {/*</CardFooter>*/}
        {/*</Card>*/}
        {/*</Col>*/}
        {/*</Row>*/}
        <Row>
          <Col>
            {/*<Card>*/}
            {/*/!*<CardHeader>*!/*/}
            {/*/!*<i className="fa fa-align-justify"></i><strong>Demographics</strong>*!/*/}
            {/*/!*</CardHeader>*!/*/}
            {/*<CardBody>*/}
            {/*<Row>*/}
            {/*<Col xs="6">*/}
            {/*<Card>*/}
            {/*<CardHeader>*/}
            {/*Gender*/}
            {/*</CardHeader>*/}
            {/*<div className="chart-wrapper">*/}
            {/*<Doughnut data={this.state.dataDoughnut} options={optDoughnut}/>*/}
            {/*</div>*/}
            {/*</Card>*/}
            {/*</Col>*/}
            {/*<Col xs="6">*/}
            {/*<Card>*/}
            {/*<CardHeader>*/}
            {/*Age*/}
            {/*</CardHeader>*/}
            {/*<div className="chart-wrapper">*/}
            {/*<Doughnut data={this.state.dataDoughnut} options={optDoughnut}/>*/}
            {/*</div>*/}
            {/*</Card>*/}
            {/*</Col>*/}

            {/*/!*<Col sm="7" className="d-none d-sm-inline-block">*!/*/}
            {/*/!*<Button color="primary" className="float-right"><i className="icon-cloud-download"></i></Button>*!/*/}
            {/*/!*<ButtonToolbar className="float-right" aria-label="Toolbar with button groups">*!/*/}
            {/*/!*<ButtonGroup className="mr-3" aria-label="First group">*!/*/}
            {/*/!*<Button color="outline-secondary" onClick={() => this.onRadioBtnClick(1)} active={this.state.radioSelected === 1}>Day</Button>*!/*/}
            {/*/!*<Button color="outline-secondary" onClick={() => this.onRadioBtnClick(2)} active={this.state.radioSelected === 2}>Month</Button>*!/*/}
            {/*/!*<Button color="outline-secondary" onClick={() => this.onRadioBtnClick(3)} active={this.state.radioSelected === 3}>Year</Button>*!/*/}
            {/*/!*</ButtonGroup>*!/*/}
            {/*/!*</ButtonToolbar>*!/*/}
            {/*/!*</Col>*!/*/}
            {/*</Row>*/}
            {/*</CardBody>*/}
            {/*</Card>*/}
          </Col>
        </Row>
        {/*<Row>*/}
          {/*<Col>*/}
            {/*<Card>*/}
              {/*<CardHeader>*/}
                {/*<i className="fa fa-align-justify"></i><strong>ChoroplethMap</strong>*/}
              {/*</CardHeader>*/}
              {/*<CardBody>*/}
                {/*<ChoroplethMap userId={user_id}/>*/}
              {/*</CardBody>*/}
              {/*<CardFooter>*/}
              {/*</CardFooter>*/}
            {/*</Card>*/}
          {/*</Col>*/}
        {/*</Row>*/}
      </div>
    );
  }
}

export default Dashboard;
