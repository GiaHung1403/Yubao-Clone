import {
    ADD_LIST_ASSET_SCAN, CLEAR_LIST_ASSET_SCAN,
    GET_LIST_FIXED_ASSET,
} from './types/fixed_assets_type';

export const getListFixedAsset =
    ({
         User_ID,
         Password,
         AssetCode,
         LocationCode,
         BranchCode
     }) => ({
        type: GET_LIST_FIXED_ASSET,
        data: {
            User_ID,
            Password,
            AssetCode,
            LocationCode,
            BranchCode
        },
    });

export const addListAssetScan =
    ({
         AssetCode,
         AssetName,
         Date
     }) => ({
        type: ADD_LIST_ASSET_SCAN,
        data: {
            AssetCode,
            AssetName,
            Date
        },
    });

export const clearListAssetScan = () =>
    ({
        type: CLEAR_LIST_ASSET_SCAN,
    });
