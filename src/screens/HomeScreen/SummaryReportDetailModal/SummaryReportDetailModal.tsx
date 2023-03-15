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
import { getSummaryReportDetail } from '@data/api';
import { ISummaryProgress, IUserSystem } from '@models/types';
import styles from '@screens/HomeScreen/styles';
import { formatVND } from '@utils';
import { useSelector } from 'react-redux';
import LoadingFullScreen from '@components/LoadingFullScreen';
import moment from 'moment';

interface IProps {
	dataSummaryProgress: ISummaryProgress[];
	Title: any;
}

export function SummaryReportDetailModal(props: any) {
	const navigation: any = useNavigation();
	const { dataSummaryProgress, Title }: IProps = props.route.params;
	const [doneAnimation, setDoneLoadAnimated] = useState<boolean>(false);
	const { colors } = useTheme();
	const { teamMemberSelected, fromDate, toDate }: any = useSelector(
		(state: any) => state.dashboard_reducer,
	);

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { subTeamSelected } = useSelector(
		(state: any) => state.dashboard_reducer,
	);

	const [listCommencement, setListCommencement] = useState<any[]>([]);

	const renderColumnChart = ({ value, percent, color }: any) => (
		<View
			style={{
				alignItems: percent ? 'flex-end' : 'flex-start',
				marginRight: percent ? 4 : 0,
			}}
		>
			<Text
				style={{
					fontSize: 11,
					fontWeight: '600',
					color,
				}}
			>
				{value}
			</Text>
			{percent ? (
				<Text
					style={{
						fontSize: 11,
						fontWeight: '600',
						color: colors.primary,
						marginVertical: 2,
					}}
				>
					({percent === Infinity ? 100 : percent}%)
				</Text>
			) : null}

			<View
				style={{
					width: 16,
					height:
						value && parseInt(value, 10) > 0
							? 60 *
									((percent === undefined || percent === Infinity
										? 100
										: percent || 1) /
										100) || 1
							: 1,
					borderRadius: 4,
					backgroundColor: color,
				}}
			/>
		</View>
	);

	useEffect(() => {
		(async function getData() {
			const data: any = await getSummaryReportDetail({
				User_ID: dataUserSystem?.EMP_NO,
				Password: '',
				sFrom_Date: fromDate.toISOString(),
				sTo_Date: toDate.toISOString(),
				Sub_Team: subTeamSelected?.C_NO || 0,
				team_Code: '',
			});

			setListCommencement(data);
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
					Summary Report Detail
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
				{/* View chart Tele/Visit/Consultation */}
				<Card elevation={2} style={{ marginTop: 8, marginHorizontal: 8 }}>
					<View style={{ padding: 8 }}>
						{/* View note */}
						<View style={{ marginBottom: 12, flexDirection: 'row' }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<View
									style={{
										backgroundColor: colors.primary,
										width: 12,
										height: 12,
										borderRadius: 6,
										marginRight: 8,
									}}
								/>
								<Text style={{ fontSize: 12, color: '#555' }}>Achievement</Text>
							</View>

							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginLeft: 16,
								}}
							>
								<View
									style={{
										backgroundColor: '#2c82c9',
										width: 12,
										height: 12,
										borderRadius: 6,
										marginRight: 8,
									}}
								/>
								<Text style={{ fontSize: 12, color: '#555' }}>Target</Text>
							</View>
						</View>

						{/* View chart */}
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'flex-end',
							}}
						>
							{/* Chart Tele */}
							<View style={{ flex: 1, alignItems: 'center' }}>
								<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
									{renderColumnChart({
										value: formatVND(
											dataSummaryProgress?.reduce(
												(value, item) => value + item.no_tele,
												0,
											),
										),
										percent: parseFloat(
											toFixNumber(
												(
													(dataSummaryProgress?.reduce(
														(value, item) => value + item.no_tele,
														0,
													) *
														100) /
													dataSummaryProgress?.reduce(
														(value, item) => value + item.acml_target_tele,
														0,
													)
												).toString(),
											).toString(),
										),
										color: colors.primary,
									})}
									{renderColumnChart({
										value: formatVND(
											dataSummaryProgress?.reduce(
												(value, item) => value + item.acml_target_tele,
												0,
											),
										),
										color: '#2c82c9',
									})}
								</View>
								<Text style={styles.labelChartColumn}>Tele</Text>
							</View>
							{/* Chart Visit */}
							<View style={{ flex: 1, alignItems: 'center' }}>
								<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
									{renderColumnChart({
										value: formatVND(
											dataSummaryProgress?.reduce(
												(value, item) => value + item.no_visit,
												0,
											),
										),
										percent: parseFloat(
											toFixNumber(
												(
													(dataSummaryProgress?.reduce(
														(value, item) => value + item.no_visit,
														0,
													) *
														100) /
													dataSummaryProgress?.reduce(
														(value, item) => value + item.acml_target_visit,
														0,
													)
												).toString(),
											).toString(),
										),
										color: colors.primary,
									})}
									{renderColumnChart({
										value: formatVND(
											dataSummaryProgress?.reduce(
												(value, item) => value + item.acml_target_visit,
												0,
											),
										),
										color: '#2c82c9',
									})}
								</View>
								<Text style={styles.labelChartColumn}>Visit</Text>
							</View>
							{/* Chart CF */}
							<View style={{ flex: 1, alignItems: 'center' }}>
								<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
									{renderColumnChart({
										value: formatVND(
											dataSummaryProgress?.reduce(
												(value, item) => value + item.no_cons,
												0,
											),
										),
										percent: parseFloat(
											toFixNumber(
												(
													(dataSummaryProgress?.reduce(
														(value, item) => value + item.no_cons,
														0,
													) *
														100) /
													dataSummaryProgress?.reduce(
														(value, item) => value + item.acml_target_cons,
														0,
													)
												).toString(),
											).toString(),
										),
										color: colors.primary,
									})}
									{renderColumnChart({
										value: formatVND(
											dataSummaryProgress?.reduce(
												(value, item) => value + item.acml_target_cons,
												0,
											),
										),
										color: '#2c82c9',
									})}
								</View>
								<Text style={styles.labelChartColumn}>Consultation</Text>
							</View>
						</View>
					</View>
				</Card>
				{doneAnimation ? (
					<FlatList
						data={listCommencement}
						keyExtractor={(item, index) => index.toString()}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => {
							let temp = item.emP_NM.split('-');
							return (
								<Card
									elevation={2}
									style={{ marginTop: 8, marginHorizontal: 8 }}
								>
									<View style={{ padding: 8 }}>
										{/* <View style={{ flexDirection: 'row' }}>
									<TextInfoRow
										icon={'barcode-outline'}
										value={item.APNO}
										styleValue={{ fontWeight: '600', color: colors.primary }}
									/>
									<TextInfoRow
										icon={'calendar-outline'}
										isIconRight
										value={convertUnixTimeDDMMYYYY(
											new Date(item.DSBT_DATE).getTime() / 1000,
										)}
										styleValue={{}}
									/>
								</View> */}

										<TextInfoRow
											icon={'person-outline'}
											value={temp[1]}
											styleValue={{ flex: 1 }}
											containerStyle={{ marginTop: 8 }}
										/>
										<View style={{ flexDirection: 'row' }}>
											<TextInfoRow
												icon={'call-outline'}
												value={`${item.no_Tele_Lv3} Call`}
												styleValue={{
													fontWeight: '600',
													color: colors.primary,
													fontSize: 12,
												}}
												containerStyle={{
													marginTop: 8,
													justifyContent: 'center',
												}}
											/>

											<TextInfoRow
												icon={'walk-outline'}
												value={`${item.no_Visit_Lv3}`}
												styleValue={{
													fontWeight: '600',
													color: colors.primary,
													fontSize: 12,
												}}
												containerStyle={{
													marginTop: 8,
													justifyContent: 'center',
												}}
											/>

											<TextInfoRow
												icon={'document-text-outline'}
												value={`${item.no_Cons_Lv3}`}
												styleValue={{
													fontWeight: '600',
													color: colors.primary,
													fontSize: 12,
												}}
												containerStyle={{
													marginTop: 8,
													justifyContent: 'center',
												}}
											/>
										</View>
									</View>
								</Card>
							);
						}}
					/>
				) : (
					<LoadingFullScreen />
				)}
			</View>
		</View>
	);
}
