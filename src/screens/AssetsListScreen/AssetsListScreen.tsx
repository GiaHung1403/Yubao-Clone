import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card, Searchbar } from 'react-native-paper';

import Header from '@components/Header';
import { LocalizationContext } from '@context/LocalizationContext';
import { formatVND } from '@utils';

export function AssetsListScreen(props: any) {
  const route = useRoute();
  const navigation: any = useNavigation();
  const { title, listAssets, APNO }: any = route.params;

  const [firstQuery, setFirstQuery] = useState('');
  const [listQuery, setListQuery] = useState<any>([]);

  const I18n = useContext(LocalizationContext);
  const textTotalAmount = I18n.t('totalAmount');
  const textQuality = I18n.t('quality');
  const textSearch = I18n.t('search');

  /* Khởi tạo list query khi có data */
  useEffect(() => {
    if (listQuery?.length === 0) {
      setListQuery(listAssets);
    }
  }, [listAssets]);

  /* Filter list data hiển thị theo keyword search */
  useEffect(() => {
    if (firstQuery.length > 0) {
      const dataFilter: any = listAssets.filter((item) =>
        item.ASTS_NM.includes(firstQuery),
      );

      setListQuery(dataFilter);
    } else {
      setListQuery(listAssets);
    }
  }, [firstQuery]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ zIndex: 2 }}>
        <Header title={title}/>
      </View>
      <View style={{ flex: 1 }}>
        <Searchbar
          textAlign={'left'}
          placeholder={textSearch}
          onChangeText={(query) => setFirstQuery(query)}
          value={firstQuery}
          style={{ zIndex: 2, marginTop: 8, marginHorizontal: 8 }}
          inputStyle={{ fontSize: 14 }}
        />
        <FlatList
          style={{ flex: 1 }}
          data={listQuery}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Card
              key={index.toString()}
              style={{ borderRadius: 8, margin: 8 }}
              elevation={4}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 8,
                  padding: 8,
                }}
                onPress={() =>
                  navigation.navigate('AssetsTakePhotoScreen', {
                    APNO,
                    assetItem: item,
                  })
                }
              >
                <Text style={{ fontWeight: '600' }}>{`${
                  I18n.locale === 'vi' ? item.ASTS_NM_V : item.ASTS_NM
                }`}</Text>
                <Text
                  style={{ marginVertical: 4 }}
                >{`${textQuality}: ${item.NQTY}`}</Text>
                <Text>{`${textTotalAmount}: ${
                  item.AMT || formatVND(item.ASTS_AMOUNT)
                } ${item.CUR_C || ''}`}</Text>
              </TouchableOpacity>
            </Card>
          )}
        />
      </View>
    </View>
  );
}
