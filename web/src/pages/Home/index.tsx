import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo.svg';
import background from '../../assets/background.svg';

const Home = () => {
  return (
    <div id='page-home'>
      <div className='content'>
        <header>
          <img src={logo} alt='EcoWaste_Ecoleta'></img>
        </header>
        <main>
          {/* <h1>Seu marketplace de coleta de resíduos.</h1> */}
          <h1>Your waste collection marketplace</h1>
          {/* <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </p> */}
          <p>We help people find waste collection points efficiently</p>

          <Link to='/create-point'>
            <span>
              <FiLogIn></FiLogIn>
            </span>
            {/* <strong>Cadastre um ponto de coleta</strong> */}
            <strong>Register a waste collection point</strong>
          </Link>
        </main>
      </div>
      <div className='background'>
        <img src={background} alt='Background'></img>
      </div>
    </div>
  );
};

export default Home;
