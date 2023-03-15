import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

import { AntDesign } from '@expo/vector-icons';
import { IUserSystem, IVisit , IVisit_Trading } from '@models/types';
import Geolocation from '@react-native-community/geolocation';
import { Swipeable } from 'react-native-gesture-handler';
import Color from '@config/Color';
import { useSelector } from 'react-redux';

interface IProps {
	visitInfo: IVisit;
	index: number;
	onPress: () => void;
}

export default function VisItemComponent(props: IProps) {
	const refSwipe = useRef<any>();
	const { visitInfo , index, onPress } = props;
	const { colors } = useTheme();
	const navigation: any = useNavigation();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [isFavorite, setIsFavorite] = useState(false);

	return (
		<Card
			style={{ marginBottom: 8, marginHorizontal: 8, backgroundColor: '#fff' }}
			onPress={onPress}
		>
			<Swipeable
				ref={(ref: any) => {
					refSwipe.current = ref;
				}}
				onSwipeableLeftOpen={() => {
					refSwipe?.current.close();
				}}
				onSwipeableRightOpen={() => {
					refSwipe?.current.close();
					dataUserSystem.EMP_NO.includes('T')
						? navigation.navigate('VisitMapModal_T', { visitInfo })
						: navigation.navigate('VisitMapModal', { visitInfo });
				}}
				enabled={!visitInfo.flaT_LONG}
				renderRightActions={() => (
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'flex-end',
							flex: 1,
							backgroundColor: Color.approved,
							borderRadius: 4,
						}}
					>
						<Text
							style={{
								color: '#fff',
								fontWeight: '500',
								width: 150,
								textAlign: 'center',
								textAlignVertical: 'center',
							}}
						>
							Check In
						</Text>
					</View>
				)}
			>
				<View
					style={{
						flexDirection: 'row',
						padding: 8,
						alignItems: 'center',
						backgroundColor: '#fff',
						borderRadius: 4,
					}}
				>
					<View style={{ marginLeft: 8, flex: 1 }}>
						<Text
							style={{
								marginBottom: 8,
								marginRight: 24,
								fontWeight: '600',
								color: colors.primary,
							}}
						>
							{visitInfo?.ls_Nm || visitInfo?.ls_Nm}
						</Text>
						<View style={{ flexDirection: 'row', marginBottom: 8 }}>
							<Text style={{ width: 150 }}>
								<Text style={{ fontWeight: '500' }}>Interview:</Text>{' '}
								{visitInfo.int_time || visitInfo?.int_time || 0}
							</Text>
							<Text>
								<Text style={{ fontWeight: '500' }}>PIC:</Text>{' '}
								{visitInfo.emp_Nm || visitInfo?.emp_Nm}
							</Text>
						</View>

						<View style={{ flexDirection: 'row' }}>
							<Text style={{}}>
								<Text
									style={{
										fontWeight: '500',
										color:
											visitInfo.flaT_LONG || visitInfo?.flaT_LONG
												? Color.approved
												: Color.waiting,
									}}
								>
									{visitInfo.flaT_LONG || visitInfo?.flaT_LONG
										? `Checked`
										: `Waiting Check-in `}{' '}
								</Text>
							</Text>
						</View>
						<Icon
							as={AntDesign}
							name={isFavorite ? 'star' : 'staro'}
							size={6}
							color={colors.primary}
							style={{
								position: 'absolute',
								top: 0,
								right: 0,
							}}
							onPress={() => setIsFavorite(!isFavorite)}
						/>
					</View>
				</View>
			</Swipeable>
		</Card>
	);
}
