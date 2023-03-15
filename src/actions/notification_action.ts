import {
  SET_NUMBER_UNREAD_NOTIFICATION,
  SET_NUMBER_UNREAD_PROMOTION,
} from './types/notification_type';

export const setNumberUnreadNotification = ({ numberUnread }) => ({
  type: SET_NUMBER_UNREAD_NOTIFICATION,
  response: numberUnread,
});

export const setNumberUnreadPromotion = ({ numberUnread }) => ({
  type: SET_NUMBER_UNREAD_PROMOTION,
  response: numberUnread,
});
