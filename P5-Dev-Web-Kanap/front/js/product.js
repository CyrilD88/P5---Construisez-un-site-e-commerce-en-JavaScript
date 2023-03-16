//Récupération de l'ID présent dans l'URL
let url = new URL(document.location).searchParams;
let urlID = url.get("id");
console.log(urlID);

//Création des constantes pour l'intégration dynamique dans le DOM
const prix = document.getElementById('price');
const titre = document.getElementById('title');
const Image = document.querySelector(".item__img");
const description = document.getElementById('description');
const couleur = document.getElementById('colors');

/*------------------------------------------------------Récupération dans la base de données des informations de l'article --------------------------------------------------------------*/
function ficheArticles() {
fetch("http://localhost:3000/api/products/" + urlID)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(data) {
        let produit = data;
        console.log(data);

        //Création de l'image et alt
        let imageProduit = document.createElement("img");
        Image.appendChild(imageProduit);
        imageProduit.src = produit.imageUrl;
        imageProduit.alt = produit.altTxt;

        //Insertion du titre, prix et description dans le DOM
        titre.innerText = produit.name;
        prix.innerText = produit.price;
        description.innerText = produit.description;
        
        //Pour chaque couleur existante dans la base de donnée : Création de la balise option et insertion de la couleur 
        for (let i in produit.colors) {
            let optionProduits = document.createElement("option");
            couleur.appendChild(optionProduits);
            optionProduits.innerText = produit.colors[i];
        }

    })
    .catch(function(err) {
        let erreur = document.querySelector("item__img");
        erreur.innerText = "Nous sommes désolés, une erreur est survenue. Votre canapé ne peut pas être affiché. Veuillez nous excuser pour ce désagrement et nous vous invitons a réessayer ultérieurement."
        console.log("Erreur dans la récupération de l'article");
    });
}

ficheArticles();


/*------------------------------------------------- Création du LocalStorage---------------------------------------------------------------------------*/
//Création des constantes pour l'ajout des articles dans le panier
const BoutonPanier = document.getElementById("addToCart");
const erreur = document.createElement("div");
document.querySelector(".item__content__addButton").appendChild(erreur);
let tableauProduit = [];

//Création de l'écoute du bouton "ajouter au panier"
BoutonPanier.addEventListener('click', function() {
    erreur.innerText = "";
    //Si:la quantité est supérieur à 0 ET inférieur ou égale à 100 ET une couleur est selectionnée alors un nouveau produit est ajouté  au panier
    if ((document.getElementById("quantity").value > 0 && document.getElementById("quantity").value <= 100) && (document.querySelector("#colors").value !== "")){
        let nouveauProduit = {
            _id: urlID,
            quantity: document.getElementById("quantity").value,
            colors: couleur.value
        };
        //Si un article est déjà dans le panier, on le met en forme JS pour pouvoir ajouter un nouveau produits à la liste
        if (localStorage.getItem('produits') !== null) {
            tableauProduit = JSON.parse(localStorage.getItem('produits'));
        }
        //Si un nouveau produit à le même ID ET la même couleur qu'un produit déjà existant dans le localstorage, alors on ajuste uniquement la quantité
        for (let doublon of tableauProduit) {
            if (doublon._id === nouveauProduit._id && doublon.colors === nouveauProduit.colors) {
                let addition = parseInt(doublon.quantity) + parseInt(nouveauProduit.quantity);
                if (addition > 100) {
                    addition = 100;
                } else if (addition < 0) {
                    addition = 0;
                }
                doublon.quantity = JSON.stringify(addition);
                return (localStorage.setItem('produits', JSON.stringify(tableauProduit)));
            }
        }

        //On ajoute le nouveau produit aux panier et on transforme le localstorage en JSON puis export dans la page "panier"
        tableauProduit.push(nouveauProduit);
        localStorage.setItem("produits", JSON.stringify(tableauProduit));
        alert("Le produit à bien été ajouté au panier.");
    } else {
        erreur.innerText = "Veuillez renseigner une quantité (entre 1 et 100) et choisir une couleur de canapé";

    };
});