//Cette fonction sert à afficher des listes de posts.

import PostItem from "./postItem";

function PostListing(props) {
    console.log("PostList :", props.posts)
    const postsProps = props.posts

    if(props.posts.length >0){
        const sortedPosts = postsProps.reverse()
        return (
        <main className="container">
                <h2 className="text-primary col col-md-6 mx-auto my-5">{props.title}</h2>
                {sortedPosts.map(post => ( //sortedPosts est l'array qui contient les données de chaque post à afficher. .map permet de traiter chaque élément du tableau les un après les autres
                <PostItem {...post} /> 
            )
            )}
        </main>
        )
    }
    if(postsProps.length <= 0){ //Le fait d'utiliser ce bloc conditionnel empêche des bugs liés à l'affichage et au mapping de listes vides
        return(
            <main className="container text-primary my-5">
                Il n'y a aucun post à afficher
            </main>
        )
    }

}

export default PostListing;
