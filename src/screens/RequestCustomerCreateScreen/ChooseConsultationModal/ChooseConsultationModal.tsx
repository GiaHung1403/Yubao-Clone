import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Button, Searchbar } from 'react-native-paper';
import { useScaling } from '../../../hooks';
import { useDispatch, useSelector } from 'react-redux';

import AvatarBorder from '@components/AvatarBorder';
import Color from '@config/Color';
import { getListCF } from '@data/api';
import { Ionicons } from '@expo/vector-icons';
import { ICustomer, IUserSystem } from '@models/types';

import styles from './styles';

interface IPropsRouteParams {
	leseID: number;
	CNIDOld: number;
	screenBack: string;
}

export function ChooseConsultationModal(props: any) {
	const { newState } = useScaling();
	const dispatch = useDispatch();
	const navigation: any = useNavigation();
	const { leseID, CNIDOld, screenBack }: IPropsRouteParams = props.route.params;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [listConsultation, setListConsultation] = useState<any[]>([]);
	const [firstQuery, setFirstQuery] = useState('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);

			const responseCF: any = await getListCF({
				User_ID: dataUserSystem.EMP_NM,
				Password: '',
				LeseID: leseID,
			});

			setListConsultation(responseCF);
		});
	}, []);

	const _onPressButtonOK = () => {
		navigation.goBack();
	};

	const _onPressItem = item => {
		navigation.navigate(screenBack, { CNID: item.CNID });
	};

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
					Choose Consultation
				</Text>
				<Button uppercase={false} style={{}} onPress={() => _onPressButtonOK()}>
					{'OK'}
				</Button>
			</View>

			<Searchbar
				textAlign={'left'}
				placeholder={'Search CNID'}
				onChangeText={query => setFirstQuery(query)}
				value={firstQuery}
				style={{ zIndex: 2, marginHorizontal: 8, marginTop: 8 }}
				inputStyle={{ fontSize: 14 }}
				allowFontScaling={newState}
			/>

			{/* View Body */}
			<View style={{ flex: 1, zIndex: 1 }}>
				<FlatList
					data={listConsultation.filter(item => item.CNID.includes(firstQuery))}
					extraData={leseID}
					style={{ flex: 1, paddingTop: 8, backgroundColor: '#fff' }}
					keyExtractor={(_, index) => index.toString()}
					showsVerticalScrollIndicator={false}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={({ item, index }) => (
						<TouchableOpacity onPress={() => _onPressItem(item)}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									paddingHorizontal: 12,
									paddingVertical: 8,
									backgroundColor: '#fff',
									borderTopWidth: index === 0 ? 0 : 0.5,
									borderTopColor: '#ddd',
								}}
							>
								<AvatarBorder username={item.CNID} size={30} />
								<Text style={{ flex: 1, marginLeft: 12 }}>
									{item.CNID} - {item.ACQT_AMT} VND
								</Text>
								{item.CNID === CNIDOld && (
									<Icon
										as={Ionicons}
										name="checkmark-outline"
										size={7}
										color={Color.main}
									/>
								)}
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	);
}
