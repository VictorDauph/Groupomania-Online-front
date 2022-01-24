//Ici, on utilise useState pour gérer l'affichage des promesses retournée par fetch via l'API firebase.
import {useState} from "react"

//Importation de useHistory pour  navigation programmatique
import { useHistory } from "react-router-dom";

//importation des composants utilisés sur cette page
import Userform from "../components/forms/UserForm";

//importation Header
import Header from "../components/layout/Header";

function SignupPage(){
    const title= "Création du compte utilisateur"
    const [message, changeMessage] = useState()
    const history = useHistory() //history est est utilisée pour la navigation programmatique

    function handleAddUser(user) {
        console.log("tentative de signup from front", user)
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
        fetch("https://victor-groupomania-api.herokuapp.com/api/account/signup",init
        ).then(res => {
            console.log("status pre-json",res.status)
            return res.json()}).then(data =>{
                console.log(data)
                changeMessage(data.message)
                if (data.success)
                    {history.replace("/")}
            }
            ).catch(err =>{
                changeMessage(err.message)})

    }; 

    return(
        <div>
            <Header headerType= "signup" />
            <main className="container">
                <div className="raw my-3 mx-3">
                    <h2 className="text-primary col-10">{title}</h2>
                </div>
                <Userform onSubmitUser={handleAddUser} buttonText="Inscription" /> {/*  Appelle UserForm et lui indique de s'afficher ici et Rend disponible la fonction handleadd(requête Post à l'API) au sous-fichier user add qui gère le formulaire */}
                <p className="text-danger my-5">{message}</p>
            </main>
        </div>
        );
}

export default SignupPage