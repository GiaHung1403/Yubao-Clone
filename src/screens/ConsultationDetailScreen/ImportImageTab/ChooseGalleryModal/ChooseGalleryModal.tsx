import Color from "@config/Color";
import {Ionicons} from "@expo/vector-icons";
import {IContact, ISpotlight, IUserLoginRC} from "@models/types";
import {useNavigation} from "@react-navigation/native";
import {callPhoneDefault} from "@utils/callPhone";
import {Icon} from "native-base";
import React, {useImperativeHandle, useState} from "react";
import {Text, TouchableOpacity, View ,Image} from "react-native";
import Modal from "react-native-modal";
import {Portal,useTheme} from "react-native-paper";

import {useSelector} from "react-redux";

function ChooseGalleryModal(props: any, ref: any) {
    const { onPress_File , onPress_Gallrey, onPress_MyCloud } = props;
	const navigation: any = useNavigation();
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const { colors } = useTheme();
	const [visible, setVisible] = useState<boolean>(false);
	const [contact, setContact] = useState<IContact>();
	const [roomChat, setRoomChat] = useState<ISpotlight>();

	useImperativeHandle(ref, () => ({
		onShowModal: (item) => {
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
							onPress_File();
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
								name={'document-attach-outline'}
								size={6}
								marginRight={8}
								color={colors.primary}
							/>
							<Text>File</Text>
						</View>
					</TouchableOpacity>
					<View
						style={{ height: 0.5, width: '100%', backgroundColor: '#dedede' }}
					/>

					{/* Send Image  */}
					<TouchableOpacity
						onPress={() => {
							onPress_Gallrey();
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
								name={'folder-outline'}
								size={6}
								marginRight={8}
								color={colors.primary}
							/>
							<Text>Gallery</Text>
						</View>
					</TouchableOpacity>

					<View
						style={{ height: 0.5, width: '100%', backgroundColor: '#dedede' }}
					/>

					{/* Send from Yubao Cloud */}
					<TouchableOpacity
						onPress={() => {
							onPress_MyCloud(), hideModal();
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingVertical: 16,
							}}
						>
							{/* <Icon
								as={Ionicons}
								name={'briefcase-outline'}
								size={6}
								marginRight={8}
								color={Color.status}
							/> */}
							<Image
								resizeMode="cover"
								style={[
									{ height: 35, width: 35, marginRight: 20, marginLeft: -5 },
								]}
								source={{
									uri: 'https://yubao.chailease.com.vn:8081/avatar/cloud_bot',
								}}
							/>
							<Text>My Cloud</Text>
						</View>
					</TouchableOpacity>
				</View>
			</Modal>
		</Portal>
	);
}

export default React.forwardRef(ChooseGalleryModal);
