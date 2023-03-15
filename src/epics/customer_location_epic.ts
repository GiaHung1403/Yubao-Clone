import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/customer_location_type';
import { getListCustomerLocation } from '@data/api';

export const getListDataCustomerLocation = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_LOCATION_CUSTOMER),
    mergeMap((action: any) =>
      getListCustomerLocation(action.data)
        .then(async (data: any) => {
          const dataFilter = data
						.filter(customer => customer.flat_long)
						.map(customer => {
							const flatLngChar = customer.flat_long?.split(',');

							return Object.assign(customer, {
								location: {
									latitude: parseFloat(flatLngChar[0]),
									longitude: parseFloat(flatLngChar[1]),
								},
							});
						});
          return {
            type: actionTypes.GET_LIST_LOCATION_CUSTOMER_SUCCESS,
            message: 'Get list customer location success!',
            response: dataFilter,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_LOCATION_CUSTOMER_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
