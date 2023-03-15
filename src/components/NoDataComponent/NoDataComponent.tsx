import React from 'react';
import {Image, Text, View} from 'react-native';

enum Type {
    denied = "Denied",
    empty = "Empty"
}

export default function NoDataComponent(props: any) {
    const {type} = props;

    const getIcon = () => {
        switch (type) {
            case Type.denied:
                return "https://img.icons8.com/bubbles/200/000000/cancel-2.png";
            case Type.empty:
                return "https://img.icons8.com/clouds/344/search-in-list.png";
            default:
                return "https://img.icons8.com/clouds/344/search-in-list.png";
        }
    }
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -200,
            }}
        >
            <Image
                source={{
                    uri: getIcon()
                }}
                resizeMode="contain"
                style={{width: 200, height: 200}}
            />
            <Text style={{fontSize: 15, fontWeight: '500', color: '#666'}}>
                {type === Type.empty ? "No data!" : "Access Denied!"}
            </Text>
        </View>
    );
}
