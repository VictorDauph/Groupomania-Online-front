//Ce fichier sert à mettre en forme une carte commentaire à partir d'arrays de posts passés depuis commentList.

import {useContext, useState, useEffect } from "react";

//importaion du contexte d'authentification
import {AuthContext} from "../../authentification/authContext";

import {Card} from 'react-bootstrap'

//Importation de useHistory pour  navigation programmatique
import { useHistory } from "react-router-dom";

//importation des interfaces de modification et suppression des commentaires
import CommentDeleteInterface from "../layout/commentDeleteInterface";
import CommentModifyButton from "../layout/commentModifyButton";
import CommentForm from "../forms/CommentForm";

//modifier la liste des comments avec APIContext
function CommentItem(props){

    //history est est utilisée pour la navigation programmatique
    const history = useHistory() 

    //Message sert à afrficher les messages d'erreurs en provenance de l'API
    const [message, changeMessage] = useState("")
    
    let propsContent= props.content
    const [content,setContent]= useState(propsContent)
    let newContent=content
    const commentId= props.commentId
    const userId= props.userId


    console.log("comment item", props)
    console.log("comment content", propsContent, content,newContent)

    //Variable d'apparition de l'interface de modification d'un commentaire
    const [isModifying,setIsModifying]= useState(false)
    const [isModified,setIsModified]= useState(false) //Si is modified est true, il faut afficher la valeur modifiée, sinon la valeur propsContent

    const AuthCtx= useContext(AuthContext)

    //l'affichage du drapeau de signalement de contenu est un state car il doit se modifier en réaction au clic de signalement.
    let isFlagged= props.flagged
    console.log("comment : ", commentId, "flagged on React ?", isFlagged)
    const[flagged,setFlagged] = useState(isFlagged)

    //On a besoin de vérifier si l'utilisateur est un admin ou un standard pour lui donner accès à la fonction unflag
    const isAdmin = AuthCtx.isAdmin();
    console.log("isAdmin", isAdmin)

    //UseEffect permet d'éxecuter le code indiqué à chaque modification de la variable dans l'Array. Ainsi on s'assure que le changement d'état s'applique bien à chaque modification de la variable, y compris lors de la navigation et du rafraîchiseement de la page.
    useEffect(() =>{
        setFlagged(isFlagged)
    },[isFlagged])

    //useEffect permet de redéfinir le contenu du post à chaque fois qu'un commentaire est crée

    useEffect(()=>{
        if (isModified == false){
        console.log("comment content effect", propsContent, content, newContent,isModified)
        setContent(propsContent)}
    },[props.content])

    useEffect(()=>{
        if (isModified){
        setContent(newContent)
        console.log("comment content effect 2", propsContent, content, newContent,isModified)}
    },[isModified])

    //Cette fonction sert à flagger les commentaires
    function setFlaggedHandler(){
        return new Promise((resolve,reject) =>{
            console.log("flagging")
            AuthCtx.initHeadersForFetch("PUT").then( (init)=>{
                fetch(`https://victor-groupomania-api.herokuapp.com/api/comment/flag/${commentId}`,init
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
                fetch(`https://victor-groupomania-api.herokuapp.com/api/comment/unflag/${commentId}`,init
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
    
    //Cette fonction permet de naviguer vers le post qui contient le commentaire.
    function gotoSinglePost(){
        console.log("gotoSinglePost", props.postId)
        localStorage.setItem("SinglePost",props.postId)
        history.push("/singlePost")
    }

    function goToUserFeed(){
        console.log("goToTuserFeed", props.userId)
        localStorage.setItem("userFeed",props.userId)
        history.push("/userFeed")
    }

    //Cette fonction sert à faire disparaître un commentaire quand il est supprimé
    const [display,setDisplay]=useState("")
    function eraseComment(){
        setDisplay("d-none")
    }

    //récupération de l'Id de l'user loggé
    let loggedUserId = null
    AuthCtx.authentifiedUserDatas().then(userDatas =>{
        loggedUserId=userDatas.id
    })


    //Cette fonction sert à modifier un commentaire via le formulaire CommentForm
    function updateComment(event,commentValue){
        event.preventDefault(); //empêche le rechargement de la page. comportement pas défaut du bouton

        //on modifie la valeur de newContent afin qu'à l'activation de useEffect la valeur rechargée soit la nouvelle valeure du commentaire
        newContent=commentValue
        setContent(newContent)
        setIsModified(true)
        console.log("comment content updated", propsContent, content)
        //construction du body de la requête fetch
        const requestBody = {
            content:commentValue,
            userId:loggedUserId
        }
        console.log("Updated comment content :", commentValue, "index :", "requestBody :",requestBody)

        //Requête fetch vers l'API qui modifie le commentaire dans la base de données
        AuthCtx.initHeadersForFetch("PUT",requestBody).then(init =>{
            fetch(`https://victor-groupomania-api.herokuapp.com/api/comment/${commentId}`,init).then(res => res.json()).then( res => {
                changeMessage(res.message)
                setContent(commentValue)
            }).catch(res => {changeMessage(res.message)})
            .then(()=>{setIsModifying(false) })//fermeture du formulaire
        })
    }
    console.log("item adminPanel?", props.adminPanel)
        
    return (
        <div className={display}>
            <Card className="col col-md-6 mx-auto bg-secondary py-3 px-3">
                <Card.Text className="text-light">
                    {/* la balise de navigation vers le post ne doit s'afficher que dans panelAdmin.*/}
                    {props.adminPanel?<p className="mini">Ce commentaire est rattaché au post : <span className="text-primary cursor-pointer" onClick={gotoSinglePost}>{props.postId}</span> </p>:null} 
                    <p className="mini">
                        crée le: {props.createdAt} par 
                        <span className="text-primary cursor-pointer" onClick={goToUserFeed}>  {userId} </span>
                    </p>
                    <p>{content}</p>
                    <p>
                        {/* Affichage de l'interface de signalement/désignalement */}
                        <span className="text-danger mini mx-1"> {flagged? isAdmin? <i className="fas fa-flag cursor-pointer text-primary" onClick={setUnflaggedHandler}> Contenu acceptable </i> : <i className="fas fa-flag"> contenu signalé</i> : <i class="far fa-flag cursor-pointer" onClick={setFlaggedHandler}> signaler ce contenu</i>} </span></p>
                        {/*Le formulaire de modification apparaît quand isModifying=true, quand isModifying=false apparition des boutons. */}
                        {isModifying? <CommentForm  {...props} handleComment={updateComment} isModifying={isModifying} setIsModifying={setIsModifying} buttonText={"Modifier Commentaire !"} label="Modifiez votre commentaire" />: 
                        <div className="container">
                            <div className="row">
                                <CommentModifyButton {...props} setIsModifying={setIsModifying}/> 
                                <div className="col"></div>
                                <CommentDeleteInterface {...props} eraseComment={eraseComment}/>
                            </div>
                        </div>}
                </Card.Text>
            </Card>
            <p className="text-danger col col-md-6 mx-auto">{message}</p>
        </div>
    )
        

}

export default CommentItem