//Ce fichier sert à gérer l'affichage d'un post unique et de ses commentaires.

import {Card} from 'react-bootstrap'

//importation des composants à afficher
import Header from "../components/layout/Header";
import PostListing from "../components/cards/postListing"
import PostDeleteInterface from "../components/layout/postDeleteInterface";
import CommentListing from "../components/comments/commentList";
import CommentForm from "../components/forms/CommentForm";
import NewCommentListing from '../components/comments/NewCommentList';


//importation des éléments contextuels liés à la récupération de donnée via l'API avec fetch.
import { useContext } from "react";
import ApiContext from "../ApiHandling/ApiContext";
import { AuthContext } from "../authentification/authContext";

import {useEffect,useState } from "react";


function SinglePost(){
    //On utilise le contexte pour pouvoir écrire la fonction fetch dans un autre fichier, ce qui permet de mieux ranger et aussi de créer une fonction fetch get réutilisable en fonction de l'URI fournie.
    const ApiCtx = useContext(ApiContext)    
    const AuthCtx = useContext(AuthContext)
    
 
    function getPostId(){
      return new Promise ((resolve) => { 
        resolve (localStorage.getItem("SinglePost"))
    })
    }

        //récupération de l'Id du post chargé
        let postId=null
        getPostId().then(feedPostId=>{
            postId=feedPostId
        })
    //on récupère l'Id de l'utilisateur depuis le localStorage pour préparer le body de la requête

  
    
    useEffect(()=> { //useEffect évite une boucle infinie qui pousse le composant à se recharger à fois qu'il appelle fetch.
        getPostId().then(feedPostId =>{ //on a besoin de récuper l'id du post à afficher afin de l'inclure son id dans l'URL de la requête
            console.log("feedUserId",feedPostId)
            ApiCtx.getPosts(`https://victor-groupomania-api.herokuapp.com/api/post/single/${feedPostId}`)

        }
    )}, []); //On charge les commentaires au chargement de la page.
    console.log("loadedPosts", ApiCtx.loadedPosts)
    

    const [comments,setComments]=useState([])
    const [newComments,setNewComments]=useState([])
    

    useEffect(()=> { //useEffect évite une boucle infinie qui pousse le composant à se recharger à fois qu'il appelle fetch.
        setComments(ApiCtx.loadedComments)
        },[ApiCtx.loadedComments]
    )
 


    //récupération de l'userId de l'utilisateur loggé
    let loggedUserId = null
    AuthCtx.authentifiedUserDatas().then(userDatas =>{
        loggedUserId=userDatas.id
    })
    

    const [message,changeMessage]=useState()
    
    //Cette fonction sert à crée un nouveau commentaire via comment form
    function createComment(event,commentValue){
        event.preventDefault(); //empêche le rechargement de la page. comportement pas défaut du bouton
        
        //construction du body de la requête fetch
        const requestBody ={
            content:commentValue,
            userId:loggedUserId,
            postId:postId
        }
        console.log("request Body",requestBody)
        
        //Requête fetch vers l'API qui crée le commentaire dans la base de données
        AuthCtx.initHeadersForFetch("POST",requestBody).then(init =>{
            fetch(`https://victor-groupomania-api.herokuapp.com/api/comment/`,init).then(res => res.json()).then( res => {
                const newComment = {
                    commentId:res.commentId,
                    content:commentValue,
                    createdAt:"maintenant",
                    flagged:false,
                    postId:postId,
                    userId:loggedUserId,
                    newComment:true, 
                }
                
                console.log(res.message)
                changeMessage(res.message)
                return new Promise((resolve) =>{
                    let newCommentsArray=[newComment].concat(newComments)
                    resolve(newCommentsArray)
                }).then(newCommentsArray=>{
                    newCommentsArray.sort(function(a, b){return b.commentId - a.commentId});
                    setNewComments(newCommentsArray)
                    console.log("new comments", newCommentsArray)
                })
            })
            }).catch(res => {changeMessage(res.message)})
    }

    
    /* Les Hooks permettent de découper le code selon ce qu’il fait plutôt qu’en fonction des noms de méthodes de cycle de vie. React appliquera tous les effets utilisés par le composant, dans l’ordre de leur déclaration*/
    return(
        <div>
            <Header headerType = "userFeed"/>
            <PostListing posts = {ApiCtx.loadedPosts} title={"Page du Post"} adminPanel={false} />
            <PostDeleteInterface post = {ApiCtx.loadedPosts} />
            <div className="col col-md-6 mx-auto bg-secondary py-3 px-3">
                <CommentForm  handleComment={createComment} buttonText={"Commenter !"} label="Commentez" />
                <div className="text-danger">{message}</div>
            </div>
            <NewCommentListing comments={newComments}/> {/*affichage des nouveaux commentaires */}
            <CommentListing comments={comments}/> {/*affichage des commentaires de la BDD */}
        </div>
    )
} 

export default SinglePost