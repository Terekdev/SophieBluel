const urlCategories = 'http://localhost:5678/api/categories';
const urlWorks = 'http://localhost:5678/api/works';
const urlLogin = 'http://localhost:5678/api/users/login';
let selectedCategoryId = 0; // par défaut, afficher tous les works

/**
 * Suppression des works de la galerie index.html 
 */
function deleteWorks() {
    // Récupération de l'élément galerie d'index.html
    const gallery = document.getElementsByClassName("gallery").item(0);
    // Suppression des enfants de l'élément galerie
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    };
};

/**
 * Affichage des works dans la galerie index.html grâce aux données de l'API
 */
function displayWorks() {
    // Récupération des données de l'API
    fetch(urlWorks)
        .then(function (response) {
            if (response.ok) {
                deleteWorks();
                return response.json();
            }
        })
        .then(function (data) {
            for (let work of data) {
                if (selectedCategoryId === 0 || selectedCategoryId === work.categoryId) {
                    // Récupération de l'élément galerie dans le DOM
                    const gallery = document.getElementsByClassName("gallery").item(0);
                    // Création des cartes pour chaque work de l'API
                    const figure = document.createElement('figure');
                    const image = document.createElement('img');
                    image.setAttribute("crossorigin", "anonymous");
                    image.setAttribute("src", work.imageUrl);
                    image.alt = work.title;
                    const figCaption = document.createElement('figcaption');
                    figCaption.innerText = work.title;
                    // Rattachement des éléments créés au DOM
                    gallery.appendChild(figure);
                    figure.append(image, figCaption);
                };
            };
        })
};

/**
 * Affichage des boutons de filtre par catégorie grâce aux données de l'API
 */
function displayFilters() {
    // Nouvelle promesse : attendre que cette fonction soit exécutée en totalité avant d'éxecuter la suivante
    return new Promise(resolve => {
        // Récupération des données de l'API
        fetch(urlCategories)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                };
            })
            .then(function (data) {
                // Ajout de la catégorie "Tous" sur les données de l'API
                data.unshift({
                    id: 0,
                    name: 'Tous'
                });
                // Récupération des éléments du DOM pour le rattachement des boutons de filtre
                const portfolio = document.getElementById('portfolio');
                const gallery = document.getElementsByClassName('gallery').item(0);
                // Création du conteneur des boutons de filtres
                const divFilters = document.createElement('div');
                divFilters.setAttribute('id', 'container-filters');
                // Création des boutons de filtre en fonctions des données de l'API
                for (let category of data) {
                    const button = document.createElement('button');
                    button.classList.add('button-filter');
                    button.innerText = category.name;
                    button.value = category.id;
                    // Rattachement des boutons de filtre au DOM
                    divFilters.appendChild(button);
                }
                // Rattachement du conteneur des boutons de filtres au DOM
                portfolio.insertBefore(divFilters, gallery);
                // Résolution de la promesse
                resolve();
            })
    });
};

/**
 * Filtrage des works en fonction leur catégorie 
 */
function filterWorks() {
    // Mettre à jour l'identifiant de la catégorie sélectionnée
    selectedCategoryId = parseInt(event.target.value);
    // Afficher les works filtrés
    displayWorks();
};

/**
 * Affichage du mode admin si le token a été correctement stocké lors de la connexion
 */
function displayAdminMode() {
    if (localStorage.getItem('token')) {
        // Affichage du bouton logout
        const log = document.querySelector('nav > ul > li > a');
        log.setAttribute('id', 'logout');
        log.href = "index.html";
        log.innerText = "logout";
        // Affichage de la bannière noir
        const bannerTemplate = `<div class="edit_mode"><i class="fas fa-regular fa-pen-to-square fa-lg"></i><p>Mode édition</p></div>`;
        const header = document.querySelector("header");
        header.style.marginTop = "70px";
        header.insertAdjacentHTML("afterbegin", bannerTemplate);
        // Création du bouton modifier
        const editButtonTemplate = `<a href="#" class="edit-link"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`;
        // Positionnement des différents boutons modifier
        const galleryTitle = document.querySelector("#portfolio h2");
        galleryTitle.insertAdjacentHTML('afterend', editButtonTemplate);
        // Ajout d'un href="#modal" sur le bouton modifier de la galerie
        const editButtonGallery = document.querySelector("#portfolio a");
        editButtonGallery.href = '#modal';
        editButtonGallery.classList.add('open-modal');
        // Désactivation de la fonction de filtrage
        const divFilters = document.getElementById('container-filters');
        divFilters.style.display = 'none';
    };
};

/**
 * Ajout de works sur l'API
 */
function sendData() {
    // Récupération des valeurs du formulaire
    const title = document.getElementById('title').value;
    const selectCategory = document.getElementById('selectCategory');
    const choice = selectCategory.selectedIndex;
    const category = selectCategory.options[choice].id;
    const file = document.getElementById('file').files[0];
    // Création de l'objet formData
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);

    // Récupération du token 
    const token = localStorage.getItem('token');
    //Envoi des données au serveur avec une requête HTTP POST
    fetch(urlWorks, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: formData
    })
        .then(response => {
            console.log(response);
            if (response.ok) {
                console.log('Données envoyées avec succès !');
                goBackModal();
                displayWorksModal();
                displayWorks();
            } else {
                console.error('Erreur lors de l\'envoi des données : ', response.status);
            }
        })
        .catch(error => console.error('Erreur lors de l\'envoi des données : ', error));
};

// Listing des évènements déclencheurs
/**
 * EVENT : Filtrage des works au clic sur la catégorie choisie
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.button-filter')) {
        filterWorks();
    };
});

/**
 * EVENT : Déconnexion au clic sur le bouton logout
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('#logout')) {
        localStorage.removeItem('token');
    };
});
