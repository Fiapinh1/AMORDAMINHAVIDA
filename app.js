// ======= PERSONALIZE AQUI =======
const CONFIG = {
  nomeDela: "Vida", // troque pelo apelido

  // Fase 1: data do aniversário do relacionamento (aceita variações)
  aniversarioRelacionamento: "29/03/2024", // troque: "DD/MM/AAAA"

  // Fase 2
  petFofo: "Tony",

  // Fase 3
  viagemMarcante: "Caldas Novas",

  // Fase 4 (SALA) - item e código físico
  salaItem: "flores",
  codigoFlores: "FLOR-22", // escreva num papelzinho preso nas flores

  // Fase 5
  camisetaOdeia: "camiseta vermelha da maca", // a validação ignora acento
  // (se quiser ser mais curto: "camiseta vermelha")

  // Fase 6 (COZINHA) - chocolate + código físico
  codigoChocolate: "CHOCO-07", // escreva no bilhetinho junto do chocolate

  // Fase 7
  pedidoCasamento: "Paris",

  // Fase 8 (QUARTO DE HÓSPEDE) - cartinha + código físico
  codigoCartinha: "CARTA-LOVE",

  // Fase 9 (VÍDEO + QUARTO FINAL)
  videoSrc: "video.mp4", // coloque o arquivo no repo. Se for youtube, eu adapto.
  codigoFinal: "ABRE-QUARTO", // opcional: pode estar num bilhete na porta
};
// ================================

const $ = (s) => document.querySelector(s);

const titleEl = $("#title");
const descEl = $("#desc");
const contentEl = $("#content");
const msgEl = $("#msg");
const btnNext = $("#btnNext");
const btnBack = $("#btnBack");
const btnReset = $("#btnReset");
const barFill = $("#barFill");
const progressText = $("#progressText");
const btnHint = $("#btnHint");
const hintText = $("#hintText");

let state = loadState();
let hintShown = false;

function norm(s){
  return (s||"")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g," ");
}

function matchAny(input, options){
  const v = norm(input);
  return options.some(o => norm(o) === v);
}

function parseDateLoose(s){
  // aceita "12/06/2024", "12-06-2024", "12062024", "12 06 2024"
  const t = norm(s).replace(/[^\d]/g,"");
  if (t.length === 8) return `${t.slice(0,2)}/${t.slice(2,4)}/${t.slice(4,8)}`;
  return null;
}

