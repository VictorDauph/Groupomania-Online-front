//Ce commposant sert à entrer du texte et le transmets  à commentItem pour créer la requête htpp

//react-bootstrap permet d'utiliser des composant spécifiques pour les Form et les Button
import {Form, Button} from "react-bootstrap"
//useRef permet de lire le contenu d'un input.
import {useEffect, useRef} from "react"; 


function CommentForm(props){
    //variables de lecture des inputs
    const commentInput = useRef()
    const isModifying=props.isModifying

    function handleSubmit(event){
        const commentValue = commentInput.current.value
        props.handleComment(event,commentValue)
    }

    function handleCancel(){
        props.setIsModifying(false)
    }
  
    
    
    return(
            <div className="container">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="p-3 mb-5 rounded text-primary bg-secondary" controlId="formText">
                        <Form.Label>{props.label}</Form.Label>
                        <Form.Control type="text" as="textarea" placeholder={props.label} ref={commentInput} />
                    </Form.Group>
                    <div className="d-flex justify-content-around">
                        <Button className="text-dark bg-primary border-0" type="submit">
                            {props.buttonText}
                        </Button>
                        {props.isModifying?<Button onClick={handleCancel} className="text-dark bg-primary border-0">
                            annuler
                        </Button>:null}
                    </div>
                </Form>
            </div>
    )
}
export default CommentForm