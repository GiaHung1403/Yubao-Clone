export interface IGeneralRFA {
    req_id:           string;
    sBasDate:         string;
    bas_Date:         Date;
    kind_nm:          string;
    req_Type:         string;
    subj:             string;
    apNo:             string;
    lS_NM:            null;
    st_c_nm:          string;
    oP_EMP_NO:        string;
    fS_EMP_NM:        string;
    dept_Name2:       string;
    cfM_YN:           string;
    sT_C:             string;
    posted:           string;
    approver_Status:  string;
    iT_Status:        null;
    iT_PIC:           null;
    current_Deadline: null;
    start_Date:       null;
    attach_Files:     string;
    lstApprover:      LstApprover[];
    requestRFA:       RequestRFA;
}

export interface LstApprover {
    cnfm_YN:             number;
    key_ID:              string;
    dept_Code:           string;
    approver_No:         string;
    approver_NN:         string;
    approver_Title:      string;
    sign_Date:           string;
    rmks:                string;
    email:               string;
    cnfm_Date:           string;
    highest_YN:          boolean;
    onbehalf_Highest_YN: boolean;
    attach_Files:        string;
    url_Report:          string;
}

export interface RequestRFA {
    cfM_DATE:         Date;
    cfM_YN:           boolean;
    rfiA_ID:          null;
    reQ_ID:           string;
    kind:             string;
    baS_DATE:         Date;
    apno:             string;
    saleS_NO:         string;
    astS_ID:          number;
    cuR_C:            null;
    aprV_AMT:         null;
    dsbT_AMT:         null;
    totaL_EX:         null;
    ouT_BAL:          null;
    sd:               null;
    trm:              null;
    sT_DATE:          null;
    eN_DATE:          null;
    comM_YN:          boolean;
    sT_C:             string;
    subj:             string;
    reason:           string;
    oP_EMP_NO:        string;
    cc:               string;
    proposal:         string;
    attm:             string;
    rmks:             string;
    olD_PAY_DATE:     null;
    neW_PAY_DATE:     null;
    efF_DATE:         null;
    curR_INSR_INF_BY: null;
    neW_INSR_INF_BY:  null;
    flag:             null;
    restucture_YN:    boolean;
    overtime_YN:      null;
    reQ_TYPE:         string;
    cC_EMP_EMAIL:     string;
    devicE_OS:        null;
}
