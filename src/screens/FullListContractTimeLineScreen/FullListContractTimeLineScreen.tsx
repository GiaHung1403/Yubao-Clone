import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
	Alert,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header';
import TextInfoRow from '../../components/TextInfoRow';
import Color from '../../config/Color';
import { callPhoneDefault } from '../../utils/callPhone';
import openLink from '../../utils/openLink';
import { Ionicons } from '@expo/vector-icons';
import LoadingFullScreen from '@components/LoadingFullScreen/LoadingFullScreen';
import { get_FullTimeLine } from '@data/api';
import moment from 'moment';
import log from '@utils/log';

export function FullListContractTimeLineScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	// const { contractTimelineItem }: IPropsRouteParams = props.route.params;
	const { contractInfo } = props.route.params;

	const dataUser = useSelector((state: any) => state.auth_reducer.data);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [fullStep, setFullStep] = useState<any>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const data: any = await get_FullTimeLine({
				cnid: contractInfo.cnid,
				emp_No: contractInfo.mk_emp_no,
				round_Seq: 1,
			});
			setFullStep(data?.reverse());
			setDoneLoadAnimated(true);
		});
	}, []);

	const CircleViewProgress = ({ isProcessing, color, step }) => (
		<View
			style={{
				borderLeftWidth: 2,
				borderLeftColor: colors.primary,
				height: 120,
			}}
		>
			<View
				style={{
					width: 30,
					height: 30,
					borderRadius: 10,
					borderWidth: 0.5,
					borderColor: '#dedede',
					marginLeft: -16,
					backgroundColor: '#fff',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<View
					style={{
						width: 22,
						height: 22,
						borderRadius: 10,
						backgroundColor: isProcessing ? color : '#999',
					}}
				/>
				<Text
					style={{
						color: 'white',
						zIndex: 99,
						position: 'absolute',
					}}
				>
					{step}
				</Text>
			</View>
		</View>
	);

	const StepComponent = ({
		containerStyle,
		inProcess,
		done,
		labelStep,
		name,
		day,
		detail,
	}) => (
		<View
			style={[
				{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				},
				containerStyle,
			]}
		>
			<View style={{ flex: 1, justifyContent: 'center', marginTop: 20 }}>
				<Text
					style={{
						fontWeight: '600',
						color: inProcess ? 'black' : '#999',
						fontSize: 12,
					}}
				>
					{day}
				</Text>
			</View>

			<View style={{ flex: 3, flexDirection: 'row' }}>
				<CircleViewProgress
					isProcessing={inProcess}
					color={done ? Color.approved : '#ff9933'}
					step={name}
				/>
				<View style={{ justifyContent: 'flex-start' }}>
					{(!inProcess || !done) && (
						<Text
							style={{
								marginLeft: 10,
								color: inProcess ? (done ? Color.approved : '#ff9933') : '#999',
								fontWeight: inProcess ? '600' : 'normal',
							}}
						>
							{!inProcess
								? 'Status : in progress'
								: done
								? null
								: 'Processing '}
						</Text>
					)}

					<Text
						style={{
							marginLeft: 10,
							color: inProcess ? (done ? Color.approved : '#ff9933') : '#999',
							fontWeight: inProcess ? '600' : 'normal',
						}}
					>
						{labelStep}
					</Text>

					<Text
						style={{
							marginLeft: 10,
							color: inProcess
								? done
									? Color.approved
									: colors.primary
								: '#999',
							fontWeight: inProcess ? '600' : 'normal',
						}}
					>
						{detail}
					</Text>

					{name === '4' || name === '9' ? (
						<TouchableOpacity
							disabled={!inProcess ? true : false}
							onPress={() =>
								navigation.navigate('ContractTimeLineDetailScreen', {
									contractInfo,
									step: name,
								})
							}
							style={{
								backgroundColor: !inProcess ? '#999' : `${Color.approved}90`,
								borderRadius: 4,
								paddingVertical: 8,
								paddingHorizontal: 8,
								marginTop: 8,
							}}
						>
							<Text
								style={{
									color: '#000',
									textAlign: 'center',
								}}
							>
								{'View detail'}
							</Text>
						</TouchableOpacity>
					) : null}
				</View>
			</View>
		</View>
	);

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Contract TimeLine Detail'} />

			{doneLoadAnimated ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}
				>
					<ScrollView style={{ flex: 1, padding: 8 }}>
						<Card elevation={2}>
							<View style={{ padding: 8 }}>
								<Text style={{ marginBottom: 8, fontWeight: '600' }}>
									{'TimeLine'}
								</Text>

								<View
									style={{
										marginLeft: 12,
										marginTop: 10,
									}}
								>
									{fullStep.map(item =>
										item?.step_Type === '3' ? (
											//Not yet start
											<StepComponent
												name={item?.step_nm}
												containerStyle={{}}
												inProcess={false}
												done={false}
												labelStep={item?.step_Title}
												day={''}
												detail={item?.rmks}
											/>
										) : (
											<StepComponent
												name={item?.step_nm}
												containerStyle={{}}
												inProcess={true}
												done={item?.step_Type === '2' ? false : true}
												labelStep={item?.step_Title}
												day={
													item?.start_Date === null
														? ''
														: moment(item?.start_Date).format(
																'DD.MM.YYYY HH:mm:ss',
														  )
												}
												detail={item?.rmks}
											/>
										),
									)}
								</View>
							</View>
						</Card>

						<SafeAreaView style={{ height: 60 }} />
					</ScrollView>
				</KeyboardAvoidingView>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
