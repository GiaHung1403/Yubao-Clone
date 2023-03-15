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
	ScrollView,
	useWindowDimensions,
	View,
} from 'react-native';
import { Button, Colors, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
	getListApproverEFlow,
	getListRequestEFlow,
} from '@actions/eFlow_action';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import { getDataLaborEFlow, submitEFlow } from '@data/api';
import { IRequestEFlow, IUserSystem } from '@models/types';
import { checkBiometryAuth, isBiometrySupported } from '@utils/BiometryAuth';
import { SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import ListApproverComponent from './ListApproverComponent';
import ListFileComponent from './ListFileComponent';
import ListGeneralInfoComponent from './ListGeneralInfoComponent';
import PreparedComponent from './PreparedComponent';

import styles from './styles';
import PickerCustomComponent from '@components/PickerCustomComponent';

interface IEFlowReducer {
	kindSelected: string;
	requestID: string;
	proposedBy: string;
	lesseeName: string;
	description: string;
	statusSelected: string;
}

interface IPropsRoute {
	eFlowItem: IRequestEFlow;
}

interface ILaborType {
	value: string;
	label: string;
}

export function EFlowDetailScreen(props: any) {
	const navigation: any = useNavigation();
	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const dispatch = useDispatch();
	const { eFlowItem }: IPropsRoute = props.route.params;
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
	}: IEFlowReducer = useSelector((state: any) => state.eFlow_reducer);

	const [loading, setLoading] = useState<boolean>(false);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [note, setNote] = useState('');
	const [index, setIndex] = React.useState(0);
	const [indexBottomSheet, setIndexBottomSheet] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'approver', title: 'List Approver' },
		{ key: 'generalInfo', title: 'General Information' },
		{ key: 'file', title: 'Files' },
	]);
	const [labors, setLabors] = useState<ILaborType[]>([]);
	const [laborSelected, setLaborSelected] = useState<string>();

	const isLabor = eFlowItem?.functioN_NAME.toLocaleLowerCase() === 'labor';

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
			setTimeout(() => {
				bottomSheetModalRef.current?.present();
			}, 100);
			const data: any = await getDataLaborEFlow({
				User_ID: dataUserSystem.EMP_NO,
				keyID: eFlowItem?.keY_ID,
			});
			const dataMap = data.map(item => ({
				label: item.stnd_C_Nm,
				value: item.c_No,
			}));
			setLabors(dataMap);
		});
	}, []);

	const snapPoints = useMemo(
		() => (isLabor ? ['20%', '35%', '80%'] : ['20%', '44%', '80%']),
		[],
	);

	const handleSheetChanges = useCallback((indexSheet: number) => {
		if (indexSheet === -1) bottomSheetModalRef.current?.present();
		setIndexBottomSheet(indexSheet);
	}, []);

	const renderScene = ({ route }) => {
		switch (route.key) {
			case 'approver':
				return (
					<ListApproverComponent
						eFlowItem={eFlowItem}
						isScroll={indexBottomSheet === 2}
					/>
				);
			case 'generalInfo':
				return <ListGeneralInfoComponent eFlowItem={eFlowItem} />;
			case 'file':
				return <ListFileComponent eFlowItem={eFlowItem} />;
		}
	};

	const _onPressSubmitEFlow = async ({ isApproval }) => {
		try {
			if (isLabor && !laborSelected) {
				Alert.alert('Warning!', 'Please choose labor type!');
				return;
			}
			const type = (await isBiometrySupported()) as string;
			if (type) {
				await checkBiometryAuth({
					reason: `Confirm EFlow ${eFlowItem?.keY_ID}`,
				});
			}
			setLoading(true);

			await submitEFlow({
				User_ID: dataUserSystem.EMP_NO,
				KEY_DATA: eFlowItem?.keY_ID,
				FUNCTION_NAME: eFlowItem?.functioN_NAME,
				RMKS: note,
				CNFM_YN: isApproval,
				companyCode: eFlowItem.companyCode,
				laborAuthID: laborSelected,
			});

			setLoading(false);

			dispatch(
				getListApproverEFlow({
					User_ID: dataUserSystem.EMP_NO,
					KEY_DATA: eFlowItem?.keY_ID,
					FUNCTION_NAME: eFlowItem?.functioN_NAME,
					companyCode: eFlowItem.companyCode,
				}),
			);

			dispatch(
				getListRequestEFlow({
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

	const isDisableButtonApproved =
		eFlowItem?.status_Doc === 'Cancel' ||
		eFlowItem?.status_Doc === 'Finish' ||
		(eFlowItem?.pic !== 'Approver' && eFlowItem?.pic !== 'Onbehalf');

	const isDisableButtonReject =
		eFlowItem?.status_Doc === 'Cancel' ||
		eFlowItem?.status_Doc === 'Finish' ||
		(eFlowItem?.pic !== 'Approver' && eFlowItem?.pic !== 'Onbehalf');

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
					<Header title={`Request ID ${eFlowItem?.keY_ID}`} />
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
								<ScrollView
									style={{ marginBottom: 8, maxHeight: '65%' }}
									showsVerticalScrollIndicator={false}
								>
									<PreparedComponent eFlowItem={eFlowItem!} />
								</ScrollView>
								<View>
									{isLabor && (
										<PickerCustomComponent
											showLabel={true}
											listData={labors}
											label="Labor type"
											value={laborSelected}
											style={{ marginBottom: 8 }}
											onValueChange={setLaborSelected}
										/>
									)}
								</View>

								<TextInputCustomComponent
									label={'Yours Opinion'}
									placeholder={'Yours Opinion'}
									value={note}
									multiline
									inputStyle={styles.textInputOpinion}
									onChangeText={(text: string) => setNote(text)}
								/>

								<View style={styles.containerButton}>
									<Button
										mode="contained"
										uppercase={false}
										disabled={isDisableButtonReject}
										style={[
											styles.buttonReject,
											{
												backgroundColor: !isDisableButtonReject
													? Colors.red500
													: '#999',
											},
										]}
										onPress={() => _onPressSubmitEFlow({ isApproval: 0 })}
									>
										Reject
									</Button>
									<Button
										mode="contained"
										uppercase={false}
										disabled={isDisableButtonApproved}
										loading={loading}
										style={[
											styles.buttonApprove,
											{
												backgroundColor: !isDisableButtonApproved
													? Colors.blue700
													: '#999',
											},
										]}
										onPress={() => _onPressSubmitEFlow({ isApproval: 1 })}
									>
										{loading ? 'Loading' : 'Approve'}
									</Button>
								</View>
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
