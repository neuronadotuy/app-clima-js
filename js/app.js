/** @format */

const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
  e.preventDefault();

  // Validar
  const ciudad = document.querySelector("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  // console.log(ciudad, pais);

  if (ciudad === "" || pais === "") {
    mostrarError("Ambos campos son obligatorios");
    return;
  }

  // Consultar API
  consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
  const noRepeatError = document.querySelector(".no--repeat--error");

  if (!noRepeatError) {
    const alerta = document.createElement("div");
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center",
      "no--repeat--error"
    );

    alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>
  `;

    container.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function consultarAPI(ciudad, pais) {
  const appID = "dbac7dbc08ea9ec4f1241792cda076b5";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

  divSpinner(); //spinner de carga

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      limpiarHTML();
      console.log(result);
      if (result.cod === "404") {
        mostrarError("Ciudad no encontrada");
        return;
      }

      // HTML
      mostrarClima(result);
    });
}

function mostrarClima(datos) {
  const {
    main: { temp, temp_max, temp_min },
    name,
    sys: { country },
  } = datos;

  const currentTemp = kelvinACentigrados(temp);
  const minTemp = kelvinACentigrados(temp_min);
  const maxTemp = kelvinACentigrados(temp_max);
  // const cityName = name;

  const currentCity = document.createElement("h2");
  currentCity.innerHTML = `${name}, <span class="font-normal">${country}</span>`;
  currentCity.classList.add("font-bold", "text-2xl");

  const current = document.createElement("p");
  current.innerHTML = `${currentTemp} &#8451;`;
  current.classList.add("font-bold", "text-6xl");

  const min = document.createElement("p");
  min.innerHTML = `<span class="text-sm">Min:</span> ${minTemp} &#8451;`;
  min.classList.add("text-xl");

  const max = document.createElement("p");
  max.innerHTML = `<span class="text-sm">Max:</span> ${maxTemp} &#8451;`;
  max.classList.add("text-xl");

  const resultadoDiv = document.createElement("div");
  resultadoDiv.classList.add("text-center", "text-white");

  resultadoDiv.appendChild(currentCity);
  resultadoDiv.appendChild(current);
  resultadoDiv.appendChild(min);
  resultadoDiv.appendChild(max);

  resultado.appendChild(resultadoDiv);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

const kelvinACentigrados = (grados) => {
  return parseInt(grados - 273.15);
};

function divSpinner() {
  limpiarHTML();

  const divSpinner = document.createElement("div");
  divSpinner.classList.add("spinner");

  divSpinner.innerHTML = `
  <div class="spinner"></div>
  `;

  resultado.appendChild(divSpinner);
}
