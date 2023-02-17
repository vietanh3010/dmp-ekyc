import React, {Component} from "react";
import {Bar, Line, Doughnut, HorizontalBar} from 'react-chartjs-2';
import {
  CardTitle,
  CardText,
  CardDeck,
  Col,
  Row,
  Button, Label, FormGroup,
  ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Container, CardBody, Card, CardHeader, CardFooter
} from "reactstrap";
import ChoroplethMap from "../Heatmap/choroplethMap";
import Pagination from 'rc-pagination';
import styles from './Report.css';
import {getStyle} from "@coreui/coreui/dist/js/coreui-utilities";
import html2canvas from "html2canvas";
import * as jsPDF from 'jspdf'
import buzzData from "./ReportData";
import axios from "axios/index";
import {KONG_URL, optionsModels} from "../../constants/ActionTypes";
import KeywordManagement from "../Keyword/Management/KeyWord/KeywordManagement";
import Select from 'react-select';
import moment from "moment";
import DateTimePicker from 'react-datetime-picker';
import chroma from 'chroma-js';


const TOKEN = 'access_token';
const jwtDecode = require('jwt-decode');
const token = localStorage.getItem(TOKEN);
const decoded = jwtDecode(token);
const user_id = decoded.id //"5cefa8f28d31d700064ddf71";

const brandPrimary = getStyle('--primary')
const brandSecondary = getStyle('--secondary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')
const MAX_ROW = 3;

const buzzListNeutral = buzzData.filter((data) => data.status === "neutral");
const buzzListPositive = buzzData.filter((data) => data.status === "positive");


function processData(buzzList) {
  var labelList = [];
  var data = [];

  labelList = buzzList.map(data => data.date);
  labelList = labelList.map((date) => date.substring(5, date.length));
  var countedDate = labelList.reduce(function (allDates, date) {
    if (date in allDates) {
      allDates[date]++;
    } else {
      allDates[date] = 1;
    }
    return allDates;
  }, {});

  labelList = labelList.filter((v, i) => labelList.indexOf(v) === i);
  for (var i = 0; i < labelList.length; i++) {
    data.push(countedDate[labelList[i]]);
  }

  return data;
}


const data1 = processData(buzzListNeutral);
const data2 = processData(buzzListPositive);

const mainChart = {
  labels: ["13/01", "14/01", "15/01", "16/01"],
  datasets: [
    {
      label: 'Neutral',
      backgroundColor: 'transparent',
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data1,
    },
    {
      label: 'Positive',
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data2,
    },
  ],
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


const optDoughnut = {
  tooltips: {
    mode: "single",
  },
  legend: {
    position: "bottom"
  }
};

const dataDoughnutChannelBreakdown = {
  datasets: [{
    data: [28, 45],
    backgroundColor: [
      brandPrimary, brandWarning
    ]
  }],

  labels: [
    'Facebook Pages',
    'News',
  ]
};

const optDoughnutChannelBreakdown = {
  tooltips: {
    mode: "single",
  },
  legend: {
    position: "bottom"
  },
  title: {
    display: true,
    text: 'Buzz Distribution',
    fontSize: 20,
    fontColor: brandPrimary
  }
};

const dataBar = {
  labels: ["Facebook Pages", "News"],
  datasets: [
    {
      label: "Negative",
      backgroundColor: brandDanger,
      data: [0, 0],
    },
    {
      label: "Positive",
      backgroundColor: brandSuccess,
      data: [13, 0],
    },
    {
      label: "Neutral",
      backgroundColor: brandSecondary,
      data: [15, 45],
    },
  ],
};

const optBar = {
  legend: {
    position: "bottom"
  },
  scales: {
    xAxes: [{
      barPercentage: 0.8,
      categoryPercentage: 0.5,
      stacked: true,
    }],
    yAxes: [{
      stacked: true,
      barPercentage: 0.8,
      categoryPercentage: 0.5,
    }]
  },
};

const dataHorizonBar = {
  labels: ["Ban lãnh đạo", "Hoạt động trên fanpage", "Thương hiệu", "Hoạt động kinh doanh", "Dự án", "Cổ phiếu FPT", "Sự kiện"],
  datasets: [
    {
      label: "Negative",
      backgroundColor: brandDanger,
      data: [],
    },
    {
      label: "Positive",
      backgroundColor: brandSuccess,
      data: [],
    },
    {
      label: "Neutral",
      backgroundColor: brandSecondary,
      data: [29, 14, 9, 5, 1, 1, 1],
    },
  ],
};

const optHorizonBar = {
  legend: {
    position: "bottom"
  },
  scales: {
    xAxes: [{
      stacked: true,
      barPercentage: 0.2,
      categoryPercentage: 0.5,
      // ticks: {
      //   beginAtZero: true,
      // },
      // scaleLabel: {
      //   display: true,
      //   labelString: 'Buzz'
      // },
    }],
    yAxes: [{
      stacked: true,
      barPercentage: 0.5,
      categoryPercentage: 0.5,
      // gridLines: {
      //   drawOnChartArea: false,
      // },
    }]

  },
};

function getTotalPage(totalLength) {
  return Math.floor((totalLength - 1) / MAX_ROW) + 1;
};
const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#f7dad6",
  })

};


const customStyles_process = {
  control: (base, state) => ({
    ...base,
    background: "#f7dad6",
    width: 150,
    border: 0,
    fontSize: 10,
    height: 20,
    minHeight: 20,
    textAlight: "center",
  })

};
const dot = (color = '#ccc') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

export const colourOptions = [
  {value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true},
  {value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true},
  {value: 'purple', label: 'Purple', color: '#5243AA'},
  {value: 'red', label: 'Red', color: '#FF5630', isFixed: true},
  {value: 'orange', label: 'Orange', color: '#FF8B00'},
  {value: 'yellow', label: 'Yellow', color: '#FFC400'},
  {value: 'green', label: 'Green', color: '#36B37E'},
  {value: 'forest', label: 'Forest', color: '#00875A'},
  {value: 'slate', label: 'Slate', color: '#253858'},
  {value: 'silver', label: 'Silver', color: '#666666'},
];

const colourStyles = {
  control: (base, state) => ({
    ...base,
    width: 140,
    border: 0,
    fontSize: 13,
    textAlight: "center",
  }),
  option: (styles, {data, isDisabled, isFocused, isSelected}) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
          ? data.color
          : isFocused
            ? color.alpha(0.1).css()
            : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
  },
  input: styles => ({...styles, ...dot()}),
  placeholder: styles => ({...styles, ...dot()}),
  singleValue: (styles, {data}) => ({...styles, ...dot(data.color)}),
};


