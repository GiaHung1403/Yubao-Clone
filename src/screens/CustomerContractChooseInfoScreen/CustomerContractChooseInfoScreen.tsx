import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
	Image,
	InteractionManager,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import Header from '@components/Header';
import { LocalizationContext } from '@context/LocalizationContext';
import api_get_webview_file from '@data/api/api_get_webview_file';

const IC_ARROW_RIGHT = require('@assets/icons/ic_arrow_right.png');
const IC_PAYMENT = require('@assets/icons/ic_history_payment_test.png');
const IC_LEASED_NOTICE = require('@assets/icons/ic_leased_notice.png');
const IC_ASSETS = require('@assets/icons/ic_assets.png');
const IC_CONTRACT_CUTE = require('@assets/icons/ic_contract_cute.png');
const IC_MORTGAGE_ASSETS = require('@assets/icons/ic_mortgage_assets.png');
const IC_GUARANTOR = require('@assets/icons/ic_guarantor.png');
const IC_INVOICE = require('@assets/icons/ic_history_payment.png');

let listUrlFiles: any = [];

export function CustomerContractChooseInfoScreen(props: any) {
	const navigation: any = useNavigation();
	const route = useRoute();
	const { title, url, isShowButton, listAssets, APNO, taxCode }: any =
		route.params;
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	const I18n = useContext(LocalizationContext);
	const textPaymentSchedule = 'Lease Commencement Notice';
	const textInvoice = 'E-Invoice';
	const textSelectInfo = I18n.t('selectInfo');
	const textContractAsset = I18n.t('assets');
	const textLeaseCommencementNotice = I18n.t('leaseCommencementNotice');
	const textContractInsurance = I18n.t('contractInsurance');
	const textMortgageAssets = I18n.t('mortgageAssets');

	const [listData, setListData] = useState([
		{ label: textPaymentSchedule, id: 0, icon: IC_PAYMENT },
		{ label: textLeaseCommencementNotice, id: 1, icon: IC_LEASED_NOTICE },
		{ label: textInvoice, id: 7, icon: IC_INVOICE },
		{ label: textContractAsset, id: 2, icon: IC_ASSETS },
		{ label: textContractInsurance, id: 3, icon: IC_CONTRACT_CUTE },
		{ label: textMortgageAssets, id: 4, icon: IC_MORTGAGE_ASSETS },
		{ label: 'Guarantor', id: 5, icon: IC_GUARANTOR },
	]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const listDataItem: any = [...listData];
			await (async function getData() {
				const data: any = await api_get_webview_file({
					APNO, // C200112702
					User_ID: taxCode,
					Password: taxCode,
					table_name: 'LCN',
				});

				listUrlFiles = [].concat(data);
				if (listUrlFiles.length === 0) {
					listDataItem.splice(1, 1);
				} else {
					listDataItem.shift();
				}

				setListData(listDataItem);

				setTimeout(async () => {
					setDoneLoadAnimated(true);
				}, 100);
			})();
		});
	}, []);

	const _onPressItem = (item: any) => {
		switch (item.id) {
			case 0:
				navigation.navigate('WebviewScreen', {
					title,
					url,
					isShowButton,
				});
				break;
			case 1:
				navigation.navigate('WebviewScreen', {
					title,
					url: listUrlFiles[0]?.FILE_URL,
					isShowButton,
				});
				break;
			case 2:
				navigation.navigate('AssetsListScreen', {
					title,
					url,
					isShowButton,
					listAssets,
					APNO,
				});
				break;
			case 3:
				navigation.navigate('CustomerInsuranceListScreen', {
					keyword: APNO,
					taxCode,
				});
				break;
			case 4:
				navigation.navigate('MortgageAssetScreen', {
					APNO,
					title,
					taxCode,
				});
				break;
			case 5:
				navigation.navigate('CustomerGuarantorScreen', {
					APNO,
					title,
					taxCode,
				});
				break;
			case 7:
				navigation.navigate('CustomerInvoiceScreen', {
					APNO,
					title,
					taxCode,
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

			{doneLoadAnimated && (
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
							key={data.id.toString()}
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
					{/* <Button mode='contained' style={{ margin: 8, marginTop: 20 }}>
            Sent Rating
          </Button> */}
				</View>
			)}
		</View>
	);
}
