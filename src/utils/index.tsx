import {Dimensions, Platform} from 'react-native';
import getImageSize from './getImageSize';

export {formatVND} from "./formatMoney";
export {removeVietnameseTones} from "./removeVietnameseTones";

const valueRem = Dimensions.get('window').width / 414;
export const rem = valueRem > 1.5 ? 1.5 : valueRem;

export {getImageSize};

export const catchErrorData = (error: any, type?: any) => {
    if (__DEV__) {
        console.log({error});
    }

    if (!error.response) {
        return {
            type,
            message: 'Không thể kết nối đến server',
            code: '',
        };
    } else {
        const {response} = error;
        const {data} = response;
        const {code} = response.data;
        let message = '';
        switch (response.status) {
            case 401:
                message = 'Truy cập không hợp lệ!';
                break;
            case 403:
                message =
                    code === 'invalidPassword'
                        ? 'Xác thực không chính xác!'
                        : 'Quyền truy cập bị từ chối!';
                break;
            case 404:
                message = 'Không tìm thấy dữ liệu mong muốn!';
                break;
            case 422:
                data.properties
                    ? data.properties.forEach((property: any) => {
                        message += `${data.propertyErrors[property]}\n`;
                    })
                    : (message = data.code);
                break;
            case 500:
                message = 'Lỗi không mong muốn!';
                break;
            default:
                break;
        }
        return {
            type,
            message,
            code,
        };
    }
};

export const catchErrorDataSuccess = (response: any, type: any) => {
    const {data} = response;
    let code = '';
    switch (data.status) {
        case 401:
            code = 'loggedOut';
            break;
        case 403:
            code = '';
            break;
        default:
            break;
    }
    return {
        type,
        message: data.message,
        code,
    };
};

export class CustomError extends Error {
    date: Date;
    code: string;

    constructor(code = '', message, ...params) {
        super(...params);

        // if (Error.captureStackTrace) {
        //   Error.captureStackTrace(this, CustomError);
        // }

        this.code = code;
        this.message = message;
        this.date = new Date();
    }
}

export const convertUnixTimeNotification = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];
    const days = [
        'Chủ nhật',
        'Thứ 2',
        'Thứ 3',
        'Thứ 4',
        'Thứ 5',
        'Thứ 6',
        'Thứ 7',
    ];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const day = days[a.getDay()];
    const hour = a.getHours();
    const min = a.getMinutes();

    const time = `${zeroFill(hour, 2)}:${zeroFill(min, 2)} ${day}, ${zeroFill(
        date,
        2,
    )}/${month}/${year}`;
    return {time, date};
};

export const convertUnixTimeWithDay = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];
    const days = [
        'Chủ nhật',
        'Thứ 2',
        'Thứ 3',
        'Thứ 4',
        'Thứ 5',
        'Thứ 6',
        'Thứ 7',
    ];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const day = days[a.getDay()];
    const hour = a.getHours();
    const min = a.getMinutes();

    const time = `${day}, ${zeroFill(date, 2)}/${month}/${year}`;
    return time;
};

export const convertUnixTimeFull = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];
    const days = [
        'Chủ nhật',
        'Thứ 2',
        'Thứ 3',
        'Thứ 4',
        'Thứ 5',
        'Thứ 6',
        'Thứ 7',
    ];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const day = days[a.getDay()];
    const hour = a.getHours();
    const min = a.getMinutes();

    return `${zeroFill(date, 2)}/${zeroFill(month, 2)}/${year} ${zeroFill(hour, 2)}:${zeroFill(min, 2)}`;
};

export const convertUnixTimeFullWithStrikethrough = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];
    const days = [
        'Chủ nhật',
        'Thứ 2',
        'Thứ 3',
        'Thứ 4',
        'Thứ 5',
        'Thứ 6',
        'Thứ 7',
    ];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const day = days[a.getDay()];
    const hour = a.getHours();
    const min = a.getMinutes();
    const second = a.getSeconds();

    return `${year}-${zeroFill(month, 2)}-${zeroFill(date, 2)} ${zeroFill(hour, 2)}:${zeroFill(min, 2)}:${zeroFill(second, 2)}`;
};

export const convertUnixTimeDDMMYYYY = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();

    const time = `${zeroFill(date, 2)}/${month}/${year}`;
    return time;
};

export const convertUnixTimeWithHours = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);

    const hour = a.getHours();
    const min = a.getMinutes();

    const time = `${zeroFill(hour, 2)}:${zeroFill(min, 2)}`;
    return time;
};

export const convertUnixTimeSolid = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];

    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();

    const time = `${zeroFill(date, 2)}/${month}/${year}`;
    return time;
};

export const convertUnixTimeMMDDYYYY = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];

    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();

    const time = `${month}/${zeroFill(date, 2)}/${year}`;
    return time;
};

export const convertUnixTimeNoSpace = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];

    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();

    const time = `${zeroFill(date, 2)}${month}${year}`;
    return time;
};

export const convertUnixTimeNoSpaceYYYYMMDD = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];

    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();

    const time = `${year}${month}${zeroFill(date, 2)}`;
    return time;
};

export const convertUnixTimeNoSpaceYYYYMMDDHHMM = (UNIX_TIMESTAMP: any) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
    ];

    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();

    return `${year}/${zeroFill(month, 2)}/${zeroFill(date, 2)} ${zeroFill(hour, 2)}:${zeroFill(min, 2)}`;
};

export const zeroFill = (n?: any, p?: any, c?: any) => {
    const PAD_CHAR = typeof c !== 'undefined' ? c : '0';
    const pad = new Array(1 + p).join(PAD_CHAR);
    return `${(pad + n).slice(-pad.length)}`;
};

const dim = Dimensions.get('window');

export const isIPhoneXSize = () => dim.height === 812 || dim.width === 812;

export const isIPhoneXrSize = () => dim.height === 896 || dim.width === 896;

export const isIphoneX = () =>
    Platform.OS === 'ios' && (isIPhoneXSize() || isIPhoneXrSize());

export const generateHash = (targetLength) => {
    let text = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < targetLength; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

export const removeEmptyField = (obj) => {
    const objNew = Object.assign(obj);

    Object.keys(objNew).map(key => obj[key] = typeof obj[key] === 'string' ? obj[key].trim() : obj[key]);

    Object.keys(objNew).forEach(
        (key) =>
            (objNew[key] === undefined ||
                objNew[key] === null ||
                objNew[key] === '') &&
            delete objNew[key],
    );

    return objNew;
};

export const parseFloatUtil = (numberValue: string) =>
    parseFloat(numberValue.replace(/,/, "."));
