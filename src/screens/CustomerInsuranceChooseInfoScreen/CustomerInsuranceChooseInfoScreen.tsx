import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import Header from '@components/Header';
import { LocalizationContext } from '@context/LocalizationContext';

const IC_ARROW_RIGHT = require('@assets/icons/ic_arrow_right.png');
const IC_PAYMENT = require('@assets/icons/ic_history_payment_test.png');
const IC_LEASED_NOTICE = require('@assets/icons/ic_leased_notice.png');
const IC_ASSETS = require('@assets/icons/ic_assets.png');

export function CustomerInsuranceChooseInfoScreen(props: any) {
	const navigation: any = useNavigation();
	const route = useRoute();
	const { title, url, isShowButton, listAssets, insuranceItem, taxCode }: any =
		route.params;

	const I18n = useContext(LocalizationContext);
	const textPaymentSchedule = I18n.t('noticePayment');
	const textSelectInfo = I18n.t('selectInfo');
	const textContractAsset = I18n.t('assets');

	const listData = [
		{ label: textPaymentSchedule, id: 0, icon: IC_PAYMENT },
		{ label: 'POA', id: 1, icon: IC_LEASED_NOTICE },
		{ label: textContractAsset, id: 2, icon: IC_ASSETS },
	];

	const _onPressItem = (item: any) => {
		switch (item.id) {
			case 0:
				navigation.navigate('WebviewScreen', {
					title,
					url: '',
					isShowButton,
				});
				break;
			case 1:
				navigation.navigate('CustomerInsuranceCompensationScreen', {
					APNO: insuranceItem.APNO,
					taxCode,
				});
				break;
			case 2:
				navigation.navigate('AssetsListScreen', {
					title,
					url,
					isShowButton,
					listAssets,
				});
				break;
			default:
				break;
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={{ zIndex: 2 }}>
				<Header title={title} />
			</View>

			<View style={{ flex: 1 }}>
				<View
					style={{
						padding: 16,
						backgroundColor: '#f9f9f9',
						borderBottomColor: '#ddd',
						borderBottomWidth: 1,
					}}
				>
					<Text
						style={{
							textAlign: 'center',
							fontWeight: '600',
							fontSize: 16,
						}}
					>
						{textSelectInfo}
					</Text>
				</View>

				{listData.map(data => (
					<TouchableOpacity
						style={{
							padding: 16,
							flexDirection: 'row',
							alignItems: 'center',
							borderBottomColor: '#ddd',
							borderBottomWidth: 1,
						}}
						key={data.label}
						onPress={() => _onPressItem(data)}
					>
						<Image
							source={data.icon}
							resizeMode="contain"
							style={{ width: 32, height: 32, marginRight: 16 }}
						/>
						<Text style={{ flex: 1 }}>{data.label}</Text>
						<Image
							source={IC_ARROW_RIGHT}
							resizeMode="contain"
							style={{ width: 16, height: 16, tintColor: '#666' }}
						/>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}
