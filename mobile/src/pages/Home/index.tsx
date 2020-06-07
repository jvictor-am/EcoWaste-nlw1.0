import React, {useState, useEffect} from 'react';
import axios from 'axios';

import {
  View,
  ImageBackground,
  Text,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {RectButton} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';

interface IBGEUFResponse {
  sigla: string;
  nome: string;
}
interface IBGECityResponse {
  nome: string;
}

const Home: React.FC = () => {
  const [ufs, setUfs] = useState<IBGEUFResponse[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      )
      .then((response) => {
        const formatedUF: IBGEUFResponse[] = response.data.map<IBGEUFResponse>(
          (uf) => uf,
        );

        setUfs(formatedUF);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);

        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleNavigationToPoints() {
    if (selectedUf === '0' || selectedCity === '0') {
      Alert.alert(
        'Sorry...',
        'You need to select one State/UF and one City',
        [{text: 'OK'}],
        {cancelable: true},
      );
      // console.log(selectedUf);
      // console.log(selectedCity);

      return;
    }
    // console.log(selectedUf);
    // console.log(selectedCity);

    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });

    // navigation.navigate('Points', {
    //   uf: selectedUf,
    //   city: selectedCity,
    // });
  }

  function handleSelectUF(uf: string) {
    setSelectedUf(uf);
    // setSelectedCity('Select one City');
  }

  function handleSelectCity(city: string) {
    setSelectedCity(city);
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      // eslint-disable-next-line react-native/no-inline-styles
      imageStyle={{width: 274, height: 368}}>
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Your waste collection marketplace</Text>
        <Text style={styles.description}>
          We help people find waste collection points efficiently
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.input}>
          <Picker
            onValueChange={(itemValue) => handleSelectUF(String(itemValue))}
            selectedValue={selectedUf}
            style={styles.picker}>
            <Picker.Item
              label={'Select one State/UF'}
              value={'0'}
              key={String(0)}
              color="#000"
            />
            {ufs.map((uf) => (
              <Picker.Item
                label={uf.nome}
                value={uf.sigla}
                key={String(uf.sigla)}
                color="#6C6C80"
              />
            ))}
          </Picker>
        </View>

        <View style={styles.input}>
          <Picker
            onValueChange={(itemValue) => handleSelectCity(String(itemValue))}
            selectedValue={selectedCity}
            style={styles.picker}>
            <Picker.Item
              label={'Select one City'}
              value={'0'}
              key={String(0)}
              color="#000"
            />
            {cities.map((city) => (
              <Picker.Item
                label={city}
                value={city}
                key={String(city)}
                color="#6C6C80"
              />
            ))}
          </Picker>
        </View>

        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Enter</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    // backgroundColor: '#f0f0f5',
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu-Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto-Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    // height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    paddingVertical: 5,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },

  picker: {
    color: '#6C6C80',
    fontFamily: 'Roboto-Regular',
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
});

export default Home;
