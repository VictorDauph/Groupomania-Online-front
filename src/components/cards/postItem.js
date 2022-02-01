//Ce fichier sert à mettre en forme une carte post à partir d'arrays de posts passés depuis postList.

import {useContext, useState, useEffect } from "react";

import {Card,Button} from 'react-bootstrap'
import { Image } from 'cloudinary-react';
//importaion du contexte d'authentification
import {AuthContext} from "../../authentification/authContext";
import ApiContext from "../../ApiHandling/ApiContext";

//importation du composant qui gère les likes
import LikeInterface from "../layout/likeInterface";

//Importation de useHistory pour  navigation programmatique
import { useHistory } from "react-router-dom";




function PostItem(props) {
    console.log("cloudName",process.env.REACT_APP_CLOUDINARY_NAME)
    //history est est utilisée pour la navigation programmatique
    const history = useHistory() 

    //importation du contexte d'authentification
    const AuthCtx = useContext(AuthContext)
    const ApiCtx = useContext(ApiContext)

    //Message sert à afrficher les messages d'erreurs en provenance de l'API
    const [message, changeMessage] = useState("")

    //calcul du karma à ârtir des tables upvotes et downvotes
    const upVotes = props.usersUpvotes.length
    const downVotes =  props.usersDownvotes.length
    const karma= upVotes - downVotes

    console.log("post props", props )



    //l'affichage du drapeau de signalement de contenu est un state car il doit se modifier en réaction au clic de signalement.
    let isFlagged= props.flagged
    console.log("post : ", props.postId, "flagged on React ?", isFlagged)
    const[flagged,setFlagged] = useState(isFlagged)
    
    //On a besoin de vérifier si l'utilisateur est un admin ou un standard pour lui donner accès à la fonction unflag
    const isAdmin = AuthCtx.isAdmin();
    console.log("isAdmin", isAdmin)

    //UseEffect permet d'éxecuter le code indiqué à chaque modification de la variable dans l'Array. Ainsi on s'assure que le changement d'état s'applique bien à chaque modification de la variable, y compris lors de la navigation et du rafraîchiseement de la page.
    useEffect(() =>{
        setFlagged(isFlagged)
    },[isFlagged])

    //Cette fonction sert à flagger les posts
    function setFlaggedHandler(){
        return new Promise((resolve,reject) =>{
            console.log("flagging")
            AuthCtx.initHeadersForFetch("PUT").then( (init)=>{
                fetch(`https://victor-groupomania-api.herokuapp.com/api/post/flag/${props.postId}`,init
                ).then(data => data.json()
                ).then(res => {
                    console.log(res)
                    resolve(res)
                }).catch(err=>{reject(err)})
            }).catch(err=>{reject(err)})
        }).then(data => {
            isFlagged=true;
            setFlagged(isFlagged)
            changeMessage(data.message)})
        .catch(err => {changeMessage(err.message)})
    }

    function setUnflaggedHandler(){
        return new Promise((resolve,reject) =>{
            console.log("unflagging")
            AuthCtx.initHeadersForFetch("PUT").then( (init)=>{
                fetch(`https://victor-groupomania-api.herokuapp.com/api/post/unflag/${props.postId}`,init
                ).then(data => data.json()
                ).then(res => {
                    console.log(res)
                    resolve(res)
                }).catch(err=>{reject(err)})
            }).catch(err=>{reject(err)})
        }).then(data => {
            isFlagged=false;
            setFlagged(isFlagged)
            changeMessage(data.message)})
        .catch(err => changeMessage(err.message))
    }

    function goToUserFeed(){

        console.log("goToTuserFeed", props.userId)
        localStorage.setItem("userFeed",props.userId)
        history.push("/userFeed")
    }

    function gotoSinglePost(){

        console.log("gotoSinglePost", props.postId)
        localStorage.setItem("SinglePost",props.postId)
        history.push("/singlePost")
    }



    return (    
        <div className="raw my-3 mx-3">
                <Card className="col col-md-6 mx-auto bg-secondary">
                    <Card.Body>
                        <Card.Title  >  <Button variant="link" className="text-primary cursor-pointer text-decoration-none" onClick={gotoSinglePost} onKeyPress={(e)=>{if (e.key==="Enter") {gotoSinglePost()}}} > <h3> {props.title} </h3> </Button> </Card.Title>
                            <Card.Text className="text-light"> 
                                <p>Karma: {karma} 
                                    <span className="mini"> {/*Pouce levé blanc si post liké, pouce baissé blanc si post disliké, sinon pouces bleus */}
                                        <LikeInterface {...props} changeMessage={changeMessage} />
                                        {/* Affichage de l'interface de signalement/désignalement */}
                                        <span> {flagged? isAdmin? <Button variant="link" className="cursor-pointer text-primary flag-button" onClick={setUnflaggedHandler} onKeyPress={(e)=>{if (e.key==="Enter") {setUnflaggedHandler()}}} ><i className="fas fa-flag" > Contenu acceptable </i> </Button> : <i className="fas fa-flag text-danger"> contenu signalé</i> : <Button variant="link" className="cursor-pointer text-danger flag-button" onClick={setFlaggedHandler} onKeyPress={(e)=>{if (e.key==="Enter") {setFlaggedHandler()}}} ><i className="far fa-flag "> signaler ce contenu</i> </Button>} </span>
                                    </span> 
                                </p>
                                <p className="mini">
                                    crée le: {props.createdAt} par 
                                    <Button variant="link" className="text-primary cursor-pointer text-decoration-none user-button" onClick={goToUserFeed} onKeyPress={(e)=>{if (e.key==="Enter") {goToUserFeed()}}}>  {props.userId} </Button>
                                </p>
                        </Card.Text>
                    </Card.Body>
                    <Image
                        cloudName={ApiCtx.cloudName} 
                        publicId={ApiCtx.cloudinaryFolder+props.imageUrl}
                    />
                </Card>
                <p className="text-danger col col-md-6 mx-auto">{message}</p>
               
        </div>
    )
}
export default PostItem;

                   /*  <Card.Img variant="top" src={`https://victor-groupomania-api.herokuapp.com/images/${props.imageUrl}`} /> */

