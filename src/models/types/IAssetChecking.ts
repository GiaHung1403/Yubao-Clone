export interface IAssetCheckingType {
    ID:             number;
    IMAGE_NUM:      number;
    NAME:           string;
    NOTIFY_TYPE:    string;
    NOTIFY_TYPE_NM: string;
    STT:            number;
    VIDEO_NUM:      number;
    ALLOW_E:        boolean;
}

export interface IAssetCheckingRequest {
    CNID:           string;
    CONTENT:        null;
    CRE_DATE:       Date;
    CRE_DATE_DISP:  string;
    ID:             number;
    LESE_ID:        number;
    LS_NM:          string;
    NOTIFY_TYPE:    string;
    NOTIFY_TYPE_NM: string;
    OP_EMP_NM:      string;
    OP_EMP_NO:      string;
    REQ_STA:        null;
    REQ_STA_DATE:   null;
    REQ_STA_NM:     string;
    SUBJECT:        string;
}

export interface IAssetCheckingRequestDetail {
    ALLOW_E:      boolean;
    CNID:         string;
    CONTENT:      null;
    CRE_DATE:     Date;
    ID:           number;
    ID1:          number;
    ID2:          number;
    IMAGE_NUM:    number;
    Ident00:      number;
    LESE_ID:      number;
    LINK:         any;
    LOCATION:     null;
    NAME:         string;
    NOTE:         string;
    NOTIFY_TYPE:  string;
    OP_EMP_NO:    string;
    REQ_STA:      null;
    REQ_STA_DATE: null;
    STT:          number;
    SUBJECT:      string;
    TYPE_ID:      number;
    VIDEO_NUM:    number;
}

