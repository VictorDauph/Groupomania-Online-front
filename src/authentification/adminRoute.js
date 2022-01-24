//Ce fichier sert à créer une route protégée.
import {Route, Redirect} from "react-router-dom"

//importation du contexte d'authentification
import {useContext} from "react";
import {AuthContext} from "../authentification/authContext"



function AdminRoute({component: Component, ...rest}){ //On doit passer en props à ProtectedRoute un composant et on transmet les autre props avec ...rest au composant.
    const AuthCtx = useContext(AuthContext)
    

    function checkAuth(props){
        
        console.log("checking admin :", AuthCtx.isAdmin())

        if(AuthCtx.isAdmin()) //On vérifie que l'utilisateur a le rôle d'Admin, s'il ne l'a pas i lest redirigé vers la page de login
                        {   console.log("route admin authentifiée")
                            return <Component {...props} />} //On affiche le composant passé en props ici
                    else{
                        console.log("route admin pas authentifiée")
                        return <Redirect to={{pathname:"/feed",state:{from: props.location}}}/> //On redirige ver la page de login si l'authenfication n'est pas bonne.
                        }
    }

    return(
        <Route {...rest} render={checkAuth} />
    )
}

export default AdminRoute