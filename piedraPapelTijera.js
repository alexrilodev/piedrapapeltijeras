// Este array no se puede modificar,
var posibilidades = ["piedra", "papel", "tijera"];
//    //

// Se introducen las variables globales necesarias para la aplicación web
let jugadorNombre = "";
let totalPartidas = 0;
let partidaActual = 0;
let jugadorEleccion = null;
let historial = [];

// Se indican la selección de aquellos elementos HTML que se utilizarán con frecuencia
const nombreInput = document.querySelector('input[name="nombre"]');
const partidasInput = document.querySelector('input[name="partidas"]');
const botonJugar = document.querySelector('button');
const botonTirada = document.querySelectorAll('button')[1]; // ¡YA! botón
const botonReset = document.querySelectorAll('button')[2]; // RESET botón
const spanActual = document.getElementById('actual');
const spanTotal = document.getElementById('total');
const jugadorDiv = document.getElementById('jugador');
const maquinaImg = document.querySelector('#maquina img');
const historialUl = document.getElementById('historial');

// Aquí se indica la función para inicializar los eventos, con sus particularidades
function inicializarEventos() {
  // Para el botón ¡JUGAR!
  botonJugar.addEventListener('click', comenzarJuego);

  // Para la selección de opción del jugador
  const opcionesJugador = jugadorDiv.querySelectorAll('img');
  opcionesJugador.forEach((img, index) => {
    img.addEventListener('click', () => seleccionarOpcionJugador(index));
    
    // Aquí se asigna la imagen correspondiente a cada opción del jugador (piedra-papel-tijera)
    if (posibilidades[index] === "piedra") {
      img.src = `img/piedraJugador.png`;
    } else if (posibilidades[index] === "papel") {
      img.src = `img/papelJugador.png`;
    } else if (posibilidades[index] === "tijera") {
      img.src = `img/tijeraJugador.png`;
    }
  });

  // Para el botón ¡YA!
  botonTirada.addEventListener('click', realizarTirada);

  // Para el botón RESET
  botonReset.addEventListener('click', resetJuego);
}

// Aquí se indica la función para comenzar el juego
function comenzarJuego() {
  jugadorNombre = nombreInput.value.trim();
  totalPartidas = parseInt(partidasInput.value);

  // Se indica el criterio de validación del nombre del jugador (mínimo 4 caracteres y el primero no numérico)
  const nombreValido = jugadorNombre.length > 3 && isNaN(jugadorNombre.charAt(0));
  const partidasValidas = totalPartidas > 0;

  // Para detectar datos no válidos y mostrar errores
  if (!nombreValido) {
    nombreInput.classList.add('fondoRojo');
  } else {
    nombreInput.classList.remove('fondoRojo');
  }

  if (!partidasValidas) {
    partidasInput.classList.add('fondoRojo');
  } else {
    partidasInput.classList.remove('fondoRojo');
  }

  // En caso de introducir datos válidos que inicie el juego
  if (nombreValido && partidasValidas) {
    nombreInput.disabled = true;
    partidasInput.disabled = true;
    spanTotal.textContent = totalPartidas;
	spanActual.textContent = 1;
	partidaActual = 0;
  }
}

// Aquí se indica la función para seleccionar la opción del jugador
function seleccionarOpcionJugador(index) {
  const opcionesJugador = jugadorDiv.querySelectorAll('img');
  opcionesJugador.forEach((img, i) => {
    if (i === index) {
      img.classList.add('seleccionado');
      img.classList.remove('noSeleccionado');
      jugadorEleccion = index;
    } else {
      img.classList.remove('seleccionado');
      img.classList.add('noSeleccionado');
    }
  });
}

// Aquí se indica la función para realizar la tirada y calcular el resultado
function realizarTirada() {
  if (jugadorEleccion === null || partidaActual >= totalPartidas) return;

  // Para generar la opción aleatoria de la máquina
  const maquinaEleccion = Math.floor(Math.random() * posibilidades.length);

  // Igual que con el jugador, aquí también se asigna la imagen correspondiente a la opción aleatoria de la máquina (piedra-papel-tijera)
  if (posibilidades[maquinaEleccion] === "piedra") {
    maquinaImg.src = `img/piedraOrdenador.png`;
  } else if (posibilidades[maquinaEleccion] === "papel") {
    maquinaImg.src = `img/papelOrdenador.png`;
  } else if (posibilidades[maquinaEleccion] === "tijera") {
    maquinaImg.src = `img/tijeraOrdenador.png`;
  }

  // Para comprobar el resultado
  const resultado = determinarGanador(jugadorEleccion, maquinaEleccion);
  partidaActual++;
  spanActual.textContent = partidaActual;

  // Para actualizar historial
  actualizarHistorial(resultado);

  // Para deshabilitar juego si se completaron todas las partidas
  if (partidaActual >= totalPartidas) {
    botonTirada.disabled = true;
  }
}

// Aquí se indica la función que determina el ganador
function determinarGanador(jugador, maquina) {
  if (jugador === maquina) {
    return 'Empate';
  } else if ((jugador === 0 && maquina === posibilidades.length - 1) ||
             (jugador > 0 && jugador === maquina + 1)) {
    return `Gana ${jugadorNombre}`;
  } else {
    return 'Gana la máquina';
  }
}

// Aquí se indica la función para actualizar el historial
function actualizarHistorial(resultado) {
  const li = document.createElement('li');
  li.textContent = resultado;
  historialUl.appendChild(li);
}

// Aquí se indica la función para resetear el juego
function resetJuego() {
  // Reiniciar configuración inicial
  nombreInput.disabled = false;
  partidasInput.disabled = false;
  partidasInput.value = 0;
  spanActual.textContent = 0;
  spanTotal.textContent = 0;
  partidaActual = 0;
  jugadorEleccion = null;

  // Para restablecer las imágenes del jugador a sus opciones originales tras resetear el juego
  const opcionesJugador = jugadorDiv.querySelectorAll('img');
  opcionesJugador.forEach((img, index) => {
    img.classList.remove('seleccionado');
    img.classList.add('noSeleccionado');
    
    // Nuevamente se asignan las imágenes correspondientes
    if (posibilidades[index] === "piedra") {
      img.src = `img/piedraJugador.png`;
    } else if (posibilidades[index] === "papel") {
      img.src = `img/papelJugador.png`;
    } else if (posibilidades[index] === "tijera") {
      img.src = `img/tijeraJugador.png`;
    }
  });

  // Para resetear la imagen de la máquina a la imagen por defecto (pingüino)
  maquinaImg.src = 'img/proyectopiedrapapeltijeras.png';

  // Para añadir "Nueva partida" al historial
  const li = document.createElement('li');
  li.textContent = "Nueva partida";
  historialUl.appendChild(li);

  // Para habilitar botón de tirada
  botonTirada.disabled = false;
}

// Para inicializar eventos cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', inicializarEventos);
