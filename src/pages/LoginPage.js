//Ici, on utilise useState pour gérer l'affichage des promesses retournée par fetch via l'API firebase.
import {useState} from "react"

//Importation de useHistory pour  navigation programmatique
import { useHistory } from "react-router-dom";

//importation des composants utilisés sur cette page
import Userform from "../components/forms/UserForm";

//importation des éléments liés aux composants contextuels
import {useContext} from "react";
import {AuthContext} from "../authentification/authContext"; 

//importation header
import Header from "../components/layout/Header";

function LoginPage(props){
    const title= "Connexion au compte utilisateur"
    const [message, changeMessage] = useState("")
    const history = useHistory() //history est est utilisée pour la navigation programmatique
    const AuthCtx = useContext(AuthContext) //Authcontext contient les variables fonctions liées au login, logout et vérification d'authentification pour gérer les Protected Routes

    function handleUserLogin(user) {
        //paramètrage de la requête Post pour le login
        console.log("tentative de login from front", user)
        const requestHeaders = {"Content-Type":"application/json"};
        const requestBody = JSON.stringify({
            email: user.email,
            password: user.password
        })

        const init=
        {
            method:"POST",
            body: requestBody,
            headers: requestHeaders,
        };
        //requête de login
        fetch("https://victor-groupomania-api.herokuapp.com/api/account/login",init
        ).then(res => {
            console.log("status pre-json",res.status)

            //fonxtion d'appel du contexte pour gérer le login
            return res.json()}).then(data =>{
                const redirection = () => {history.push("/feed");}
                changeMessage(data.message)
                console.log(data.userId, data.token)
                AuthCtx.login(redirection, data.userId,data.role, data.token)
            }).catch(err =>{
                changeMessage(err.message)})
    }; 

    //Gestion de l'affichage, des éléments qui constituent le composant, notemment le formulaire.
    return(
        <div>
            <Header headerType= "login" />
            <main className="container">
                <div className="raw my-3 mx-3">
                    <h2 className="text-primary col-10">{title}</h2>
                </div>
                <Userform onSubmitUser={handleUserLogin} buttonText="connexion" /> {/*  Appelle UserForm et lui indique de s'afficher ici et Rend disponible la fonction handleadd(requête Post à l'API) au sous-fichier user add qui gère le formulaire */}
                <p className="text-danger my-5">{message}</p>
            </main>
        </div>
    );
}

export default LoginPage