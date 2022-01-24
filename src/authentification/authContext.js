//Ce fichier sert à créer des variables utilisables à n'importe quel endroit de l'application via createContext
import { createContext } from "react";

// AuthContext est un composant React créé par nos soins. L'argument de createContext est sa valeur par défaut. La modification des valeurs se fait dans la constante contexte de la fonction FavoritesContextProvider
//Authcontext contient les variables fonctions liées au login, logout et vérification d'authentification pour gérer les Protected Routes
export const AuthContext = createContext({
    authenticated:null,
    isAdmin:() =>{},
    login:() =>{},
    isAuthenticated:() =>{},
    logout:() =>{},
    initHeadersForFetch:() =>{},
    authentifiedUserDatas:() =>{},
});



export function AuthContextProvider(props){
    let userAuth = false

        //Cette fonction stocke les données de l'utilisateur qui s'authentifie dans le local storage en ecrasant celles déjà stockées. Un seul utilsiateur peut être identifié à la fois côté client.
        function loginHandler(redirection,userId,role, token){ //en argument de login on passe une fonction de redirection qui doit être éxécutée une fois l'authentification réalisée.
            console.log("demande d'authentification")
            const userDatas = {id:userId,role:role,token:token}
            localStorage.setItem("userDatas", JSON.stringify(userDatas))
            console.log("stored userDatas", localStorage.getItem("userDatas"))
            console .log("userId", userDatas)
            if(userDatas.id !== undefined){
                redirection()
            }
            
            
        }

        //Cette fonction supprime les infos utilisateurs stockées dans localStorage
        function logoutHandler(redirection){
            console.log("logging out")
            localStorage.clear()
            redirection();
        }

        //Cette fonction retourne true si un utilisateur est authentifié et false si non.
        function isAuthenticatedHandler(){
            function checkLocalStorage(userDatas)
            {
                    if (userDatas !==null){
                        console.log("setting true")
                        return true
                    }
                    else{
                        console.log("setting false")
                        return false
                    }
            }
            const userDatas = localStorage.getItem("userDatas")
            userAuth = checkLocalStorage(userDatas) //l'utilisateur est considéré comme authentifié sur userDatas est présent dans le LocalStorage
            return userAuth;
        }

            //les headers de toutes les fonction fetch get sont identiques et sont paramètrées ici. On définit init sous forme de promesse pour éviter des erreurs d'authentification au chargement de la page. 
            //Il faut passer la method "GET", "POST","DELETE" ou "PUT" en argument à la fonction.
        function initHeadersForFetch(method,bodyToFetch){ 
            return new Promise ((resolve) => {
                const userDatas = JSON.parse(localStorage.getItem("userDatas"))
                let token = ""
                if(userDatas !== null)
                    {token = userDatas.token}
                
                const fetchHeader = {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json'
                }
                
                const init = {
                    method: method,
                    headers: fetchHeader,
                    mode: 'cors',
                    cache: 'default',
                    body: JSON.stringify(bodyToFetch)
                }
                resolve(init)
            })
        }

        //Cette fonction retourne true si l'utilisateur authentifié est un admin et false dans tous les autres cas.
        function isAdmin(){
            if(isAuthenticatedHandler()){//on vérifie d'abord que l'utilisateur est loggé
                const userDatas = JSON.parse( localStorage.getItem("userDatas"))
                if (userDatas.role == "admin") // Puis on vérifie qu'il a bien le rôle admin.
                    {return true}
                else
                    {return false}
            }
            else
                {return false} 



        }

        //Cette fonction retourne les données utilisateur stockées dans le local storage
        function authentifiedUserDatas(){
            return new Promise ((resolve) => { 
                resolve (JSON.parse(localStorage.getItem("userDatas")))
            })
        }

        const context = {
            authenticated:userAuth,
            isAdmin:isAdmin,
            login:loginHandler,
            isAuthenticated:isAuthenticatedHandler,
            logout:logoutHandler,
            initHeadersForFetch:initHeadersForFetch,
            authentifiedUserDatas:authentifiedUserDatas
        };

    return(<AuthContext.Provider value={context}> {/* Ce bout de code sert à passer le contenu de AuthContext au reste du projet. */}
        {props.children}
    </AuthContext.Provider>);
}

