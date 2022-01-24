//Importation de l'élément Dropdown de la librairie react-bootstrap
import {Dropdown} from "react-bootstrap"

//Le composant link remplace les balises <a> en React pour la navigation. En effet les <a> sont des liens qui font charger des pages, et en React on ne navigue pas de page en page, mais on modifie la page de manière dynamique avec des routes. Les links servent à gérer les routes sans envoyer de requêtes http.
import {Link} from "react-router-dom";

//importation des éléments liés aux composants contextuels
import {useContext} from "react";
import {AuthContext} from "../../authentification/authContext"; 

//Importation de useHistory pour  navigation programmatique
import { useHistory } from "react-router-dom";

function CustomDropdownMenu(props){
    console.log("headerType", props.headerType)

    const history = useHistory() //history est est utilisée pour la navigation programmatique
    const AuthCtx = useContext(AuthContext) //Authcontext contient les variables fonctions liées au login, logout et vérification d'authentification pour gérer les Protected Routes
    const redirection = () => {history.push("/");} //Cette redirection ramène sur la page de login après un logout.
    
    

    //Fonction qui appelle la fonction de logout
    function logoutHandler(){
        AuthCtx.logout(redirection)
    }

    //Fonction qui appelle la fonction de suppression de compte

    function deleteAccountHandler(){
        let body = {userId:null}
        console.log("delete account")
        AuthCtx.authentifiedUserDatas().then( datas=>{
            body.userId = datas.id
            }).then( () => {
            AuthCtx.initHeadersForFetch("DELETE",body).then(init =>{
            fetch(`https://victor-groupomania-api.herokuapp.com/api/account/`,init).then(res=>res.json()).then(res=>{
                console.log(res.message)
                alert(res.message)
                localStorage.clear("userDatas")
                history.push("/")
                }).catch(err => alert(err.message))
            })
        })            
    } 

    function navigate(Url){
        history.push(Url)
    }

    

    //Les fonction DropDownItem... sont des boutons utilisés dans les différents dropDownMenus des headers des différentes pages. Ils sont codés séparément car utilisés différemment selon les pages
    function DropdownItemSignup(){
        return(
            <Dropdown.Item className="text-decoration-none text-primary" onClick={()=>{navigate("/signup")}} onKeyPress={(e)=>{if (e.key==="Enter") {navigate("/signup")}}}  >
                Inscription d'un nouvel utilisateur
            </Dropdown.Item>
        )
    }

    function DropDownItemLogin(){
        return(
            <Dropdown.Item className="text-decoration-none text-primary" onClick={()=>{navigate("/")}} onKeyPress={(e)=>{if (e.key==="Enter") {navigate("/")}}} >
                Connexion Utilisateur
            </Dropdown.Item>
        )
    }

    function DropDownItemCreatePost(){
        return(
            <Dropdown.Item className="text-decoration-none text-primary" onClick={()=>{navigate("/newPost")}} onKeyPress={(e)=>{if (e.key==="Enter") {navigate("/newPost")}}} >
                Créer Post
            </Dropdown.Item>
        )
    }

    function DropDownItemDeleteAccount(){
        return(
            <Dropdown.Item className="text-decoration-none text-danger" onClick={deleteAccountHandler} onKeyPress={(e)=>{if (e.key==="Enter") {deleteAccountHandler()}}} >
                Supprimer compte
            </Dropdown.Item>
        )
    }

    function DropDownItemMyFeed(){
        return(
            <Dropdown.Item className="text-decoration-none text-primary" onClick={()=>{navigate("/myFeed")}} onKeyPress={(e)=>{if (e.key==="Enter") {navigate("/myFeed")}}} >
                Mon Fil
            </Dropdown.Item>
        )
    }

    function DropDownItemLogout(){
        return(
            <Dropdown.Item className="text-decoration-none text-primary" onClick={logoutHandler} onKeyPress={(e)=>{if (e.key==="Enter") {logoutHandler()}}} >
                Logout
            </Dropdown.Item>       
        )
    }

    function DropDownItemFeed(){
        return(
        <Dropdown.Item className="text-decoration-none text-primary" onClick={()=>{navigate("/feed")}} onKeyPress={(e)=>{if (e.key==="Enter") {navigate("/feed")}}} >
            Fil
        </Dropdown.Item>
        )
    }


    function DropDownItemAdminPanel(){
        const isAdmin=AuthCtx.isAdmin()
        console.log("isAdmin :", isAdmin)
        if(isAdmin){
            return(
                <Dropdown.Item className="text-decoration-none text-primary" onClick={()=>{navigate("/adminPanel")}} onKeyPress={(e)=>{if (e.key==="Enter") {navigate("/adminPanel")}}} >
                    Paneau d'administration
                </Dropdown.Item>
            )
        }
        else return(null)
    }

    //Les blocs conditionnels if, retournent des boutons différents pour des pages différentes

    if(props.headerType=="login"){   
        //Menu dropdown page login
    return(
        <Dropdown>
        <Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
            <i className="fas fa-bars"></i> 
        </Dropdown.Toggle>
        <Dropdown.Menu className="bg-secondary">
            <DropdownItemSignup />
        </Dropdown.Menu>
    </Dropdown> 
        )
    }
    else if (props.headerType=="signup"){
        //Menu dropdown page signup   
        return(
            <Dropdown>
            <Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
                <i className="fas fa-bars"></i> 
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-secondary">
                <DropDownItemLogin />
            </Dropdown.Menu>
        </Dropdown> 
            )
        }

        else if (props.headerType=="feed"){
            //Menu dropdown page feed  
            return(
                <Dropdown>
                <Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
                    <i className="fas fa-bars"></i> 
                </Dropdown.Toggle>
                <Dropdown.Menu className="bg-secondary">
                    <DropDownItemCreatePost />
                    <DropDownItemMyFeed />
                    <DropDownItemLogout />
                    <DropDownItemAdminPanel />
                    <DropDownItemDeleteAccount />
                </Dropdown.Menu>
            </Dropdown> 
                )
            }
            else if (props.headerType=="newPost"){
                //Menu dropdown page feed  
                return(
                    <Dropdown>
                    <Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
                        <i className="fas fa-bars"></i> 
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="bg-secondary">
                        <DropDownItemFeed />
                        <DropDownItemMyFeed />
                        <DropDownItemLogout />
                        <DropDownItemAdminPanel />
                        <DropDownItemDeleteAccount />
                    </Dropdown.Menu>
                </Dropdown> 
                    )
                }
                else if (props.headerType=="myFeed"){
                    //Menu dropdown page feed  
                    return(
                        <Dropdown>
                        <Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
                            <i className="fas fa-bars"></i> 
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="bg-secondary">
                            <DropDownItemCreatePost />
                            <DropDownItemFeed />
                            <DropDownItemLogout />
                            <DropDownItemAdminPanel />
                            <DropDownItemDeleteAccount />
                        </Dropdown.Menu>
                    </Dropdown> 
                        )
                    }
    
                    else if (props.headerType=="userFeed"){
                        //Menu dropdown page feed  
                        return(
                            <Dropdown>
                            <Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
                                <i className="fas fa-bars"></i> 
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="bg-secondary">
                                <DropDownItemCreatePost />
                                <DropDownItemFeed />
                                <DropDownItemMyFeed />
                                <DropDownItemLogout />
                                <DropDownItemAdminPanel />
                                <DropDownItemDeleteAccount />
                            </Dropdown.Menu>
                        </Dropdown> 
                            )
                        }

                    else if (props.headerType=="adminPanel"){
                        //Menu dropdown page adminPanel  
                        return(
                            <Dropdown>
                                <Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
                                    <i className="fas fa-bars"></i> 
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="bg-secondary">
                                    <DropDownItemCreatePost />
                                    <DropDownItemFeed />
                                    <DropDownItemMyFeed />
                                    <DropDownItemLogout />
                                    <DropDownItemDeleteAccount />
                                </Dropdown.Menu>
                            </Dropdown> 
                        )
                    }
    else{
        return(
            <div>nul</div>
        )
    }
}

export default CustomDropdownMenu