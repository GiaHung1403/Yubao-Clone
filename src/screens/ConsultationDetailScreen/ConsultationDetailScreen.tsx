import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	InteractionManager,
	Platform,
	StatusBar,
	useWindowDimensions,
	View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import {
	SceneMap,
	SceneRendererProps,
	TabBar,
	TabView,
} from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { getListGuarantorByCustomerID } from '@data/api';

import { getConsultationDetail } from '@data/api/api_consultation';
import {
	IConsultationDetail,
	ICustomer,
	IGuarantor,
	IUserSystem,
} from '@models/types';
import ImportImageTab from './ImportImageTab';
import styles from './styles';
import TabList_Import from './TabList_Import';
import Tab_Main from './Tab_Main';

import ViewButton_Consultation from './ViewButton_Consultation';

interface IPropsRouteParams {
	consultationID: string;
	customerSelected: ICustomer;
	listContactPersonSelected: string[];
}

export function ConsultationDetailScreen(props: any) {
	let indexTab = 0;
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const dispatch = useDispatch();
	const {
		consultationID,
		customerSelected,
		listContactPersonSelected,
	}: IPropsRouteParams = props.route.params;


	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [listGuarantor, setListGuarantor] = useState<IGuarantor[]>([]);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [item, setItem] = useState<IConsultationDetail>();

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			await getConsultationItemData();
		});
	}, []);

	const getConsultationItemData = async () => {
		const consultationItem = (await getConsultationDetail({
			cnid: consultationID,
		})) as IConsultationDetail;
		// setConsultationDetail(consultationItem);
		// const regex = /<[^>]*>?/gm;
		const responseGuarantor: any = await getListGuarantorByCustomerID({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
			LESE_ID: consultationItem?.lesE_ID,
		});
		setListGuarantor(responseGuarantor);
		setItem(consultationItem);

		setDoneLoadAnimated(true);
	};

	const textMain = 'Main';
	const textUpload = 'Upload';
	const textDocument = 'Document';

	const initialLayout = useWindowDimensions();

	const [routes] = React.useState([
		{ key: 'first', title: textMain },
		{ key: 'second', title: textDocument },
		{ key: 'three', title: textUpload },
	]);

	const FirstRoute = () => (
		<Tab_Main
			consultationID={consultationID}
			customerSelected={customerSelected}
			consultationItem={item}
			listContactPersonSelected={listContactPersonSelected}
			listGuarantor={listGuarantor}
		/>
		// <View></View>
	);
	const SecondRoute = () => (
		<TabList_Import
			consultationID={consultationID}
			customerSelected={customerSelected}
			consultationItem={item}
		/>
		// <View></View>
	);
	const ThreeRoute = () => (
		<ImportImageTab
			consultationID={consultationID}
			customerSelected={customerSelected}
			consultationItem={item}
		/>
		// <View></View>
	);

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
		three: ThreeRoute,
	});

	const renderTabBar = (
		propsData: SceneRendererProps & { navigationState },
	) => {
		return (
			<TabBar
				{...propsData}
				scrollEnabled
				indicatorStyle={{
					borderBottomColor: colors.primary,
					borderBottomWidth: 4,
				}}
				style={{ backgroundColor: '#fff' }}
				tabStyle={{ width: initialLayout.width / 3 }}
				labelStyle={{ fontWeight: '600', textTransform: undefined }}
				activeColor={colors.primary}
				inactiveColor={'#a1a1aa'}
			/>
		);
	};


	return (
		<View style={{ flex: 1 }}>
			<Header title={'Consultation Detail'} />
			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<TabView
						navigationState={{ index: indexTab, routes }}
						renderScene={renderScene}
						renderTabBar={renderTabBar}
						onIndexChange={index => {
							indexTab = index;
						}}
						initialLayout={initialLayout}
						// lazy
						style={{
							marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
						}}
					/>
					<ViewButton_Consultation
						consultationItem={item}
						listGuarantor={listGuarantor}
					/>
				</View>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
