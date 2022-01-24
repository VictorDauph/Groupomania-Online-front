//Importation de l'élément personnalisé DropdownMenu. Cet élément affiche un menu différent en fonction de la variable HeaderType.
import CustomDropdownMenu from "./CustomDropdownMenu";

import {Link} from "react-router-dom"

function Header(props) {
    
    //Fonction d'appel de la fonction logout depuis le contexte.
    console.log("header headerType", props.headerType)

        const title= "Groupomania";
        return(
                <header className=" bg-secondary">
                    <div className="container"> 
                        <div className="raw d-flex flex-row align-items-center">
                            <div className="col-1"></div>
                            <Link className="d-flex flex-row align-items-center col-7 text-decoration-none" to="/feed">
                                <img src="./ressources/logos/miniature-white.png" alt="logo Groupomania " className=" my-3" id="logo"></img>
                                <h1 className="text-light">{title}</h1>
                            </Link>
                            <div className="col-2"></div>
                            <CustomDropdownMenu headerType={props.headerType} />
                            <div className="col-1"></div>
                        </div>
                    </div>
                </header>
        );
}

export default Header