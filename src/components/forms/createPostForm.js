//Le composant createPostForm permet d'afficher et de gérer l'interface de création de posts.

//Importation de useHistory pour  navigation programmatique
import { useHistory } from "react-router-dom";
//react-bootstrap permet d'utiliser des composant spécifiques pour les Form et les Button
import {Form, Button} from "react-bootstrap"
//useRef permet de lire le contenu d'un input.
import {useRef, useContext} from "react"; 
//axios est le plugin qui permet d'envoyer des fichiers
import axios from "axios"

import { AuthContext } from "../../authentification/authContext";

function CreatePostForm(props){
    //variables de lecture des inputs
    const titleInput = useRef()
    const formFileInput = useRef()
    //importation du contexte d'authentification
    const AuthCtx = useContext(AuthContext)
    //Cette redirection remène sur le fil global après la création d'un post
    const history = useHistory() //history est est utilisée pour la navigation programmatique
    const redirection = () => {history.push("/feed");} 

    function handleSubmit(event){
        event.preventDefault(); //empêche le rechargement de la page. comportement pas défaut du bouton
        const titleValue = titleInput.current.value
        const fileValue = formFileInput.current.files[0]

        AuthCtx.authentifiedUserDatas().then( usersDatas =>{
        //formData est un format spécial qui permet de stocker et échanger des données en binaires: ficjiers et images
        const config={
            headers:{
                 Authorization: `Bearer ${usersDatas.token}`
               }
        }
        const data = new FormData();
        data.append("title", titleValue)
        data.append("userId", usersDatas.id)
        data.append("image", fileValue) //il vaut mieux attacher le fichier en dernier pour eviter certains bugs.
        axios.post("https://victor-groupomania-api.herokuapp.com/api/post",data,config
        ).then( res => {
            props.changeMessage(res.data.message)
            redirection()
        }).catch( err => props.changeMessage("error", err))


        })



    }
    
    return(
            <main className="container">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="p-3 mb-5 rounded text-primary bg-secondary" controlId="formTitle">
                        <Form.Label>Titre</Form.Label>
                        <Form.Control type="text" placeholder="entrez le titre du post" ref={titleInput} />
                    </Form.Group>

                    <Form.Group className="p-3 mb-5 rounded text-primary bg-secondary" controlId="formFile">
                        <Form.Label>Sélectionner une image</Form.Label>
                        <Form.Control className="bg-secondary text-white" type="file" ref={formFileInput} />
                    </Form.Group>

                    <Button className="text-primary bg-secondary border-0" type="submit">
                        Créer Post!
                    </Button>
                </Form>
            </main>
    )
}
export default CreatePostForm