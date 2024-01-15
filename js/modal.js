
/**
 * Ouverture de la modal
 */
function openModal() {
    const modal = document.querySelector('#modal');
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    displayModalDeleteWorks();
    displayWorksModal();
};

/**
 * Fermeture de la modal
 */
function closeModal() {
    const modal = document.querySelector('#modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    const modalWrapper = document.querySelector('.modal-wrapper');
    while (modalWrapper.firstChild) {
        modalWrapper.removeChild(modalWrapper.firstChild);
    };
};

/**
 * Affichage de la modale en mode suppression des works
 */
function displayModalDeleteWorks() {
    // Récupération de la modal de suppression de works
    const modalWrapper = document.querySelector('.modal-wrapper-delete');
    // Création de l'élément de navigation entre les deux modals
    const modalNav = document.createElement('div');
    modalNav.classList.add('modal-nav');
    // Création du bouton de fermeture de la modal
    const closeModalButton = document.createElement('i');
    closeModalButton.classList.add('fa-solid', 'fa-xmark', 'close-modal-button');
    // Création du titre de la modal
    const titleModal = document.createElement('h3');
    titleModal.innerText = 'Galerie photo';
    // Création du conteneur de la galerie
    const containerGallery = document.createElement('div');
    containerGallery.setAttribute('id', 'modal-gallery');
    // Création du bouton "Ajouter photo" pour passer à la modal d'ajout de works
    const addWorkButton = document.createElement('button');
    addWorkButton.classList.add('link-modal-add');
    addWorkButton.innerText = 'Ajouter une photo';
    // Création du bouton "Supprimer la galerie"
    const linkDelete = document.createElement('a');
    linkDelete.href = '#';
    linkDelete.classList.add('js-delete-works');
    // Rattachement des tous les éléments ci-dessus au DOM
    modalNav.append(closeModalButton);
    modalWrapper.append(modalNav, titleModal, containerGallery, addWorkButton, linkDelete);
};

/**
 * Affichage des works dans la modal en fonction des données de l'API
 */
function displayWorksModal() {
    // Récupération des données de l'API
    fetch(urlWorks)
        .then(function (response) {
            if (response.ok) {
                // Suppression de la galerie avant l'ajout des works de l'API
                const gallery = document.getElementById('modal-gallery');
                while (gallery.firstChild) {
                    gallery.removeChild(gallery.firstChild)
                };
                return response.json();
            };
        })
        .then(function (data) {
            for (let work of data) {
                // Récupération de l'élément galerie de la modal
                const gallery = document.getElementById('modal-gallery');
                // Création des cartes pour chaque work
                let figure = document.createElement('figure');
                figure.classList.add('modal-figure-works');
                let image = document.createElement('img');
                image.setAttribute('crossorigin', 'anonymous');
                image.setAttribute('src', work.imageUrl);
                image.alt = work.title;
                // Création du bouton "poubelle" pour chaque work
                let deleteButton = document.createElement('i');
                deleteButton.setAttribute('id', work.id);
                deleteButton.classList.add('fa-solid', 'fa-trash-can', 'delete-work');
                let figCaption = document.createElement('figcaption');
                // Rattachement des éléments au DOM
                gallery.append(figure);
                figure.append(deleteButton, image, figCaption);
            };
        })
};

/**
 * Suppression des works de l'API
 */
function deleteWorksData(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'content-type': "application/Json",
            'authorization': "Bearer " + localStorage.getItem("token"),
        },
    })
        .then((response) => {
            if (response.status === 201) {
                displayWorksModal();
                displayWorks();
            };
        });
};

/**
 * Affichage de la modale en mode ajout de works
 */
function displayModalAddWork() {
    // Récupération de la modal de suppression de works
    const modalWrapper = document.querySelector('.modal-wrapper-add');
    modalWrapper.style.display = null;
    // Création de l'élément de navigation entre les deux modals
    const modalNav = document.createElement('div');
    modalNav.classList.add('modal-nav');
    // Création du bouton de retour à la précédente modal
    const goBackButton = document.createElement('i');
    goBackButton.classList.add('fa-solid', 'fa-arrow-left', 'go-back-button');
    // Création du bouton de fermeture de la modal
    const closeModalButton = document.createElement('i');
    closeModalButton.classList.add('fa-solid', 'fa-xmark', 'close-modal-button');
    // Création du titre de la modal
    const titleModal = document.createElement('h3');
    titleModal.innerText = 'Ajout photo';
    // Rattachement des éléments ci-dessus au DOM
    modalNav.append(goBackButton, closeModalButton);
    modalWrapper.append(modalNav, titleModal);
    displayFormAddWork();
};

/**
 * Retour vers la modale précédente
 */
function goBackModal() {
    const modalWrapperAdd = document.querySelector('.modal-wrapper-add');
    modalWrapperAdd.style.display = 'none';
    while (modalWrapperAdd.firstChild) {
        modalWrapperAdd.removeChild(modalWrapperAdd.firstChild);
    };
    const modalWrapperDelete = document.querySelector('.modal-wrapper-delete');
    modalWrapperDelete.style.display = null;
};

/**
 * Affichage du formulaire d'ajout de work
 */
