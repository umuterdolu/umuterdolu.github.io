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

/* =========================
   GÖZ SAĞLIĞI CHATBOT MANTIĞI
========================= */

const chatbotLauncher = document.getElementById("chatbotLauncher");
const chatbotPanel = document.getElementById("chatbotPanel");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotMessages = document.getElementById("chatbotMessages");
const chatbotForm = document.getElementById("chatbotForm");
const chatbotInput = document.getElementById("chatbotInput");

// Sohbet penceresini aç ve kapat
function setChatbotOpen(open) {
    chatbotPanel.hidden = !open;
    chatbotPanel.setAttribute("aria-hidden", String(!open));
    chatbotLauncher.setAttribute("aria-expanded", String(open));

    if (open) {
        chatbotInput.focus();
    } else {
        chatbotLauncher.focus();
    }
}

chatbotLauncher.addEventListener("click", () => {
    setChatbotOpen(chatbotPanel.hidden);
});

chatbotClose.addEventListener("click", () => {
    setChatbotOpen(false);
});

// Mesaj balonu oluştur
function addChatMessage(text, sender = "bot") {
    const message = document.createElement("div");

    message.className =
        "chat-message " +
        (sender === "user" ? "user-message" : "bot-message");

    // Kullanıcı mesajları HTML olarak çalıştırılmaz.
    message.textContent = text;

    chatbotMessages.appendChild(message);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    return message;
}

// Türkçe karakterleri arama için normalize et
function normalizeText(text) {
    return text
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ı/g, "i")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// Birden fazla belirti grubunu kontrol et
function containsAny(text, phrases) {
    return phrases.some(phrase => text.includes(phrase));
}

