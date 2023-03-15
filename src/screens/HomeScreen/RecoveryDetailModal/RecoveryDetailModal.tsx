import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import * as Keychain from 'react-native-keychain';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { getRecoveryDetail, getDelinquentDetail } from '@data/api';
import { getListContact } from '@actions/contact_action';
import { IUserSystem, IContact } from '@models/types';
import LoadingFullScreen from '@components/LoadingFullScreen';

import styles from '@screens/HomeScreen/styles';

export function RecoveryDetailModal(props: any) {
	const navigation: any = useNavigation();
	const { dataSummaryProgress, Title, IsRevovery } = props.route.params;
	const [doneAnimation, setDoneLoadAnimated] = useState<boolean>(false);
	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);
	const dispatch = useDispatch();
	const [title, setTitle] = useState(Title);

	const getCreateName = value => {
		let createName: IContact[];
		createName = listContact?.filter(item => item.emp_no.includes(value));
		return createName[0]?.emp_nm;
	};

	const { colors } = useTheme();
	const {
		teamMemberSelected,
		fromDate,
		toDate,
		dataDelinquent,
		dataRecovery,
	}: any = useSelector((state: any) => state.dashboard_reducer);

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { subTeamSelected } = useSelector(
		(state: any) => state.dashboard_reducer,
	);

	const [listRecovery, setListRecovery] = useState<any[]>([]);
	const [listDelinquent, setListDelinquent] = useState<any[]>([]);
	const [isRecovery, setIsRecovery] = useState<boolean>(IsRevovery);

	useEffect(() => {
		(async function search() {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;

			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: '',
					Dept_Code: '0',
					Branch: '-1',
					subteam: dataUserSystem.EMP_NO.includes('T') ? '' : undefined,
				}),
			);
		})();
	}, []);

	useEffect(() => {
		(async function getDataRecovery() {
			const data: any = await getRecoveryDetail({
				User_ID: dataUserSystem?.EMP_NO,
				Password: '',
				FROM_DATE: moment(fromDate).format('DDMMYYYY'),
				TO_DATE: moment(toDate).format('DDMMYYYY'),
				Sub_Team: subTeamSelected?.C_NO || 0,
			});
			setListRecovery(data);
			// setDoneLoadAnimated(true);
		})();

		(async function getDataDelinquent() {
			const data: any = await getDelinquentDetail({
				User_ID: dataUserSystem?.EMP_NO,
				Password: '',
				sFrom_Date: fromDate.toISOString(),
				sTo_Date: toDate.toISOString(),
				Sub_Team: subTeamSelected?.C_NO || 0,
				team_Code: '',
				report_Type: 'MO',
			});

			//console.log(data)
			setListDelinquent(data);
			setDoneLoadAnimated(true);
		})();
	}, []);

	const _onPressButtonOK = () => {
		return null;
	};

	const toFixNumber = (value: string) => {
		return Number(parseFloat(value).toFixed(2));
	};

	const renderCardCommenceNPV = ({
		stylesCard,
		iconUrl,
		labelCard,
		value,
		percent,
	}) => {
		const percentFormat = percent === 'NaN' ? '0' : percent;

		return (
			<Card
				elevation={2}
				style={[styles.cardItemCommenceNVP, stylesCard]}
				onPress={() => navigation.navigate('CommenceDetailModal')}
			>
				<View style={styles.containerItemCommenceNPV}>
					<View style={{ alignItems: 'center' }}>
						<Image
							source={{
								uri: iconUrl,
							}}
							resizeMode="contain"
							style={styles.iconCommenceNPV}
						/>

						<Text style={styles.labelCommenceNPV}>{labelCard}</Text>
					</View>

					<View style={styles.viewRightItemCommenceNPV}>
						<View style={styles.viewValueRightItemCommenceNPV}>
							<Text style={styles.textValueRightItemCommenceNPV}>{value}</Text>
							<Text style={styles.textLabelRightItemCommenceNPV}>
								Total Amount
							</Text>
						</View>

						<View style={[styles.viewRightItemCommenceNPV, { marginTop: 20 }]}>
							<Text style={styles.textValueRightItemCommenceNPV}>
								{percentFormat}%
							</Text>
							<Text style={styles.textLabelRightItemCommenceNPV}>Achieved</Text>
						</View>
					</View>
				</View>
			</Card>
		);
	};

	const renderInfoFilterRow = ({ color, label, value }) => (
		<View style={styles.containerInfoFilterRow}>
			<View style={[styles.circleColor, { backgroundColor: color }]} />

			<Text style={styles.textLabelInfoFilter}>
				{label}:{' '}
				<Text style={[styles.textValueInfoFilter, { color }]}>{value}</Text>
			</Text>
		</View>
	);

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle={'dark-content'} />
			<SafeAreaView
				style={{
					paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
				}}
			/>
			{/* View Header */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: 8,
					borderBottomColor: '#ddd',
					borderBottomWidth: 1,
				}}
			>
				<Button
					uppercase={false}
					style={{}}
					onPress={() => navigation.goBack()}
				>
					Close
				</Button>
				<Text style={{ fontSize: 15, fontWeight: '600', color: '#555' }}>
					{title}
				</Text>
				<Button uppercase={false} style={{}} onPress={() => _onPressButtonOK()}>
					{'OK'}
				</Button>
			</View>

			<View style={{ flex: 1 }}>
				<View style={{ padding: 8 }}>
					{renderInfoFilterRow({
						color: colors.primary,
						label: 'Team',
						value:
							(subTeamSelected?.STND_C_NM !== 'Choose' &&
								subTeamSelected?.STND_C_NM) ||
							'Company',
					})}

					{renderInfoFilterRow({
						color: Color.status,
						label: 'MO',
						value:
							!teamMemberSelected || teamMemberSelected?.EMP_NO === '0'
								? 'All Member'
								: teamMemberSelected?.EMPNM,
					})}

					{renderInfoFilterRow({
						color: '#2c82c9',
						label: 'Period',
						value: `${moment(fromDate).format('DD/MM/YYYY')} - ${moment(
							toDate,
						).format('DD/MM/YYYY')}`,
					})}
				</View>

				{/* View Recovery and Delinquent */}
				<View
					style={{
						flexDirection: 'row',
						marginTop: 8,
						marginHorizontal: 8,
						marginBottom: 5,
					}}
				>
					{/* Card Recovery */}
					<Card
						elevation={2}
						style={{
							flex: 1,
							marginRight: 8,
							paddingVertical: 8,
							backgroundColor: isRecovery ? '#DDDDDD' : 'white',
						}}
						onPress={() => {
							setIsRecovery(true);
							setTitle('Recovery Detail');
						}}
					>
						<View style={{ flexDirection: 'row' }}>
							<Image
								source={{
									uri: 'https://img.icons8.com/bubbles/344/refund.png',
								}}
								resizeMode="contain"
								style={styles.iconCommenceNPV}
							/>
							<View
								style={{ marginLeft: 8, justifyContent: 'center', flex: 1 }}
							>
								<Text style={styles.valueRecoveryDelinquent}>
									{`${toFixNumber(dataRecovery?.recovery?.toString() || '0')}%`}
								</Text>
								<Text style={[styles.labelRecoveryDelinquent]}>
									Rental Recovery
								</Text>
							</View>
						</View>

						<Text
							style={{
								fontSize: 11,
								marginTop: 8,
								marginLeft: 8,
								color: '#666',
							}}
						>
							RR = Receipt / Payable Amount
						</Text>
					</Card>

					{/* Card Delinquent */}
					<Card
						elevation={2}
						style={{
							flex: 1,
							backgroundColor: !isRecovery ? '#DDDDDD' : 'white',
						}}
						onPress={() => {
							setIsRecovery(false);
							setTitle('Delinquent Report Detail');
						}}
					>
						<View
							style={{ flexDirection: 'row', padding: 8, paddingVertical: 8 }}
						>
							<Image
								source={{
									uri: 'https://img.icons8.com/bubbles/344/tax.png',
								}}
								resizeMode="contain"
								style={styles.iconCommenceNPV}
							/>
							<View
								style={{ marginLeft: 8, justifyContent: 'center', flex: 1 }}
							>
								<Text style={styles.valueRecoveryDelinquent}>
									{`${toFixNumber(
										dataDelinquent?.persent_Overdue?.toString() || '0',
									)}%`}
								</Text>
								<Text style={styles.labelRecoveryDelinquent}>Delinquent</Text>
							</View>
						</View>
					</Card>
				</View>

				{doneAnimation ? (
					<FlatList
						data={isRecovery ? listRecovery : listDelinquent}
						keyExtractor={(item, index) => index.toString()}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => {
							//let temp = item.emP_NM.split('-');
							return isRecovery ? (
								getCreateName(item?.mk_Emp_No) ? (
									<Card
										elevation={2}
										style={{ marginTop: 8, marginHorizontal: 8 }}
									>
										<View style={{ padding: 8, flexDirection: 'row' }}>
											<TextInfoRow
												icon={'person-outline'}
												value={getCreateName(item?.mk_Emp_No)}
												// value={getCreateName(item?.field_Code)}
												styleValue={{ flex: 1 }}
												containerStyle={{ marginTop: 8 }}
											/>

											<TextInfoRow
												icon={'cash-outline'}
												isIconRight={true}
												value={`${item?.recovery}`}
												// value={`${item?.out_Bal_Del_Ratio}`}
												styleValue={{
													fontWeight: '600',
													color: colors.primary,
													fontSize: 12,
												}}
												containerStyle={{
													marginTop: 8,
													justifyContent: 'flex-end',
												}}
											/>
										</View>
									</Card>
								) : null
							) : getCreateName(item?.field_Code) ? (
								<Card
									elevation={2}
									style={{ marginTop: 8, marginHorizontal: 8 }}
								>
									<View style={{ padding: 8, flexDirection: 'row' }}>
										<TextInfoRow
											icon={'person-outline'}
											// value={getCreateName(item?.MK_EMP_NO)}
											value={getCreateName(item?.field_Code)}
											styleValue={{ flex: 1 }}
											containerStyle={{ marginTop: 8 }}
										/>

										<TextInfoRow
											icon={'cash-outline'}
											isIconRight={true}
											// value={`${item?.Recovery}`}
											value={`${item?.out_Bal_Del_Ratio}`}
											styleValue={{
												fontWeight: '600',
												color: colors.primary,
												fontSize: 12,
											}}
											containerStyle={{
												marginTop: 8,
												justifyContent: 'flex-end',
											}}
										/>
									</View>
								</Card>
							) : null;
						}}
					/>
				) : (
					<LoadingFullScreen />
				)}
			</View>
		</View>
	);
}