function displayFormAddWork() {
    // Récupération de la modal de suppression de works
    const modalWrapper = document.querySelector('.modal-wrapper-add');
    // Création du formulaire
    const formAddWork = document.createElement('form');
    formAddWork.classList.add('form-add-works');
    // Création du conteneur image du formulaire
    const containerFormImg = document.createElement('div');
    containerFormImg.classList.add('container-add-img');
    // Création de la prévisualisation file
    const imgPreview = document.createElement('img');
    imgPreview.classList.add('img-preview');
    imgPreview.src = 'assets/icons/icon-img.png'
    // Création du label file
    const labelAddImgButton = document.createElement('label');
    labelAddImgButton.setAttribute('for', 'file');
    labelAddImgButton.innerText = '+ Ajouter photo';
    // Création de l'input file
    const addImgButton = document.createElement('input');
    addImgButton.type = 'file';
    addImgButton.setAttribute('id', 'file');
    addImgButton.classList.add('input-image', 'verif-form');
    addImgButton.required = true;
    // Création de la ligne d'information file
    const infoAddImg = document.createElement('p');
    infoAddImg.innerText = 'jpg, png : 4mo max';
    // Création du conteneur info du formulaire
    const containerFormInfo = document.createElement('div');
    containerFormInfo.classList.add('container-form-info');
    // Création du label titre
    const labelTitle = document.createElement('label');
    labelTitle.setAttribute('for', 'title');
    labelTitle.innerText = 'Titre';
    // Création de l'input titre
    let inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.setAttribute('name', 'title');
    inputTitle.setAttribute('id', 'title');
    inputTitle.classList.add('verif-form');
    inputTitle.required = true;
    // Création du label catégorie
    const labelCategory = document.createElement('label');
    labelCategory.setAttribute('for', 'category');
    labelCategory.innerText = 'Catégorie';
    // Création du select catégorie
    const selectCategory = document.createElement('select');
    selectCategory.setAttribute('id', 'selectCategory');
    selectCategory.classList.add('verif-form');
    selectCategory.required = true;
    // Récupération des options catégorie
    setOptionsSelectForm();
    // Création du bouton valider
    const validForm = document.createElement('button');
    validForm.classList.add('js-add-works');
    validForm.innerText = 'Valider';
    validForm.style.backgroundColor = '#A7A7A7';
    //validForm.disabled = true;
    // Rattachement des éléments ci-dessus au DOM
    modalWrapper.appendChild(formAddWork);
    formAddWork.append(containerFormImg, containerFormInfo, validForm);
    containerFormImg.append(imgPreview, labelAddImgButton, addImgButton, infoAddImg);
    containerFormInfo.append(labelTitle, inputTitle, labelCategory, selectCategory);
    // Ajout de la fonction de vérification pour changer la couleur du bouton
    verifForm();
};

/**
 * Création des options pour le select du formulaire d'ajout de work
 */
function setOptionsSelectForm() {
    fetch(urlCategories)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            data.unshift({
                id: 0,
                name: ''
            });
            for (let category of data) {
                const option = document.createElement('option');
                option.classList.add('cat-option');
                option.setAttribute('id', category.id);
                option.setAttribute('name', category.name);
                option.innerText = category.name;
                const selectCategory = document.getElementById('selectCategory');
                selectCategory.append(option);
            };
        })
};

/**
 * Vérification du formulaire d'ajout de work pour le changement de couleur du bouton ajouter
 */
function verifForm() {
    const formAddWork = document.querySelector('.form-add-works');
    const validForm = document.querySelector('.js-add-works');
    const requiredElements = document.querySelectorAll('.verif-form[required]');
    requiredElements.forEach(element => {
        element.addEventListener('input', function () {
            if (formAddWork.checkValidity()) {
                validForm.style.backgroundColor = '#1D6154';
                //validForm.disabled = false;
            } else {
                validForm.style.backgroundColor = '#A7A7A7';
            }
        });
    });
};


/**
 * EVENT : Ouverture de la modal au clic sur le bouton modifier
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.open-modal')) {
        openModal();
    };
});

/**
 * EVENT : Fermeture de la modale au clic sur la croix ou hors de la modal
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.close-modal-button')) {
        closeModal();
    } else if (event.target.matches('#modal')){
        closeModal();
    };
});

/**
 * EVENT : Suppression des works sur la modal et l'index.html au clic sur la poubelle
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.delete-work')) {
        deleteWorksData(event.target.id);
        alert('Supression du work id=' + event.target.id);
        displayWorksModal();
        displayWorks();
    };
})

/**
 * EVENT : transfert vers la modal d'ajout de work au clic sur le bouton ajouter photo
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.link-modal-add')) {
        const modalWrapper = document.querySelector('.modal-wrapper-delete');
        modalWrapper.style.display = 'none';
        displayModalAddWork();
    };
});

/**
 * EVENT : retour vers la modal suppression de work au clic sur la fleche
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.go-back-button')) {
        goBackModal()
    };
});

/**
 * EVENT : Récupération du fichier et actualisation du preview
 */
document.addEventListener('change', function (event) {
    if (event.target.matches('.input-image')) {
        const imgPreview = document.querySelector('.img-preview');
        const file = event.target.files[0];
        const reader = new FileReader();
        if (file.size <= 4 * 1024 * 1024) {
            reader.addEventListener('load', () => {
                imgPreview.src = reader.result;
            });
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            alert('La taille du fichier doit être inférieure à 4 Mo');
        };
    };
}); 

/**
 * EVENT : Envoi des données du formulaire au clic sur le bouton valider
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.js-add-works')) {
        const formAddWorks = document.querySelector('.form-add-works');
        if (formAddWorks.checkValidity()) {
            sendData();
            displayWorks();
        }
    };
});

/**
 * Déclanchement des fonctions au chargement de la page
 */
async function init() {
    displayWorks();
    await displayFilters();
    displayAdminMode();
};

init();

