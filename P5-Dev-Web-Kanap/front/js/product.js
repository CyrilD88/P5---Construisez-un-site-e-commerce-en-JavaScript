const params = new URL(document.location).searchParams
const id = params.get("id")

const url = `http://localhost:3000/api/products/${id}`



////création de la fonction récupérant les infos de l'API
const getArticle = () => {
    fetch(url)
    .then(function(res) {
            return res.json()
    })
    .then(function(data){
        // console.log(data)
        const addTitle = (document.getElementById("title").innerHTML=data.name)  //création du titre du canapé
        const addPrice = (document.getElementById("price").innerHTML=data.price) //création du prix du canapé
        const addImg = document.createElement("img")  //création de l'élément image
        document.querySelector(".item__img").appendChild(addImg) // intégration de l'élément image à la div parente
        addImg.setAttribute("src", `${data.imageUrl}`) //ajout de l'image par son url

        const addDescription = (document.getElementById("description").innerHTML=data.description) //création de la description du canapé
        const addOption = document.getElementById("colors") //création des choix de couleur du canapé
        for (dyeing in data.colors) {
            addOption.innerHTML += `<option value= "${data.colors[dyeing]}">${data.colors[dyeing]}</option>`
        }

    })
}

getArticle()

//enregistrement des choix utilisateurs
const button = document.getElementById("addToCart");
const mistake = document.createElement("div");
document.querySelector(".item__content__addButton").appendChild(mistake);
const addprodLocalStorage = [];

//Création "ajouter au panier"
button.addEventListener('click', function() {
    mistake.innerText = "";
    if ((document.getElementById("quantity").value > 0 && document.getElementById("quantity").value <= 100) && (document.querySelector("#colors").value !== "")){
        let newProduct = {
            id: id,
            quantity: document.getElementById("quantity").value,
            colors: document.getElementById("colors").value

        };

        //S'il y a déjà un article dans le panier, ==> ajouter un nouveau produits à la liste
        if (localStorage.getItem('produits') !== null) {
            addprodLocalStorage = JSON.parse(localStorage.getItem('produits'));
        }
        
        //on peut ajuster la quantité si un nouveau produit à le même ID ET la même couleur qu'un produit déjà existant dans le localstorage
        for (let doublon of addprodLocalStorage) {
            if (doublon._id === newProduct._id && doublon.colors === newProduct.colors) {
                let addition = parseInt(doublon.quantity) + parseInt(newProduct.quantity);
                if (addition > 100) {
                    addition = 100;
                } else if (addition < 0) {
                    addition = 0;
                }
                doublon.quantity = JSON.stringify(addition);
                return (localStorage.setItem('produits', JSON.stringify(addprodLocalStorage)));
            }
        }

        // ajouter un nouveau produit au panier 
        addprodLocalStorage.push(newProduct);
        localStorage.setItem("produits", JSON.stringify(addprodLocalStorage));
        alert("Le produit à bien été ajouté au panier.");
    } else {
        mistake.innerText = "Veuillez renseigner une quantité (entre 1 et 100) et choisir une couleur de canapé";

    };
});


