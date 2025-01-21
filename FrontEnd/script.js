async function GetWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur :", error.message);
        return null;
    }
}

async function GetCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur :", error.message);
        return null;
    }
}
async function DeleteFromAPI(id){
        await fetch('http://localhost:5678/api/works/'+id, {
            method: 'DELETE',
            headers: {
            'Authorization': 'Bearer '+ active_token,
            },
        })
        .then(response => {
            if (response.ok) {
                return response.status !== 204 ? response.json() : null;
            } else {
                throw new Error(`Erreur : ${response.status} ${response.statusText}`);
            }
        })
        .then(data => {
            if (data) {
                console.log("Réponse JSON :", data);
            } else {
                console.log("Ressource supprimée avec succès (pas de contenu renvoyé)");
            }
        })
        .catch(error => {
            console.error("Erreur réseau ou API :", error);
        });
}
async function PostNewProject(infos) {
    const formedData = new FormData();

    infos = await infos;
    formedData.append('image', infos.image);
    formedData.append('title', infos.title);
    formedData.append('category', infos.category);

    try {
        const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + active_token,
            'accept' : 'application/json'
        },
        body: formedData
    });
    const result = await response.json();
    return(result);
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}



const sectionProjets = document.querySelector(".gallery");
const sectionFiltres = document.querySelector(".filtres");

const login_page_button = document.querySelectorAll('li')[2];

const active_token = sessionStorage.getItem('token');

const img_input = document.querySelector('.img-input');
const before_preview = document.querySelector('.before-preview');
const previewed_img_container = document.querySelector('.previewed-img-container');

const addProjectBtn = document.querySelector('.add-bottom-btn');

const addMsg = document.querySelector('.add-msg');

const modale_shadow = document.querySelector('.modale-shadow');
const modale = document.querySelector('.modale');
const modale_cards = document.querySelector('.modale-cards');
const add_page = document.querySelector('.add-aside');




if (active_token){
    display_admin_page();
    document.querySelector('header').style.paddingTop = '40px'
};

function display_admin_page(){
    display_admin_bar();
    remove_filtres();
    display_modify_btn();
    loginToLogout();
}



function loginToLogout(){
    login_page_button.innerHTML = 'logout';
    login_page_button.addEventListener('click',()=> sessionStorage.removeItem('token'),false);
}
function display_modify_btn(){
    const modify_btn = document.querySelector('.modify-btn');
    modify_btn.style.display = 'flex';
}
function display_admin_bar(){
    const edit_bar = document.querySelector('.edit-bar');
    edit_bar.style.display = "flex";
}   
function remove_filtres(){
    const filtres = document.querySelector('.filtres');
    filtres.remove();
};





