import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import styles from './styles';

export default class ModalAlert extends React.Component {
  state = {
    visible: false,
    success: false,
    error: false,
    alert: '',
  };

  loading = () => {
    StatusBar.setBarStyle('light-content');
    this.setState({ visible: true });
  };

  close = () => {
    this.setState({ visible: false, success: false });
    StatusBar.setBarStyle('dark-content');
  };

  alert = (alert: string, error: boolean) => {
    this.setState({ success: true, alert, error, visible: true });
    setTimeout(() => {
      this.close();
    }, 1500);
  };

  render() {
    const { visible, success, error, alert } = this.state;

    if (!visible) {
      return null;
    }

    if (success) {
      return (
        <SafeAreaView
          style={[
            styles.modalLoading,
            { backgroundColor: error ? 'red' : 'green' },
          ]}
        >
          <Text style={styles.textLoading}>{alert}</Text>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.modalLoading}>
        <ActivityIndicator color="white" size="small"/>
        <Text style={styles.textLoading}>Loading...</Text>
      </SafeAreaView>
    );
  }
}
