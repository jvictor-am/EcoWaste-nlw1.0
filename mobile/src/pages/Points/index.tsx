import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {SvgCssUri} from 'react-native-svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';

import MapView, {Marker} from 'react-native-maps';

import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}
interface Params {
  uf: string;
  city: string;
}

const Points: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadPosition() {
      Geolocation.getCurrentPosition(
        (position) => {
          setInitialPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        // (e) => Alert.alert(e.message),
        () =>
          Alert.alert(
            'Hello...',
            'We need your permission to obtain your location and show on map. Thanks!',
          ),
        {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
      );
    }

    loadPosition();
  }, []);

  useEffect(() => {
    api.get('items').then((response) => setItems(response.data));
  }, []);

  useEffect(() => {
    api
      // .get('points', {params: {city: 'Fortaleza', uf: 'CE', items: [1, 4]}})
      .get('points', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems,
        },
      })
      .then((response) => {
        setPoints(response.data);
      });
  }, [routeParams.city, routeParams.uf, selectedItems]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', {point_id: id});
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" color="#34cb79" size={20} />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.description}>
          Please, select the items you want to dispose and find collection waste
          point(s) on map below. Click on it to see details.
        </Text>

        <View style={styles.mapContainer}>
          {/* {initialPosition[0] !== 0 && ( */}
          {initialPosition[0] === 0 ? (
            // eslint-disable-next-line react-native/no-inline-styles
            <ActivityIndicator color="#34CB79" size={50} style={{flex: 1}} />
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                // latitude: -2.795727,
                // longitude: -40.516009,
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}>
              {points.map((point) => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  // coordinate={{latitude: -2.795727, longitude: -40.516009}}>
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}>
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image_url,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{paddingHorizontal: 20}}>
          {items.map((item) => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleSelectedItem(item.id)}
              activeOpacity={0.6}>
              <SvgCssUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 50,
    // paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto-Regular',
    textAlign: 'justify',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
    textAlign: 'center',
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;