(async () => {

    /* Récupérer l'API */
    let works = await GetWorks();

    async function refreshWorks(){
        works = await GetWorks();
    }

    const categories = await GetCategories();

    /* Display les projets */ 
    function display_projects(filtre) {
        
        function display_one_project(item){
            // Créer un conteneur `<figure>`
            const figureElement = document.createElement("figure");

            // Créer l'image
            const imageElement = document.createElement("img");
            imageElement.src = item.imageUrl;
            imageElement.alt = item.title;

            // Créer la légende
            const captionElement = document.createElement("figcaption");
            captionElement.innerText = item.title;

            // Ajouter l'image et la légende au `<figure>`
            figureElement.appendChild(imageElement);
            figureElement.appendChild(captionElement);
            figureElement.classList.add('projet');

            // Ajouter le `<figure>` à `.gallery`
            sectionProjets.appendChild(figureElement);
        }

        if (filtre == 'all'){
            works.forEach((item) => {
                display_one_project(item);
            });
            return;
        }
        
        works.forEach((item) => {
            if (filtre == item.category.id) {
                display_one_project(item);
            }
        });
    }

    display_projects('all');
    /* Fonctions pour faire fonctionner les boutons filtres */
    function remove_projects (){
        const figureElement = document.getElementsByClassName('projet');
        while (figureElement.length > 0){
            figureElement[0].remove();
        };
    };

    function filter_projects(filter) {

        remove_projects();
        display_projects(filter);

        reset_filters_color()
        paint_filter(filter)

    };

    function reset_filters_color(){
        filters = document.getElementsByClassName('filtre-item');
        for(let i=0 ; i< filters.length ; i++){
            filters[i].style.backgroundColor= 'white';
            filters[i].style.color = '#1D6154';
        };
    };
    function paint_filter(filter){
        if(filter == 'all'){filter = 0};
        const used_filter = document.getElementsByClassName('filtre-item')[filter];
        used_filter.style.backgroundColor = '#1D6154';
        used_filter.style.color = 'white';
    };

    /* Display les boutons filtres */
    let filtres_names = ['Tous'];
    categories.forEach((item) => {
        filtres_names.push(item.name);
    });
    filtres_names.forEach((filtre) => {
        const ButtonElement = document.createElement("button");
        ButtonElement.innerHTML = filtre;
        ButtonElement.classList.add('filtre-item');
        sectionFiltres.appendChild(ButtonElement);
    });

    const tous_filter = document.querySelector('.filtre-item');
    if(tous_filter != null){   /* condition nécessaire pour que la page en version admin fonctionne bien*/
        tous_filter.style.backgroundColor = '#1D6154';
        tous_filter.style.color = 'white';
    }

    /* Faire fonctionner les boutons filtres */
    const filtre_buttons = document.getElementsByClassName('filtre-item');

    if(filtre_buttons.length > 0){   /* condition nécessaire pour que la page en version admin fonctionne bien*/
        filtre_buttons[0].addEventListener("click",() => filter_projects('all'), false);
        for(let i=1;i<4;i++){
            filtre_buttons[i].addEventListener("click",() => filter_projects(categories[i-1].id), false);
        };
    }
    login_page_button.addEventListener('click',()=>window.location.replace('login.html'), false);
    const contact_page_button = document.querySelectorAll('li')[1];
    contact_page_button.addEventListener('click',()=>window.location.replace('index.html'), false);

    function display_modale(){

        modale.style.display = 'flex';
        modale_shadow.style.display = 'block';
        while(modale_cards.firstChild){                         
            modale_cards.firstChild.remove();                      
        };
            works.forEach((item) => {
                const cardContainer = document.createElement('div');
        
                const imageElement = document.createElement("img");
                imageElement.src = item.imageUrl;
                imageElement.alt = item.title;

                const remove_btn = document.createElement("img");
                remove_btn.id = item.id ;
                remove_btn.src = 'assets/images/bin_icon.png';
                remove_btn.alt = 'bin icon';
                remove_btn.style.height = '17px';
                remove_btn.style.width = '17px';
                remove_btn.style.position = 'absolute';
                remove_btn.classList.add('remove-btn');
                remove_btn.style.top = ('10px');
                remove_btn.style.right = ('10px');
                remove_btn.addEventListener('click', () => delete_project(item.id) , false);

                cardContainer.appendChild(remove_btn);
                cardContainer.appendChild(imageElement);
                modale_cards.appendChild(cardContainer);

            });
    };

    async function delete_project(id){

        await DeleteFromAPI(id);
        if (await DeleteFromAPI(id) == undefined){
            await refreshWorks();
            while (modale_cards.firstChild) {
                modale_cards.firstChild.remove();
            }
            display_modale();
            remove_projects();
            display_projects('all');
        }
    };

    const modify_btn = document.querySelector('.modify-btn');
    modify_btn.addEventListener('click', () => display_modale(),false);

    const category_add_page = document.querySelector('#category');

    for (let i = 0 ; i< categories.length ; i++){
        const category = document.createElement('option');
        category.innerHTML = categories[i].name ;
        category_add_page.appendChild(category);
    }

    function getNewProjectInfos(){
        let imgInput = document.querySelector('.img-input');
        const title = document.querySelector('.title-input').value;
        const categoryName = document.querySelector('.category-input').value;
        let categoryId;


        categories.forEach((category)=>{
            if (category.name === categoryName){
                categoryId = category.id;
            }
        });

        console.log(document.querySelector('.img-input'));
        const infos = {
            'image' : imgInput.files[0],
            'title' : title,
            'category' : categoryId
        }

        console.log(infos);
        return(infos)
    }
    async function addProject(){

        if(addImgInput.value && addTitleInput.value && addCategoryNameInput.value){
            display_well_added();

            infos = getNewProjectInfos();
            await PostNewProject(infos);

            await refreshWorks();
            refreshAddPage();

            remove_projects();
            display_projects('all');
            hide_modale_and_add();
        }else{
            display_error_add();
        };

    }
    function display_error_add(){
        addMsg.innerHTML = 'Veuillez remplir tous les champs d\'informations';
    }
    addProjectBtn.addEventListener('click', ()=> addProject(), false);

    addProjectBtn.addEventListener('click',display_error_add, false);


    const addImgInput = document.querySelector('#previewed_img_input');
    const addTitleInput = document.querySelector('.title-input');
    const addCategoryNameInput = document.querySelector('.category-input');
    const addInputs = [addCategoryNameInput,addTitleInput,addImgInput];

    addInputs.forEach((item)=>{
        item.addEventListener('change', ()=> turnOnAddBtn() ,false);
    });
    function turnOnAddBtn(){
        if(addImgInput.value && addTitleInput.value && addCategoryNameInput.value){
            addProjectBtn.style.backgroundColor = '#1D6154';
        } else {
            addProjectBtn.style.backgroundColor = '#CBD6DC';
        }
        if (addMsg){
            setTimeout(()=>addMsg.innerHTML = '', 2000);
        }
    };

})();
function display_well_added(){
    addMsg.innerHTML = 'Projet ajouté avec succès !'
}
function hide_modale(){
    modale_shadow.style.display = 'none';
    modale.style.display = 'none';
    addMsg.innerHTML = '';

};
function display_shadow(){
    modale_shadow.style.display = 'block';
}
function display_add_page() {
    add_page.style.display = 'flex';
    addProjectBtn.style.backgroundColor = '#CBD6DC';
}
function hide_add_page(){
    add_page.style.display = 'none'
    modale_shadow.style.display = 'none';
    refreshAddPage();
}
function space_back_close_btns(){
    const add_btns_container = document.querySelectorAll('.modale-and-add-top-btns')[1];
    add_btns_container.style.justifyContent = 'space-between';
}
function modaleToAddPage(){
    hide_modale();
    display_add_page();
    display_shadow();
    space_back_close_btns();
}
function backToModale(){
    hide_add_page();
    modale.style.display = 'flex';
    display_shadow();
}

