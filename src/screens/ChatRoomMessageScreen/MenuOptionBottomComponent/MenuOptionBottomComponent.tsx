import React from 'react';
import { Text, View } from 'react-native';

interface IProps {
  keyboardHeight: number;
}


export default function MenuOptionBottomComponent(props: any) {
  const { keyboardHeight } = props;
  return (
    <View style={{ height: keyboardHeight }}>

    </View>
  );
}
