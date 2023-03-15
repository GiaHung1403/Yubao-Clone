export interface IGeneralUserChoose {
    lstHighest:    Lst[];
    lstOnbehalves: Lst[];
    lstRelated:    LstRelated[];
}

export interface Lst {
    emp_No: string;
    lst_NM: string;
}

export interface LstRelated {
    emp_ID: string;
    emp_No: string;
    idx:    string;
    tit:    string;
    tit_ID: string;
}