function hide_modale_and_add() {
    hide_add_page();
    hide_modale();
}

function displayPreviewImg(){
    const img = document.createElement('img');
    img.classList.add('previewed-img');
    previewed_img_container.style.height = '100%';
    const file = img_input.files[0];
    if (file.size > 4000000 ){
        display_img_size_error();
        return;
    }
    if(!(file.type == 'image/png' || file.type == 'image/jpeg')){
        display_img_type_error();
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    //  gérer la taille du fichier 
    console.log(file);

    img.alt = 'wanted image';
    before_preview.style.display ='none'
    previewed_img_container.appendChild(img);
};
function display_img_size_error(){
    addMsg.innerHTML = 'L\'image est trop volumineuse';
}
function display_img_type_error(){
    addMsg.innerHTML = 'Le fichier choisi n\'est pas au bon format';
}
img_input.addEventListener('change', ()=> displayPreviewImg() ,false );

function refreshAddPage(){

    const previewed_img = document.querySelector('.previewed-img');
    if(previewed_img){
        document.querySelector('.previewed-img').remove();
    };
    previewed_img_container.style.height = '0';
    before_preview.style.display ='flex';
    const category = document.querySelector('.category-input');
    let title = document.querySelector('.title-input');
    
    if(category){
        category.value = category[0];
    }
    if(title){
        title.value = '';
    }
    document.querySelector('.img-input').value = '';
    
}
