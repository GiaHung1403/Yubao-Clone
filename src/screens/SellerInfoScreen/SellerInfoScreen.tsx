import React, { useEffect, useState } from 'react';
import { InteractionManager, ScrollView, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import { getAllTcoByClass, getListNation } from '@data/api';
import { INation, ISeller, ITcoByClass, IUserSystem } from '@models/types';
import CheckBoxCustomComponent from '@components/CheckBoxCustomComponent';

interface IPropsRouteParams {
	sellerInfo: ISeller;
}

interface INationConvert {
	label: string;
	value: string;
}

export function SellerInfoScreen(props) {
	const { sellerInfo }: IPropsRouteParams = props.route.params;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [listNation, setListNation] = useState<INationConvert[]>([]);
	const [listTypeOfSeller, setListTypeOfSeller] = useState<any[]>([
		{ label: 'Company', value: '1' },
		{ label: 'Individual', value: '2' },
	]);
	const [listCICCode, setListCICCode] = useState<any[]>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			/* Get List Nation */
			const responseNation = (await getListNation({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
			})) as INation[];

			const listNationConvert: INationConvert[] = responseNation.map(item => ({
				label: item.STND_C_NM,
				value: item.C_NO,
			}));

			setListNation(listNationConvert);

			/* Get CIC Code */
			const responseCICCode: ITcoByClass[] = (await getAllTcoByClass({
				classNo: 'cdln000013',
			})) as ITcoByClass[];

			const listCICCodeConvert = responseCICCode.map(item => ({
				label: `${item.c_No} - ${item.stnD_C_NM}`,
				value: item.c_No,
			}));

			setListCICCode(listCICCodeConvert);
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<Header title={`Seller Info ${sellerInfo.ID}`} />

			{doneLoadAnimated ? (
				<ScrollView
					style={{
						flex: 1,
						padding: 8,
					}}
					showsVerticalScrollIndicator={false}
				>
					<Card elevation={2}>
						<View style={{ padding: 8 }}>
							<TextInputCustomComponent
								label="Seller Name VN"
								enable={false}
								multiline
								style={{ marginBottom: 8 }}
								value={sellerInfo.SELLER_NM_V}
							/>
							<TextInputCustomComponent
								label="Seller Name EN"
								enable={false}
								multiline
								style={{ marginBottom: 8 }}
								value={sellerInfo.SELLER_NM}
							/>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginBottom: 8,
								}}
							>
								<TextInputCustomComponent
									label="ID"
									placeholder=""
									enable={false}
									style={{ flex: 1, marginRight: 8 }}
									value={sellerInfo.ID.toString()}
								/>
								<TextInputCustomComponent
									label={
										sellerInfo.SELLER_TP === '1'
											? 'TaxCode'
											: 'ID No./Passport No.'
									}
									placeholder=""
									enable={false}
									style={{ flex: 1 }}
									value={
										sellerInfo.SELLER_TP === '1'
											? sellerInfo.TAX_CODE
											: sellerInfo.REG_ID
									}
								/>
							</View>

							<CheckBoxCustomComponent
								title={'Type of Seller'}
								listData={listTypeOfSeller}
								value={sellerInfo.SELLER_TP}
								setValue={value => null}
								showTitle={true}
							/>

							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginBottom: 8,
								}}
							>
								<TextInputCustomComponent
									label="Phone Number"
									enable={false}
									style={{ marginBottom: 8, flex: 1, marginRight: 8 }}
									value={sellerInfo.TNO.trim()}
								/>

								<PickerCustomComponent
									showLabel={true}
									listData={listCICCode}
									label="CIC code"
									value={sellerInfo.CILC_CODE}
									textStyle={{ maxWidth: 110 }}
									style={{ flex: 1, marginBottom: 8 }}
								/>
							</View>

							<TextInputCustomComponent
								label="Address_VN"
								multiline={true}
								enable={false}
								style={{ marginBottom: 8 }}
								value={sellerInfo.ADDR_V}
							/>
							<TextInputCustomComponent
								label="Address_EN"
								multiline={true}
								enable={false}
								style={{ marginBottom: 8 }}
								value={sellerInfo.ADDR}
							/>

							<PickerCustomComponent
								showLabel={true}
								listData={listNation}
								label="Nation"
								value={sellerInfo.NAT_C}
								style={{ marginBottom: 8 }}
							/>

							<TextInputCustomComponent
								label="PIC"
								placeholder=""
								enable={false}
								style={{ marginBottom: 8 }}
								value={sellerInfo.PIC}
							/>
						</View>
					</Card>
				</ScrollView>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
