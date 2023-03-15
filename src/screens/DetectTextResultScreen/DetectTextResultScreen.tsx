import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { Icon, Select } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView, Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

import Header from '@components/Header/Header';
import { insertCustomerInfo } from '@data/api';
import { IUserSystem } from '@models/types';
import styles from './styles';

export function DetectTextResultScreen(props: any) {
  const route = useRoute();
  const navigation: any = useNavigation();

  const dataUserSystem: IUserSystem = useSelector(
    (state: any) => state.auth_reducer.dataUserSystem,
  );

  const [listText, setListText] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { textDetail, gptText }: any = route.params;

  useEffect(() => {

    try {
      if (!gptText)
        throw Error("no text")
      let tempData = JSON.parse(gptText)
      const tempList = Object.keys(tempData).map((i, index) => {
        return {
          text: tempData[i],
          type: i
        }
      })
      setListText(tempList);

    }
    catch (e) {
      console.log(e)
      const listTextSplit: any[] = textDetail.split(/[\n|]+/);
      const listMap = listTextSplit.map((text: string) => {
        return {
          text,
          type: 'name',
        };
      });
      setListText(listMap);

    }

  }, []);

  const onPressDelete = (item: any) => {
    const listData = [...listText];
    const index = listData.findIndex((text: any) => text.text === item);
    listData.splice(index, 1);

    setListText(listData);
  };

  const _onPressNewLine = () => {
    setListText([...listText, { text: 'Enter Your Field', type: 'name' }]);
  };

  const changeAlias = (alias) => {
    if (!alias) {
      return '';
    }
    let str = alias;
    str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
    str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
    str = str.replace(/[ìíịỉĩ]/g, 'i');
    str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
    str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
    str = str.replace(/[ỳýỵỷỹ]/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(
      /[!@%^*()+=<>?\/:;'"&#\[\]~$_`\-{}|\\]/g,
      ' ',
    );
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    return str;
  };

  const onPressSubmit = async () => {
    try {
      const COMPANY_TAXCODE = listText
        .find((item) => item.type === 'tax' || item.type ==="company_tax_code")
        ?.text.replace(/[^0-9-]+/g, '');
      const CUSTOMER_NAME = changeAlias(
        listText.find((item) => item.type === 'company' || item.type === "company_name")?.text,
      ).toUpperCase();
      let COMPANY_ADDRESS = `${changeAlias(listText.find((item) => item.type === 'company_address')?.text)},${changeAlias(listText.find((item) => item.type === 'address1')?.text)}, ${changeAlias(listText.find((item) => item.type === 'address2')?.text)}`;

      const COMPANY_NAME_VN = changeAlias(
        listText.find((item) => item.type === 'company' || item.type === "company_name")?.text,
      ).toUpperCase() || '';
      const TNO = listText
        .find((item) => item.type === 'phoneCompany' || item.type ==="company_phone")
        ?.text.replace(/[^0-9]+/g, '') || '';
      const PERSON = listText.find((item) => item.type === 'name')?.text || '';
      const PERSON_TNO = listText
        .find((item) => item.type === 'phone' || item.type ==="personal_phone_number")
        ?.text.replace(/[^0-9]+/g, '') || '';
      const EMAIL = listText.find((item) => item.type === 'email' || item.type ==="personal_email")?.text || '';
      const WEBSITE = listText.find((item) => item.type === 'website')?.text || '';
      const FAX = listText
        .find((item) => item.type === 'fax' || item.type ==="fax_number")
        ?.text.replace(/[^0-9]+/g, '') || '';
      const USER_ID = dataUserSystem.EMP_NO;

      if (!CUSTOMER_NAME) {
        Alert.alert('Thông báo', 'Tên bắt buộc phải có!');
        return;
      }

      if (!COMPANY_ADDRESS || COMPANY_ADDRESS === ', ') {
        Alert.alert('Thông báo', 'Địa chỉ bắt buộc phải có!');
        return;
      }

      if (!COMPANY_TAXCODE) {
        Alert.alert('Thông báo', 'Taxcode bắt buộc phải có!');
        return;
      } else if (
        (COMPANY_TAXCODE.length !== 10 && COMPANY_TAXCODE.length !== 14) ||
        (COMPANY_TAXCODE.length === 14 && !COMPANY_TAXCODE.includes('-'))
      ) {
        Alert.alert('Thông báo', 'Taxcode không đúng!');
        return;
      }

      if (EMAIL && !isEmail(EMAIL)) {
        Alert.alert('Thông báo', 'Email không đúng!');
        return;
      }

      if (PERSON_TNO && !isMobilePhone(PERSON_TNO, ['vi-VN'])) {
        Alert.alert('Thông báo', 'Số điện thoại không đúng!');
        return;
      }

      setLoading(true);

      await insertCustomerInfo({
        COMPANY_TAXCODE,
        CUSTOMER_NAME,
        COMPANY_ADDRESS,
        COMPANY_NAME_VN,
        TNO,
        USER_ID,
        PERSON,
        PERSON_TNO,
        EMAIL,
        WEBSITE,
        FAX,
      });

      Alert.alert(
        'Thông báo',
        'Update thông tin thành công!',
        [
          {
            text: 'OK',
            onPress: async () => {
              navigation.goBack();
            },
          },
        ],
        { cancelable: false },
      );
      setLoading(false);
    } catch (error: any) {
      Alert.alert('Thông báo', error.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="CardVisit Information" />
      <KeyboardAvoidingView
        style={styles.containerBody}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          style={styles.flatList}
          data={listText}
          extraData={listText}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => (
            <View>
              <Button
                mode="outlined"
                style={styles.buttonAddItem}
                onPress={() => _onPressNewLine()}
              >
                +
              </Button>

              <Button
                mode="contained"
                style={styles.buttonSubmit}
                loading={loading}
                onPress={() => onPressSubmit()}
              >
                {loading ? 'loading' : 'Submit'}
              </Button>
            </View>
          )}
          renderItem={({ item, index }) => (
            <Card style={{ flex: 1, marginHorizontal: 8, marginTop: 8 }}>
              <View style={styles.containerItem}>
                <TextInput
                  value={item.text}
                  style={styles.textInputItem}
                  onChangeText={text => {
                    const listData = [...listText];
                    listData.map((itemText: any, indexItem) =>
                      indexItem === index ? (itemText.text = text) : itemText,
                    );
                    setListText(listData);
                  }}
                />

                <Select
                  placeholder={'Select currency'}
                  dropdownIcon={
                    <Icon
                      name="chevron-down-outline"
                      as={Ionicons}
                      color={'#999'}
                      size={6}
                    />
                  }
                  selectedValue={item.type}
                  onValueChange={value => {
                    const listData = [...listText];
                    listData.map((itemText: any, indexItem) =>
                      indexItem === index ? (itemText.type = value) : itemText,
                    );
                    setListText(listData);
                  }}
                  flex={1}
                >
                  <Select.Item label="Company Name" value="company_name" />
                  <Select.Item label="CP Name" value="name" />
                  <Select.Item label="Title" value="title" />
                  <Select.Item label="Address1" value="address1" />
                  <Select.Item label="Address2" value="address2" />
                  <Select.Item label="Telephone" value="phoneCompany" />
                  <Select.Item label="Email" value="email" />
                  <Select.Item label="Tax Code" value="tax" />
                  <Select.Item label="Personal Email" value="personal_email" />
                  <Select.Item label="Website" value="website" />
                  <Select.Item label="Fax" value="fax" />
                  <Select.Item label="Personal Phonme" value="personal_phone_number" />
                  <Select.Item label="Company Tax Number" value="company_tax_code" />
                  <Select.Item label="Fax" value="fax_number" />
                  <Select.Item label="Company Phone" value="company_phone" />
                  <Select.Item label="Company Address" value="company_address" />
                  {/* <Select.Item label="Company" value="company_name" /> */}
                  <Select.Item label="Title" value="personal_title" />
                </Select>

                <TouchableOpacity
                  style={{ paddingLeft: 16, paddingRight: 8 }}
                  onPress={() => onPressDelete(item.text)}
                >
                  <Icon
                    as={Ionicons}
                    name="close-outline"
                    color="#3e3e3e"
                    size={7}
                  />
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
