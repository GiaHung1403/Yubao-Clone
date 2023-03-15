import React, { useEffect, useRef } from 'react';
import EasyToast from 'react-native-easy-toast';

import { useTheme } from 'react-native-paper';
import Colors from '@config/Color';
import { EventEmitterEnum } from '@models/EventEmitterEnum';
import EventEmitter from '@utils/events';
import styles from './styles';

export default function Toast(props: any) {
  const toast: any = useRef<any>();

  useEffect(() => {
    EventEmitter.addEventListener(EventEmitterEnum.TOAST, showToast);

    return () => EventEmitter.removeListener(EventEmitterEnum.TOAST);
  }, []);

  const getToastRef = (toastNew) => (toast.current = toastNew);

  const showToast = ({ message }) => {
    if (toast && toast.current.show) {
      toast.current.show(message, 1000);
    }
  };
  const{colors} = useTheme()

  return (
    <EasyToast
      ref={getToastRef}
      // @ts-ignore
      style={[styles.toast, { backgroundColor: colors.primary }]}
      textStyle={[styles.text, { color: '#fff', fontWeight: '600' }]}
      opacity={0.8}
    />
  );
}
