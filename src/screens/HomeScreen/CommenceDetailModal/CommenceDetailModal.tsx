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

import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { getCommencementDetail } from '@data/api';
import {
	timeFromFilterDashboardDefault,
	timeToFilterDashboardDefault,
} from '@data/Constants';
import {
	ICommencementDetail,
	IUserSystem,
	ISummaryProgress,
} from '@models/types';
import styles from '@screens/HomeScreen/styles';
import { formatVND } from '@utils';
import { useSelector } from 'react-redux';
import moment from 'moment';

interface IProps {
	dataSummaryProgress: ISummaryProgress[];
	teamMemberSelected: any;
	fromDate: any;
	toDate: any;
}
export function CommenceDetailModal(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const { dataSummaryProgress, teamMemberSelected, fromDate, toDate }: IProps =
		useSelector((state: any) => state.dashboard_reducer);

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { subTeamSelected } = useSelector(
		(state: any) => state.dashboard_reducer,
	);

	const [listCommencement, setListCommencement] = useState<
		ICommencementDetail[]
	>([]);

	useEffect(() => {
		(async function getData() {
			const data = (await getCommencementDetail({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				APNO: '',
				FROM_DATE: moment(timeFromFilterDashboardDefault).format('DDMMYYYY'),
				TO_DATE: moment(timeToFilterDashboardDefault).format('DDMMYYYY'),
				Sub_Team: subTeamSelected?.C_NO || 0,
			})) as ICommencementDetail[];
			setListCommencement(data);
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
					List Commence and NPV
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
				{/* View Commence & NPV */}
				<View style={styles.containerCommenceNPV}>
					{/* View Commence Card */}
					{renderCardCommenceNPV({
						stylesCard: { marginRight: 8 },
						iconUrl: 'https://img.icons8.com/bubbles/344/money-bag.png',
						labelCard: 'Commence',
						value: formatVND(
							dataSummaryProgress?.reduce(
								(value, item) => value + item.acml_amt,
								0,
							),
						),
						percent:
							(dataSummaryProgress &&
								dataSummaryProgress[0]?.persent_acml_target?.toFixed(2)) ||
							`${(
								(dataSummaryProgress?.reduce(
									(value, item) => value + item.acml_amt,
									0,
								) /
									dataSummaryProgress?.reduce(
										(value, item) => value + item.acml_target,
										0,
									)) *
								100
							)?.toFixed(2)}`,
					})}

					{/* View NPV Card */}
					{renderCardCommenceNPV({
						stylesCard: {},
						iconUrl:
							'https://img.icons8.com/bubbles/344/economic-improvement.png',
						labelCard: 'NPV',
						value: formatVND(
							dataSummaryProgress?.reduce(
								(value, item) => value + item.npv_amt,
								0,
							),
						),
						percent:
							(dataSummaryProgress &&
								dataSummaryProgress[0]?.persent_npv?.toFixed(2)) ||
							`${(
								(dataSummaryProgress?.reduce(
									(value, item) => value + item.npv_amt,
									0,
								) /
									dataSummaryProgress?.reduce(
										(value, item) => value + item?.NPV_TARGET,
										0,
									)) *
								100
							)?.toFixed(2)}`,
					})}
				</View>
				<FlatList
					data={listCommencement}
					keyExtractor={(item, index) => index.toString()}
					ListFooterComponent={() => <SafeAreaView style={{ width: 50 }} />}
					renderItem={({ item, index }) => (
						<Card elevation={2} style={{ marginTop: 8, marginHorizontal: 8 }}>
							<View style={{ padding: 8 }}>
								<View style={{ flexDirection: 'row' }}>
									<TextInfoRow
										icon={'barcode-outline'}
										value={item.apno}
										styleValue={{ fontWeight: '600', color: colors.primary }}
									/>
									<TextInfoRow
										icon={'calendar-outline'}
										isIconRight
										value={moment(new Date(item.dsbt_Date)).format(
											'DD/MM/YYYY',
										)}
										styleValue={{}}
									/>
								</View>

								<TextInfoRow
									icon={'person-outline'}
									value={item.ls_nm}
									styleValue={{ flex: 1 }}
									containerStyle={{ marginTop: 8 }}
								/>
								<View style={{ flexDirection: 'row' }}>
									<TextInfoRow
										icon={'cash-outline'}
										value={`${formatVND(item.dsbt_amt)} USD`}
										styleValue={{
											fontWeight: '600',
											color: colors.primary,
											fontSize: 12,
										}}
										containerStyle={{ marginTop: 8, justifyContent: 'center' }}
									/>

									<TextInfoRow
										icon={'trending-up-outline'}
										value={`${formatVND(item.exp_NPV_Costdown)} USD`}
										styleValue={{
											fontWeight: '600',
											color: colors.primary,
											fontSize: 12,
										}}
										containerStyle={{ marginTop: 8, justifyContent: 'center' }}
									/>

									<TextInfoRow
										icon={'analytics-outline'}
										value={`${item.exp_Irr_Costdown}% (IRR)`}
										styleValue={{
											fontWeight: '600',
											color: colors.primary,
											fontSize: 12,
										}}
										containerStyle={{ marginTop: 8, justifyContent: 'center' }}
									/>
								</View>
							</View>
						</Card>
					)}
				/>
			</View>
		</View>
	);
}
