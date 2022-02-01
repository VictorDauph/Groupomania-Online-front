//composants nécessaires à React
import React from 'react';
import ReactDOM from 'react-dom';
//BrowserRouter est le router spécifique à react qui gère le changement de page onepage
import {BrowserRouter} from "react-router-dom"; //BrowserRouter est l'élément qui permet de gérer le changement de pages dans React

//fichier de style CSS
import './style/CSS/style.css';

//chargement du fichier App qui gère le code Javascript et met en place les composants
import App from './App';

//Il est impératif que les composants du contexte englobent l'entièreté du projet pour pouvoir être pris en compte à n'importe quel niveau.
import {AuthContextProvider} from "./authentification/authContext"
import { ApiContextProvider } from './ApiHandling/ApiContext';

//Cette ligne appelle le plugin dotenv qui sécurise l'environnement du serveur
require('dotenv').config()

ReactDOM.render(
  <AuthContextProvider>
    <ApiContextProvider>
        <BrowserRouter>
          <App />
      </ BrowserRouter>
    </ApiContextProvider>
  </AuthContextProvider>,
  document.getElementById('root')
);

