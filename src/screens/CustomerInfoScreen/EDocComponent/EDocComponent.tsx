import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  InteractionManager,
  SafeAreaView,
  View,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import LoadingFullScreen from '@components/LoadingFullScreen';
import NoDataComponent from '@components/NoDataComponent';
import { LocalizationContext } from '@context/LocalizationContext';
import { getOtherDocument } from '@data/api';
import * as firebaseFunction from '@data/firebase';
import { EventTracking } from '@models/EventTrackingEnum';
import ItemEDoc from './ItemEDocComponent';

export default function EDocComponent(props: any) {
  const { taxCode } = props;
  const flatListRef: any = useRef<any>(null);
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const I18n = useContext(LocalizationContext);
  const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
  const [firstQuery, setFirstQuery] = useState('');
  const [listDoc, setListDoc] = useState<any>([]);
  const [listQuery, setListQuery] = useState([]);

  const textSearchHistory = 'Enter the Contract No. or E-doc code';

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      const data: any = await getOtherDocument({
        User_ID: taxCode,
      });

      setListDoc(data.filter((item) => item.TABLE_NAME !== 'LCN'));
      setDoneLoadAnimated(true);
    });
  }, []);

  useEffect(() => {
    if (listQuery?.length === 0) {
      setListQuery(listDoc);
    }
  }, [listDoc]);

  useEffect(() => {
    if (firstQuery.length > 0) {
      let dataFilter: any = [];
      dataFilter = listDoc.filter(
        (item) =>
          item.APNO.toLowerCase().includes(firstQuery.toLowerCase()) ||
          item.DEPT_CODE.toLowerCase().includes(firstQuery.toLowerCase()),
      );
      setListQuery(dataFilter);
    } else {
      setListQuery(listDoc);
    }
  }, [firstQuery]);

  const _onPressItem = async (item: any) => {
    firebaseFunction.trackingLog({
      event: EventTracking.SCREEN,
      screen: {
        class: 'DetailElectronicBillScreen',
        name: 'Detail Electronic Bill Screen',
      },
      data: {
        ebill: item,
      },
    });

    navigation.navigate('WebviewScreen', {
      title: `${item.DOC_NM_EN}`,
      url: item.FILE_URL,
      isShowButton: item.SHOW_WEB_YN,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, marginHorizontal: 8 }}>
        <Searchbar
          textAlign={"left"}
          placeholder={textSearchHistory}
          onChangeText={(query) => setFirstQuery(query)}
          value={firstQuery}
          style={{ zIndex: 2, marginTop: 8 }}
          inputStyle={{ fontSize: 13 }}
        />

        {doneLoadAnimated ? (
          <FlatList
            ref={flatListRef}
            style={{ flex: 1, zIndex: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            keyExtractor={(item, index) => index.toString()}
            data={listQuery}
            extraData={listDoc}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={() => <NoDataComponent type={"Empty"}/>}
            ListFooterComponent={() => <SafeAreaView style={{ height: 50 }}/>}
            renderItem={({ item, index }) => (
              <ItemEDoc item={item} onPressItem={() => _onPressItem(item)}/>
            )}
          />
        ) : (
          <LoadingFullScreen/>
        )}
      </View>
    </View>
  );
}
