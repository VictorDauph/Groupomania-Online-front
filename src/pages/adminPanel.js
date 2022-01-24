//Le composant link remplace les balises <a> en React pour la navigation. En effet les <a> sont des liens qui font charger des pages, et en React on ne navigue pas de page en page, mais on modifie la page de manière dynamique avec des routes. Les links servent à gérer les routes sans envoyer de requêtes http.
import {Link} from "react-router-dom";    
    
//importation des composants à afficher
import Header from "../components/layout/Header";
import PostListing from "../components/cards/postListing"
import CommentListing from "../components/comments/commentList";

//importation des éléments contextuels liés à la récupération de donnée via l'API avec fetch.
import { useContext,useEffect, useState } from "react";
import ApiContext from "../ApiHandling/ApiContext";
import {AuthContext } from "../authentification/authContext";


  

function AdminPanel(){

    //Gestion du panneau des posts signalés
      //On utilise le contexte pour pouvoir écrire la fonction fetch dans un autre fichier, ce qui permet de mieux ranger et aussi de créer une fonction fetch get réutilisable en fonction de l'URI fournie.
    const ApiCtx = useContext(ApiContext)    
    const AuthCtx = useContext(AuthContext)

    //on récupère l'Id de l'utilisateur depuis le localStorage pour préparer le body de la requête
    
    
    useEffect(()=> { //useEffect évite une boucle infinie qui pousse le composant à se recharger à fois qu'il appelle fetch.
        AuthCtx.authentifiedUserDatas().then(() =>{ 
            ApiCtx.getPosts(`https://victor-groupomania-api.herokuapp.com/api/post/flagged`)
        })
        
      }, []); //[] est vide car il n'ya pas d'external dependencie dans la fonction gérée par useEffect. S'il y'en avait eu, il aurait fallu les inclure dans l'array.
    console.log("loadedPosts", ApiCtx.loadedPosts)

    

    //gestion du panneau des commentaires signalés:

    const [flaggedComments,setFlaggedComments]=useState([])

    function getFlaggedComments(comments){
        let formatedComments=[]
            function formateComments(comments){
                //création d'un array de posts stocké dans loadedPost. l'array contient plusieur posts pour l'affichage sur un fil ou un seul post pour l'affichage sur la page single post. Dans tous les cas, on affiche les posts grâce au composant PostListing.
                console.log("fetched flagged comments :", comments)
                comments.map(
                    comment =>{
                        console.log("mapped comment:", comment)
                            const formatedComment = {
                                ...comment,

                            }
                            formatedComments.push(formatedComment)
                            console.log("formated comment", formatedComment)
                    }
                )
                setFlaggedComments(formatedComments)
                
            }
        formateComments(comments)

    }
    
      useEffect(()=> { //useEffect évite une boucle infinie qui pousse le composant à se recharger à fois qu'il appelle fetch.
            AuthCtx.initHeadersForFetch("GET").then(init =>{
                fetch(`https://victor-groupomania-api.herokuapp.com/api/comment/flagged`,init).then(res => res.json()).then( comments => {
                getFlaggedComments(comments)
            }) 
        })
      }, [])
  

    return(
    <div>
        <Header headerType = "adminPanel"/>
        <PostListing posts = {ApiCtx.loadedPosts} title={"Posts signalés"}  />
        <CommentListing comments={flaggedComments} adminPanel={true} title={"Commentaires signalés"}/>
    </div>
    )
}


export default AdminPanel