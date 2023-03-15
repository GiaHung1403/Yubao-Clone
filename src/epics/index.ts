import {combineEpics} from 'redux-observable';

import * as auth_epic from './auth_epic';
import * as book_meeting_epic from './book_meeting_epic';
import * as car_booking_epic from './car_booking_epic';
import * as cic_epic from './cic_epic';
import * as consultation_epic from './consultation_epic';
import * as contact_epic from './contact_epic';
import * as contract_epic from './contract_epic';
import * as customer_epic from './customer_epic';
import * as customer_location_epic from './customer_location_epic';
import * as dashboard_epic from './dashboard_epic';
import * as document_epic from './document_epic';
import * as eFlow_epic from './eFlow_epic';
import * as e_coin_epic from './e_coin_epic';
import * as fixed_assets_epic from './fixed_assets_epic';
import * as general_rfa_epic from './general_rfa_epic';
import * as leave_request_epic from './leave_request_epic';
import * as message_epic from './message_epic';
import * as quotation_epic from './quotation_epic';
import * as request_customer_epic from './request_customer_epic';
import * as room_rc_epic from './room_rc_epic';
import * as setting_epic from './setting_epic';
import * as user_epic from './user_epic';
import * as eReview_epic from './eReview_epic';
import * as notification_epic from './notification_epic';
import * as ticket_epic from './ticket_epic'
import * as contract_timeline_epic from './contract_timeline_epic';
import * as insurance_epic from './insurance_epic';

export default combineEpics(
	auth_epic.login,
	auth_epic.loginRC,
	book_meeting_epic.getListMeetingRoomData,
	book_meeting_epic.getListBookMeetingData,
	contract_epic.getListContract,
	user_epic.getListUserRC,
	customer_epic.getListDataCustomer,
	customer_epic.getListDataSeller,
	setting_epic.getSettingPublicRC,
	message_epic.getListMessage,
	dashboard_epic.getDataSummaryProgress,
	dashboard_epic.getDataNPV,
	dashboard_epic.getDataRecovery,
	dashboard_epic.getDataDelinquent,
	dashboard_epic.getDataInsuranceInformed,
	customer_location_epic.getListDataCustomerLocation,
	contact_epic.getListContactData,
	eFlow_epic.getListDataRequestEFlow,
	eFlow_epic.getListDataApproverEFlow,
	general_rfa_epic.getListGeneralRFAData,
	document_epic.getListDataFileRC,
	room_rc_epic.getListDataRoomMember,
	room_rc_epic.getListDataRoom,
	room_rc_epic.getListRequest,
	quotation_epic.getListDataQuotation,
	quotation_epic.getDataQuotationDetail,
	quotation_epic.getListDataQuotationTenor,
	quotation_epic.calculationDataQuotation,
	leave_request_epic.getListLeaveRequestData,
	leave_request_epic.getListDayOffRemainingData,
	car_booking_epic.getListCarBookingData,
	cic_epic.getListCICData,
	fixed_assets_epic.getListFixedAssetsData,
	e_coin_epic.getListECoinReportData,
	e_coin_epic.getECoinTotalData,
	e_coin_epic.getListOrderHistoryData,
	consultation_epic.getListConsultationData,
	request_customer_epic.getAssetCheckingRequestsData,
	eReview_epic.getListDataCommentEReview,
	eReview_epic.getListDataRequestEReview,
	contract_timeline_epic.getListContract_Timeline,
	// notification_epic.getNotificationNum,
	insurance_epic.getInsuranceContracts,
);
