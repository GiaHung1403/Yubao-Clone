import {Ionicons} from "@expo/vector-icons";
import { Icon } from 'native-base';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface IProps {
  label: string;
  description?: string;
  icon: string;
  children?: any;
  labelNumber?: string;
  isItemFirst?: boolean;
  rightComponent?: () => void;
  color?: string;
  onPress?: () => void
}

export default function ItemActionComponent(props: IProps) {
  const {
    icon,
    label,
    labelNumber,
    description,
    children,
    isItemFirst,
    rightComponent = () => null,
    color,
    onPress,
  } = props;

  return (
    <TouchableOpacity
      style={{ paddingHorizontal: 16, paddingBottom: 16 }}
      onPress={onPress}
    >
      <View
        style={{
          height: isItemFirst ? 0 : 1,
          backgroundColor: '#ddd',
          marginLeft: 36,
          marginBottom: 16,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Icon
          as={Ionicons}
          name={icon}
          size={7}
          color={color || "#888"}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color }}>
            {label}{' '}
            <Text style={{ color: '#888' }}>
              {labelNumber && `(${labelNumber})`}
            </Text>
          </Text>
          {description && (
            <Text style={{ color: '#888', marginTop: 4, fontSize: 12 }}>
              {description}
            </Text>
          )}
        </View>
        {rightComponent()}
      </View>

      <View style={{ marginLeft: 36 }}>{children}</View>
    </TouchableOpacity>
  );
}
