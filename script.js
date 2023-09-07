const titulo = document.querySelector(".titulo");
const screen = document.querySelectorAll(".campo-de-escrita");
const spiral = document.querySelector(".area-de-carregamento");
const PALAVRA_DO_DIA_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDAÇÃO_DA_PALAVRA = "https://words.dev-apis.com/validate-word";
let divAtual = 0;
let letraAtual = 0;
let ouvirEventos = true;

async function verificarPalavra(palavra) {
  spiral.style.visibility = "visible";
  const onePromise = await fetch(VALIDAÇÃO_DA_PALAVRA, {
    method: "POST",
    body: JSON.stringify({"word": palavra})
  });
  const processadoOnePromise = await onePromise.json();
  const promise = await fetch(PALAVRA_DO_DIA_URL);
  const processadoPromise = await promise.json();
  let letraAtual = 0;
  let letrasRepetidas = new Set();
  console.log(processadoOnePromise.validWord)

  if (processadoOnePromise.validWord === true) {
    for (let verificadorDaLetra = divAtual - 4; verificadorDaLetra <= divAtual; verificadorDaLetra++) {
      const letraPalavra = palavra[letraAtual];
      const letraWord = processadoPromise.word[letraAtual];
  
      if (letraPalavra === letraWord) {
        screen[verificadorDaLetra].style.background = "green";
        screen[verificadorDaLetra].style.color = "white";
        letrasRepetidas.add(letraPalavra);
      } else if (processadoPromise.word.includes(letraPalavra) && !letrasRepetidas.has(letraPalavra)) {
        screen[verificadorDaLetra].style.background = "goldenrod";
        screen[verificadorDaLetra].style.color = "white";
        letrasRepetidas.add(letraPalavra);
      } else {
        screen[verificadorDaLetra].style.background = "gray";
        screen[verificadorDaLetra].style.color = "white";
      }
      letraAtual++;
    }
  } else { 
    for (let i = divAtual - 4; i <= divAtual; i++) {
      screen[i].classList.add("invalid");
    }
}

  if (palavra !== processadoPromise.word && processadoOnePromise.validWord === true) {
    spiral.style.visibility = "hidden";
    divAtual++;
  }  else if (processadoOnePromise.validWord === false) {
    spiral.style.visibility = "hidden";
    return;
  }else {
    alert("Você acertou a palavra do dia!")
    spiral.style.visibility = "hidden";
    titulo.classList.add("vitoria");
    ouvirEventos = false;
    return;
  }
}

function CasoParaSimbolos (simbolo) {
  switch (simbolo) {
    case "Backspace":
      if (divAtual === 0 || divAtual === 5 || divAtual === 10 || divAtual === 15 || divAtual === 20 || divAtual === 25) {
        screen[divAtual].innerText = "";
        return;
        
      } else {
        if (divAtual === 4 || divAtual === 9 || divAtual === 14 || divAtual === 19 || divAtual === 24 || divAtual === 29) {
          if (screen[divAtual].childNodes.length > 0) {
            screen[divAtual].innerText = "";
            return; 
          } else {
            divAtual--;
            screen[divAtual].innerText = "";
            return;
          }
        } else {          
        divAtual--;
        screen[divAtual].innerText = "";
        return;
        }
      }
    case "Enter":
      for (let i = divAtual - 4; i <= divAtual; i++) {
        screen[i].classList.remove("invalid");
      }
      if (divAtual === 4 || divAtual === 9 || divAtual === 14 || divAtual === 19 || divAtual === 24 || divAtual === 29) {
        if (screen[divAtual].childNodes.length > 0) {
          let concatenacao = screen[divAtual - 4].textContent + screen[divAtual - 3].textContent + screen[divAtual - 2].textContent + screen[divAtual - 1].textContent + screen[divAtual].textContent;
          verificarPalavra(concatenacao);
          return;
        } else return;
      } else return;
  }
}

function ProximaDiv(value) {
  if (divAtual < 30) {
    if (divAtual === 4 || divAtual === 9 || divAtual === 14 || divAtual === 19 || divAtual === 24 || divAtual === 29) {
      if (screen[divAtual].childNodes.length > 0) {
        screen[divAtual].replaceChild(value, screen[divAtual].childNodes[0]);
        return;
      } else {
        screen[divAtual].appendChild(value);
        return;
      }
    } else {
      screen[divAtual].appendChild(value);
      divAtual++;
      return;
    }
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}
document.addEventListener(
  "keydown", function letras(event) {
    if (!ouvirEventos) return;
    if (event.key === "Enter") {
      CasoParaSimbolos(event.key);
    } else if (event.key === "Backspace") {
    CasoParaSimbolos(event.key);
    } else if (!isLetter(event.key)) {
      event.preventDefault();
    } else {
      rerender(event.key);
    }
  })

function rerender(value) {
  const texto = document.createTextNode(value);
  const paragrafo = document.createElement("p");
  paragrafo.appendChild(texto);
  paragrafo.classList.add("letra-do-bloco");
  ProximaDiv(paragrafo);
  return;
}