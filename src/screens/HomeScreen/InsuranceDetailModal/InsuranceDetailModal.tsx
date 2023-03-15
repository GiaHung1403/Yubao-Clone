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
import { getInsuranceInformedDetail } from '@data/api';
import moment from 'moment';
import { IUserSystem } from '@models/types';
import styles from '@screens/HomeScreen/styles';
import { useSelector } from 'react-redux';
import LoadingFullScreen from '@components/LoadingFullScreen';

export function InsuranceDetailModal(props: any) {
	const navigation: any = useNavigation();
	const [doneAnimation, setDoneLoadAnimated] = useState<boolean>(false);
	const { colors } = useTheme();
	const { teamMemberSelected, fromDate, toDate, dataInsuranceInformed }: any =
		useSelector((state: any) => state.dashboard_reducer);

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
			const data: any = await getInsuranceInformedDetail({
				User_ID: dataUserSystem?.EMP_NO,
				FROM_DATE: moment(fromDate).format('DDMMYYYY'),
				TO_DATE: moment(toDate).format('DDMMYYYY'),
				Sub_Team: subTeamSelected?.C_NO || 0,
				Password: '',
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
					Insurance Detail
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

				{/* Card Insurance Informed */}
				<Card elevation={2} style={{}}>
					<View style={{ padding: 8 }}>
						<View
							style={{
								marginBottom: 16,
								flexDirection: 'row',
								alignSelf: 'center',
							}}
						>
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
								<Text style={{ fontSize: 12, color: '#555' }}>Actual</Text>
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

						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
								{renderColumnChart({
									value: dataInsuranceInformed?.persent_amt.toString(),
									percent: dataInsuranceInformed?.persent_amt,
									color: colors.primary,
								})}
								{renderColumnChart({
									value: '90%',
									color: '#2c82c9',
								})}
							</View>
						</View>

						<Text style={styles.labelCustomerInsurance}>
							Insurance Informed
						</Text>
					</View>
				</Card>

				{doneAnimation ? (
					<FlatList
						data={listCommencement}
						keyExtractor={(item, index) => index.toString()}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => {
							//let temp = item.emP_NM.split('-');
							return (
								<Card
									elevation={2}
									style={{ marginTop: 8, marginHorizontal: 8 }}
								>
									<View style={{ padding: 8, flexDirection: 'row' }}>
										<TextInfoRow
											icon={'person-outline'}
											value={item?.MK_EMP_NM}
											styleValue={{}}
											containerStyle={{ marginTop: 8 }}
										/>

										<TextInfoRow
											icon={'shield-outline'}
											isIconRight={true}
											value={`${item?.PERSENT_AMT}`}
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
