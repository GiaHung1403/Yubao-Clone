import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	Animated,
	InteractionManager,
	TouchableOpacity,
	View,
} from 'react-native';
import Keychain from 'react-native-keychain';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
	getListRequestEReview,
	setDescriptionEReview,
	setKindSelectedEReview,
	setLesseeNameEReview,
	setProposedByEReview,
	setRequestIDEReview,
	setStatusSelectedEReview,
} from '@actions/eReview_action';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import {
	getListKindEFlowOrEReview,
	getListStatusEFlowOrEReview,
} from '@data/api';
import { IRequestEFlow, IUserSystem } from '@models/types';

interface IEReviewReducer {
	listRequestEReview: IRequestEFlow[];
	kindSelected: string;
	requestID: string;
	proposedBy: string;
	lesseeName: string;
	description: string;
	statusSelected: string;
	loading: boolean;
}

const anime = {
	height: new Animated.Value(0),
	contentHeight: 100,
};

let listener = '';

export default function EReviewFilterComponent(props: any) {
	const dispatch = useDispatch();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const {
		kindSelected,
		requestID,
		proposedBy,
		lesseeName,
		description,
		statusSelected,
	}: IEReviewReducer = useSelector((state: any) => state.eReview_reducer);

	const [showView, setShowView] = useState(false);
	const [listKind, setListKind] = useState<any>([]);
	const [listStatus, setListStatus] = useState<any>([]);
	const { colors } = useTheme();

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;

			try {
				const responseKind: any = await getListKindEFlowOrEReview({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
					KEY_DATA: 'cdln000062',
				});

				const kindConvert = responseKind.map(item => ({
					label: item.STND_C_NM,
					value: item.C_NO,
				}));

				setListKind(kindConvert);

				const responseStatus: any = await getListStatusEFlowOrEReview({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
				});

				const statusConvert = responseStatus.map(item => ({
					label: item.STND_C_NM,
					value: item.C_NO,
				}));

				setListStatus(statusConvert);

				dispatch(
					getListRequestEReview({
						User_ID: dataUserSystem.EMP_NO,
						Status: statusSelected,
						Kind: kindSelected,
						RequestID: requestID,
						ProposedBy: proposedBy,
						LesseeName: lesseeName,
						Description: description,
					}),
				);
			} catch (error: any) {
				console.log(error.message);
			}
		});

		listener = anime.height.addListener(async ({ value }) => {
			if (value === anime.contentHeight && !showView) {
				setShowView(true);
			} else {
				setShowView(false);
			}
		});

		return () => {
			anime.height.removeListener(listener);
			anime.height.setValue(_getMinValue());
		};
	}, []);

	const _initContentHeight = evt => {
		if (anime.contentHeight > 0) {
			return;
		}
		anime.contentHeight = evt.nativeEvent.layout.height;
		anime.height.setValue(showView ? _getMaxValue() : _getMinValue());
	};

	const _getMaxValue = () => {
		return anime.contentHeight;
	};

	const _getMinValue = () => {
		return 0;
	};

	const toggle = () => {
		Animated.timing(anime.height, {
			toValue: showView ? _getMinValue() : _getMaxValue(),
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	const _onPressFilter = async () => {
		if (showView) {
			Animated.timing(anime.height, {
				toValue: _getMinValue(),
				duration: 300,
				useNativeDriver: false,
			}).start();
		}

		dispatch(
			getListRequestEReview({
				User_ID: dataUserSystem.EMP_NO, // 00842
				Status: statusSelected,
				Kind: kindSelected,
				RequestID: requestID,
				ProposedBy: proposedBy,
				LesseeName: lesseeName,
				Description: description,
			}),
		);
	};

	return (
		<Card elevation={4}>
			{/* View Kind and Request Id */}
			<View
				style={{
					flexDirection: 'row',
					marginTop: 8,
					paddingHorizontal: 8,
				}}
			>
				<PickerCustomComponent
					showLabel={true}
					listData={listKind}
					label="Kind"
					value={kindSelected}
					style={{ flex: 1, marginRight: 8 }}
					onValueChange={text =>
						dispatch(setKindSelectedEReview({ kindSelected: text }))
					}
				/>

				<TextInputCustomComponent
					label="Request Id."
					placeholder="Request Id."
					value={requestID}
					keyboardType="number-pad"
					onChangeText={(text: string) =>
						dispatch(setRequestIDEReview({ requestID: text }))
					}
					style={{ flex: 1 }}
				/>
			</View>
			{/* View Lessee Name and Status */}
			<View
				style={{
					flexDirection: 'row',
					paddingHorizontal: 8,
					marginTop: 8,
				}}
			>
				<TextInputCustomComponent
					label="Lessee Name"
					placeholder="Lessee Name"
					value={lesseeName}
					autoCapitalize="words"
					onChangeText={(text: string) =>
						dispatch(setLesseeNameEReview({ lesseeName: text }))
					}
					style={{ flex: 1, marginRight: 8 }}
				/>

				<PickerCustomComponent
					showLabel={true}
					listData={listStatus}
					label="Status"
					value={statusSelected}
					style={{ flex: 1 }}
					textStyle={{ maxWidth: 110 }}
					onValueChange={text =>
						dispatch(setStatusSelectedEReview({ statusSelected: text }))
					}
				/>
			</View>
			<Animated.View
				style={{ height: anime.height }}
				onLayout={_initContentHeight}
			>
				{/* View Description and Proposed By */}
				{showView && (
					<View
						style={{
							flexDirection: 'row',
							paddingHorizontal: 8,
							marginTop: 8,
						}}
					>
						<TextInputCustomComponent
							label="Description"
							placeholder="Description"
							value={description}
							keyboardType="number-pad"
							onChangeText={(text: string) =>
								dispatch(setDescriptionEReview({ description: text }))
							}
							style={{ flex: 1, marginRight: 8 }}
						/>

						<TextInputCustomComponent
							label="Proposed By"
							placeholder="Proposed By"
							value={proposedBy}
							onChangeText={(text: string) =>
								dispatch(setProposedByEReview({ proposedBy: text }))
							}
							style={{ flex: 1 }}
						/>
					</View>
				)}
			</Animated.View>

			<Button
				mode="contained"
				uppercase={false}
				style={{ margin: 8, width: 100, alignSelf: 'center' }}
				onPress={() => _onPressFilter()}
			>
				Filter
			</Button>

			<TouchableOpacity
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					paddingVertical: 8,
				}}
				onPress={() => toggle()}
			>
				<Icon
					as={Ionicons}
					name={showView ? 'chevron-up-outline' : 'chevron-down-outline'}
					size={7}
					color={colors.primary}
				/>
			</TouchableOpacity>
		</Card>
	);
}