const LEVELS = [
  {
    title: `Oii ${CONFIG.nomeDela} 💛`,
    desc: "Bem-vinda ao seu desafio! Passe pelas fases pra desbloquear o caminho até o seu presente.",
    hint: "Sem pressa. Se errar, só tenta de novo 😄",
    render(){
      contentEl.innerHTML = `
        <div class="choice selected" style="flex:1">
          <b>Regras rápidas:</b>
          <div class="small">
            • Você vai responder algumas perguntas.<br/>
            • Em algumas fases, você vai andar pela casa e encontrar coisas reais.<br/>
            • Quando encontrar, você vai digitar um <b>código</b> que está junto do item.<br/>
          </div>
        </div>
        <div class="small">Clique em <b>Continuar</b> quando estiver pronta ✨</div>
      `;
      btnBack.disabled = true;
      btnNext.disabled = false;
    },
    validate(){ return true; }
  },

  // 1) Aniversário relacionamento
  {
    title: "Fase 1 — Data especial 📅",
    desc: "Qual é o dia do nosso aniversário de namoro? (formato DD/MM/AAAA)",
    hint: "Pensa em uma data que você nunca esquece 😉",
    render(){
      contentEl.innerHTML = `
        <div class="row">
          <input id="ans1" class="input" placeholder="Ex: 12/06" autocomplete="off" />
        </div>
        <div class="small">Dica: pode digitar com /, - ou só números.</div>
      `;
      btnBack.disabled = false;
      $("#ans1").focus();
    },
    validate(){
      const raw = $("#ans1").value;
      const parsed = parseDateLoose(raw);
      if (parsed && parsed === CONFIG.aniversarioRelacionamento) return ok("Issooo! ✅");
      return err("Hmm… tenta de novo. Você sabe essa 😄");
    }
  },

  // 2) Pet Tony
  {
    title: "Fase 2 — O mais fofo e peludo 🐶",
    desc: "Qual é o nome do bichinho mais fofo e peludo?",
    hint: "Começa com T… 😄",
    render(){
      contentEl.innerHTML = `
        <div class="row">
          <input id="ans2" class="input" placeholder="Digite o nome..." autocomplete="off" />
        </div>
      `;
      $("#ans2").focus();
    },
    validate(){
      const v = $("#ans2").value;
      if (matchAny(v, [CONFIG.petFofo])) return ok("Acertei você sabia 😌✅");
      return err("Não foi… pensa no nosso fofinho 🐾");
    }
  },

  // 3) Viagem Caldas Novas com dicas
  {
    title: "Fase 3 — Viagem marcante ✈️",
    desc: "Qual foi a viagem a dois que marcou nosso relacionamento?",
    hint: "Água quentinha… descanso… 👀",
    render(){
      contentEl.innerHTML = `
        <div class="row">
          <input id="ans3" class="input" placeholder="Nome da cidade..." autocomplete="off" />
        </div>
        <div class="small">
          Pistas: tem clima de relax, piscina/água quente e foi “nossa cara”.
        </div>
      `;
      $("#ans3").focus();
    },
    validate(){
      const v = $("#ans3").value;
      if (matchAny(v, [CONFIG.viagemMarcante])) return ok("SIM! Essa mesmo 😍✅");
      return err("Quase… relembra a melhor viagem a dois 😄");
    }
  },

  // 4) Sala: flores + código
  {
    title: "Fase 4 — Missão na Sala 🛋️",
    desc: "Na sala tem algo te esperando. O que você vai encontrar?",
    hint: "É algo bonito e cheirosinho 🌸",
    render(){
      contentEl.innerHTML = `
        <div class="row">
          <input id="ans4" class="input" placeholder="Responda (uma palavra)..." autocomplete="off" />
        </div>
        <div class="small">
          Quando acertar, eu vou te mandar ir até a sala procurar de verdade 😄
        </div>
      `;
      $("#ans4").focus();
    },
    validate(){
      const v = $("#ans4").value;
      if (!matchAny(v, [CONFIG.salaItem, "flor", "flores"])) return err("Não… tenta de novo 👀");

      // acertou: pede ação real com código
      contentEl.innerHTML = `
        <div class="choice selected" style="flex:1">
          <b>Boa! Agora vai até a SALA.</b><br/><br/>
          Encontre as <b>${CONFIG.salaItem}</b> e procure um papelzinho com um código.
        </div>
        <div class="row" style="margin-top:12px">
          <input id="codeFlores" class="input" placeholder="Digite o código das flores..." autocomplete="off" />
        </div>
        <div class="small">Sem o código não vale 😄</div>
      `;
      $("#codeFlores").focus();

      // muda a validação deste nível “na prática”
      LEVELS[state.level].validate = () => {
        const code = $("#codeFlores")?.value || "";
        if (matchAny(code, [CONFIG.codigoFlores])) return ok("Perfeito! Próxima fase ✅");
        return err("Código errado… confere no papelzinho das flores 🙂");
      };

      ok("Vai lá na sala! 🌸");
      return false; // não avança ainda; precisa do código
    }
  },

  // 5) Camiseta vermelha da maçã
  {
    title: "Fase 5 — A camiseta 😅",
    desc: "Qual é a camiseta que você mais odeia quando eu uso?",
    hint: "Vermelha… e tem uma referência bem específica 🍎",
    render(){
      contentEl.innerHTML = `
        <div class="row">
          <input id="ans5" class="input" placeholder="Digite a resposta..." autocomplete="off" />
        </div>
        <div class="small">Vale escrever do seu jeito, eu entendo variações.</div>
      `;
      $("#ans5").focus();
    },
    validate(){
      const v = norm($("#ans5").value);
      const ok1 = v.includes("camiseta") && v.includes("vermelha") && (v.includes("maca") || v.includes("maça") || v.includes("apple"));
      if (ok1) return ok("HAHA sim… essa mesmo 😅✅");
      return err("Não foi… pensa na camiseta que te dá raiva só de ver 😂");
    }
  },

  // 6) Cozinha: chocolate + código
  {
    title: "Fase 6 — Missão na Cozinha 🍫",
    desc: "Agora você vai para a COZINHA e vai procurar o chocolate escondido.",
    hint: "Olha onde eu poderia esconder algo pequeno e gostoso 👀",
    render(){
      contentEl.innerHTML = `
        <div class="choice selected" style="flex:1">
          <b>Vai até a COZINHA.</b><br/><br/>
          Quando achar o chocolate, ele vai ter um papelzinho com um <b>código</b>.
        </div>
        <div class="row" style="margin-top:12px">
          <input id="codeChoco" class="input" placeholder="Digite o código do chocolate..." autocomplete="off" />
        </div>
        <div class="small">Dica: o código começa com <b>CHOCO</b>.</div>
      `;
      $("#codeChoco").focus();
    },
    validate(){
      const code = $("#codeChoco").value;
      if (matchAny(code, [CONFIG.codigoChocolate])) return ok("Boa! Você achou 😍🍫");
      return err("Ainda não… achou o papelzinho certo?");
    }
  },

  // 7) Paris torre eiffel
  {
    title: "Fase 7 — Sonho de pedido 💍",
    desc: "Onde a Tata quer que eu peça ela em casamento?",
    hint: "Um lugar clássico, romântico, e bem famoso ✨",
    render(){
      contentEl.innerHTML = `
        <div class="row">
          <input id="ans7" class="input" placeholder="Digite o lugar..." autocomplete="off" />
        </div>
        <div class="small">Pode escrever simples: cidade + ponto turístico.</div>
      `;
      $("#ans7").focus();
    },
    validate(){
      const v = norm($("#ans7").value);
      const ok2 = v.includes("paris") && (v.includes("eiffel") || v.includes("torre"));
      if (ok2) return ok("Isso! 🥹💛");
      return err("Hmm… pensa em um lugar bem ‘filme’ 😄");
    }
  },

  // 8) Quarto de hóspede: cartinha + código
  {
    title: "Fase 8 — Quarto de hóspede 💌",
    desc: "Vai até o QUARTO DE HÓSPEDE. Lá tem um presente: uma cartinha de amor.",
    hint: "Olha em lugares ‘óbvios de esconder bilhete’ 😄",
    render(){
      contentEl.innerHTML = `
        <div class="choice selected" style="flex:1">
          <b>Missão:</b> encontre a cartinha 💌<br/><br/>
          Ela tem um papelzinho com um código pra você digitar aqui.
        </div>
        <div class="row" style="margin-top:12px">
          <input id="codeCarta" class="input" placeholder="Digite o código da cartinha..." autocomplete="off" />
        </div>
      `;
      $("#codeCarta").focus();
    },
    validate(){
      const code = $("#codeCarta").value;
      if (matchAny(code, [CONFIG.codigoCartinha])) return ok("Aaaah 😍 Próxima!");
      return err("Código errado… confere no final da cartinha 🙂");
    }
  },

  // 9) Vídeo (libera depois de terminar)
  {
    title: "Fase Final — Antes do quarto 🎬",
    desc: "Antes de abrir o quarto… assista esse vídeo. Só depois ele vai liberar.",
    hint: "Quando o vídeo terminar, um botão aparece 😉",
    render(){
      contentEl.innerHTML = `
        <video id="vid" controls playsinline>
          <source src="${CONFIG.videoSrc}" type="video/mp4" />
          Seu navegador não conseguiu carregar o vídeo.
        </video>

        <div class="small" style="margin-top:10px">
          Quando terminar, você vai receber a liberação final.
        </div>

        <div id="unlockArea" style="margin-top:12px; display:none;">
          <div class="choice selected" style="flex:1">
            <b>Agora sim!</b> Você pode ir até o <b>QUARTO</b> 🎁<br/><br/>
            (Opcional) Se tiver um código final num bilhete na porta, digite aqui:
          </div>
          <div class="row" style="margin-top:12px">
            <input id="finalCode" class="input" placeholder="Digite o código final (opcional)..." autocomplete="off" />
          </div>
          <div class="small">Se você não quiser usar código final, pode deixar em branco.</div>
        </div>
      `;

      btnNext.textContent = "Liberar";
      btnBack.disabled = true;

      const vid = $("#vid");
      const unlock = $("#unlockArea");
      if (vid) {
        vid.addEventListener("ended", () => {
          unlock.style.display = "block";
          launchConfetti();
          ok("Vídeo finalizado! Agora pode liberar ✅");
        });
      }
    },
    validate(){
      const unlock = $("#unlockArea");
      if (!unlock || unlock.style.display === "none") {
        return err("Assista o vídeo até o fim pra liberar 🙂");
      }
      const code = ($("#finalCode")?.value || "").trim();
      if (!code) {
        ok("Liberado! Vai pro quarto agora 😍🎁");
        return true;
      }
      if (matchAny(code, [CONFIG.codigoFinal])) {
        ok("Perfeito! Agora pode abrir o quarto 🎁✅");
        return true;
      }
      return err("Código final errado… confere no bilhete/porta 🙂");
    }
  }
];

