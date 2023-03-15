import { formatVND } from '@utils';
import moment from 'moment';

const createBodyForm = ({
	cnid,
	lS_NM,
	applicationStatus,
	tno,
	cN_DATE,
	coN_TACT,
	phon,
	addr,
	customeSrc,
	cilC_INDS_NM,
	taX_CODE,
	paiD_CAP,
	cuR_C,
	purpose,
	cR_TP_NM,
	trm,
	irr,
	rmks,
	validCFSentMailResult,
	listGuarantor,
	program,
	downpaY_R,
	deP_R,
	v_CASE,
	rV_R,
	eX_R,
	lstCFConsIns,
	crE_PRO_2,
	lS_INT_R,
	inT_R,
	sprd,
	condition,
	opI_SALES,
	html_Sign,
	acqT_AMT,
	acqT_AMT1,
	pmT_YN,
	paY_MOD,
	baS_INT_TP_NM,
	perType,
	m_RATE2,
	steP_PMT,
	comM_PRM_YN,
	ouT_BALL,
}: any) =>
	`<table border="0" style="width: 100%; margin-bottom: 100px">
    <tbody>
      <tr>
        <td>
          <img src="https://firebasestorage.googleapis.com/v0/b/chailease-chat.appspot.com/o/mylogo.jpeg?alt=media&token=410f5459-42b1-4ba0-915c-f1b650086c31" />
        </td>
        <td style="text-align: center">
          <span style="font-size: 18px"
            >CONSULTATION FORM
            <span style="font-size: 12px"
              ><br />Application No.:${cnid}</span
            ></span
          >
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
            <tbody>
              <tr>
                <td style="width: 100%">
                  <table
                    border="1"
                    style="
                      width: 100%;
                      border-right: black 2px solid;
                      table-layout: fixed;
                      border-top: black 2px solid;
                      border-left: black 2px solid;
                      border-bottom: black 2px solid;
                      border-collapse: collapse;
                    "
                  >
                    <tbody>
                      <tr>
                        <td
                          style="width: 20%; text-align: left"
                          class="TDheaderCenter"
                        >
                          Applicant's name
                        </td>
                        <td class="TDData" colspan="5">
                          <span id="lblAppName"
                            >${lS_NM}</span
                          >
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="width: 20%; text-align: left"
                          class="TDheaderCenter"
                        >
                          Applicant's Status
                        </td>
                        <td class="TDData" colspan="1">
                          <span id="lblAppSta">${applicationStatus || ''}</span>
                        </td>
                        <td class="TDheaderCenter" style="text-align: left">
                          Telephone
                        </td>
                        <td class="TDData" colspan="1">
                          <span id="lblTelephone">${tno}</span>
                        </td>
                        <td class="TDheaderCenter" style="text-align: left">
                          Date
                        </td>
                        <td class="TDData" colspan="1">
                          <span id="lblDate">${moment(cN_DATE).format(
														'DD/MM/YYYY',
													)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="text-align: left"
                          class="TDheaderCenter"
                          colspan="1"
                        >
                          Contact Person
                        </td>
                        <td class="TDData" colspan="2">
                          <span id="lblContact">${coN_TACT || ''}</span>
                        </td>
                        <td
                          style="text-align: left"
                          class="TDheaderCenter"
                          colspan="1"
                        >
                          Telephone
                        </td>
                        <td class="TDData" colspan="2">
                          <span id="lblPhone">${phon || ''}</span>
                        </td>
                      </tr>

                      <tr>
                        <td class="TDheaderCenter" style="text-align: left">
                          <span id="lblAddrCaption" style=""
                            >Address</span
                          >
                        </td>
                        <td colspan="5" class="TDData">
                          <span id="lblAddr" style=""
                            >${addr}</span
                          >
                        </td>
                      </tr>

                      <tr>
                        <td class="TDheaderCenter" style="text-align: left">
                          Introduced By
                        </td>
                        <td class="TDData" colspan="5">
                          <span id="lblIntro">${customeSrc}</span>
                          <span id="lblDealer"
                            ></span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="TDheaderCenter" style="text-align: left">
                          Business
                        </td>
                        <td class="TDData" colspan="2">
                          <span id="lblBusiness"
                            >${cilC_INDS_NM}</span
                          >
                        </td>
                        <td class="TDheaderCenter" style="text-align: left">
                          Tax Code
                        </td>
                        <td class="TDDataCenter" colspan="2">
                          <span id="lblTaxCode">${taX_CODE.trim()}</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="width: 163px; text-align: left"
                          class="TDheaderCenter"
                        >
                          Incorporated On
                        </td>
                        <td class="TDData" colspan="2">
                          <span id="lblIncorOn">${moment(
														validCFSentMailResult.tc_Issue_date,
													).format('DD/MM/YYYY')}</span>
                        </td>
                        <td class="TDheaderCenter" style="text-align: left">
                          Paid-up Capital
                        </td>
                        <td class="TDDataCenter" colspan="2">
                          <span id="lblPaidUp">${formatVND(
														paiD_CAP,
													)} ${cuR_C}</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="width: 163px; text-align: left"
                          class="TDheaderCenter"
                        >
                          Funding Purpose
                        </td>
                        <td
                          class="TDDataCenter"
                          colspan="2"
                          style="text-align: left"
                        >
                          <span id="lblLeasePur">${purpose}</span>
                        </td>
                        <td class="TDheaderCenter" style="text-align: left">
                          Credit Type
                        </td>
                        <td
                          class="TDData"
                          style="text-align: center"
                          colspan="2"
                        >
                          <span id="lblCreditType"
                            >${cR_TP_NM}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="width: 163px; text-align: left"
                          class="TDheaderCenter"
                        >
                          Outstanding Prin. (A)
                        </td>
                        <td
                          class="TDDataCenter"
                          colspan="2"
                          style="padding-right: 2px; text-align: right"
                        >
                          &nbsp;<span
                            id="lblOut"
                            style=""
                            >${
															cuR_C === 'VND'
																? `${formatVND(
																		(ouT_BALL / eX_R).toFixed(),
																  )} USD (${formatVND(ouT_BALL.toFixed())} VND`
																: `${formatVND(
																		ouT_BALL.toFixed(),
																  )} USD (${formatVND(
																		(ouT_BALL * eX_R).toFixed(),
																  )} VND`
														}</span
                          >
                        </td>
                        <td class="TDheaderCenter" style="text-align: left">
                          Payment Method
                        </td>
                        <td
                          class="TDData"
                          style="text-align: center"
                          colspan="2"
                        >
                          <span id="lblPayMod"
                            >${
															pmT_YN === 'True' ? 'PMT' : 'Equal principle'
														} - ${
		paY_MOD === '1' ? 'Monthly in arrears' : 'Monthly in advanced'
	}</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="width: 163px; text-align: left"
                          class="TDheaderCenter"
                        >
                          Credit Line App. (B)
                        </td>
                        <td
                          class="TDDataCenter"
                          colspan="2"
                          style="padding-right: 2px; text-align: right"
                        >
                          <span
                            id="lblFinanAmt"
                            style=""
                            >
                            ${
															cuR_C === 'VND'
																? `${formatVND(
																		(acqT_AMT1 / eX_R).toFixed(),
																  )} USD (${acqT_AMT} VND`
																: `${acqT_AMT} USD (${formatVND(
																		(acqT_AMT1 * eX_R).toFixed(),
																  )} VND`
														}
                          </span>
                        </td>
                        <td class="TDheaderCenter" style="text-align: left">
                          Tenor
                        </td>
                        <td
                          class="TDData"
                          style="text-align: center"
                          colspan="2"
                        >
                          <span id="lblTenor">${trm} months</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="width: 163px; text-align: left"
                          class="TDheaderCenter"
                        >
                          Total (=A+B)
                        </td>
                        <td
                          class="TDDataCenter"
                          colspan="2"
                          style="padding-right: 2px; text-align: right"
                        >
                          <span id="lblTotal" style=""
                            >${
															cuR_C === 'VND'
																? `${formatVND(
																		((ouT_BALL + acqT_AMT1) / eX_R).toFixed(),
																  )} USD (${formatVND(
																		(ouT_BALL + acqT_AMT1).toFixed(),
																  )} VND`
																: `${formatVND(
																		(ouT_BALL + acqT_AMT1).toFixed(),
																  )} USD (${formatVND(
																		((ouT_BALL + acqT_AMT1) * eX_R).toFixed(),
																  )} VND`
														}</span
                          >
                        </td>
                        <td
                          style="width: 198px; text-align: left"
                          class="TDheaderCenter"
                        >
                          Risk Premium
                        </td>
                        <td style="text-align: center" class="TDData">
                          <span id="lblIRR" style="font-weight: normal"
                            >${parseFloat(irr)}%</span
                          >
                        </td>
                        <td class="TDData" colspan="1">
                          <strong>Program: </strong> ${program}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="width: 163px; text-align: left"
                          class="TDheaderCenter"
                        >
                          Guarantor
                        </td>
                        <td class="TDData" colspan="2">
                          <span id="lblGua"
                            > ${listGuarantor}</span
                          >
                        </td>

                        <td
                          style="width: 198px; text-align: left"
                          class="TDheaderCenter"
                        >
                          Risk Premium Method
                        </td>
                        <td
                          style="text-align: center"
                          class="TDData"
                          colspan="2"
                        >
                          <span id="lblIRR_TYPE" style="font-weight: normal"
                            >Cost down</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="width: 163px; text-align: left"
                          class="TDheaderCenter"
                        >
                          Leased Assets
                        </td>
                        <td class="TDData" colspan="5">
                          <span id="lblLeasedAss"
                            >${rmks}</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="width: 163px; text-align: left"
                          class="TDheaderCenter"
                        >
                          No. of Pending Items
                        </td>
                        <td
                          class="TDDataCenter"
                          colspan="2"
                          style="padding-right: 2px; text-align: left"
                        >
                          <span id="lblNoPendItem">0</span>
                        </td>
                        <td
                          style="width: 198px; text-align: left"
                          class="TDheaderCenter"
                        >
                          Black List
                        </td>
                        <td style="text-align: left" class="TDData" colspan="2">
                          <span id="lblBlackList">No</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="width: 163px; text-align: left"
                          class="TDheaderCenter"
                        ></td>
                        <td class="TDData" colspan="5"></td>
                      </tr>
                      <tr>
                        <td
                          colspan="2"
                          class="TDheaderCenter"
                          style="text-align: left"
                        >
                          Collateral &amp; Other Conditions
                        </td>
                        <td colspan="4" class="TDData">
                          <span
                            id="lblCollateral"
                            style=""
                            >Down=${parseFloat(
															downpaY_R,
														)}%, Deposit=${parseFloat(deP_R)}% (Setoff Y/N:
                            <strong>${
															v_CASE === '1' ? 'Yes' : 'No'
														}</strong>), Residual=${rV_R}%, Credit
                            Granting=0%, Ex.Rate: ${eX_R}
                            ${
															parseInt(perType) > 0
																? `<br/>- From Term 1 to Term ${perType}: ${lS_INT_R}% (fixed)
                                <br/>- From Term ${
																	parseInt(perType) + 1
																} onward: ${(
																		parseFloat(inT_R) + parseFloat(m_RATE2)
																  ).toFixed(
																		2,
																  )}% [CILC VND Standard Rate ${inT_R}%) Margin(${parseFloat(
																		m_RATE2,
																  ).toFixed(2)}%)]`
																: `Int.Rate=${lS_INT_R}% [${baS_INT_TP_NM}(${inT_R}%) + Margin(${sprd}%)]`
														}
                            ${steP_PMT ? `<br />- ${steP_PMT}` : ''}
                            ${
															comM_PRM_YN === '1'
																? `<br/> - This application is under vehicle commission program`
																: ''
														}
                            <br />${condition}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" class="TDheaderCenter">
                          Date of Received
                        </td>
                        <td style="width: 247px" class="TDData"></td>
                        <td colspan="2" class="TDheaderCenter">
                          Date of Cr. Report Finished
                        </td>
                        <td class="TDData"></td>
                      </tr>
                      <tr>
                        <td colspan="6" class="TDData">
                          <div>
                            <table
                              class="TDData"
                              cellspacing="0"
                              cellpadding="0"
                              rules="all"
                              id="mydg"
                              style="
                                border-width: 1px;
                                border-style: Solid;
                                width: 100%;
                                border-collapse: collapse;
                              "
                            >
                              <tbody>
                                <tr>
                                  <th class="TDheaderCenter" scope="col">
                                    Item
                                  </th>
                                  <th class="TDheaderCenter" scope="col">
                                    Confirm
                                  </th>
                                  <th class="TDheaderCenter" scope="col">
                                    Essential Data For The Credit Process
                                  </th>
                                  <th class="TDheaderCenter" scope="col">
                                    Remarks
                                  </th>
                                </tr>
                                ${lstCFConsIns.reduce(
																	(str, currentValue, currentIndex) =>
																		str +
																		`<tr>
                                  <td class="TDDataCenter" style="width: 5%">
                                    <span id="mydg_lblId_0">${
																			currentIndex + 1
																		}</span>
                                  </td>
                                  <td class="TDDataCenter" style="width: 10%">
                                    <span id="mydg_lblConfirm_0">${
																			crE_PRO_2.trim().split(' ')[currentIndex]
																		}</span>
                                  </td>
                                  <td
                                    class="TDData"
                                    align="center"
                                    valign="middle"
                                    style="width: 45%"
                                  >
                                    ${currentValue.essData}
                                  </td>
                                  <td class="TDDataCenter" style="width: 40%">
                                    <span id="mydg_lblRemarks_0">${
																			currentValue.rmks || ''
																		}</span>
                                  </td>
                                </tr>`,
																	'',
																)}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="4" class="TDheaderCenter">
                          Opinions of Sales Department
                        </td>
                        <td colspan="2" class="TDheaderCenter">
                          Comments of Credit Department
                        </td>
                      </tr>
                      <tr>
                        <td colspan="4" class="TDData">
                          <span
                            id="lblOpinion"
                            style=""
                            >${opI_SALES}</span>
                        </td>
                        <td colspan="2" class="TDData"></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style="width: 100%"></td>
              </tr>
            </tbody>
          </table>
          ${html_Sign.replaceAll(
						'../ico/tick-blue.png',
						'https://firebasestorage.googleapis.com/v0/b/chailease-chat.appspot.com/o/tick-blue.png?alt=media&token=6e07fe91-3052-4319-8cbb-cda5ee0a9e99',
					)}
        </td>
      </tr>
    </tbody>
  </table>`;

const createStyleForm = `<style>
    .TDheaderCenter {
      font-family: Times New Roman;
      color: Black;
      font-weight: bold;
      text-align: center;
      vertical-align: middle;
      border-collapse: collapse;
      border-width: 1px;
      border-color: Olive;
      border-style: solid;
    }

    .TDData {
      font-family: Times New Roman;
      color: Black;
      font-weight: normal;
      text-align: left;
      vertical-align: middle;
      border-collapse: collapse;
      border-width: 1px;
      border-color: Olive;
      border-style: solid;
    }

    .TDDataCenter {
      font-family: Times New Roman;
      color: Black;
      font-weight: normal;
      text-align: center;
      vertical-align: middle;
      border-collapse: collapse;
      border-width: 1px;
      border-color: Olive;
      border-style: solid;
    }

    .important {
      background-color: #f5fcc8;
      padding: 2px;
    }
  </style>`;

export default function createFormCF(consultationItem) {
	return createStyleForm + createBodyForm(consultationItem);
}
