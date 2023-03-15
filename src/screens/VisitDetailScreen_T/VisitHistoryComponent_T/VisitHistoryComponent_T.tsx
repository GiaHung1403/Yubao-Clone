import React, { useEffect, useState } from 'react';
import {
  FlatList,
  InteractionManager,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Card ,useTheme} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Colors from '@config/Color';
import { getListVisit_History_Trading } from '@data/api';
import { IUserSystem, IVisitHistory_Trading } from '@models/types';

export default function VisitHistoryComponent_T(props: any) {
  const { LeseID } = props;

  const {colors} = useTheme()
  const dataUserSystem: IUserSystem = useSelector(
    (state: any) => state.auth_reducer.dataUserSystem,
  );

  const [listVisitHistory, setListVisitHistory] =
		useState<[IVisitHistory_Trading]>();

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      const credentials: any = await Keychain.getGenericPassword();
      const { password } = credentials;
      const responseVisitHistory: any = await getListVisit_History_Trading({
				User_ID: dataUserSystem.EMP_NO,
				CustomerName : LeseID,
			});

      setListVisitHistory(responseVisitHistory);
    });
  }, []);

  return (
    <FlatList
      style={{ padding: 8 }}
      data={listVisitHistory}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => <SafeAreaView style={{ height: 60 }}/>}
      renderItem={({ item, index }) => (
        <Card style={{ marginBottom: 8 }} elevation={2}>
          <View style={{ padding: 8 }}>
            <Text
              style={{
                color: colors.primary,
                fontWeight: '600',
                fontSize: 15,
                marginBottom: 8,
              }}
            >
              {item.op_Emp_Nm}
            </Text>
            <Text>
              <Text style={{ fontWeight: '500', color: colors.primary }}>
                SEQ:
              </Text>{' '}
              {item.seq}
            </Text>
            <Text style={{ marginVertical: 4 }}>
              <Text style={{ fontWeight: '500', color: colors.primary }}>
                Date:
              </Text>{' '}
              {item.bas_Date}
            </Text>
            <Text>
              <Text style={{ fontWeight: '500', color: colors.primary }}>
                Remark:
              </Text>{' '}
              {item.rmks}
            </Text>
          </View>
        </Card>
      )}
    />
  );
}
