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
import { getListVisitHistory } from '@data/api';
import { IUserSystem, IVisitHistory } from '@models/types';

export default function VisitHistoryComponent(props: any) {
  const { LeseID } = props;

  const {colors} = useTheme()
  const dataUserSystem: IUserSystem = useSelector(
    (state: any) => state.auth_reducer.dataUserSystem,
  );

  const [listVisitHistory, setListVisitHistory] = useState<[IVisitHistory]>();

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      const credentials: any = await Keychain.getGenericPassword();
      const { password } = credentials;
      const responseVisitHistory: any = await getListVisitHistory({
        User_ID: dataUserSystem.EMP_NO,
        Password: password,
        LeseID,
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
              {item.OP_EMP_NN}
            </Text>
            <Text>
              <Text style={{ fontWeight: '500', color: colors.primary }}>
                SEQ:
              </Text>{' '}
              {item.SEQ}
            </Text>
            <Text style={{ marginVertical: 4 }}>
              <Text style={{ fontWeight: '500', color: colors.primary }}>
                Date:
              </Text>{' '}
              {item.BAS_DATE}
            </Text>
            <Text>
              <Text style={{ fontWeight: '500', color: colors.primary }}>
                Remark:
              </Text>{' '}
              {item.RMKS}
            </Text>
          </View>
        </Card>
      )}
    />
  );
}
