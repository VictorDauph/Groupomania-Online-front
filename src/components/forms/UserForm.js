//userForm est un composant modulable utilisé pour le login et pour le signup. Par conséquent le text du bouton, les fonctions de traitement des données et la redirection sont des props.

//react-bootstrap permet d'utiliser des composant spécifiques pour les Form et les Button
import {Form, Button} from "react-bootstrap"
//useRef permet de lire le contenu d'un input.
import {useRef} from "react"; 


function UserForm(props){
    const emailInput = useRef()
    const passwordInput = useRef()
    const buttonText = props.buttonText

    function handleSubmit (event) {
        console.log("submission")
        event.preventDefault(); //empêche le rechargement de la page. comportement pas défaut du bouton
        const email= emailInput.current.value;
        const password= passwordInput.current.value;
        console.log(email,password)

        const newUser = {
            email: email,
            password: password
        }

        props.onSubmitUser(newUser)
      };

    //affichage et styles bootstrap du formulaire
    return(
        <Form onSubmit={handleSubmit}>
            <Form.Group className="p-3 mb-5 rounded text-primary bg-secondary" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="entrez votre email" ref={emailInput} />
            </Form.Group>

            <Form.Group className="p-3 mb-5 rounded text-primary bg-secondary" controlId="formBasicPassword">
            <Form.Label>Mot de Passe</Form.Label>
                <Form.Control type="password" placeholder="entrez votre mot de passe" ref={passwordInput} />
            </Form.Group>

            <Button className="text-primary bg-secondary border-0" type="submit">
                {buttonText}
            </Button>
        </Form>
    );
}

export default UserForm