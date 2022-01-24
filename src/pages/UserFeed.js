//importation des composants à afficher
import Header from "../components/layout/Header";
import PostListing from "../components/cards/postListing"

//importation des éléments contextuels liés à la récupération de donnée via l'API avec fetch.
import { useContext } from "react";
import ApiContext from "../ApiHandling/ApiContext";



import {useEffect, useState } from "react";

function UserFeed(props){
      //On utilise le contexte pour pouvoir écrire la fonction fetch dans un autre fichier, ce qui permet de mieux ranger et aussi de créer une fonction fetch get réutilisable en fonction de l'URI fournie.
    const ApiCtx = useContext(ApiContext)    

    function getFeedUserId(){
      return new Promise ((resolve) => { 
        resolve (localStorage.getItem("userFeed"))
    })
    }

    //on récupère l'Id de l'utilisateur depuis le localStorage pour préparer le body de la requête
    
    const [feedUser,setFeedUser]= useState()
    useEffect(()=> { //useEffect évite une boucle infinie qui pousse le composant à se recharger à fois qu'il appelle fetch.
        getFeedUserId().then(feedUserId =>{ //on a besoin de récuper les données de connection de l'utilisateur pour inclure son id dans l'URL de la requête
            console.log("feedUserId",feedUserId)
            setFeedUser(feedUserId)
            ApiCtx.getPosts(`https://victor-groupomania-api.herokuapp.com/api/post/fromUser/${feedUserId}`)
        })
        
      }, []); //[] est vide car il n'ya pas d'external dependencie dans la fonction gérée par useEffect. S'il y'en avait eu, il aurait fallu les inclure dans l'array.
    console.log("loadedPosts", ApiCtx.loadedPosts)
    

    return(
    <div>
        <Header headerType = "userFeed"/>
        <PostListing posts = {ApiCtx.loadedPosts} title={"Fil de "+feedUser} />
    </div>
    )
} 

export default UserFeed