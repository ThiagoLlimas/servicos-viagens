/* ==========================================
   1. FORMULÁRIO DE CONTATO
   ========================================== */
const form = document.getElementById("contact-form");

if (form) {
  async function handleSubmit(event) {
    event.preventDefault();
    const status = document.getElementById("status-envio");
    const data = new FormData(event.target);

    // Validação de nome (Aceita name="nome" ou name="name")
    const nomeDigitado = data.get("nome") || data.get("name") || "";
    const contemNumero = /\d/.test(nomeDigitado);

    if (contemNumero) {
      status.innerHTML = "Por favor, insira um nome válido (sem números).";
      status.className = "erro";
      status.style.display = "block";
      return;
    }

    if (data.has("telephone") || data.has("telefone")) {
      const telefoneDigitado =
        data.get("telephone") || data.get("telefone") || "";

      if (telefoneDigitado.length < 14) {
        status.innerHTML = "Por favor, insira um telefone válido com DDD.";
        status.className = "erro";
        status.style.display = "block";
        return;
      }
    }

    status.className = "";
    status.innerHTML = "Enviando...";

    console.log("Enviando para o Formspree: ", event.target.action);

    // O envio real para o Formspree
    fetch(event.target.action, {
      method: form.method || "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          status.innerHTML =
            "Mensagem enviada com sucesso! Logo entraremos em contato.";
          status.className = "sucesso";
          form.reset();
        } else {
          response.json().then((data) => {
            if (Object.hasOwn(data, "errors")) {
              status.innerHTML =
                "Erro no preenchimento. Verifique seu e-mail e tente novamente.";
            } else {
              status.innerHTML = "Ops! Ocorreu um erro técnico com o servidor.";
            }
            status.className = "erro";
          });
        }
      })
      .catch((error) => {
        console.error("Erro no Fetch: ", error);
        status.innerHTML =
          "Sem conexão ou erro de bloqueio. Verifique sua internet.";
        status.className = "erro";
      });
  }

  form.addEventListener("submit", handleSubmit);
}

/* ==========================================
   2. MÁSCARA DO TELEFONE (À Prova de Balas)
   ========================================== */
// Tenta achar o input pelo ID em inglês ou em português
const inputTelefone =
  document.getElementById("telephone") || document.getElementById("telefone");

if (inputTelefone) {
  inputTelefone.addEventListener("input", function (e) {
    // Remove tudo o que NÃO for número na mesma hora (bloqueia letras)
    let valor = e.target.value.replace(/\D/g, "");

    // Formata o número com parênteses e traço: (XX) XXXXX-XXXX
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");

    // Devolve o valor limpo e formatado para o input
    e.target.value = valor;
  });
}

/* ==========================================
   3. CARROSSEL DE IMAGENS (Agora solto e global!)
   ========================================== */

const bancoDeImagens = {
  expedicao1: [
    "assets/img/img-centro-exp.jpg",
    "assets/img/carrossel1-img2.webp",
    "assets/img/carrossel1-img3.webp",
    "assets/img/carrossel1-img4.webp",
    "assets/img/carrossel1-img5.webp",
  ],
  expedicao2: [
    "assets/img/img-centro-exp2.jpg",
    "assets/img/carrossel2-img2.webp",
    "assets/img/carrossel2-img3.webp",
    "assets/img/carrossel2-img4.webp",
    "assets/img/carrossel2-img5.webp", // Pode ter quantas fotos quiser!
  ],
  expedicao3: [
    "assets/img/img-centro-exp3.jpg",
    "assets/img/carrossel3-img2.webp",
    "assets/img/carrossel3-img3.webp",
    "assets/img/carrossel3-img4.webp",
    "assets/img/carrossel3-img5.webp",
  ],
};

let indiceAtual = 0;

function mudarImagem(direcao) {
  // Pega o container inteiro e a imagem
  const containerGaleria = document.getElementById("galeria-expedicao");
  const imgElement = document.getElementById("imagem-carrossel");

  // Se não existir carrossel na página, para o código aqui
  if (!containerGaleria || !imgElement) return;

  // Lê o "crachá" que colocamos no HTML (ex: "expedicao1")
  const qualExpedicao = containerGaleria.getAttribute("data-expedicao");

  // Puxa do nosso gaveteiro APENAS a lista de fotos da página atual
  const imagensGaleria = bancoDeImagens[qualExpedicao];

  // Se por acaso esquecer de cadastrar as fotos, para o código
  if (!imagensGaleria) return;

  // --- A Mágica da Troca (Mesmo código que você já validou) ---
  imgElement.classList.add("fade-out");

  setTimeout(() => {
    indiceAtual += direcao;

    if (indiceAtual >= imagensGaleria.length) {
      indiceAtual = 0;
    } else if (indiceAtual < 0) {
      indiceAtual = imagensGaleria.length - 1;
    }

    imgElement.src = imagensGaleria[indiceAtual];
    imgElement.classList.remove("fade-out");
  }, 300);
}
