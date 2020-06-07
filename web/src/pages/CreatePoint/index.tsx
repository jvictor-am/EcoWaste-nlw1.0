import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone';

import './styles.css';

import logo from '../../assets/logo.svg';
// import background from '../../assets/background.svg';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phonenumber: '',
  });

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
      // console.log(position);
    });
  }, []);

  useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
        // setItems(response.data);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });

    // console.log('mudou', selectedUf);
  }, [selectedUf]);

  function handleSelectedUf(e: ChangeEvent<HTMLSelectElement>) {
    const uf = e.target.value;

    setSelectedUf(uf);
  }

  function handleSelectedCity(e: ChangeEvent<HTMLSelectElement>) {
    const city = e.target.value;

    setSelectedCity(city);
  }

  function handleMapClick(e: LeafletMouseEvent) {
    setSelectedPosition([e.latlng.lat, e.latlng.lng]);
    // console.log(e.latlng);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    // console.log(e.target.name, e.target.value);
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
    // console.log('test', id);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // console.log(selectedFile);

    // return;

    const { name, email, phonenumber } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('phonenumber', phonenumber);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    !selectedFile ||
    formData.name === '' ||
    formData.email === '' ||
    formData.phonenumber === '' ||
    selectedUf === '' ||
    selectedCity === '' ||
    latitude === 0 ||
    longitude === 0 ||
    items.length === 0
      ? toast.error(
          'Please insert Image, fill in all Inputs, select Address on Map and select at least 1 Waste Item'
        )
      : (await api.post('points', data)) &&
        toast.success('Waste Point Successfully created !') &&
        history.push('/');
  }

  return (
    <div id='page-create-point'>
      <header>
        <Link to='/'>
          <img src={logo} alt='EcoWaste_Ecoleta' />
        </Link>

        <Link to='/'>
          <FiArrowLeft />
          <strong>Go back to Homepage</strong>
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Register a waste
          <br />
          collection point
        </h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Data</h2>
          </legend>

          <div className='field'>
            <label htmlFor='name'>Entity Name</label>
            <input
              type='text'
              name='name'
              id='name'
              onChange={handleInputChange}
            />
          </div>

          <div className='field-group'>
            <div className='field'>
              <label htmlFor='email'>E-mail</label>
              <input
                type='text'
                name='email'
                id='email'
                onChange={handleInputChange}
              />
            </div>
            <div className='field'>
              <label htmlFor='phonenumber'>Phone Number</label>
              <input
                type='text'
                name='phonenumber'
                id='phonenumber'
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select address on map</span>
          </legend>

          <Map
            // center={[-2.7957405, -40.5151]}
            center={initialPosition}
            zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />

            {/* <Marker position={[-2.7957405, -40.5151]} /> */}
            <Marker position={selectedPosition} />
          </Map>

          <div className='field-group'>
            <div className='field'>
              <label htmlFor='uf'>State (UF)</label>
              <select
                name='uf'
                id='uf'
                value={selectedUf}
                onChange={handleSelectedUf}
              >
                <option value='0'>Select one UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className='field'>
              <label htmlFor='city'>City</label>
              <select
                name='city'
                id='city'
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option value='0'>Select one City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Waste Items</h2>
            <span>Select at least one item below</span>
          </legend>

          <ul className='items-grid'>
            {items.map((item) => (
              // <li className='selected'>
              <li
                key={item.id}
                onClick={() => handleSelectedItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type='submit'>Register waste collection point</button>
      </form>
    </div>
  );
};

export default CreatePoint;
