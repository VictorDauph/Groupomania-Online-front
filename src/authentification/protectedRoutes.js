//Ce fichier sert à créer une route protégée.
import {Route, Redirect} from "react-router-dom"

//importation du contexte d'authentification
import {useContext} from "react";
import {AuthContext} from "../authentification/authContext"

function ProtectedRoute({component: Component, ...rest}){ //On doit passer en props à ProtectedRoute un composant et on transmet les autre props avec ...rest au composant.
    const AuthCtx = useContext(AuthContext)

    function checkAuth(props){

        console.log("checking Auth")

        if(AuthCtx.isAuthenticated()) //isAuthenticated est une fonction de Auth qui retourne vrai si l'utilisateur est authentifié et faux s'il ne l'est pas. On veut afficher le composant uniquement si isAuthenticated retourne vrai, sinon on est redirigé sur la Landing Page.
                        {   console.log("route authentifiée")
                            return <Component {...props} />} //On affiche le composant passé en props ici
                    else{
                        console.log("route pas authentifiée")
                        return <Redirect to={{pathname:"/",state:{from: props.location}}}/> //On redirige ver la page de login si l'authenfication n'est pas bonne.
                        }
    }

    return(
        <Route {...rest} render={checkAuth} />
    )
}

export default ProtectedRoute