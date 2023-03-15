import {Icon} from 'native-base';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Card ,useTheme} from 'react-native-paper';

import Colors from '@config/Color';
import {convertUnixTimeSolid} from '@utils';
import {AntDesign} from "@expo/vector-icons";

export default function TeleItemComponent(props: any) {
    const {teleInfo, index, onPress} = props;
    const [isFavorite, setIsFavorite] = useState(false);
    const {colors} = useTheme()

    return (
			<Card
				style={{
					marginBottom: 8,
					marginHorizontal: 8,
					backgroundColor: '#fff',
				}}
			>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						padding: 8,
						alignItems: 'center',
					}}
					onPress={onPress}
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
							{teleInfo.lese_Name}
						</Text>
						<View style={{ flexDirection: 'row' }}>
							<Text style={{ marginBottom: 4, marginRight: 20 }}>
								<Text style={{ fontWeight: '500' }}>Call Date: </Text>
								{convertUnixTimeSolid(
									new Date(teleInfo.callDate).getTime() / 1000,
								)}
							</Text>
							<Text style={{ marginBottom: 4 }}>
								<Text style={{ fontWeight: '500' }}>City:</Text>{' '}
								{teleInfo?.city_Nm}
							</Text>
						</View>
						<Text style={{ marginBottom: 4 }}>
							<Text style={{ fontWeight: '500' }}>Time of Demand:</Text>{' '}
							{teleInfo?.grade_NM}
						</Text>
						<Icon
							as={AntDesign}
							name={isFavorite ? 'star' : 'staro'}
							color={colors.primary}
							size={7}
							style={{
								position: 'absolute',
								top: 0,
								right: 0,
							}}
							onPress={() => setIsFavorite(!isFavorite)}
						/>
					</View>
				</TouchableOpacity>
			</Card>
		);
}
