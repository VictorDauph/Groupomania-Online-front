//Le composant createPostForm permet d'afficher et de gérer l'interface de création de posts.

//Importation de useHistory pour  navigation programmatique
import { useHistory } from "react-router-dom";
//react-bootstrap permet d'utiliser des composant spécifiques pour les Form et les Button
import {Form, Button} from "react-bootstrap"
//useRef permet de lire le contenu d'un input.
import {useRef, useContext, useState} from "react"; 

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

    //states de gestion de l'image
    const [selectedFile, setSelectedFile] = useState();
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [message, changeMessage] = useState("")

    function handleFileInputChange(e){
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);

    };

       //preview file sert à afficher l'image que l'utilisteur va uploader
    const previewFile = (file) => {
        //FileReader est un composant préconfiguré React qui permet de lire un fichier
        const reader = new FileReader();
        //readAsDataURL transforme le contenu de l'objet (ici, l'image) en une chaîne de caractères
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        const reader = new FileReader();
        //selected file est un fichier sous forme d'objet qui contient l'image et ses caractéristiques.
        console.log("selectedFile",selectedFile)
        //readAsDataURL transforme le contenu de l'objet (ici, l'image) en une chaîne de caractères
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            uploadImage(reader.result);
        };
        reader.onerror = () => {
            console.error('AHHHHHHHH!!');
            changeMessage('something went wrong!');
        };
    };

    const uploadImage = async (base64EncodedImage) => {
        const titleValue = titleInput.current.value
        //console.log("base64EncodedImage",base64EncodedImage)
        console.log("uploading")

        AuthCtx.authentifiedUserDatas().then( usersDatas =>{
            //formData est un format spécial qui permet de stocker et échanger des données en binaires: ficjiers et images
            const config={
                headers:{
                     Authorization: `Bearer ${usersDatas.token}`
                   }
            }
            try {
                fetch('https://victor-groupomania-api.herokuapp.com/api/post', {
                    method: 'POST',
                    //L'image est envoyée dans le body sous forme de JSON.
                    body: JSON.stringify({ 
                        title: titleValue,
                        userId: usersDatas.id,
                        data: base64EncodedImage
                    }),
                    headers: { 
                        'Content-Type': 'application/json' ,
                        "Authorization": `Bearer ${usersDatas.token}`
                    }

                }).then(()=>{redirection()});
            } catch (err) {
                console.error(err);
                changeMessage('Something went wrong!');
            }
        })
    }    
    return(
            <main className="container">
                <Form onSubmit={handleSubmit} className="my-3">
                    <Form.Group className="p-3 mb-5 rounded text-primary bg-secondary" controlId="formTitle">
                        <Form.Label>Titre</Form.Label>
                        <Form.Control type="text" placeholder="entrez le titre du post" ref={titleInput} />
                    </Form.Group>

                    <Form.Group className="p-3 mb-5 rounded text-primary bg-secondary" controlId="formFile">
                        <Form.Label>Sélectionner une image</Form.Label>
                        <Form.Control className="bg-secondary text-white" name="image" type="file" onChange={handleFileInputChange} ref={formFileInput} />
                    </Form.Group>
                    <Button className="text-primary bg-secondary border-0" type="submit">
                        Créer Post!
                    </Button>
                </Form>
                <p className="text-danger my-5">{message}</p>
                {previewSource && (
                <img
                    src={previewSource}
                    alt="chosen"
                    style={{ height: '300px' }}
                />
                )}
            </main>
    )
}
export default CreatePostForm