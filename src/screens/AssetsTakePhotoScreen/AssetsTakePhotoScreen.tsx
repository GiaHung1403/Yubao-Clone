import Geolocation from '@react-native-community/geolocation';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import * as Keychain from 'react-native-keychain';
import { Card ,useTheme} from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '@components/Header';
import Colors from '@config/Color';
import { getImages, removeImage, uploadImage } from '@data/api';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import { IAssetImage, IUserSystem } from '@models/types';

export function AssetsTakePhotoScreen(props: any) {
  const { APNO, assetItem } = props.route.params;
  const dataUserSystem: IUserSystem = useSelector(
    (state: any) => state.auth_reducer.dataUserSystem,
  );
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 16.59885,
    longitude: 105.746316,
  });
  const [listImage, setListImage] = useState<IAssetImage[]>(new Array(3));
  const [loading, setLoading] = useState<boolean>(false);
  const [indexItemLoading, setIndexItemLoading] = useState<number>();
  const{colors} = useTheme()
  useEffect(() => {
    getListAssetImage();
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) =>
        Alert.alert(
          'Alert',
          'Cannot get current location! Please contact MIS!\n' + error.message,
        ),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }, []);

  const getListAssetImage = async () => {
    const credentials: any = await Keychain.getGenericPassword();
    const { username, password } = credentials;
    const responseImage: any = await getImages({
      User_ID: username,
      Password: password,
      key: `${APNO}_${assetItem.ASTS_ID}`,
      SEQ: '',
    });

    setListImage((listOld) => [].concat(responseImage));
  };

  const _onPressItem = (index: number) => {
    setLoading(true);
    setIndexItemLoading(index);
    const options = {
      maxWidth: 1920,
      quality: 0.1,
    };

    ImagePicker.launchCamera(options as ImagePicker.ImageLibraryOptions, async (response) => {
      if (response.didCancel) {
        setLoading(false);
        return;
      }

      if (listImage[index]) {
        try {
          await removeImage({
            key: `${APNO}_${assetItem.ASTS_ID}`,
            SEQ: listImage[index].SEQ,
          });
        } catch (error: any) {
          Alert.alert('Error Remove Image', error.message);
        }
      }

      try {
        const credentials: any = await Keychain.getGenericPassword();
        const { username, password } = credentials;

        if (response.assets) {
          await uploadImage({
            User_ID: username,
            Password: password,
            binary: response.assets[0].base64,
            imageName: `${APNO}_${assetItem.ASTS_ID}_${index + 1}`,
            imageURI: response.assets[0].uri,
            SEQ: index + 1,
            latLng: `${currentLocation.latitude},${currentLocation.longitude}`,
            location: `${currentLocation.latitude},${currentLocation.longitude}`,
            key: `${APNO}_${assetItem.ASTS_ID}`,
          });
        }

        setListImage((listOld) => {
          listOld[index] = Object.assign(listOld[index], {
            URL_FILE: response.assets ? response.assets[0].uri : "",
          });
          return listOld;
        });

        setLoading(false);
        Alert.alert('Success', 'Upload image assets success!');
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          zIndex: 2,
        }}
      >
        <Header title="Take photos"/>
      </View>

      <View
        style={{
          flex: 1,
          zIndex: 1,
          padding: 8,
          flexDirection: 'row',
        }}
      >
        <Card style={{ height: 100, flex: 1 }}>
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
            onPress={() => _onPressItem(0)}
          >
            {indexItemLoading === 0 && loading ? (
              <View>
                <ActivityIndicator/>
              </View>
            ) : listImage[0] ? (
              <Image
                source={{ uri: listImage[0].URL_FILE }}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Icon
                as={MaterialCommunityIcons}
                name={'plus'}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        </Card>
        <Card
          style={{
            height: 100,
            flex: 1,
            marginHorizontal: 8,
          }}
        >
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
            onPress={() => _onPressItem(1)}
          >
            {indexItemLoading === 1 && loading ? (
              <View>
                <ActivityIndicator/>
              </View>
            ) : listImage[1] ? (
              <Image
                source={{ uri: listImage[1].URL_FILE }}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Icon
                as={MaterialCommunityIcons}
                name={'plus'}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        </Card>
        <Card style={{ height: 100, flex: 1 }}>
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
            onPress={() => _onPressItem(2)}
          >
            {indexItemLoading === 2 && loading ? (
              <View>
                <ActivityIndicator/>
              </View>
            ) : listImage[2] ? (
              <Image
                source={{ uri: listImage[2].URL_FILE }}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Icon
                as={MaterialCommunityIcons}
                name={'plus'}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        </Card>
      </View>
    </View>
  );
}
