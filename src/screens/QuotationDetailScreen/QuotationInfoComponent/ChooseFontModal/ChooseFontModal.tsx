import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import { IContact, ISpotlight, IUserLoginRC } from '@models/types';
import { useNavigation } from '@react-navigation/native';
import { callPhoneDefault } from '@utils/callPhone';
import { Icon } from 'native-base';
import React, { useImperativeHandle, useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import Modal from 'react-native-modal';
import { Portal, useTheme } from 'react-native-paper';

import { useSelector } from 'react-redux';

function ChooseFontModal(props: any, ref: any) {
	const { onPress_EN, onPress_CH, onPress_VN } = props;
	const navigation: any = useNavigation();
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const { colors } = useTheme();
	const [visible, setVisible] = useState<boolean>(false);
	const [contact, setContact] = useState<IContact>();
	const [roomChat, setRoomChat] = useState<ISpotlight>();

	useImperativeHandle(ref, () => ({
		onShowModal: item => {
			setVisible(item);
		},
	}));

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	return (
		<Portal>
			<Modal isVisible={visible} onBackdropPress={hideModal}>
				<View
					style={{
						backgroundColor: 'white',
						padding: 12,
						borderRadius: 4,
					}}
				>
					{/* Send File */}
					<TouchableOpacity
						onPress={() => {
							onPress_EN();
							hideModal();
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingVertical: 16,
							}}
						>
							<Icon
								as={Ionicons}
								name={'document-text-outline'}
								size={6}
								marginRight={8}
								color={colors.primary}
							/>
							<Text>Offer (EN)</Text>
						</View>
					</TouchableOpacity>
					<View
						style={{ height: 0.5, width: '100%', backgroundColor: '#dedede' }}
					/>

					{/* Send Image  */}
					<TouchableOpacity
						onPress={() => {
							onPress_CH();
							hideModal();
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingVertical: 16,
							}}
						>
							<Icon
								as={Ionicons}
								name={'document-text-outline'}
								size={6}
								marginRight={8}
								color={colors.primary}
							/>
							<Text>Offer (CH)</Text>
						</View>
					</TouchableOpacity>

					<View
						style={{ height: 0.5, width: '100%', backgroundColor: '#dedede' }}
					/>

					{/* Send from Yubao Cloud */}
					<TouchableOpacity
						onPress={() => {
							onPress_VN(), hideModal();
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingVertical: 16,
							}}
						>
							<Icon
								as={Ionicons}
								name={'document-text-outline'}
								size={6}
								marginRight={8}
								color={colors.primary}
							/>
							<Text>Offer (VN)</Text>
						</View>
					</TouchableOpacity>
				</View>
			</Modal>
		</Portal>
	);
}

export default React.forwardRef(ChooseFontModal);