// ---------- UI + STATE ----------
function renderLevel(){
  const i = state.level;
  const total = LEVELS.length;

  const lvl = LEVELS[i];
  titleEl.textContent = lvl.title;
  descEl.textContent = lvl.desc;

  hintShown = false;
  hintText.textContent = "";

  msgEl.className = "msg";
  msgEl.textContent = "";

  progressText.textContent = `Fase ${i+1} de ${total}`;
  barFill.style.width = `${((i+1) / total) * 100}%`;

  btnBack.disabled = i === 0;
  btnNext.textContent = (i === total - 1) ? "Liberar" : "Continuar";

  lvl.render();
  saveState();
}

$("#btnNext").addEventListener("click", () => {
  const lvl = LEVELS[state.level];
  const okv = lvl.validate();
  if (okv === true) {
    if (state.level < LEVELS.length - 1) {
      state.level++;
      stopConfetti();
      renderLevel();
    } else {
      // fim real (se quiser, pode trocar para uma tela final)
      ok("Missão completa 💛");
    }
  }
});

$("#btnBack").addEventListener("click", () => {
  if (state.level > 0) {
    state.level--;
    stopConfetti();
    renderLevel();
  }
});

btnReset.addEventListener("click", () => {
  if (confirm("Quer recomeçar do zero?")) {
    state = { level: 0 };
    localStorage.removeItem("surpresa_state");
    stopConfetti();
    renderLevel();
  }
});

