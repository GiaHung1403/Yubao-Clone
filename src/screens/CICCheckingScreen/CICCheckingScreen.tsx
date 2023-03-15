import React, { useContext, useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	Platform,
	Text,
	View,
	StatusBar,
	SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { useTheme, Searchbar } from 'react-native-paper';
import LoadingFullScreen from '@components/LoadingFullScreen';
import NoDataComponent from '@components/NoDataComponent';
import { getCIC } from '@data/api';
import { IUserSystem } from '@models/types';
import CIC_ItemComponent from '../CustomerInfoScreen/CICItemComponent';
import { LocalizationContext } from '@context/LocalizationContext';

const IC_EMAIL = require('@assets/icons/ic_email.png');
const IC_PHONE = require('@assets/icons/ic_phone.png');

export function CICCheckingScreen(props: any) {
	const { title, leseID } = props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();
	const I18n = useContext(LocalizationContext);
	const textSearchHistory = I18n.t('search_history');
	const [firstQuery, setFirstQuery] = useState('');
	const navigation: any = useNavigation();
	const [getTitle, setTitle] = useState<boolean>();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [listCIC, setListCIC] = useState([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			(async function getData() {
				const data: any = await getCIC({
					flag: 'GET_GUARANTOR_BY_ID',
					lese_Id: leseID, //'234480', // leseID,210098
				});
				setListCIC(data);
				setDoneLoadAnimated(true);
			})();
		});
		setTitle(title);
	}, []);

	return doneLoadAnimated ? (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			{/* CIC Request */}
			<StatusBar barStyle={'dark-content'} />
			<SafeAreaView
				style={{
					paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
				}}
			/>
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
					Cancel
				</Button>
				<Text style={{ fontSize: 15, fontWeight: '600', color: '#555' }}>
					{getTitle ? 'Check disburse(CT)' : 'Check other(CT+TSBĐ)'}
				</Text>
				<Button
					uppercase={false}
					onPress={() => {
						setTitle(!getTitle);
					}}
				>
					Change
				</Button>
			</View>
			<Searchbar
				placeholder={textSearchHistory}
				onChangeText={query => setFirstQuery(query)}
				value={firstQuery}
				style={{
					zIndex: 2,
					marginTop: 8,
					marginHorizontal: 8,
					marginBottom: 10,
				}}
				inputStyle={{ fontSize: 14 }}
			/>
			<FlatList
				data={listCIC}
				keyExtractor={(_, index) => index.toString()}
				contentContainerStyle={{ flexGrow: 1 }}
				ListEmptyComponent={() => <NoDataComponent type={'Empty'} />}
				renderItem={({ item, index }) => (
					<CIC_ItemComponent dataItem={item} checkType={getTitle} />
				)}
			/>
		</View>
	) : (
		<LoadingFullScreen size={'large'} />
	);
}
