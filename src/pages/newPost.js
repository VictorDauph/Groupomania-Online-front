//importation des composants à afficher
import Header from "../components/layout/Header";
import CreatePostForm from "../components/forms/createPostForm";

//importation des fonctionnalité de React
import {useState} from "react"

function NewPost(){
    const title ="Créer un nouveau Post"
    const [message, changeMessage] = useState("")
    return(
        <div>
            <Header headerType = "newPost"/>
            <main className="container">
                <div className="raw my-3 mx-3">
                    <h2 className="text-primary col-10">{title}</h2>
                </div>
                <CreatePostForm changeMessage={changeMessage} /> {/*  Appelle UserForm et lui indique de s'afficher ici et Rend disponible la fonction handleadd(requête Post à l'API) au sous-fichier user add qui gère le formulaire */}
                <p className="text-danger my-5">{message}</p>
            </main>
        </div>
    )
}
export default NewPost