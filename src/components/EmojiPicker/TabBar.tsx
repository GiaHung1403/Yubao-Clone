import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

interface IProps {
  goToPage: (index: number) => void;
  activeTab: number;
  tabs: any[];
  tabEmojiStyle: object;
}

function TabBar(props: IProps) {
  const { tabs, goToPage, tabEmojiStyle, activeTab } = props;

  const child = useMemo(
    () => (
      <View style={styles.tabsContainer}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={tab}
            onPress={() => goToPage(i)}
            style={styles.tab}
            testID={`reaction-picker-${tab}`}
          >
            <Text style={[styles.tabEmoji, tabEmojiStyle]}>{tab}</Text>
            {activeTab === i ? (
              <View style={styles.activeTabLine} />
            ) : (
              <View style={styles.tabLine} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    ),
    [activeTab],
  );

  return child;
}
