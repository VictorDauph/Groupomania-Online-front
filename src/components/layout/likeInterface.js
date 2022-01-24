//Ce fichier sert à gérer  l'affichage de l'interface et les fonctions de like des posts.
import {useEffect, useState, useContext} from "react"

//importation de contexte d'authentification pour stockage données utilisateur
import { AuthContext } from "../../authentification/authContext"

//Importation de l'APIContexte pour gestion de la fonction fecth like/dislike
import ApiContext from "../../ApiHandling/ApiContext"

import {Button} from 'react-bootstrap'

function LikeInterface(props){
    console.log("like Interface props :", props)
    //changeMessage est la fonction qui permet d'afficher les messages d'erreurs
    const changeMessage = props.changeMessage

    //importation de contexte d'authentification pour stockage données utilisateur
    const AuthCtx = useContext(AuthContext)

    const upVotes = props.usersUpvotes.length
    const downVotes =  props.usersDownvotes.length

    //Ce groupe de fonctions sert à gérer les likes
    let usersUpvotesProps = props.usersUpvotes
    let usersDownvotesProps= props.usersDownvotes
    //On récupère l'UserId qui a servi à l'authentification de l'utilisateur et on le stock dans AuthentifiedUserId
   const [authentifiedUserId,setAuthentifiedUserId]=useState(null)

   
    //hasUserLikedPost() est une fonction qui doit retourner 0 si l'utilisateur est neutre, 1 s'il a liké le post, -1 s'il l'a disliké.
    const ApiCtx = useContext(ApiContext)
    //stockage des arrays de likes et dislikes dans des states

 
    //détermination de l'état du post: liké 1 , disliké -1 ou neutre 0 ?
    let isLiked = 2
    const [UserHasLikedPost,setUserHasLikedPost] = useState();


    //La valeur retournée est stockée dans UserHasLikedPost
    function hasUserLikedPost(){
        
        AuthCtx.authentifiedUserDatas().then( datas=>{
            setAuthentifiedUserId(datas.id)
            console.log("identification", authentifiedUserId)
         }).catch(err=>{changeMessage(err.message)}).then(()=>{
            console.log("user Upvotes array for post",props.postId, usersUpvotesProps, "user Id:", authentifiedUserId)
            if(usersUpvotesProps.includes(authentifiedUserId)){
                isLiked=1
                setUserHasLikedPost(isLiked)
                console.log("post liked :", props.postId)
            }
            else if(usersDownvotesProps.includes(authentifiedUserId)){
                isLiked=-1
                setUserHasLikedPost(isLiked)
                console.log("post disliked :", props.postId)
            }
            else{
                isLiked=0
                setUserHasLikedPost(isLiked)
                console.log("post not liked :", props.postId)
            }
         })
    }

   
    function likePostHandler(){

        //requête POST pour ajout de like à la BDD
        ApiCtx.likePost(1,props.postId,authentifiedUserId).then((data)=>{
                    //modification du pouce
                    isLiked = 1
                    setUserHasLikedPost(isLiked)
                    //modification du nombre de likes
                    usersUpvotesProps.push(authentifiedUserId)
                    changeMessage(data.message)
                    console.log("liking post", authentifiedUserId)
        }).catch( err=>{
            changeMessage(err.message)
        })
    }


        function dislikePostHandler(){
        console.log("disliking post")
        //requête POST pour ajout de dislike à la BDD
        ApiCtx.likePost(-1,props.postId,authentifiedUserId).then((data)=>{
            //modification du pouce
            isLiked = -1
            setUserHasLikedPost(isLiked)
            //modification du nombre de likes
            usersDownvotesProps.push(authentifiedUserId)
            changeMessage(data.message)
        }).catch( err=>{
            changeMessage(err.message)
        })
    }

    function unlikePostHandler(){//enlever un like ou un dislike nécessite la même requête fetch avec une valeure de like nulle.
        console.log("unliking post")
        //requête POST pour retrait de like/dislike à la BDD
        ApiCtx.likePost(0,props.postId,authentifiedUserId).then((data)=>{
            //modification du pouce
            isLiked = 0
            setUserHasLikedPost(isLiked)
            //modification du nombre de likes en React. Il faut d'abord vérifier si l'user est dans le tableau des likes ou des dislikes du post puis le supprimer du tableau corresponsant avec splice.
            function checkAndDeleteUser(ArrayToCheck){ //Cette fonction est utilisable avec le tableau like et le tableau dislike. On vérifie d'abord la présence de l'utilisateur dans le tableau, puis on l'enlève s'il est présent.
                console.log("ArrayToCheck", ArrayToCheck)
                const UserIndex = ArrayToCheck.indexOf(authentifiedUserId)
                if(UserIndex >= 0){
                    ArrayToCheck.splice(UserIndex,1)
                    return ArrayToCheck
                }
            }
            //On vérifie la présence de l'utilisateur dans chaque tableau, on le supprime s'il est présent.
            usersDownvotesProps = checkAndDeleteUser(usersDownvotesProps);
            usersUpvotesProps= checkAndDeleteUser(usersUpvotesProps)
            //Une fois l'utilisateur supprimé on met à jour les states.
            changeMessage(data.message)
        }).catch( err=>{
            changeMessage(err.message)
        })
    }

    //useEffect permet de prendre en compte la modification des variables au fur et à mesure.
    useEffect(()=>{
        hasUserLikedPost()
    })





    if(UserHasLikedPost==1)
        return(
            <span> {/*Pouce levé blanc et clickable, pouce baissé bleu  non clickable */}
                <Button variant="link" className="text-light cursor-pointer text-decoration-none thumb-button mx-0" onClick={unlikePostHandler} onKeyPress={(e)=>{if (e.key==="Enter") {unlikePostHandler()}}} ><i className="fas fa-thumbs-up"></i></Button>{upVotes}
                <span className="text-primary mx-1" > <i className="fas fa-thumbs-down"></i> </span> {downVotes} 
            </span>
        )
    else if(UserHasLikedPost==0)
        return(
            <span> {/*Pouce levé bleu et clickable, pouce baissé bleu et clickable */}
                <Button variant="link" className="text-primary cursor-pointer text-decoration-none thumb-button mx-0" onClick={likePostHandler} onKeyPress={(e)=>{if (e.key==="Enter") {likePostHandler()}}} ><i className="fas fa-thumbs-up"></i></Button>{upVotes}
                <Button variant="link" className="text-primary cursor-pointer text-decoration-none thumb-button mx-0" onClick={dislikePostHandler} onKeyPress={(e)=>{if (e.key==="Enter") {dislikePostHandler()}}} ><i className="fas fa-thumbs-down"></i></Button>{downVotes}
            </span>
        )
    else if(UserHasLikedPost==-1)
        return(
            <span> {/*Pouce levé bleu et non clickable, pouce baissé blanc et clickable */}
                <span className="text-primary arrow mx-1"> <i className="fas fa-thumbs-up"></i> </span> {upVotes}
                <Button variant="link" className="text-white cursor-pointer text-decoration-none thumb-button mx-0" onClick={unlikePostHandler} onKeyPress={(e)=>{if (e.key==="Enter") {unlikePostHandler()}}} ><i className="fas fa-thumbs-down"></i></Button>{downVotes} 
            </span>
        )

    else
        return(<span>nul</span>)



}

export default LikeInterface


