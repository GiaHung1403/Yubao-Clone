import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
	InteractionManager,
	Text,
	View,
	TextStyle,
	FlatList,
	Image,
} from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { getEmailPayment } from '@data/api';
import axios from 'axios';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { LocalizationContext } from '@context/LocalizationContext';
import { IUserSystem } from '@models/types';
import Color from '@config/Color';

import styles from './styles';

interface IPropItemTicket {
	label: string;
	value: string;
	styleValue?: TextStyle;
}

interface IEmailPayment {
	fuji_YN: string;
	bF_Date_Iss: number;
	due_Date: string;
	generate_Date: string;
	generate_Date_Adj: string;
	email_Date_Adj: string;
	email_Date: string;
}
export function EmailPaymentScreen(props: any) {
	const { type } = props.route.params;
	const navigation: any = useNavigation();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	const I18n = useContext(LocalizationContext);
	const { colors } = useTheme();
	// const [listEmail, setListEmail] = useState();
	const [listFuji, setListFuji] = useState();
	const [listNor, setListNor] = useState();
	const [typeData, setTypeData] = useState(type);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			(async function getData() {
				const data : any = await getEmailPayment({
					User_ID: dataUserSystem.EMP_NO,
					password: dataUserSystem.PSWD,
				});

				setListFuji(data.filter(item => item?.fuji_YN === 'Fuji'));
				setListNor(data.filter(item => item?.fuji_YN === 'Normal'));
				//setListEmail(data)
			})();

			setDoneLoadAnimated(true);
		});
	}, []);

	const itemTicketView = ({ label, value, styleValue }: IPropItemTicket) => (
		<View
			style={{ marginBottom: 8, alignItems: 'center', marginHorizontal: 19 }}
		>
			<Text style={{ flex: 1 }}>{label}</Text>
			<Text style={styleValue}>{value}</Text>
		</View>
	);
	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<Header title={'Generate And Email Payment'} />
			<View style={{ marginTop: 8, flexDirection: 'row', marginHorizontal: 8 }}>
				<Card
					elevation={2}
					style={{
						flex: 1,
						marginRight: 8,
						paddingVertical: 8,
						backgroundColor: typeData === 'Fuji' ? '#DDDDDD' : 'white',
					}}
					onPress={() => setTypeData('Fuji')}
				>
					<View style={{ flexDirection: 'row' }}>
						<Image
							source={{
								uri: 'https://img.icons8.com/bubbles/2x/money-transfer.png',
							}}
							resizeMode="contain"
							style={styles.iconCommenceNPV}
						/>
						<View style={{ marginLeft: 8, justifyContent: 'center', flex: 1 }}>
							<Text
								style={[styles.labelRecoveryDelinquent, { marginLeft: 20 }]}
							>
								Fuji
							</Text>
						</View>
					</View>
				</Card>

				{/* Card Delinquent */}
				<Card
					elevation={2}
					style={{
						flex: 1,
						backgroundColor: typeData === 'Normal' ? '#DDDDDD' : 'white',
					}}
					onPress={() => setTypeData('Normal')}
				>
					<View
						style={{ flexDirection: 'row', padding: 8, paddingVertical: 8 }}
					>
						<Image
							source={{
								uri: 'https://img.icons8.com/bubbles/2x/money-transfer.png',
							}}
							resizeMode="contain"
							style={styles.iconCommenceNPV}
						/>
						<View style={{ marginLeft: 8, justifyContent: 'center', flex: 1 }}>
							<Text style={styles.labelRecoveryDelinquent}>Normal</Text>
						</View>
					</View>
				</Card>
			</View>
			{doneLoadAnimated ? (
				<FlatList
					data={typeData === 'Fuji' ? listFuji : listNor}
					renderItem={({ item, index }) => (
						<Card elevation={2} style={{ marginHorizontal: 8, marginTop: 8 }}>
							<View style={{ flexDirection: 'row', padding: 8 }}>
								{/* {itemTicketView({
									label: 'Fuji/Normal',
									value: item?.FUJI_YN,
									styleValue: { fontWeight: '600', color: colors.primary },
								})} */}
								{itemTicketView({
									label: 'Due Date',
									value: item?.due_Date,
									styleValue: {
										fontWeight: '600',
										color: Color.approved,
										maxWidth: 250,
									},
								})}
								{itemTicketView({
									label: 'Generate Date',
									value:
										item?.generate_Date_Adj === ''
											? item?.generate_Date
											: item?.generate_Date_Adj,
									styleValue: {
										fontWeight: '600',
										color: Color.approved,
										maxWidth: 250,
									},
								})}

								{itemTicketView({
									label: 'Email Date',
									value:
										item?.email_Date_Adj === ''
											? item?.email_Date
											: item?.email_Date_Adj,
									styleValue: {
										fontWeight: '600',
										color: Color.approved,
										maxWidth: 250,
									},
								})}
							</View>
						</Card>
					)}
				/>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
