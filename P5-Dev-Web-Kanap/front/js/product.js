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
        console.log(data)
        const addTitle = (document.getElementById("title").innerHTML=data.name)  //création du titre du canapé
        const addPrice = (document.getElementById("price").innerHTML=data.price) //création du prix du canapé
        const addImg = document.createElement("img")  //création de l'élément image
        document.querySelector(".item__img").appendChild(addImg) // intégration de l'élément image à la div parente
        addImg.setAttribute("src", `${data.imageUrl}`) //ajout de l'image par son url

        const addDescription = (document.getElementById("description").innerHTML=data.description) //création de la description du canapé
        const addOption = document.getElementById("colors") //création des choix de couleur du canapé
        for (dyeing in data.colors) {
            addOption.innerHTML += `<option value= "${data.colors[dyeing]}">"${data.colors[dyeing]}"</option>`
        }

    })
}

getArticle()