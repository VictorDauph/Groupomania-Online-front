//On affiche ce bouton seulement si l'user loggé est l'user qui a créé le post ou s'il est admin.
import { useContext,useState,useEffect } from "react";
import { AuthContext } from "../../authentification/authContext";
import ApiContext from "../../ApiHandling/ApiContext";




function CommentDeleteInterface(props){
    //console.log("delete interface comment item", props)
    const AuthCtx = useContext(AuthContext)
    const ApiCtx = useContext(ApiContext)



    //On stock le logged userId dans un state car il vient d'une fonction du contexte qui a un temps de réponse trop grand pour être traité avec une variable
    const [loggedUserId,setLoggedUserId]=useState()
    AuthCtx.authentifiedUserDatas().then(userDatas =>{
        setLoggedUserId(userDatas.id)
    })

    //On a besoin de vérifier si l'utilisateur est un admin pour lui donner accès à la fonction de suppression d'un commentaire
    const isAdmin = AuthCtx.isAdmin();
    const commentId=props.commentId
    const postUserId=props.userId

    //Cette fonction envoie la requête fecth pour supprimer le commentaire auquel le bouton appartient
    function deleteCommentHandler(event)
        {   
            event.preventDefault()
            console.log("deleting comment :", commentId, "loggedUserId :", loggedUserId, "postUserId", postUserId, "isAdmin :", isAdmin )
            const body={userId:loggedUserId}
            //initHeadersForFetch construit la requête à envoyer à l'API, il suffit ensuite d'appliquer la fonction fetch
            AuthCtx.initHeadersForFetch("DELETE",body).then(init =>{
                fetch(`https://victor-groupomania-api.herokuapp.com/api/comment/${commentId}`,init).then(res => res.json()).then( ans => {
                    alert(ans.message)
                    props.eraseComment()
                })
            })
        }
    
    //le bouton supprimer ne doit apparaître que si l'utilisateur est un admin ou le propriétaire du commentaire
    if( isAdmin || loggedUserId==postUserId)
    {    
    return(
                <div className="col-md-4">
                    <button className="text-dark bg-danger" onClick={deleteCommentHandler} >SUPPRIMER</button>
                </div>
        )
    }
    else
    {
        return null
    }
}

export default CommentDeleteInterface