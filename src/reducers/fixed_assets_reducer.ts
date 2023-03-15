import * as actionTypes from '@actions/types/fixed_assets_type';

const initialState = {
  message: '',
  listFixedAsset: [],
  listScanAsset: [],
  error: false,
  loading: true,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_LIST_FIXED_ASSET:
      return {
        ...state,
        loading: true,
        listFixedAsset: [],
      };
    case actionTypes.GET_LIST_FIXED_ASSET_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listFixedAsset: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_FIXED_ASSET_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.ADD_LIST_ASSET_SCAN:
      const listData = [].concat(state.listScanAsset) as any[];
      if (listData.findIndex(item => item.AssetCode === action.data.AssetCode) === -1) {
        listData.unshift(action.data)
      }
      return {
        ...state,
        listScanAsset: listData,
      };
    case actionTypes.CLEAR_LIST_ASSET_SCAN:
      return {
        ...state,
        listScanAsset: [],
      };
    default:
      return state;
  }
}
