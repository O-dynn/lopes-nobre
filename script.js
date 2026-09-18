const body = document.body,
    header = document.getElementById("header"),
    progress = document.getElementById("progress");

const menu = document.getElementById("menu"),
    mobile = document.getElementById("mobile");

menu.onclick = () => {
    const o = mobile.classList.toggle("open");
    menu.classList.toggle("open", o);
    body.classList.toggle("lock", o);
};

mobile.querySelectorAll("a").forEach(a =>
    a.onclick = () => {
        mobile.classList.remove("open");
        menu.classList.remove("open");
        body.classList.remove("lock");
    }
);

const obs = new IntersectionObserver(
    es => es.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
        }
    }),
    { threshold: .1 }
);

document.querySelectorAll(".reveal").forEach(e => obs.observe(e));

function scrollUI() {
    const h = document.documentElement.scrollHeight - innerHeight;

    progress.style.width = (h ? scrollY / h * 100 : 0) + "%";
    header.classList.toggle("scrolled", scrollY > 25);
}

addEventListener("scroll", scrollUI, { passive: true });
scrollUI();


/* =====================================================
   LIGHTBOX DAS IMAGENS
===================================================== */

const items = [...document.querySelectorAll("[data-img]")],
    lb = document.getElementById("lightbox"),
    li = document.getElementById("lightImg"),
    cap = document.getElementById("caption");

let idx = 0;

function show(i) {
    idx = i;

    li.src = items[i].dataset.img;
    li.alt = items[i].dataset.cap;
    cap.textContent = items[i].dataset.cap;

    lb.classList.add("open");
    body.classList.add("lock");
}

function hide() {
    lb.classList.remove("open");
    body.classList.remove("lock");

    setTimeout(() => {
        if (!lb.classList.contains("open")) {
            li.src = "";
        }
    }, 250);
}

items.forEach((x, i) => x.onclick = () => show(i));

document.getElementById("closeLight").onclick = hide;

document.getElementById("prev").onclick = () =>
    show((idx - 1 + items.length) % items.length);

document.getElementById("next").onclick = () =>
    show((idx + 1) % items.length);

lb.onclick = e => {
    if (e.target === lb) hide();
};


/* =====================================================
   MODAL DE VÍDEO
===================================================== */

const videoModal = document.getElementById("videoModal"),
    eventVideo = document.getElementById("eventVideo"),
    openVideoButton = document.getElementById("openVideo"),
    videoPreview = document.getElementById("videoPreview"),
    closeVideoButton = document.getElementById("closeVideo");

function openVideo() {
    videoModal.classList.add("open");
    body.classList.add("lock");

    eventVideo.play().catch(() => {
        // Caso o navegador bloqueie a reprodução automática,
        // o usuário ainda poderá iniciar pelo controle do vídeo.
    });
}

function closeVideo() {
    videoModal.classList.remove("open");
    body.classList.remove("lock");

    eventVideo.pause();
    eventVideo.currentTime = 0;
}

openVideoButton.onclick = openVideo;
videoPreview.onclick = openVideo;
closeVideoButton.onclick = closeVideo;


/* Fecha o vídeo ao clicar fora dele */

videoModal.onclick = e => {
    if (e.target === videoModal) {
        closeVideo();
    }
};


/* =====================================================
   CONTROLES PELO TECLADO
===================================================== */

addEventListener("keydown", e => {

    if (e.key === "Escape") {

        if (lb.classList.contains("open")) {
            hide();
        }

        if (videoModal.classList.contains("open")) {
            closeVideo();
        }
    }

    if (lb.classList.contains("open") && e.key === "ArrowRight") {
        show((idx + 1) % items.length);
    }

    if (lb.classList.contains("open") && e.key === "ArrowLeft") {
        show((idx - 1 + items.length) % items.length);
    }

});