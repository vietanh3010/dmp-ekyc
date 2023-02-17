export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
export const LOAD_CAMPAIGN = 'LOAD_CAMPAIGN';
export const ADD_CAMPAIGN = 'ADD_CAMPAIGN';
export const DELETE_CAMPAIGN = 'DELETE_CAMPAIGN';
export const EDIT_CAMPAIGN = 'EDIT_CAMPAIGN';
export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';

const configKeys = require('../config/keys');
export const API_URL = configKeys.apiUrl;
export const KONG_URL = configKeys.kongUrl;
export const CALLBACK_URL = configKeys.callbackUrl;
export const ID_TOKEN = configKeys.idToken;


export const API_KONG_URL = 'https://cors-anywhere.herokuapp.com/http://kong.knowlead.io/api/dmp/v1/interests';
export const API_KONG_URL_SEARCH = 'https://cors-anywhere.herokuapp.com/http://kong.knowlead.io/api/dmp/v1/customers/?';
export const API_KONG_HEADER = {
  'apikey': 'zWu5yyFr6YR3Qf5IMYlWHaNTLEIuGA1Y'
};
export const optionsLocations = [
  {value: 'HN', label: 'Hà Nội'},
  {value: 'SG', label: 'Sài Gòn'},
  {value: 'DN', label: 'Đà Nẵng'}
];
export const optionsSalesField = [
  {value: 'K', label: 'Kẹo'},
  {value: 'Đ', label: 'Đèn'},
  {value: 'B', label: 'Bàn ghế'}
];
export const optionsModels = [
  {value: 1, label: 'Tìm tập giống nhau'},
  {value: 2, label: 'Tìm theo fanpage'}
];
export const optionsReports = [
  {value: 'email', label: 'Email'},
  {value: 'fb', label: 'Facebook'}
];

export const optionsStatus = [
  {value: 1, label: 'Đang hoạt động'},
  {value: 0, label: 'Không hoạt động'},
]

export const optionsSuperuserTypes = [
  {value: 'normal', label: 'Bình thường'},
  {value: 'vip', label: 'VIP'}
];

export const emailList = [
  // {value: 1, label: 'HoaTD@fsoft.com.vn'},
  {value: 1, label: 'KhacDV@fsoft.com.vn'},
  {value: 1, label: 'yenctb@fsoft.com.vn'},
  {value: 1, label: 'Ngant6@fsoft.com.vn'},
  {value: 1, label: 'ViPTQ@fsoft.com.vn'},
  // {value: 1, label: 'duonghtt3@fsoft.com.vn'},
  {value: 1, label: 'chungph1@fsoft.com.vn'},
  // {value: 2, label: 'VietNX@fpt.com.vn'},
  {value: 2, label: 'LoanPT@fpt.com.vn'},
  {value: 3, label: 'TuVA@fpt.com.vn'},
  {value: 4, label: 'HienNM@fpt.com.vn'},
  {value: 4, label: 'VuongNM@fpt.com.vn'},
  {value: 4, label: 'ThuyTHD@fpt.com.vn'},
  // {value: 5, label: 'Thanhha@fpt.com.vn'},
  {value: 5, label: 'ThiHTC@fpt.com.vn'},
  {value: 5, label: 'TuanLH@fpt.com.vn'},
  {value: 5, label: 'HuyenVTT8@fpt.com.vn'},
  // {value: 6, label: 'VuNL@fpt.com.vn'},
  {value: 6, label: 'Bichlien@vnexpress.net'},
  {value: 7, label: 'CuongTT@fe.edu.vn'},
  // {value: 8, label: 'PhuongNK@fpt.com.vn'},
  // {value: 8, label: 'HuyCQ@fpt.com.vn'},
  // {value: 1, label: 'ngocnb9@fpt.com.vn'},
  // {value: 1, label: 'longtd9@fpt.com.vn'},
  // {value: 1, label: 'bangnbx@fpt.com.vn'},
];

export const specialEmail = [
  {value: 0, label: 'VietLH@fpt.com.vn'},
  // {value: 0, label: 'longtd9@fpt.com.vn'},
  {value: 0, label: 'thaottl@fpt.com.vn'},
  {value: 0, label: 'yenvh2@fpt.com.vn'},
  {value: 0, label: 'PhuongNk@fpt.com.vn'},
  {value: 0, label: 'Thephuong@fpt.com.vn'},
  {value: 0, label: 'ChauBNP@fpt.com.vn'},
  {value: 0, label: 'HuyCQ@fpt.com.vn'},
  {value: 0, label: 'TrangNM15@fpt.com.vn'},
];