// Belirtilere göre güvenli yönlendirme oluştur.
// Bu kurallar teşhis koymaz ve tedavi belirlemez.
function getEyeGuidance(input) {
    const text = normalizeText(input);

    const chemicalExposure = containsAny(text, [
        "gozume kimyasal",
        "gozume camasir suyu",
        "gozume deterjan",
        "gozume asit",
        "kimyasal madde",
        "kimyasal sicradi",
        "gozume temizlik urunu",
        "gozume sampuan"
    ]);

    const suddenVisionLoss = containsAny(text, [
        "ani gorme kaybi",
        "aniden goremem",
        "birden goremem",
        "aniden gormem azaldi",
        "birden gormem azaldi",
        "gozum gormuyor",
        "gorme kaybi",
        "gorme kaybettim"
    ]);

    const severePain = containsAny(text, [
        "cok siddetli agri",
        "siddetli goz agrisi",
        "dayanilmaz agri",
        "gozumde dayanilmaz agri",
        "gozum cok agriyor"
    ]);

    const injury = containsAny(text, [
        "gozume darbe",
        "gozume bir sey saplandi",
        "gozume metal kacti",
        "gozume cam kacti",
        "gozume delici cisim",
        "gozum delindi",
        "gozum yaralandi",
        "gozume sert cisim"
    ]);

    const flashesOrCurtain = containsAny(text, [
        "isik cakmasi",
        "isik cakmalari",
        "perde inmesi",
        "gozumun onune perde",
        "ani ucusan cisimler",
        "ucusan noktalar",
        "aniden cogu siyah nokta",
        "goruntude perde"
    ]);

    const emergencyKeywords = containsAny(text, [
        "acil bir belirtim var",
        "acil durum var",
        "ani gorme kaybi",
        "aniden goremem",
        "birden goremem",
        "gorme kaybi",
        "gozum gormuyor",
        "gozume kimyasal",
        "kimyasal madde",
        "gozume darbe",
        "gozum delindi",
        "gozume bir sey saplandi"
    ]);

    // Kimyasal temas: ilk yardım geciktirilmemeli.
    if (chemicalExposure) {
        return {
            urgent: true,
            message:
                "Gözünüze kimyasal madde temas ettiyse hemen gözünüzü " +
                "bol, temiz, ılık olmayan akan suyla kesintisiz " +
                "en az 20 dakika yıkamaya başlayın. Yardım almak için " +
                "yıkamayı geciktirmeyin. Gözü ovalamayın ve maddenin " +
                "etkisini başka bir kimyasalla gidermeye çalışmayın. " +
                "Acil tıbbi değerlendirme alın; Türkiye'de 112'yi " +
                "arayabilir veya acil servise başvurabilirsiniz."
        };
    }

    // Ani görme kaybı ve ciddi yaralanmalar
    if (
        suddenVisionLoss ||
        severePain ||
        injury ||
        flashesOrCurtain ||
        emergencyKeywords
    ) {
        return {
            urgent: true,
            message:
                "Anlattığınız durum acil değerlendirme gerektirebilir. " +
                "Chatbot üzerinden değerlendirme beklemeyin; şimdi " +
                "acil servise başvurun veya durumunuza göre 112'yi " +
                "arayın. Göze saplanan bir cismi çıkarmaya, göze " +
                "baskı uygulamaya ya da gözü ovalamaya çalışmayın."
        };
    }

    const pain = containsAny(text, [
        "gozum agriyor",
        "goz agrisi",
        "agri var",
        "agrim var"
    ]);

    const redness = containsAny(text, [
        "gozum kizarik",
        "gozum kizardi",
        "kizariklik",
        "gozum kizar",
        "gozlerim kizarik"
    ]);

    const itching = containsAny(text, [
        "kasiniyor",
        "kasinti",
        "gozum kasiniyor"
    ]);

    const blurryVision = containsAny(text, [
        "bulanık",
        "bulanık goruyorum",
        "bulanık gorme",
        "bulanık gorus",
        "net goremiyorum",
        "bulanik",
        "net degil"
    ]);

    const discharge = containsAny(text, [
        "capak",
        "capaklanma",
        "gozum akiyor",
        "goz akintisi",
        "irin"
    ]);

    const lightSensitivity = containsAny(text, [
        "isiga hassas",
        "isik rahatsiz ediyor",
        "isiktan rahatsiz",
        "isik hassasiyeti"
    ]);

    const contactLens = containsAny(text, [
        "kontakt lens",
        "kontak lens",
        "lens kullaniyorum",
        "lens takiyorum"
    ]);

    if (pain && (redness || lightSensitivity)) {
        return {
            urgent: true,
            message:
                "Göz ağrısına kızarıklık veya ışığa hassasiyetin " +
                "eşlik etmesi gecikmeden değerlendirilmelidir. " +
                "Bugün bir göz hekimine veya uygun sağlık kuruluşuna " +
                "başvurun. Ağrı şiddetliyse ya da görmeniz azaldıysa " +
                "acil servise gidin."
        };
    }

    if (contactLens && (pain || redness || blurryVision)) {
        return {
            urgent: true,
            message:
                "Kontakt lens kullanırken ağrı, kızarıklık veya " +
                "bulanık görme önemli olabilir. Lensi çıkarabiliyorsanız " +
                "çıkarın ve yeniden takmayın. Bugün acil göz " +
                "değerlendirmesi alın. Şiddetli ağrı veya görme kaybı " +
                "varsa doğrudan acil servise başvurun."
        };
    }

    if (blurryVision) {
        return {
            urgent: false,
            message:
                "Bulanık görmenin farklı nedenleri olabilir; yalnızca " +
                "bu mesajla nedenini belirlemek mümkün değildir. Yeni " +
                "başladıysa veya devam ediyorsa gecikmeden göz hekimine " +
                "başvurun. Ani görme değişikliği varsa acil servise " +
                "gidin. Diğer durumlarda muayene randevusu alın."
        };
    }

    if (redness || itching || discharge) {
        return {
            urgent: false,
            message:
                "Kızarıklık, kaşıntı veya akıntının farklı nedenleri " +
                "olabilir. Şikâyetinizin nedenini belirlemek için " +
                "göz hekimi değerlendirmesi uygun olur. Gözünüzü " +
                "ovalamayın; doktor önerisi olmadan ilaçlı damla " +
                "kullanmayın. Ağrı, ışığa hassasiyet veya görme " +
                "değişikliği gelişirse gecikmeden tıbbi yardım alın."
        };
    }

    if (pain) {
        return {
            urgent: false,
            message:
                "Göz ağrısının nedeni bu sohbetle belirlenemez. " +
                "Yeni başlayan veya devam eden ağrı için aynı gün " +
                "sağlık değerlendirmesi almanız uygun olur. Şiddetli " +
                "ağrı veya görme değişikliği varsa acil servise gidin."
        };
    }

    return {
        urgent: false,
        message:
            "Şikâyetinizi yalnızca bu mesajla değerlendirmek mümkün " +
            "değil. Belirtilerinizin süresi ve eşlik eden bulgular " +
            "önemlidir. Göz doktorundan muayene randevusu almanızı " +
            "öneririm. Ani görme kaybı, şiddetli ağrı, yeni ışık " +
            "çakmaları veya kimyasal temas varsa acil yardım alın."
    };
}

// Kullanıcı mesajını değerlendir
function handleChatMessage(rawMessage) {
    const message = rawMessage.trim();

    if (!message) return;

    addChatMessage(message, "user");

    const result = getEyeGuidance(message);

    const response = addChatMessage(result.message, "bot");

    if (result.urgent) {
        response.style.borderLeft = "4px solid #c0392b";
    }

    // Doktora iletişim için bölüm bağlantısı
    const contactLink = document.createElement("a");
    contactLink.href = "#iletisim";
    contactLink.className = "text-link";
    contactLink.textContent = "İletişim bilgilerini görüntüle →";

    chatbotMessages.appendChild(contactLink);

    contactLink.addEventListener("click", () => {
        setChatbotOpen(false);
    });

    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Form gönderimi
chatbotForm.addEventListener("submit", event => {
    event.preventDefault();

    const message = chatbotInput.value.trim();

    if (!message) return;

    handleChatMessage(message);
    chatbotInput.value = "";
});

// Hazır yanıt butonları
chatbotMessages.addEventListener("click", event => {
    const button = event.target.closest("[data-message]");

    if (!button) return;

    const message = button.dataset.message;

    button.parentElement.remove();
    handleChatMessage(message);
});

// ESC tuşuyla sohbeti kapat
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !chatbotPanel.hidden) {
        setChatbotOpen(false);
    }
});