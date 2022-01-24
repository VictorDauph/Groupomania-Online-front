//On affiche ce bouton seulement si l'user loggé est l'user qui a créé le post ou s'il est admin.
import { useContext,useState } from "react";
import { AuthContext } from "../../authentification/authContext";

//Importation de useHistory pour  navigation programmatique
import { useHistory } from "react-router-dom";

function PostDeleteInterface(props){
    const AuthCtx = useContext(AuthContext)
    const history = useHistory() //history est est utilisée pour la navigation programmatique

    //On stock le logged userId dans un state car il vient d'une fonction du contexte qui a un temps de réponse trop grand pour être traité avec une variable
    const [loggedUserId,setLoggedUserId]=useState()
    AuthCtx.authentifiedUserDatas().then(userDatas =>{
        setLoggedUserId(userDatas.id)
    })

    //On a besoin de vérifier si l'utilisateur est un admin pour lui donner accès à la fonction de suppression d'un post
    const isAdmin = AuthCtx.isAdmin();

    const postId=props.post[0].postId
    const postUserId=props.post[0].userId

    function deletePostHandler(event)
        {   
            event.preventDefault()
            console.log("deleting post :", postId, "loggedUserId :", loggedUserId, "postUserId", postUserId, "isAdmin :", isAdmin )
            const body={userId:loggedUserId}
            //initHeadersForFetch construit la requête à envoyer à l'API, il suffit ensuite d'appliquer la fonction fetch
            AuthCtx.initHeadersForFetch("DELETE",body).then(init =>{
                fetch(`https://victor-groupomania-api.herokuapp.com/api/post/${postId}`,init).then(res => res.json()).then( ans => {
                    alert(ans.message)
                    history.push("/feed");
                    
                })
            })
        }
    
    if( isAdmin || loggedUserId==postUserId)
    {    
    return(
            <div className="container">
                    <div className="col col-md-6 mx-auto my-5">
                        <button className="text-white bg-danger" onClick={deletePostHandler} >SUPPRIMER CE POST</button>
                    </div>
            </div>
        )
    }
    else
    {
        return null
    }
}

export default PostDeleteInterface