btnHint.addEventListener("click", () => {
  const lvl = LEVELS[state.level];
  hintShown = !hintShown;
  hintText.textContent = hintShown ? (lvl.hint || "") : "";
});

function ok(text){
  msgEl.textContent = text;
  msgEl.className = "msg ok";
  return true;
}
function err(text){
  msgEl.textContent = text;
  msgEl.className = "msg err";
  return false;
}

function saveState(){
  localStorage.setItem("surpresa_state", JSON.stringify(state));
}
function loadState(){
  try{
    const raw = localStorage.getItem("surpresa_state");
    if (!raw) return { level: 0 };
    const s = JSON.parse(raw);
    if (typeof s.level !== "number") return { level: 0 };
    return { level: Math.max(0, Math.min(s.level, LEVELS.length-1)) };
  } catch {
    return { level: 0 };
  }
}

// ---------- CONFETTI ----------
const canvas = $("#confetti");
const ctx = canvas.getContext("2d");
let confettiId = null;
let particles = [];

function resizeCanvas(){
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti(){
  stopConfetti();
  particles = Array.from({length: 180}, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.3,
    r: 3 + Math.random() * 5,
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 5,
    rot: Math.random() * Math.PI,
    vr: -0.1 + Math.random() * 0.2,
    c: pick(["#ffd36a","#ff7bd8","#6dffb2","#b8bde6"])
  }));
  tick();
}
function tick(){
  confettiId = requestAnimationFrame(tick);
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.03;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.1);
    ctx.restore();
  });
  particles = particles.filter(p => p.y < window.innerHeight + 40);
  if (particles.length === 0) stopConfetti();
}
function stopConfetti(){
  if (confettiId) cancelAnimationFrame(confettiId);
  confettiId = null;
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
}
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

// start
renderLevel();