const Loader = () => <div id="loading" className="text-center">
  <img id="loading-image" src="http://www.broadwaybalancesamerica.com/images/ajax-loader.gif" alt="Loading..."/>
</div>

class Report extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      mainChart: {},
      date: new Date(moment().subtract(1, 'days').toString()),
      to_date: new Date(),
      dataDoughnut: {},
      dataDoughnutChannelBreakdown: {},
      dataBar: {},
      dataTopPageHorizonBar: {},
      dataTopGroupHorizonBar: {},
      dataTopUserHorizonBar: {},
      dataHorizonBar: {},
      total_buzz: 0,
      post_count: 0,
      comment_count: 0,
      reply_count: 0,
      total_pos: 0,
      total_na: 0,
      total_neu: 0,
      dataTableNegative: [],
      dataTablePositive: [],
      dataTableNeutral: [],
      view: "",
      currentPageNegative: 1,
      currentPagePositive: 1,
      currentPageNeutral: 1,
      totalPageNegative: 1,
      totalPagePositive: 1,
      totalPageNeutral: 1,
      searchTable: [],
      // end_date: new Date().getTime(),
      // start_date: new Date(moment().subtract(1, 'days').toString()).getTime(),
      lineOption: {value: 1, label: 'Last 7 days'},
      lineOptions: [
        {value: 7, label: 'Last 7 days'},
        {value: 14, label: 'Last 14 days'},
        {value: 30, label: 'Last 30 days'},
        {value: 90, label: 'Last 90 days'}
      ],
      buzzOption: {value: 1, label: 'Negative Buzzes'},
      buzzOptions: [
        {value: 1, label: 'Negative Buzzes'},
        {value: 2, label: 'Positive Buzzes'},
        {value: 3, label: 'Neutral Buzzes'}
      ],
      statusOption0: {value: -1, label: 'Select ...'},
      statusOption1: {value: -1, label: 'Select ...'},
      statusOption2: {value: -1, label: 'Select ...'},
      statusOptions: [
        {value: 3, label: 'Processing', color: '#00875A'},
        {value: 2, label: 'Follow Up', color: '#5243AA'},
        {value: 1, label: 'Done', color: '#0052CC'},
        {value: 0, label: 'Delete', color: '#FF5630'}
      ],
      list: {},
      list_pos: {},
      list_neu: {},
      dropdownOpen: false,
      projectId: this.props.match.params.id//"5cefa9618d31d700064ddf72"
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const newArray = !this.state.dropdownOpen;

    this.setState({
      dropdownOpen: newArray,
    });
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      const projectId = nextProps.match.params.id;
      await this.setState({
        projectId
      })
    }
    this.showLoader();
    this.loadData();
  }

  componentDidMount() {
    this.showLoader();
    this.loadData();
  }

  hideLoader = () => {
    this.setState({loading: false});
  }
  showLoader = () => {
    this.setState({loading: true});
  }

  loadData() {
    var projectId = this.state.projectId;
    var param = {
      params: {
        start: this.state.date.getTime(),
        end: this.state.to_date.getTime(),
        userId: user_id,
        projectId: projectId
      }
    };
    if (localStorage.getItem('start_date')) {
      var start_date = new Date(localStorage.getItem('start_date')).getTime() || this.state.date.getTime();
      var end_date = new Date(localStorage.getItem('end_date')).getTime() || this.state.to_date.getTime();
      this.setState({
        date: new Date(localStorage.getItem('start_date')),
        to_date: new Date(localStorage.getItem('end_date'))
      })
      param = {
        params: {
          start: start_date,
          end: end_date,
          userId: user_id,
          projectId: projectId
        }
      };

    }

    axios.get(KONG_URL + '/totalBuzz', param).then((response) => {
      this.successShow(response);
    }).catch((error) => {
      //alert(error);
    });
    //get positive nagative and neuture
    axios.get(KONG_URL + '/totalByPoNeuNe', param).then((response) => {
      this.successShowPos(response);
    }).catch((error) => {
      //alert(error);
    });
    //get channel
    axios.get(KONG_URL + '/totalByUserGroupPage', param).then((response) => {
      this.successShowChannel(response);
    }).catch((error) => {
      //alert(error);
    });
    //get by keyword
    axios.get(KONG_URL + '/totalByKeywords', param).then((response) => {
      this.successShowKeyword(response);
    }).catch((error) => {
      //alert(error);
    });

    this.getDataNegative(this.state.currentPageNegative);
    this.getDataPositive(this.state.currentPagePositive);
    this.getDataNeutral(this.state.currentPageNeutral);
    //get list buzzes positive
    //console.log(new Date(moment().subtract(1, 'days').toString()).getTime());

    //get top source
    axios.get(KONG_URL + '/topSources', param).then((response) => {
      this.successShowTopSource(response);
    }).catch((error) => {
      //alert(error);
    });

    //get line chart
    axios.get(KONG_URL + '/get7DaysTrending', param).then((response) => {
      this.successShowLineChart(response);
    }).catch((error) => {
      //alert(error);
    });

    this.hideLoader();
  }

  getDataNegative(page) {
    var projectId = this.state.projectId;
    var start_date = new Date(localStorage.getItem('start_date')).getTime() || this.state.date.getTime();
    var end_date = new Date(localStorage.getItem('end_date')).getTime() || this.state.to_date.getTime();
    //get list buzzes negative
    axios.get(KONG_URL + '/listBuzz', {
      params: {
        type: -1,
        start: start_date,
        end: end_date,
        size: MAX_ROW,
        from: (page - 1) * MAX_ROW,
        userId: user_id,
        projectId: projectId
      }
    }).then((response) => {
      this.successShowListBuzzNeg(response);
    }).catch((error) => {
      //alert(error);
    });
  }

  getDataPositive(page) {
    var projectId = this.state.projectId;
    var start_date = new Date(localStorage.getItem('start_date')).getTime() || this.state.date.getTime();
    var end_date = new Date(localStorage.getItem('end_date')).getTime() || this.state.to_date.getTime();
    //get list buzzes negative
    axios.get(KONG_URL + '/listBuzz', {
      params: {
        type: 1,
        start: start_date,
        end: end_date,
        size: MAX_ROW,
        from: (page - 1) * MAX_ROW,
        userId: user_id,
        projectId: projectId
      }
    }).then((response) => {
      this.successShowListBuzzPos(response);
    }).catch((error) => {
      alert(error);
    });
  }

  getDataNeutral(page) {
    var projectId = this.state.projectId;
    var start_date = new Date(localStorage.getItem('start_date')).getTime() || this.state.date.getTime();
    var end_date = new Date(localStorage.getItem('end_date')).getTime() || this.state.to_date.getTime();
    //get list buzzes negative
    axios.get(KONG_URL + '/listBuzz', {
      params: {
        type: 0,
        start: start_date,
        end: end_date,
        size: MAX_ROW,
        from: (page - 1) * MAX_ROW,
        userId: user_id,
        projectId: projectId
      }
    }).then((response) => {
      this.successShowListBuzzNeutral(response);
    }).catch((error) => {
      //alert(error);
    });
  }

  handlePageClickNegative = pageClick => {
    this.setState({currentPageNegative: pageClick});
    this.getDataNegative(pageClick);
  };

  handlePageClickPositive = pageClick => {
    this.setState({currentPagePositive: pageClick});
    this.getDataPositive(pageClick);
  };

  handlePageClickNeutral = pageClick => {
    this.setState({currentPageNeutral: pageClick});
    this.getDataNeutral(pageClick);
  };

  successShowLineChart(response) {
    if (response.data && response.data.data) {
      var data = response.data.data;
      var listKeyword = [];
      var listNumberNegative = [];
      var listNumberNeutral = [];
      var listNumberPositive = [];
      for (let i = 0; i < data.length; i++) {
        var date = new Date(data[i].key);
        listKeyword.push(moment(date).format('DD MMM YY'));
        listNumberNegative.push(data[i].detail.Negative);
        listNumberNeutral.push(data[i].detail.Neutral)
        listNumberPositive.push(data[i].detail.Positive)
      }

      this.setState({
        mainChart: {
          labels: listKeyword,
          datasets: [
            {
              label: 'Neutral',
              backgroundColor: 'transparent',
              borderColor: brandInfo,
              pointHoverBackgroundColor: '#fff',
              borderWidth: 2,
              data: listNumberNeutral,
            },
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
        },
      });
    }

  }

  successShowListBuzzNeg(response) {
    var statusOption0 = {value: -1, label: 'Select ...'};
    var statusOption1 = {value: -1, label: 'Select ...'};
    var statusOption2 = {value: -1, label: 'Select ...'};
    this.setState({
      statusOption0, statusOption1, statusOption2
    });

    if (response.data && response.data.data) {
      var list_id = [];
      this.setState({
        dataTableNegative: response.data.data
      });
      let totalPageNegative = getTotalPage(response.data.total);
      this.setState({totalPageNegative});
      for (let i = 0; i < response.data.data.length; i++) {
        var name_field = "statusOption" + i;
        if (response.data.data[i]._source.status) {
          for (let item of this.state.statusOptions) {
            if (response.data.data[i]._source.status === item.value) {
              this.setState({
                [name_field]: item
              });
            }
          }
        }
        list_id.push(response.data.data[i]._source.from_id);
      }
      axios.post('http://123.30.108.126:2702/v1/facebook/name_from_ids', {
        "type": "user",
        "ids": list_id
      })
        .then((response) => {
          this.setState({
            list: response.data
          });
        })
        .catch((error) => {
          //alert(error);
        });
    }

  }

  successShowListBuzzPos(response) {
    if (response.data && response.data.data) {
      var list_id = [];
      this.setState({
        dataTablePositive: response.data.data
      });
      let totalPagePositive = getTotalPage(response.data.total);
      this.setState({totalPagePositive});
      for (let i = 0; i < response.data.data.length; i++) {
        list_id.push(response.data.data[i]._source.from_id);
      }
      axios.post('http://123.30.108.126:2702/v1/facebook/name_from_ids', {
        "type": "user",
        "ids": list_id
      })
        .then((response) => {
          this.setState({
            list_pos: response.data
          });
        })
        .catch((error) => {
          //alert(error);
        });
    }
  }

  successShowListBuzzNeutral(response) {
    if (response.data && response.data.data) {
      var list_id = [];
      this.setState({
        dataTableNeutral: response.data.data
      });
      let totalPageNeutral = getTotalPage(response.data.total);
      this.setState({totalPageNeutral});
      for (let i = 0; i < response.data.data.length; i++) {
        list_id.push(response.data.data[i]._source.from_id);
      }
      axios.post('http://123.30.108.126:2702/v1/facebook/name_from_ids', {
        "type": "user",
        "ids": list_id
      })
        .then((response) => {
          this.setState({
            list_neu: response.data
          });
        })
        .catch((error) => {
          //alert(error);
        });
    }
  }

  successShowKeyword(response) {
    if (response.data && response.data.data) {
      var data = response.data.data;
      var listKeyword = [];
      var listNumberNegative = [];
      var listNumberNeutral = [];
      var listNumberPositive = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].total && data[i].total > 0) {
          if (data[i].keyword) {
            listKeyword.push(data[i].keyword);
          }
          listNumberNegative.push(data[i].detail.negative);
          listNumberNeutral.push(data[i].detail.neutral);
          listNumberPositive.push(data[i].detail.positive);
        }

      }
      this.setState({
        dataHorizonBar: {
          labels: listKeyword,
          datasets: [
            {
              label: "Negative",
              backgroundColor: brandDanger,
              data: listNumberNegative,
            },
            {
              label: "Positive",
              backgroundColor: brandSuccess,
              data: listNumberPositive,
            },
            {
              label: "Neutral",
              backgroundColor: brandSecondary,
              data: listNumberNeutral,
            },
          ],
        },
      });
    }
  }

  successShowTopSource(response) {
    var data = response.data.data;
    var listUser = [];
    var listTotalUser = [];
    var listGroup = [];
    var listTotalGroup = [];
    var listPage = [];
    var listTotalPage = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === "user") {
        listUser.push(data[i].id);
        listTotalUser.push(data[i].total);
      }
      if (data[i].type === "group") {
        listGroup.push(data[i].id);
        listTotalGroup.push(data[i].total);
      }
      if (data[i].type === "page") {
        listPage.push(data[i].id);
        listTotalPage.push(data[i].total);
      }
    }
    this.setState({
      dataTopUserHorizonBar: {
        labels: listUser,
        datasets: [
          {
            label: "Total",
            backgroundColor: brandPrimary,
            data: listTotalUser,
          }
        ],
      },
      dataTopGroupHorizonBar: {
        labels: listGroup,
        datasets: [
          {
            label: "Total",
            backgroundColor: brandSuccess,
            data: listTotalGroup,
          }
        ],
      },
      dataTopPageHorizonBar: {
        labels: listPage,
        datasets: [
          {
            label: "Total",
            backgroundColor: brandWarning,
            data: listTotalPage,
          }
        ],
      },
    });
  }


  successShowChannel(response) {
    var total_user = 0, total_group = 0, total_page = 0,
      total_user_neutral = 0, total_user_negative = 0, total_user_positive = 0,
      total_group_neutral = 0, total_group_negative = 0, total_group_positive = 0,
      total_page_neutral = 0, total_page_negative = 0, total_page_positive = 0;
    if (response.data && response.data.total_detail[0] && response.data.total_detail[0].doc_count) {
      total_user = response.data.total_detail[0].doc_count;
    }
    if (response.data && response.data.total_detail[1] && response.data.total_detail[1].doc_count) {
      total_group = response.data.total_detail[1].doc_count;
    }
    if (response.data && response.data.total_detail[2] && response.data.total_detail[2].doc_count) {
      total_page = response.data.total_detail[2].doc_count;
    }
    if (response.data.total_detail[0] && response.data.total_detail[0]["3"].buckets[0]) {
      total_user_neutral = response.data.total_detail[0]["3"].buckets[0].doc_count;
    }
    if (response.data.total_detail[0] && response.data.total_detail[0]["3"].buckets[2]) {
      total_user_negative = response.data.total_detail[0]["3"].buckets[2].doc_count;
    }
    if (response.data.total_detail[0] && response.data.total_detail[0]["3"].buckets[1]) {
      total_user_positive = response.data.total_detail[0]["3"].buckets[1].doc_count;
    }
    if (response.data.total_detail[1] && response.data.total_detail[1]["3"].buckets[0]) {
      total_group_neutral = response.data.total_detail[1]["3"].buckets[0].doc_count;
    }
    if (response.data.total_detail[1] && response.data.total_detail[1]["3"].buckets[2]) {
      total_group_negative = response.data.total_detail[1]["3"].buckets[2].doc_count;
    }
    if (response.data.total_detail[1] && response.data.total_detail[1]["3"].buckets[1]) {
      total_group_positive = response.data.total_detail[1]["3"].buckets[1].doc_count;
    }
    if (response.data.total_detail[2] && response.data.total_detail[2]["3"].buckets[0]) {
      total_page_neutral = response.data.total_detail[2]["3"].buckets[0].doc_count;
    }
    if (response.data.total_detail[2] && response.data.total_detail[2]["3"].buckets[2]) {
      total_page_negative = response.data.total_detail[2]["3"].buckets[2].doc_count;
    }
    if (response.data.total_detail[2] && response.data.total_detail[2]["3"].buckets[1]) {
      total_page_positive = response.data.total_detail[2]["3"].buckets[1].doc_count;
    }
    this.setState({
      dataDoughnutChannelBreakdown: {
        datasets: [{
          data: [total_user, total_group, total_page],
          backgroundColor: [
            brandPrimary, brandWarning, brandSuccess
          ]
        }],

        labels: [
          'User',
          'Group',
          'Page'
        ]
      },
      dataBar: {
        labels: ["User", "Group", "Page"],
        datasets: [
          {
            label: "Positive",
            backgroundColor: brandSuccess,
            data: [total_user_positive,
              total_group_positive,
              total_page_positive]
          },
          {
            label: "Neutral",
            backgroundColor: brandSecondary,
            data: [total_user_neutral,
              total_group_neutral,
              total_page_neutral]
          },
          {
            label: "Negative",
            backgroundColor: brandDanger,
            data: [total_user_negative,
              total_group_negative,
              total_page_negative]
          },
        ],
      },
    });

  }

  successShowPos(response) {
    // console.log(response.data.total_detail[0].doc_count);
    var total_positive = 0, total_negative = 0, total_neutral = 0;
    if (response.data && response.data.total_detail[0]) {
      total_neutral = response.data.total_detail[0].doc_count;
    }
    if (response.data && response.data.total_detail[1]) {
      total_positive = response.data.total_detail[1].doc_count;
    }
    if (response.data && response.data.total_detail[2]) {
      total_negative = response.data.total_detail[2].doc_count;
    }
    this.setState({
      dataDoughnut: {
        datasets: [{
          data: [total_neutral, total_negative, total_positive],
          backgroundColor: [
            brandSecondary, brandDanger, brandSuccess
          ]
        }],

        labels: [
          'Neutral',
          'Negative',
          'Positive'
        ]
      },
    });

  }


  successShow(response) {
    var total_buzz = 0, post_count = 0, comment_count = 0, reply_count = 0;
    if (response.data && response.data.total_buzz) {
      total_buzz = response.data.total_buzz;
    }
    if (response.data && response.data.total_detail[0]) {
      post_count = response.data.total_detail[0].doc_count;
    }
    if (response.data && response.data.total_detail[1]) {
      comment_count = response.data.total_detail[1].doc_count;
    }
    if (response.data && response.data.total_detail[2]) {
      reply_count = response.data.total_detail[2].doc_count;
    }
    // console.log(response.data.total_detail[0].doc_count);
    this.setState({
      total_buzz: total_buzz,
      post_count: post_count,
      comment_count: comment_count,
      reply_count: reply_count,

    });

  }


  printDocument() {
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', [input.offsetHeight, input.offsetWidth]);
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save("report_FPT.pdf");
      })
    ;
  }

  reload() {
    window.location.reload();
  }

  getTableRow(index, data, view) {
    var type = "", href = "", user_id = "", href_type = "", src_img = "", user_name_neg = "", user_name_pos = "",
      user_name_neu = "";
    if (data._source && data._source.entity_type) {
      if (data._source.entity_type === 'user') {
        type = "timeline";
      }
      else {
        type = data._source.entity_type;
      }
    }
    if (data._source && data._source.url) {
      href_type = data._source.url;
    }

    if (data._source && data._source.from_id) {
      user_id = data._source.from_id;
      src_img = "http://graph.facebook.com/" + user_id + "/picture?type=square";
      href = "https://www.facebook.com/" + user_id;
    }
    if (this.state.list[user_id]) {
      user_name_neg = this.state.list[user_id];
    }
    if (this.state.list_pos[user_id]) {
      user_name_pos = this.state.list_pos[user_id];
    }
    if (this.state.list_neu[user_id]) {
      user_name_neu = this.state.list_neu[user_id];
    }
    var name_option = 'statusOption' + index;
    var array_keyword = [];
    var items = ["#fcf8e3", "#dff0d8", "#DDF4FF", "#d6dde7"];
    if (data._source.keyword) {
      for (let i = 0; i < data._source.keyword.split(',').length; i++) {
        var item = items[Math.floor(Math.random() * items.length)];
        array_keyword.push(<i key={i}
                              style={{background: item, fontSize: 13}}>{data._source.keyword.split(',')[i]}</i>);
        array_keyword.push(<span key={i + 100}>&nbsp;&nbsp;</span>)
      }
    }

    //console.log(name_option)
    if (view === "1") {
      return (
        <Col key={data._id} xs="12">
          <Card className={styles.cardStyleNegative}>
            <CardHeader className={styles.headerStyle}>
              <span className={styles.subStyle}>Hoạt động trên {type}</span>
              <div className="float-left">
                <Select
                  name={name_option}
                  //placeholder="Status ..."
                  value={this.state[name_option]}
                  options={this.state.statusOptions}
                  onChange={this.onChangeStatus(name_option, data._id)}
                  styles={colourStyles}
                />
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs="1">
                  <img src={src_img} className={styles.imageStyle}
                       alt="admin@bootstrapmaster.com"/>
                </Col>
                <Col>
                  <div>
                    <i className="fa fa-facebook-square text-primary"></i>{" "}
                    <a target="_blank" rel="noopener noreferrer" href={href}
                       className="text-primary"><u>{user_name_neg}</u></a>{" "}
                    <span className="text-secondary">{data._source.type} on{" "}</span>
                    <a target="_blank" rel="noopener noreferrer" href={href_type} className="text-primary"><u>{type}</u></a>
                    <CardText className="font-weight-normal text-secondary" style={{fontSize: "small"}}>
                      {moment(data._source.created_time).format('DD MMM YYYY, HH:mm')}
                    </CardText>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs="1">
                </Col>
                <Col>
                  <CardText>
                    {data._source.text}
                  </CardText>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col xs="1">
                </Col>
                <Col>
                  <div className="bd-example">
                    <p>{array_keyword}</p>
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter><span style={{color: brandDanger}}><i
              className="fa fa-frown-o"></i> Negative</span></CardFooter>
          </Card>
        </Col>
      )
    }
    else if (view === "2") {
      return (
        <Col key={data._id} xs="12">
          <Card className={styles.cardStylePositive}>
            <CardHeader className={styles.headerStyle}>
              <span className={styles.subStyle}>Hoạt động trên {type}</span>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs="1">
                  <img src={src_img} className={styles.imageStyle}
                       alt="admin@bootstrapmaster.com"/>
                </Col>
                <Col>
                  <div>
                    <i className="fa fa-facebook-square text-primary"></i>{" "}
                    <a target="_blank" rel="noopener noreferrer" href={href}
                       className="text-primary"><u>{user_name_pos}</u></a>{" "}
                    <span className="text-secondary">{data._source.type} on{" "}</span>
                    <a target="_blank" rel="noopener noreferrer" href={href_type} className="text-primary"><u>{type}</u></a>
                    <CardText className="font-weight-normal text-secondary" style={{fontSize: "small"}}>
                      {moment(data._source.created_time).format('DD MMM YYYY, HH:mm')}
                    </CardText>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs="1">
                </Col>
                <Col>
                  <CardText>
                    {data._source.text}
                  </CardText>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col xs="1">
                </Col>
                <Col>
                  <div className="bd-example">
                    <p>{array_keyword}</p>
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter><span style={{color: brandSuccess}}><i
              className="fa fa-smile-o"></i> Positive</span></CardFooter>
          </Card>
        </Col>)

    }
    else if (view === "3") {
      return (
        <Col key={data._id} xs="12">
          <Card className={styles.cardStyleNeutral}>
            <CardHeader className={styles.headerStyle}>
              <span className={styles.subStyle}>Hoạt động trên {type}</span>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs="1">
                  <img src={src_img} className={styles.imageStyle}
                       alt="admin@bootstrapmaster.com"/>
                </Col>
                <Col>
                  <div>
                    <i className="fa fa-facebook-square text-primary"></i>{" "}
                    <a target="_blank" rel="noopener noreferrer" href={href}
                       className="text-primary"><u>{user_name_neu}</u></a>{" "}
                    <span className="text-secondary">{data._source.type} on{" "}</span>
                    <a target="_blank" rel="noopener noreferrer" href={href_type} className="text-primary"><u>{type}</u></a>
                    <CardText className="font-weight-normal text-secondary" style={{fontSize: "small"}}>
                      {moment(data._source.created_time).format('DD MMM YYYY, HH:mm')}
                    </CardText>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs="1">
                </Col>
                <Col>
                  <CardText>
                    {data._source.text}
                  </CardText>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col xs="1">
                </Col>
                <Col>
                  <div className="bd-example">
                    <p>{array_keyword}</p>
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter><span style={{color: brandSecondary}}><i
              className="fa fa-smile-o"></i> Neutral</span></CardFooter>
          </Card>
        </Col>)

    }

  }

  filterItemsInPage = (data, view) => {
    if (view === "1") {
      return data
        .map((data, index) => this.getTableRow(index, data, view))
    }
    else if (view === "2") {
      return data
        .map((data, index) => this.getTableRow(index, data, view))
    }
    else if (view === "3") {
      return data
        .map((data, index) => this.getTableRow(index, data, view))
    }

  };

  switchView = view => {
    if (view === "search") {
      return (
        this.filterItemsInPage(this.state.searchTable, view)
      );
    } else if (view === "1") {
      return (
        this.filterItemsInPage(this.state.dataTableNegative, view)
      );
    } else if (view === "2") {
      return (
        this.filterItemsInPage(this.state.dataTablePositive, view)
      );

    } else if (view === "3") {
      return (
        this.filterItemsInPage(this.state.dataTableNeutral, view)
      );

    }
  };

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
    localStorage.setItem(e.target.name, e.target.value);
    console.log(e.target.value);
  }
  onChangeLineChart = (selectedOption) => {
    this.setState({
      lineOption: selectedOption
    });
    var param = {
      params: {
        userId: user_id,
        projectId: this.state.projectId
      }
    };
    //get line chart
    axios.get(KONG_URL + '/get7DaysTrending?days=' + selectedOption.value, param).then((response) => {
      this.successShowLineChart(response);
    }).catch((error) => {
      alert(error);
    });
  }

  onChangeStatus = (name_option, id) => (selectedOption) => {
    var from = null;
    if (this.state[name_option]) {
      from = this.state[name_option].value;
    }
    this.setState({
      [name_option]: selectedOption
    });
    //get line chart
    axios.post(KONG_URL + '/updateStatus', {
      userId: user_id,
      projectId: this.state.projectId,
      buzzId: id,
      from: from,
      to: selectedOption.value
    }).catch((error) => {
      alert(error);
    });
  }

  onChangeBuzz = (selectedOption) => {
    this.setState({
      buzzOption: selectedOption
    });
  }

  onChangeStartDate = start_date => {
    if (start_date) {
      this.setState({date: start_date});
      localStorage.setItem("start_date", start_date);
    }
    else {
      this.setState({date: new Date(moment().subtract(1, 'days').toString())});
      localStorage.setItem("start_date", new Date(moment().subtract(1, 'days').toString()));
    }


    // console.log(this.state.start_date);
  }
  onChangeEndDate = end_date => {
    if (end_date) {
      this.setState({to_date: end_date});
      localStorage.setItem("end_date", end_date);
    }
    else {
      this.setState({to_date: new Date()});
      localStorage.setItem("end_date", new Date());
    }

  }


  render() {
    return (

      <Container className="animated fadeIn">
        {(this.state.loading) ? <Loader/> :
          <Card>
            <CardHeader>
              <span className="h4 text-uppercase">Report</span>
            </CardHeader>
            <CardBody id="divToPrint">
              {/*<div>*/}
              {/*<DateTimePicker*/}
              {/*onChange={this.onChangeStartDate}*/}
              {/*value={this.state.date}*/}
              {/*/>*/}
              {/*</div>*/}
              {/*<div>*/}
              {/*<DateTimePicker*/}
              {/*onChange={this.onChangeEndDate}*/}
              {/*value={this.state.to_date}*/}
              {/*/>*/}
              {/*</div>*/}
              <div>
                <Row>
                  <Col md="4">
                    <FormGroup row>
                      <Col md="3">
                        <Label>From Date</Label>
                      </Col>
                      <Col md="8">
                        <DateTimePicker
                          onChange={this.onChangeStartDate}
                          value={this.state.date}
                        />
                        {/*<Input type="datetime-local" className="form-control-warning" name="start_date"*/}
                        {/*value={this.state.start_date}*/}
                        {/*onChange={this.onChange}/>*/}
                      </Col>

                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup row>
                      <Col md="2">
                        <Label>To Date</Label>
                      </Col>
                      <Col md="8">
                        <DateTimePicker
                          onChange={this.onChangeEndDate}
                          value={this.state.to_date}
                        />
                        {/*<Input type="datetime-local" className="form-control-warning" name="end_date"*/}
                        {/*value={this.state.end_date}*/}
                        {/*onChange={this.onChange}/>*/}
                      </Col>

                    </FormGroup>


                  </Col>
                  <Col md="4">
                    <Button onClick={this.reload} color="primary">Search</Button>
                  </Col>
                </Row>
              </div>
              <br/>
              <br/>
              <CardDeck>
                <Card>
                  <CardBody>
                    <CardTitle className={styles.titleStyle}>{this.state.total_buzz} <br/>
                      TOTAL BUZZ</CardTitle>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <CardTitle className={styles.titleStyle}>{this.state.post_count}<br/>
                      POSTS</CardTitle>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <CardTitle className={styles.titleStyle}>{this.state.comment_count}<br/>
                      COMMENTS</CardTitle>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <CardTitle className={styles.titleStyle}>{this.state.reply_count} <br/>
                      REPLIES</CardTitle>
                  </CardBody>
                </Card>
              </CardDeck>
              <br/>
              <Card>
                <CardHeader className={styles.titleStyle}>SENTIMENT TRENDLINE</CardHeader>
                <Select
                  name="lineOption"
                  value={this.state.lineOption}
                  options={this.state.lineOptions}
                  onChange={this.onChangeLineChart}
                  styles={customStyles}
                />
                <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
                  <Line data={this.state.mainChart} options={mainChartOpts} height={300}/>
                </div>
              </Card>
              <Card>
                <CardHeader className={styles.titleStyle}>BUZZ INFO</CardHeader>
                <Container>
                  <Row>
                    <CardBody>
                      <Select
                        name="buzzOption"
                        value={this.state.buzzOption}
                        options={this.state.buzzOptions}
                        onChange={this.onChangeBuzz}
                        styles={customStyles}
                      />
                      {this.state.buzzOption.value === 1 &&
                      <div>
                        {this.state.dataTableNegative.length > 0 &&
                        <Row style={{paddingTop: "30px"}}>
                          {this.switchView("1")}
                        </Row>
                        }
                        <Pagination onChange={this.handlePageClickNegative} current={this.state.currentPageNegative}
                                    total={this.state.totalPageNegative * 10}/>
                      </div>}
                      {this.state.buzzOption.value === 2 &&
                      <div>
                        {this.state.dataTablePositive.length > 0 &&
                        <Row style={{paddingTop: "30px"}}>
                          {this.switchView("2")}
                        </Row>
                        }
                        <Pagination onChange={this.handlePageClickPositive} current={this.state.currentPagePositive}
                                    total={this.state.totalPagePositive * 10}/>
                      </div>
                      }
                      {this.state.buzzOption.value === 3 &&
                      <div>
                        {this.state.dataTableNeutral.length > 0 &&
                        <Row style={{paddingTop: "30px"}}>
                          {this.switchView("3")}
                        </Row>
                        }
                        <Pagination onChange={this.handlePageClickNeutral} current={this.state.currentPageNeutral}
                                    total={this.state.totalPageNeutral * 10}/>
                      </div>}
                    </CardBody>
                  </Row>
                </Container>
              </Card>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i><strong>ChoroplethMap</strong>
                </CardHeader>
                <CardBody>
                  <ChoroplethMap userId={user_id} projectId={this.state.projectId}/>
                </CardBody>
                <CardFooter>
                </CardFooter>
              </Card>
              <Row>
                <Col xs="6">
                  <Card>
                    <CardHeader className={styles.titleStyle}>
                      OVERALL SENTIMENT
                    </CardHeader>
                    <div className="chart-wrapper"
                         style={{height: 300 + 'px', marginTop: 40 + 'px', marginBottom: 40 + 'px'}}>
                      <Doughnut data={this.state.dataDoughnut} options={optDoughnut}/>
                    </div>
                  </Card>
                </Col>
                <Col xs="6">
                  <Card>
                    <CardHeader className={styles.titleStyle}>CHANNEL BY SENTIMENT</CardHeader>
                    <div className="chart-wrapper"
                         style={{height: 300 + 'px', marginTop: 40 + 'px', marginBottom: 40 + 'px'}}>
                      <Bar data={this.state.dataBar} options={optBar}/>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Card>
                <CardHeader className={styles.titleStyle}>ATTRIBUTE BREAKDOWN</CardHeader>
                <div className="chart-wrapper">
                  <HorizontalBar data={this.state.dataHorizonBar} options={optHorizonBar}/>
                </div>
              </Card>
              {/*<Card>*/}
              {/*<CardHeader className={styles.titleStyle}><span*/}
              {/*style={{color: brandSuccess}}>POSITIVE BUZZES</span></CardHeader>*/}
              {/*<Container style={{paddingTop: "30px"}}>*/}
              {/*<Row>*/}
              {/*<CardBody>*/}
              {/*{this.state.dataTablePositive.length > 0 &&*/}
              {/*<Row>*/}
              {/*{this.switchView("2")}*/}
              {/*</Row>*/}
              {/*}*/}
              {/*<Pagination onChange={this.handlePageClickPositive} current={this.state.currentPagePositive}*/}
              {/*total={this.state.totalPagePositive * 10}/>*/}
              {/*</CardBody>*/}
              {/*</Row>*/}
              {/*</Container>*/}
              {/*</Card>*/}
              {/*<Card>*/}
              {/*<CardHeader className={styles.titleStyle}>*/}
              {/*POPULAR HEADLINES*/}
              {/*</CardHeader>*/}
              {/*<Container style={{paddingTop: "30px"}}>*/}
              {/*<Row>*/}
              {/*<Col xs="4">*/}
              {/*<Card>*/}
              {/*<CardImg src="http://admin.antt.vn/upload/2019/01/20/61.jpg"></CardImg>*/}
              {/*<CardHeader className={styles.headerStyleNew}>*/}
              {/*<CardTitle><a href="#/report">Diễn đàn Kinh tế Việt Nam 2019: Khơi thông các điểm*/}
              {/*nghẽn</a></CardTitle>*/}
              {/*<CardSubtitle className="font-weight-normal text-secondary"*/}
              {/*style={{fontSize: "small", textAlign: "center"}}>20/01/2019</CardSubtitle>*/}
              {/*</CardHeader>*/}
              {/*<CardBody>*/}
              {/*<CardText className={styles.bodyStyle}>*/}
              {/*<a href="#/report">antt.vn</a>, <a href="#/report">thoibao.today</a>, <a*/}
              {/*href="#/report">baohaiquan.vn</a>*/}
              {/*and 2*/}
              {/*others*/}
              {/*</CardText>*/}
              {/*</CardBody>*/}
              {/*<CardFooter><span style={{color: brandSuccess}}><i className="fa fa-smile-o"></i> Positive</span></CardFooter>*/}
              {/*</Card>*/}
              {/*</Col>*/}
              {/*<Col xs="4">*/}
              {/*<Card>*/}
              {/*<CardImg*/}
              {/*src="http://cafefcdn.com/zoom/600_315/2019/photo1547949507791-1547949508084-crop-1547949589436909817925.jpg"></CardImg>*/}
              {/*<CardHeader className={styles.headerStyleNew}>*/}
              {/*<CardTitle><a href="#/report">Chuyện sinh viên ĐH Kinh tế Quốc dân xử lý dữ liệu tốt hơn ĐH Bách*/}
              {/*Khoa và*/}
              {/*điểm yếu của ngành mà trả lương tới 7.000 USD/tháng vẫn không kiếm được người</a></CardTitle>*/}
              {/*<CardSubtitle className="font-weight-normal text-secondary"*/}
              {/*style={{fontSize: "small", textAlign: "center"}}>20/01/2019</CardSubtitle>*/}
              {/*</CardHeader>*/}
              {/*<CardBody>*/}
              {/*<CardText className={styles.bodyStyle}>*/}
              {/*<a href="#/report">baohomnay.net</a>, <a href="#/report">genk.vn</a>, <a*/}
              {/*href="#/report">cafef.vn</a>*/}
              {/*</CardText>*/}
              {/*</CardBody>*/}
              {/*<CardFooter><span style={{color: brandSuccess}}><i className="fa fa-smile-o"></i> Positive</span></CardFooter>*/}
              {/*</Card>*/}
              {/*</Col>*/}
              {/*<Col xs="4">*/}
              {/*<Card>*/}
              {/*<CardImg*/}
              {/*src="http://cafefcdn.com/zoom/600_315/2019/1/19/photo-1-15478953685311720516470-crop-1547896926954379184368.jpg"></CardImg>*/}
              {/*<CardHeader className={styles.headerStyleNew}>*/}
              {/*<CardTitle><a href="#/report">Diễn đàn Kinh tế Việt Nam 2019: Khơi thông các điểm*/}
              {/*nghẽn</a></CardTitle>*/}
              {/*<CardSubtitle className="font-weight-normal text-secondary"*/}
              {/*style={{fontSize: "small", textAlign: "center"}}>20/01/2019</CardSubtitle>*/}
              {/*</CardHeader>*/}
              {/*<CardBody>*/}
              {/*<CardText className={styles.bodyStyle}>*/}
              {/*<a href="#/report">baohomnay.net</a>, <a href="#/report">cafef.vn</a>, <a*/}
              {/*href="#/report">ttvn.vn</a>*/}
              {/*</CardText>*/}
              {/*</CardBody>*/}
              {/*<CardFooter><span style={{color: brandSuccess}}><i className="fa fa-smile-o"></i> Positive</span></CardFooter>*/}
              {/*</Card>*/}
              {/*</Col>*/}
              {/*</Row>*/}
              {/*<Row>*/}
              {/*<Col xs="4">*/}
              {/*<Card>*/}
              {/*<CardImg src="http://admin.antt.vn/upload/2019/01/20/61.jpg"></CardImg>*/}
              {/*<CardHeader className={styles.headerStyleNew}>*/}
              {/*<CardTitle><a href="#/report">Diễn đàn Kinh tế Việt Nam 2019: Khơi thông các điểm*/}
              {/*nghẽn</a></CardTitle>*/}
              {/*<CardSubtitle className="font-weight-normal text-secondary"*/}
              {/*style={{fontSize: "small", textAlign: "center"}}>20/01/2019</CardSubtitle>*/}
              {/*</CardHeader>*/}
              {/*<CardBody>*/}
              {/*<CardText className={styles.bodyStyle}>*/}
              {/*<a href="#/report">antt.vn</a>, <a href="#/report">thoibao.today</a>, <a*/}
              {/*href="#/report">baohaiquan.vn</a>*/}
              {/*and 2*/}
              {/*others*/}
              {/*</CardText>*/}
              {/*</CardBody>*/}
              {/*<CardFooter><span style={{color: brandSuccess}}><i className="fa fa-smile-o"></i> Positive</span></CardFooter>*/}
              {/*</Card>*/}
              {/*</Col>*/}
              {/*<Col xs="4">*/}
              {/*<Card>*/}
              {/*<CardImg*/}
              {/*src="http://cafefcdn.com/zoom/600_315/2019/photo1547949507791-1547949508084-crop-1547949589436909817925.jpg"></CardImg>*/}
              {/*<CardHeader className={styles.headerStyleNew}>*/}
              {/*<CardTitle><a href="#/report">Chuyện sinh viên ĐH Kinh tế Quốc dân xử lý dữ liệu tốt hơn ĐH Bách*/}
              {/*Khoa và*/}
              {/*điểm yếu của ngành mà trả lương tới 7.000 USD/tháng vẫn không kiếm được người</a></CardTitle>*/}
              {/*<CardSubtitle className="font-weight-normal text-secondary"*/}
              {/*style={{fontSize: "small", textAlign: "center"}}>20/01/2019</CardSubtitle>*/}
              {/*</CardHeader>*/}
              {/*<CardBody>*/}
              {/*<CardText className={styles.bodyStyle}>*/}
              {/*<a href="#/report">baohomnay.net</a>, <a href="#/report">genk.vn</a>, <a*/}
              {/*href="#/report">cafef.vn</a>*/}
              {/*</CardText>*/}
              {/*</CardBody>*/}
              {/*<CardFooter><span style={{color: brandSuccess}}><i className="fa fa-smile-o"></i> Positive</span></CardFooter>*/}
              {/*</Card>*/}
              {/*</Col>*/}
              {/*<Col xs="4">*/}
              {/*<Card>*/}
              {/*<CardImg*/}
              {/*src="http://cafefcdn.com/zoom/600_315/2019/1/19/photo-1-15478953685311720516470-crop-1547896926954379184368.jpg"></CardImg>*/}
              {/*<CardHeader className={styles.headerStyleNew}>*/}
              {/*<CardTitle><a href="#/report">Diễn đàn Kinh tế Việt Nam 2019: Khơi thông các điểm*/}
              {/*nghẽn</a></CardTitle>*/}
              {/*<CardSubtitle className="font-weight-normal text-secondary"*/}
              {/*style={{fontSize: "small", textAlign: "center"}}>20/01/2019</CardSubtitle>*/}
              {/*</CardHeader>*/}
              {/*<CardBody>*/}
              {/*<CardText className={styles.bodyStyle}>*/}
              {/*<a href="#/report">baohomnay.net</a>, <a href="#/report">cafef.vn</a>, <a*/}
              {/*href="#/report">ttvn.vn</a>*/}
              {/*</CardText>*/}
              {/*</CardBody>*/}
              {/*<CardFooter><span style={{color: brandSuccess}}><i className="fa fa-smile-o"></i> Positive</span></CardFooter>*/}
              {/*</Card>*/}
              {/*</Col>*/}
              {/*</Row>*/}
              {/*</Container>*/}
              {/*</Card>*/}
              <Card>
                <CardHeader className={styles.titleStyle}>
                  CHANNEL BREAKDOWN
                </CardHeader>
                <div className="chart-wrapper" style={{marginTop: 40 + 'px', marginBottom: 40 + 'px'}}>
                  <Doughnut data={this.state.dataDoughnutChannelBreakdown} options={optDoughnutChannelBreakdown}/>
                </div>
              </Card>
              <Card>
                <CardHeader className={styles.titleStyle}>
                  TOP SOURCES
                </CardHeader>
                <Container style={{paddingTop: 30 + "px"}}>
                  <Row style={{justifyContent: 'center'}}>
                    <Col xs="4">
                      <Card>
                        <CardHeader style={{backgroundColor: brandPrimary, color: "white"}}>
                          <CardTitle className={styles.titleStyle}>TOP FACEBOOK USERS</CardTitle>
                        </CardHeader>
                        <CardBody>
                          <div className="chart-wrapper">
                            <HorizontalBar data={this.state.dataTopUserHorizonBar}/>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs="4">
                      <Card>
                        <CardHeader style={{backgroundColor: brandSuccess, color: "white"}}>
                          <CardTitle className={styles.titleStyle}>TOP FACEBOOK GROUPS</CardTitle>
                        </CardHeader>
                        <CardBody>
                          <div className="chart-wrapper">
                            <HorizontalBar data={this.state.dataTopGroupHorizonBar}/>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs="4">
                      <Card>
                        <CardHeader style={{backgroundColor: brandWarning, color: "white"}}>
                          <CardTitle className={styles.titleStyle}>TOP FACEBOOK PAGES</CardTitle>
                        </CardHeader>
                        <CardBody>
                          <div className="chart-wrapper">
                            <HorizontalBar data={this.state.dataTopPageHorizonBar}/>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </Card>

              <div className="text-center">
                <Button onClick={this.printDocument} color="primary">Export PDF</Button>
              </div>
            </CardBody>
          </Card>}
      </Container>
    );
  }
}

export default Report;
