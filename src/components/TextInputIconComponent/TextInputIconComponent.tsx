import {Ionicons} from "@expo/vector-icons";
import {Icon} from 'native-base';
import React, {useState} from 'react';
import {
    KeyboardTypeOptions,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import {TextInput,useTheme} from 'react-native-paper';

import Color from "@config/Color";
import styles from './styles';

interface IProps {
    value: string;
    placeholder: string;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    onChangeText?: (text: string) => void;
    containerStyle?: ViewStyle;
    iconLeft?: string;
    iconRight?: string;
    onPressIconRight?: () => void;
    keyboardType?: KeyboardTypeOptions;
}

export default function TextInputIconComponent(props: IProps) {
    const {
        value,
        placeholder,
        secureTextEntry,
        autoCapitalize,
        onChangeText,
        containerStyle,
        iconLeft,
        iconRight,
        keyboardType,
        onPressIconRight,
    } = props;
    const [isFocus, setHasFocus] = useState(false);

    const{colors} = useTheme()
    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                textAlign={'left'}
                label={placeholder}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChangeText}
                style={styles.textInput}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
            />

            {iconLeft && (
                <View
                    style={{
                        top: 12,
                        left: 8,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                    }}
                >
                    <Icon
                        as={Ionicons}
                        name={iconLeft}
                        color={isFocus ? colors.primary : "#555"}
                        size={6}
                    />
                </View>
            )}

            {iconRight && (
                <TouchableOpacity
                    style={{
                        top: 8,
                        right: 8,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        paddingHorizontal: 8,
                    }}
                    onPress={onPressIconRight}
                >
                    <Icon
                        as={Ionicons}
                        name={iconRight}
                        color={colors.primary}
                        size={6}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}
