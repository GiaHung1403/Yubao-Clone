import {
	BottomSheetModal,
	BottomSheetModalProvider,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	Alert,
	InteractionManager,
	Platform,
	useWindowDimensions,
	View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Button, Colors, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import {
	submitComment,
} from '@data/api';
import { IRequestEFlow, IUserSystem } from '@models/types';
import { checkBiometryAuth, isBiometrySupported } from '@utils/BiometryAuth';
import { SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import ListCommentComponent from './ListCommentComponent';
import ListFileComponent from './ListFileComponent';
import ListGeneralInfoComponent from './ListGeneralInfoComponent';
import PreparedComponent from './PreparedComponent';

import styles from './styles';
import { getListCommentEReview, getListRequestEReview } from '@actions/eReview_action';

interface IEReviewReducer {
	kindSelected: string;
	requestID: string;
	proposedBy: string;
	lesseeName: string;
	description: string;
	statusSelected: string;
}

interface IPropsRoute {
	eReviewItem: IRequestEFlow;
}

export function EReviewDetailScreen(props: any) {
	const navigation: any = useNavigation();
	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const dispatch = useDispatch();
	const { eReviewItem }: IPropsRoute = props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const initialLayout = useWindowDimensions();

	const { colors } = useTheme();
	const {
		kindSelected,
		requestID,
		proposedBy,
		lesseeName,
		description,
		statusSelected,
	}: IEReviewReducer = useSelector((state: any) => state.eReview_reducer);

	const [loading, setLoading] = useState<boolean>(false);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [note, setNote] = useState('');
	const [index, setIndex] = React.useState(0);
	const [indexBottomSheet, setIndexBottomSheet] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'approver', title: 'List Comment' },
		{ key: 'generalInfo', title: 'General Information' },
		{ key: 'file', title: 'Files' },
	]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
			setTimeout(() => {
				bottomSheetModalRef.current?.present();
			}, 100);
		});
	}, []);

	const snapPoints = useMemo(() => ['20%', '44%', '80%'], []);

	const handleSheetChanges = useCallback((indexSheet: number) => {
		if (indexSheet === -1) bottomSheetModalRef.current?.present();
		setIndexBottomSheet(indexSheet);
	}, []);

	const renderScene = ({ route }) => {
		switch (route.key) {
			case 'approver':
				return (
					<ListCommentComponent
						eReviewItem={eReviewItem}
						isScroll={indexBottomSheet === 2}
					/>
				);
			case 'generalInfo':
				return <ListGeneralInfoComponent eReviewItem={eReviewItem} />;
			case 'file':
				return <ListFileComponent eReviewItem={eReviewItem} />;
		}
	};

	const _onPressSubmitEFlow = async ({ isApproval }) => {
		try {
			const type = (await isBiometrySupported()) as string;
			if (type) {
				await checkBiometryAuth({
					reason: `Confirm EReview ${eReviewItem?.keY_ID}`,
				});
			}
			setLoading(true);

			await submitComment({
				User_ID: dataUserSystem.EMP_NO,
				idEReview: eReviewItem?.keY_ID,
				comment: note,
				companyCode: eReviewItem.companyCode,
			});

			setLoading(false);

			dispatch(
				getListCommentEReview({
					User_ID: dataUserSystem.EMP_NO,
					KEY_DATA: eReviewItem?.keY_ID,
					FUNCTION_NAME: eReviewItem?.functioN_NAME,
					companyCode: eReviewItem.companyCode,
				}),
			);

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
			Alert.alert('Alert', `Confirm success!`, [
				{ text: 'OK', onPress: () => navigation.goBack() },
			]);
		} catch (error: any) {
			setLoading(false);
			Alert.alert('Alert', `${error}`);
		}
	};

	const renderTabBar = (
		propsData: SceneRendererProps & { navigationState },
	) => {
		return (
			<TabBar
				{...propsData}
				scrollEnabled={false}
				indicatorStyle={{
					borderBottomColor: colors.primary,
					borderBottomWidth: 4,
				}}
				style={{ backgroundColor: '#fff' }}
				labelStyle={{
					fontWeight: '600',
					textTransform: undefined,
					textAlign: 'center',
				}}
				activeColor={colors.primary}
				inactiveColor={'#a1a1aa'}
			/>
		);
	};

	return (
		<BottomSheetModalProvider>
			<View style={styles.container}>
				<View style={styles.containerHeader}>
					<Header title={`Request ID ${eReviewItem?.keY_ID}`} />
				</View>

				{doneLoadAnimated ? (
					<View style={styles.containerBody}>
						<View
							style={[
								styles.cardFormInput,
								{ zIndex: 1, backgroundColor: '#fff' },
							]}
						>
							<View style={styles.containerFormInput}>
								<View style={{ marginBottom: 8 }}>
									<PreparedComponent eReviewItem={eReviewItem!} />
								</View>

								<TextInputCustomComponent
									label={'Yours Comment'}
									placeholder={'Yours Comment'}
									value={note}
									multiline
									inputStyle={styles.textInputOpinion}
									onChangeText={(text: string) => setNote(text)}
								/>

								<Button
									mode="contained"
									uppercase={false}
									style={{ marginTop: 16 }}
									onPress={() => _onPressSubmitEFlow({ isApproval: 0 })}
								>
									Comment
								</Button>
							</View>
						</View>

						<BottomSheetModal
							ref={bottomSheetModalRef}
							index={1}
							snapPoints={snapPoints}
							onChange={handleSheetChanges}
							style={{
								backgroundColor: 'white',
								borderTopStartRadius: 24,
								borderTopEndRadius: 24,
								shadowColor: '#000',
								shadowOffset: {
									width: 0,
									height: 5,
								},
								shadowOpacity: 0.36,
								shadowRadius: 6.68,

								elevation: 11,
							}}
						>
							<BottomSheetScrollView
								style={{ flex: 1 }}
								contentContainerStyle={{ flexGrow: 1 }}
							>
								<TabView
									navigationState={{ index, routes }}
									lazy={true}
									renderScene={renderScene}
									renderTabBar={renderTabBar}
									onIndexChange={setIndex}
									initialLayout={initialLayout}
								/>
							</BottomSheetScrollView>
						</BottomSheetModal>
					</View>
				) : (
					<LoadingFullScreen />
				)}
			</View>
		</BottomSheetModalProvider>
	);
}
