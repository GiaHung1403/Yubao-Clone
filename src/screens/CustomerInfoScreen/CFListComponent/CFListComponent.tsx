import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image, InteractionManager,
  Linking,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Card, List ,useTheme} from 'react-native-paper';
import { useSelector } from 'react-redux';

import LoadingFullScreen from '@components/LoadingFullScreen';
import NoDataComponent from '@components/NoDataComponent';
import Color from '@config/Color';
import { getListCF } from '@data/api';
import { IConsultationInformation, IUserSystem } from '@models/types';
import { convertUnixTimeSolid } from '@utils';

export default function CAListComponent(props: any) {
  const navigation: any = useNavigation();
  const { leseID } = props;
  const {colors} = useTheme()
  const dataUserSystem: IUserSystem = useSelector(
    (state: any) => state.auth_reducer.dataUserSystem,
  );

  const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
  const [listCF, setListCF] = useState<IConsultationInformation[]>([]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      setDoneLoadAnimated(true);

      const { password }: any = await Keychain.getGenericPassword();

      const responseCF: any = await getListCF({
        User_ID: dataUserSystem.EMP_NM,
        Password: password,
        LeseID: leseID,
      });

      setListCF(responseCF);
    });
  }, []);

  const _onPressItem = (item: any) => {
    navigation.navigate('CATakePhotoScreen', {});
  };

  return doneLoadAnimated ? (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={listCF}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={() => <NoDataComponent/>}
        ListFooterComponent={() => <SafeAreaView style={{ height: 50 }}/>}
        renderItem={({ item, index }) => (
          <Card
            style={{
              backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff',
              marginTop: 8,
              marginHorizontal: 8,
            }}
            elevation={2}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                padding: 8,
                alignItems: 'center',
              }}
              onPress={() => _onPressItem(item)}
            >
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text
                  style={{
                    marginBottom: 4,
                    color: colors.primary,
                    fontWeight: '600',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      color: '#000',
                    }}
                  >
                    CA No.:
                  </Text>{' '}
                  {item.CNID}
                </Text>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: '500' }}>Financing Amt:</Text>{' '}
                  <Text
                    style={{ color: '#2c8ac9', fontWeight: '600' }}
                  >{`${item.ACQT_AMT} ${item.CUR_C}`}</Text>
                </Text>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: '500' }}>MO-PIC:</Text>{' '}
                  {item.FS_EMP_NM}
                </Text>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: '500' }}>CO-PIC:</Text>{' '}
                  {item.CR_EMP_NM}
                </Text>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: '500' }}>Date:</Text>{' '}
                  {item.CN_BASDATE}
                </Text>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: '500' }}>APP DATE:</Text>{' '}
                  {convertUnixTimeSolid(
                    new Date(item.APP_DATE).getTime() / 1000,
                  )}
                </Text>
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: '500' }}>Cr.Cfm:</Text>{' '}
                  {item.CR_YN}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        )}
      />
    </View>
  ) : <LoadingFullScreen/>;
}
