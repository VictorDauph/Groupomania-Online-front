//On affiche ce bouton seulement si l'user loggé est l'user qui a créé le post ou s'il est admin.
import { useContext,useState,useEffect } from "react";
import { AuthContext } from "../../authentification/authContext";

function CommentModifyButton(props){
    //console.log("delete interface comment item", props)
    const AuthCtx = useContext(AuthContext)




    //On stock le logged userId dans un state car il vient d'une fonction du contexte qui a un temps de réponse trop grand pour être traité avec une variable
    const [loggedUserId,setLoggedUserId]=useState()
    AuthCtx.authentifiedUserDatas().then(userDatas =>{
        setLoggedUserId(userDatas.id)
    })

    //On a besoin de vérifier si l'utilisateur est un admin pour lui donner accès à la fonction de modification d'un commentaire
    const isAdmin = AuthCtx.isAdmin();
    const postUserId=props.userId

    function toggleUpdateInterface(){   
            props.setIsModifying(true)
        }
    
    //le bouton modifier ne doit apparaître que si l'utilisateur est un admin ou le propriétaire du commentaire
    if( isAdmin || loggedUserId==postUserId)
    {    
    return(
                <div className="col-md-4">
                    <button className="text-dark bg-primary" onClick={toggleUpdateInterface} >Modifier</button>
                </div>
        )
    }
    else
    {
        return null
    }
}

export default CommentModifyButton