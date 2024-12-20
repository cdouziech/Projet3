
async function PostLogin(logs) {
    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logs)
      });
  
      const result = await response.json();
      return(result);

    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
}
// appeller l'API qu'une fois
async function getResponse(){
    const user_logs = {
        email : document.querySelector('#mail').value,
        password : document.querySelector('#pw').value
    }
    return(await PostLogin(user_logs))
}

async function login(){
    response = await getResponse();
    console.log(response);
    if(response.token){
        logAsAdmin();
    }  else {
        loginError();
    }
}


async function logAsAdmin(){
    response = await getResponse();
    sessionStorage.setItem('token',response.token);
    window.location.replace('index.html');
}
function loginError() {
    const main = document.querySelector('main');
    const error_msg = document.querySelector('.error-msg');
    error_msg.innerHTML = 'Mot de passe ou email incorrect, veuillez réessayer.';
    main.appendChild(error_msg);
}

const project_page_button = document.querySelectorAll('li')[0];
project_page_button.addEventListener('click', () => window.location.replace('index.html'), false);
