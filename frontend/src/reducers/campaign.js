// import {combineActions, handleActions} from "redux-actions";
// import {loadCampaign} from "../actions/campaign";

// const initialState = {};

// export default handleActions(
//   {
//     [loadCampaign](state) {
//       return state;
//     }
//   },
//   {
//     campaign: {
//       content: {
//         email: false,
//         list: true,
//         sms: false
//       },
//       object: '1',
//       plan: {
//         intent: '1'
//       }
//     }
//   }
// );

// export default campaign;


import { ADD_CAMPAIGN, DELETE_CAMPAIGN, EDIT_CAMPAIGN } from '../constants/ActionTypes';

const initialState = [{
    text: 'Campaign',
    id: 0
}];

export default function campaigns(state = initialState, action) {
    switch (action.type) {
        case ADD_CAMPAIGN:
            return [{
                id: (state.length === 0) ? 0 : state[0].id + 1,
                marked: false,
                data: action.data
            }, ...state];

        case DELETE_CAMPAIGN:
            return state.filter((campaign) => campaign.id !== action.id);

        case EDIT_CAMPAIGN:
            return state.map((campaign) => campaign.id === action.id ? { ...campaign, data: action.data } : campaign);

        default:
            return state;
    }
}