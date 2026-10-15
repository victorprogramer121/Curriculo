const loading = document.getElementById("loading");
const loadingProgress = document.querySelector(".loading-progress");

const dialogo = document.getElementById("dialogo");
const textoDialogo = document.getElementById("textoDialogo");

const avatar = document.getElementById("avatar3d");

const barras = document.querySelectorAll(".progresso");

const mensagemInicial =
"Olá! Seja bem-vindo ao meu espaço. Aqui você encontrará um pouco da minha trajetória, tecnologias que utilizo e alguns projetos desenvolvidos por mim. Espero que goste!";

let loadingEncerrado = false;

// Tempo máximo de espera apenas para o caso do <model-viewer> nem chegar a existir
// (ex.: biblioteca bloqueada ou CDN fora do ar). Se ele existir, o loading espera o .glb.
const TEMPO_MAX_BIBLIOTECA = 15000;


// ---------- LOADING: só sai quando o modelo 3D (arquivo principal) terminar de carregar ----------

function atualizarProgresso(porcentagem){
    loadingProgress.style.width = Math.round(porcentagem * 100) + "%";
}

// Barra acompanha o download real do .glb
avatar.addEventListener("progress", (evento) => {
    // Nunca chega a 100% antes do evento "load" (a barra só completa quando o modelo está pronto)
    atualizarProgresso(Math.min(evento.detail.totalProgress, 0.99));
});

const modeloPronto = new Promise((resolve) => {

    // Caso o modelo já tenha carregado antes de este script rodar
    if (avatar.loaded) {
        resolve();
        return;
    }

    avatar.addEventListener("load", resolve, { once: true });

    // Se o .glb falhar, não deixa o visitante preso na tela de carregamento
    avatar.addEventListener("error", (evento) => {
        console.error("Erro ao carregar o modelo 3D:", evento.detail);
        resolve();
    }, { once: true });

    // <model-viewer> não existe (biblioteca não carregou)
    Promise.race([
        customElements.whenDefined("model-viewer"),
        new Promise((_, rejeitar) => setTimeout(rejeitar, TEMPO_MAX_BIBLIOTECA))
    ]).catch(() => {
        console.error("model-viewer não carregou.");
        resolve();
    });

});

// Também espera as fontes, para o texto não "pular" quando o loading sumir
const fontesProntas = (document.fonts && document.fonts.ready)
    ? document.fonts.ready.catch(() => {})
    : Promise.resolve();

Promise.all([modeloPronto, fontesProntas]).then(terminarLoading);


function terminarLoading(){

    if (loadingEncerrado) return;
    loadingEncerrado = true;

    atualizarProgresso(1);

    setTimeout(()=>{

        loading.style.opacity = "0";

        setTimeout(()=>{

            loading.style.display = "none";

            const botaoVoz = document.querySelector(".voz");
            const widget = document.querySelector(".widget");

            if (botaoVoz) {
                botaoVoz.style.opacity = "1";
                botaoVoz.style.pointerEvents = "auto";
            }

            if (widget) {
                widget.style.opacity = "1";
                widget.style.pointerEvents = "auto";
            }

            abrirDialogo();

            iniciarSkills();

            iniciarVideos();

        },700);

    },300);

}


// ---------- VÍDEOS: só começam a baixar depois do loading, e só tocam quando visíveis ----------

function iniciarVideos(){

    const videos = document.querySelectorAll(".project-card video");

    if (!("IntersectionObserver" in window)) {
        videos.forEach(video => video.play().catch(() => {}));
        return;
    }

    const observador = new IntersectionObserver((entradas) => {

        entradas.forEach(entrada => {

            if (entrada.isIntersecting) {
                entrada.target.play().catch(() => {});
            } else {
                entrada.target.pause();
            }

        });

    }, { threshold: 0.25 });

    videos.forEach(video => observador.observe(video));

}


function iniciarSkills(){

    barras.forEach(barra=>{

        const largura =
            barra.classList.contains("html") ? "95%" :
            barra.classList.contains("css") ? "90%" :
            barra.classList.contains("js") ? "92%" :
            barra.classList.contains("java") ? "62%" :
            barra.classList.contains("mysql") ? "87%" :
            barra.classList.contains("python") ? "77%" :
            barra.classList.contains("typescript") ? "85%" :
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

            setTimeout(fecharDialogo,20000);

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