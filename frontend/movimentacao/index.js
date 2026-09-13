const loading = document.getElementById("loading");
const loadingProgress = document.querySelector(".loading-progress");

const dialogo = document.getElementById("dialogo");
const textoDialogo = document.getElementById("textoDialogo");

const avatar = document.getElementById("avatar3d");

const barras = document.querySelectorAll(".progresso");

const mensagemInicial =
"Olá! Seja bem-vindo ao meu espaço. Aqui você encontrará um pouco da minha trajetória, tecnologias que utilizo e alguns projetos desenvolvidos por mim. Espero que goste!";


let modeloCarregado = false;


window.addEventListener("load", iniciarSistema);


function iniciarSistema(){

    iniciarLoading();

}


function iniciarLoading(){
    loadingProgress.classList.remove("carregando");
    loadingProgress.style.width = "100%";
}


function terminarLoading(){

    if(modeloCarregado === true){

        loadingProgress.style.width = "100%";

        setTimeout(()=>{

            loading.style.opacity = "0";

            setTimeout(()=>{

                loading.style.display = "none";

                abrirDialogo();

                iniciarSkills();

                escreverFrase();

            },700);

        },300);

    }

}


avatar.addEventListener("load", () => {

    modeloCarregado = true;

    terminarLoading();

});


function iniciarSkills(){

    barras.forEach(barra=>{

        const largura =
            barra.classList.contains("html") ? "95%" :
            barra.classList.contains("css") ? "90%" :
            barra.classList.contains("js") ? "92%" :
            barra.classList.contains("java") ? "62%" :
            barra.classList.contains("mysql") ? "87%" :
            barra.classList.contains("python") ? "77%" :
            barra.classList.contains("typescritpt") ? "85%" :
            "85%";

        barra.style.width = "0";

        setTimeout(()=>{

            barra.style.width = largura;

        },300);

    });

}

function escreverDialogo(texto){

    textoDialogo.innerHTML = "";

    let i = 0;

    const intervalo = setInterval(()=>{

        textoDialogo.innerHTML += texto.charAt(i);

        i++;

        if(i >= texto.length){

            clearInterval(intervalo);

            setTimeout(fecharDialogo,8000);

        }

    },25);

}

function abrirDialogo(){

    dialogo.style.display = "block";

    escreverDialogo(mensagemInicial);

}


function fecharDialogo(){

    dialogo.style.opacity = "0";

    setTimeout(()=>{

        dialogo.style.display = "none";

    },500);

}

s.setAttribute("data-trigger", "triggerId");
