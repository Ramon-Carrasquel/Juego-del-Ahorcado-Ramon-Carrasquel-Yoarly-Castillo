const imagenHorca = document.querySelector(".caja-horca img");
const displayPalabras = document.querySelector(".display-palabras");
const textoIntentos = document.querySelector(".texto-intentos b");
const tecladoDiv = document.querySelector(".teclado");
const cuadrofinJuego = document.querySelector(".cuadro-finjuego");
const jugardeNuevo = document.querySelector(".cuadro-finjuego");
const textoPuntaje = document.querySelector(".puntaje-texto b");
let rondasGanadas = parseInt(localStorage.getItem('rondasGanadas')) || 0;

const mostrarRondasGanadas = () => {
  document.querySelector(".rondas-ganadas").innerText = rondasGanadas;
}

mostrarRondasGanadas();

document.querySelector(".reset-rondas").addEventListener("click", () => {
  rondasGanadas = 0;
  localStorage.setItem('rondasGanadas', rondasGanadas);
  mostrarRondasGanadas();
});

let palabraActual, letrasCorrectas, intentosFallidosContador, puntajeContador;
const maxIntentos = 6;

const resetearJuego = () => {
  //Resetea el juego, sus variables, y los elementos visuales
  letrasCorrectas = [];
  intentosFallidosContador = 0;
  puntajeContador = 0;
  imagenHorca.src = `imagenesdeapoyo/hangman-${intentosFallidosContador}.svg`;
  textoIntentos.innerText = `${intentosFallidosContador} / ${maxIntentos}`;
  tecladoDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
  displayPalabras.innerHTML = palabraActual.split("").map(() => `<li class="letra"></li>`).join("");
  cuadrofinJuego.classList.remove("show");
  textoPuntaje.innerText = `${puntajeContador}`;
}

const obtenPalabraCualquiera = () => {
  //Selecciona una palabra cualquiera junto a su pista, de la lista de palabras
  const { palabra, pista } = listaPalabras[Math.floor(Math.random() * listaPalabras.length)];
  palabraActual = palabra;
  document.querySelector(".texto-pista b").innerText = pista;
  resetearJuego();
}

const findeJuego = (victoria) => {
  //Muestra un cuadro con la informacion luego de haber acabado el juego, o luego de 600ms
  setTimeout(() => {
    const cajaTexto = victoria ? `Adivinaste la palabra: ` : `La palabra correcta es: `;
    cuadrofinJuego.querySelector("h4").innerText = `${victoria ? `¡Ganaste!` : `¡Perdiste`}`;
    cuadrofinJuego.querySelector("p").innerHTML = `${cajaTexto} <b>${palabraActual}</b>`;
    cuadrofinJuego.querySelector(".puntaje-final").innerText = `${puntajeContador}`;
    cuadrofinJuego.classList.add("show");
    if (victoria) {
      rondasGanadas++;
      localStorage.setItem('rondasGanadas', rondasGanadas);
      mostrarRondasGanadas();
    }
  }, 300);
}

const iniciarJuego = (button, letraClickeada) => {
  //Verifica si la letra que fue clickeada se encuentra en la palabra actual
  if (palabraActual.includes(letraClickeada)){
    //Muestra todas las letras correctas que fueron seleccionadas
    [...palabraActual].forEach((letra, index) => {
      if (letra === letraClickeada){
        letrasCorrectas.push(letra);
        displayPalabras.querySelectorAll("li")[index].innerText = letra;
        displayPalabras.querySelectorAll("li")[index].classList.add("adivinada");
        puntajeContador = puntajeContador + 50;
      }
    });
  }else{
    //Si la letra elegida no esta en la palabra, se actualiza el contador de intentos y la imagen de la horca
    intentosFallidosContador++;
    imagenHorca.src = `imagenesdeapoyo/hangman-${intentosFallidosContador}.svg`;
  }
  textoPuntaje.innerText = `${puntajeContador}`;
  button.disabled = true;
  textoIntentos.innerText = `${intentosFallidosContador} / ${maxIntentos}`;

  //Llamamos la funcion de fin de juego en caso de que se cumpla uno de los condicionales
  if (intentosFallidosContador === maxIntentos) return findeJuego(false);
  if (letrasCorrectas.length === palabraActual.length) return findeJuego(true);
}

//Bucle for para los botones del teclado y para los addEventListener
for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  tecladoDiv.appendChild(button);
  button.addEventListener("click", e => iniciarJuego(e.target, String.fromCharCode(i)));

  // Añadir la letra ñ entre n y o
  if (i === 110) {
    const buttonEnye = document.createElement("button");
    buttonEnye.innerText = "ñ";
    tecladoDiv.appendChild(buttonEnye);
    buttonEnye.addEventListener("click", e => iniciarJuego(e.target, "ñ"));
  }
}

obtenPalabraCualquiera();
jugardeNuevo.addEventListener("click", obtenPalabraCualquiera)