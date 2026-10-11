"use strict";

// Açık ve koyu tema arasında geçiş
const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", function () {
    const isLight = document.body.classList.toggle("light-theme");

    themeButton.textContent = isLight ? "🌙" : "☀️";

    themeButton.setAttribute(
        "aria-label",
        isLight ? "Koyu temaya geç" : "Açık temaya geç"
    );
});

// Güncel yılı otomatik yazdır
const yearElement = document.getElementById("year");

yearElement.textContent = new Date().getFullYear();

// Konsola bilgi yazdır
console.log("Web sitesi başarıyla yüklendi!");