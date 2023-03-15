import { combineReducers } from 'redux';
import auth_reducer from './auth_reducer';
import book_meeting_reducer from './book_meeting_reducer';
import car_booking_reducer from './car_booking_reducer';
import cic_reducer from './cic_reducer';
import consultation_reducer from './consultation_reducer';
import contact_reducer from './contact_reducer';
import contract_reducer from './contract_reducer';
import customer_location_reducer from './customer_location_reducer';
import customer_reducer from './customer_reducer';
import dashboard_reducer from './dashboard_reducer';
import document_reducer from './document_reducer';
import eFlow_reducer from './eFlow_reducer';
import e_coin_reducer from './e_coin_reducer';
import fixed_assets_reducer from './fixed_assets_reducer';
import general_rfa_reducer from './general_rfa_reducer';
import leave_request_reducer from './leave_request_reducer';
import message_reducer from './message_reducer';
import notification_reducer from './notification_reducer';
import quotation_reducer from './quotation_reducer';
import request_customer_reducer from './request_customer_reducer';
import room_rc_reducer from './room_rc_reducer';
import setting_reducer from './setting_reducer';
import user_reducer from './user_reducer';
import eReview_reducer from './eReview_reducer';
import contract_timeline_reducer from './contract_timeline_reducer';
import insurance_reducer from './insurance_reducer';

export default combineReducers({
	auth_reducer,
	book_meeting_reducer,
	notification_reducer,
	contract_reducer,
	user_reducer,
	customer_reducer,
	setting_reducer,
	message_reducer,
	dashboard_reducer,
	customer_location_reducer,
	contact_reducer,
	eFlow_reducer,
	general_rfa_reducer,
	document_reducer,
	room_rc_reducer,
	quotation_reducer,
	leave_request_reducer,
	car_booking_reducer,
	cic_reducer,
	fixed_assets_reducer,
	e_coin_reducer,
	consultation_reducer,
	request_customer_reducer,
	eReview_reducer,
	contract_timeline_reducer,
	insurance_reducer,
});
