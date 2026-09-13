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

document.addEventListener("DOMContentLoaded", () => {

    try {

        let vozAtivada = false;
        const sintetizador = window.speechSynthesis;
        let vozPortugues = null;

        if (!sintetizador) return;

        function carregarVozes() {
            const vozes = sintetizador.getVoices();
            vozPortugues =
                vozes.find(v => v.lang === "pt-BR") ||
                vozes.find(v => v.lang.startsWith("pt")) ||
                null;
        }
        carregarVozes();
        if (sintetizador.onvoiceschanged !== undefined) {
            sintetizador.onvoiceschanged = carregarVozes;
        }

        function falar(texto) {
            if (!vozAtivada || !texto) return;
            sintetizador.cancel();
            const fala = new SpeechSynthesisUtterance(texto);
            fala.lang = "pt-BR";
            if (vozPortugues) fala.voice = vozPortugues;
            fala.rate = 1;
            fala.pitch = 1;
            fala.volume = 1;
            sintetizador.speak(fala);
        }

        const btnAcessibilidade = document.getElementById("triggerId");
        const a11yStatus = document.getElementById("a11yStatus");

        if (!btnAcessibilidade) return;

        function alternarVoz() {
            vozAtivada = !vozAtivada;

            btnAcessibilidade.classList.toggle("is-active", vozAtivada);
            btnAcessibilidade.setAttribute("aria-pressed", String(vozAtivada));
            btnAcessibilidade.setAttribute(
                "aria-label",
                vozAtivada ? "Desativar leitura por voz" : "Ativar leitura por voz"
            );


            if (vozAtivada) {
                falar("Acessibilidade ativada. Passe o mouse pelos elementos para ouvir a descrição.");
            } else {
                sintetizador.cancel();
            }
        }

        btnAcessibilidade.addEventListener("click", alternarVoz);

        document.addEventListener("keydown", (e) => {
            if (document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
            if (e.key.toLowerCase() === "v") alternarVoz();
        });

        document.addEventListener("mouseover", (event) => {
            const elemento = event.target.closest(".tts-trigger");
            if (!elemento || !vozAtivada) return;
            if (elemento._ttsHover) return;
            elemento._ttsHover = true;
            falar(elemento.getAttribute("data-tts"));
        });

        document.addEventListener("mouseout", (event) => {
            const elemento = event.target.closest(".tts-trigger");
            if (!elemento) return;
            if (elemento.contains(event.relatedTarget)) return;
            elemento._ttsHover = false;
        });

        document.addEventListener("focusin", (event) => {
            const elemento = event.target.closest(".tts-trigger");
            if (elemento) falar(elemento.getAttribute("data-tts"));
        });

        document.addEventListener("click", (event) => {
            const elemento = event.target.closest(".tts-trigger");
            if (elemento && elemento !== btnAcessibilidade) falar(elemento.getAttribute("data-tts"));
        });

    } catch (err) {
        console.error("Erro ao iniciar acessibilidade por voz:", err);
    }

});