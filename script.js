"use strict";

// HTML öğelerini seç
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const currentYear = document.getElementById("currentYear");

// Güncel yılı otomatik göster
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Mobil menüyü aç ve kapat
if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Menüyü kapat" : "Menüyü aç"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    // Menü bağlantısına tıklanınca menüyü kapat
    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Menüyü aç");
            menuToggle.textContent = "☰";
        });
    });
}

// Sayfa yüklendiğinde konsola bilgi yaz
console.log("Göz doktoru web sitesi hazır.");