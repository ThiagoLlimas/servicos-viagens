/**
 * LGPD Cookie Consent Banner com Google Tag Manager
 * Gerencia o consentimento de cookies conforme Lei Geral de Proteção de Dados
 * Integra com Google Tag Manager para rastreamento
 */

class CookieConsent {
  constructor() {
    this.consentKey = "cookie_consent";
    this.analyticsKey = "analytics_consent";
    this.gtmId = "GTM-W364ZSX3"; // Substitua pelo ID real do GTM
    this.init();
  }

  init() {
    // Verifica se o usuário já deu consentimento
    const consent = this.getCookie(this.consentKey);

    if (consent === "accepted") {
      // Se já aceitou, carrega o GTM imediatamente
      this.loadGTM();
    } else if (consent === "rejected") {
      // Se rejeitou, não carrega GTM
      console.log("Consentimento de cookies rejeitado anteriormente");
    } else {
      // Se não há consentimento, mostra o banner
      this.createBanner();
    }
  }

  createBanner() {
    // Cria o elemento do banner
    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-message">
                    <h3>🍪 Privacidade e Cookies</h3>
                    <p>Usamos cookies para personalizar sua experiência e analisar o tráfego do site. 
                    Ao continuar, você concorda com nossa <a href="#" onclick="window.open('#', '_blank'); return false;">Política de Privacidade</a> 
                    e o uso de cookies conforme a LGPD.</p>
                </div>
                <div class="cookie-buttons">
                    <button id="cookie-accept" class="cookie-btn cookie-btn-accept">
                        Aceitar Todos
                    </button>
                    <button id="cookie-reject" class="cookie-btn cookie-btn-reject">
                        Recusar Não Essenciais
                    </button>
                </div>
            </div>
        `;

    // Adiciona estilos inline para o banner
    const style = document.createElement("style");
    style.textContent = `
            #cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                border-top: 1px solid #333;
                color: #ffffff;
                padding: 20px;
                z-index: 10000;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.8);
                font-family: 'Montserrat', sans-serif;
                animation: slideUp 0.5s ease-out;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .cookie-banner-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
                align-items: center;
                text-align: center;
            }

            .cookie-message h3 {
                margin: 0 0 10px 0;
                font-size: 1.2rem;
                color: #2ed3f6;
                font-weight: 600;
            }

            .cookie-message p {
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.5;
                color: #ccc;
                max-width: 800px;
            }

            .cookie-message a {
                color: #2ed3f6;
                text-decoration: none;
                border-bottom: 1px solid #2ed3f6;
                transition: all 0.3s ease;
            }

            .cookie-message a:hover {
                color: #ffffff;
                border-bottom-color: #ffffff;
            }

            .cookie-buttons {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                justify-content: center;
            }

            .cookie-btn {
                padding: 12px 24px;
                border: 1px solid #2ed3f6;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 600;
                text-transform: uppercase;
                transition: all 0.3s ease;
                font-family: 'Montserrat', sans-serif;
                min-width: 150px;
            }

            .cookie-btn-accept {
                background-color: #2ed3f6;
                color: #000000;
            }

            .cookie-btn-accept:hover {
                background-color: #000000;
                color: #2ed3f6;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(46, 211, 246, 0.3);
            }

            .cookie-btn-reject {
                background-color: transparent;
                color: #2ed3f6;
            }

            .cookie-btn-reject:hover {
                background-color: #2ed3f6;
                color: #000000;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(46, 211, 246, 0.3);
            }

            /* Responsivo */
            @media (max-width: 768px) {
                .cookie-banner-content {
                    padding: 0 20px;
                }

                .cookie-message h3 {
                    font-size: 1.1rem;
                }

                .cookie-message p {
                    font-size: 0.85rem;
                }

                .cookie-buttons {
                    flex-direction: column;
                    width: 100%;
                    max-width: 300px;
                }

                .cookie-btn {
                    width: 100%;
                }
            }
        `;

    // Adiciona o banner e estilos ao DOM
    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Adiciona os event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    const acceptBtn = document.getElementById("cookie-accept");
    const rejectBtn = document.getElementById("cookie-reject");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => this.acceptCookies());
    }

    if (rejectBtn) {
      rejectBtn.addEventListener("click", () => this.rejectCookies());
    }
  }

  acceptCookies() {
    // Salva consentimento por 1 ano
    this.setCookie(this.consentKey, "accepted", 365);
    this.setCookie(this.analyticsKey, "granted", 365);

    // Remove o banner
    this.removeBanner();

    // Carrega o Google Tag Manager
    this.loadGTM();

    // Dispara evento personalizado
    this.dispatchConsentEvent("accepted");

    console.log("Consentimento de cookies aceito. GTM carregado.");
  }

  rejectCookies() {
    // Salva rejeição por 6 meses
    this.setCookie(this.consentKey, "rejected", 180);
    this.setCookie(this.analyticsKey, "denied", 180);

    // Remove o banner
    this.removeBanner();

    // Garante que GTM não será carregado
    console.log("Consentimento de cookies rejeitado. GTM não será carregado.");

    // Dispara evento personalizado
    this.dispatchConsentEvent("rejected");
  }

  loadGTM() {
    // =============================================
    // ATENÇÃO: Carrega Google Tag Manager dinamicamente
    // Substitua GTM-XXXXXXX pelo seu ID real no script abaixo
    // =============================================

    // Verifica se o GTM já foi carregado
    if (window.google_tag_manager) {
      console.log("GTM já está carregado.");
      return;
    }

    // Carrega o script do GTM
    const gtmScript = document.createElement("script");
    gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${this.gtmId}');`;

    document.head.appendChild(gtmScript);

    // Adiciona o noscript do GTM ao body
    const noscript = document.createElement("noscript");
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${this.gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);

    console.log(`Google Tag Manager ${this.gtmId} carregado com sucesso.`);
  }

  removeBanner() {
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.style.animation = "slideDown 0.5s ease-out";
      setTimeout(() => {
        banner.remove();
      }, 500);
    }
  }

  dispatchConsentEvent(consent) {
    const event = new CustomEvent("cookieConsent", {
      detail: { consent: consent },
    });
    document.dispatchEvent(event);
  }

  // Métodos utilitários para cookies
  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie =
      name + "=" + value + ";" + expires + ";path=/;SameSite=Strict";
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  deleteCookie(name) {
    document.cookie =
      name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict";
  }

  // Método público para verificar consentimento
  hasAnalyticsConsent() {
    return this.getCookie(this.analyticsKey) === "granted";
  }

  // Método público para resetar consentimento
  resetConsent() {
    this.deleteCookie(this.consentKey);
    this.deleteCookie(this.analyticsKey);
    location.reload();
  }
}

// Adiciona animação de slide down para remoção do banner
const additionalStyle = document.createElement("style");
additionalStyle.textContent = `
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(additionalStyle);

// Inicializa o sistema quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  window.cookieConsent = new CookieConsent();
});

// Disponibiliza globalmente para uso em outros scripts
window.CookieConsent = CookieConsent;
