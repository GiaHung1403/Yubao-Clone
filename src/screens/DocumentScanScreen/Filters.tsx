import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Filters } from 'react-native-rectangle-scanner';
import Icon from 'react-native-vector-icons/Ionicons';

interface IProps {
  filterId: number;
  onFilterIdChange: (id: string) => void;
}

export default function FilterComponent(props: any) {
  const { filterId, onFilterIdChange } = props;

  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState(false);

  const setFilter = (filter) => {
    onFilterIdChange(filter.id);
    setFilterMenuIsOpen(false);
  };

  const renderFilterOptions = () => {
    return Filters.RECOMMENDED_PLATFORM_FILTERS.map((f) => {
      const selectedStyle =
        f.id === (filterId || 1) ? { color: 'yellow' } : null;
      return (
        <TouchableOpacity
          key={f.id}
          style={{
            paddingHorizontal: 22,
            paddingVertical: 16,
            width: f.name.length * 7 + 50,
          }}
          onPress={() => setFilter(f)}
          activeOpacity={0.8}
        >
          <Text
            numberOfLines={1}
            style={[{ flex: 1, color: 'white', fontSize: 13 }, selectedStyle]}
          >
            {f.name}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const dimensions = Dimensions.get('window');
  const aspectRatio = dimensions.height / dimensions.width;
  const isMobile = aspectRatio > 1.6;

  let filters;

  if (filterMenuIsOpen) {
    filters = (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          backgroundColor: '#00000080',
          borderRadius: isMobile ? 17 : 30,
          flexDirection: isMobile ? 'column' : 'row',
          right: isMobile ? 0 : 75,
          bottom: isMobile ? 75 : 8,
        }}
      >
        {renderFilterOptions()}
      </View>
    );
  }
  return (
    <View style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
      {filters}
      <View
        style={{
          backgroundColor: '#00000080',
          flexDirection: isMobile ? 'column' : 'row',
          borderRadius: 30,
          margin: 8,
        }}
      >
        <TouchableOpacity
          style={{
            paddingHorizontal: 14,
            paddingVertical: 13,
            height: 50,
            width: 50,
          }}
          onPress={() => setFilterMenuIsOpen((old) => !old)}
          activeOpacity={0.8}
        >
          <Icon
            name="ios-color-filter"
            size={40}
            color="white"
            style={{
              color: 'white',
              fontSize: 22,
              marginBottom: 3,
              textAlign: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
