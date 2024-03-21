// Función para recuperar el carrito desde el almacenamiento local
function recuperarCarrito() {
    return JSON.parse(localStorage.getItem("miCarrito")) || [];
}

// Constante para la URL del archivo JSON de la cartelera
const URL = "js/cartelera.json";

// Variables globales
const carrito = recuperarCarrito();
let eventos = [];

// Elementos del DOM
const btnCarrito = document.querySelector("i#carrito");
const contenedor = document.querySelector("div#contenedor");
const inputBuscar = document.querySelector("input[type=search]");

// Plantilla de la tarjeta HTML
function CardHTML({ imagen, nombre, precio, id }) {
    return `
        <div class="card" style="width: 18rem;"> 
            <img src="${imagen}" class="card-img-top" alt="..."/>
            <div class="card-body">
                <h5 class="card-title">${nombre}</h5>
                <p class="card-text">${precio.toLocaleString("es-AR")}</p>
                <button id="${id}" class="btn btn-primary button button-outline button-add animate__animated animate__flash" title="Pulsa para comprar">COMPRAR</button>
            </div>
        </div>`;
}

// Plantilla de error
function CardError() {
    return `
        <div class="card-error">
            <h2>ERROR 404  </h2>
            <h3>No se han podido cargar los productos de la web</h3>
            <h4>Intenta nuevamente o contacta con nuestro soporte!</h4>
        </div>`;
}

// Función para manejar el click en el botón de comprar
function ClickBtn() {
    const botonesComprar = document.querySelectorAll("button.button-add");

    botonesComprar.forEach(boton => {
        boton.addEventListener("click", () => {
            const eventoSeleccionado = eventos.find(evento => evento.id === parseInt(boton.id));
            carrito.push(eventoSeleccionado);
            localStorage.setItem("miCarrito", JSON.stringify(carrito));
            alertAñadirCarrito(`${eventoSeleccionado.nombre} se agregó al carrito correctamente!`);
        });
    });
}

// Función para cargar los eventos en el contenedor
function cargarEventos(array) {
    contenedor.innerHTML = array.length > 0 ? array.map(CardHTML).join('') : CardError();
    ClickBtn();
}

// Función para obtener los eventos desde el archivo JSON
function obtenerEventosJSON() {
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudieron cargar los datos de los productos");
            }
            return response.json();
        })
        .then(data => {
            eventos = data;
            cargarEventos(eventos);
        })
        .catch(error => {
            console.error(error);
            cargarEventos([]);
        });
}

// Función para mostrar la cantidad de entradas en el carrito al pasar el mouse sobre el icono del carrito
btnCarrito.addEventListener("mousemove", () => {
    btnCarrito.title = carrito.length > 0 ? `${carrito.length} entrada(s) en el carrito` : "Ir al carrito";
});

// Función para redirigir al usuario al carrito si hay elementos en él
btnCarrito.addEventListener("click", () => {
    if (carrito.length > 0) {
        location.href = "./pages/compras.html";
    } else {
        alertCarrito();
    }
});

// Función para buscar eventos al presionar Enter en el campo de búsqueda
inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && inputBuscar.value.trim() !== "") {
        const resultado = eventos.filter(evento => evento.nombre.toUpperCase().includes(inputBuscar.value.trim().toUpperCase()));
        if (resultado.length === 0) {
            AlertSearchError(`${inputBuscar.value.trim()} no se pudo encontrar!`);
        }
        cargarEventos(resultado);
    }
});

// Función para cargar todos los eventos al borrar el texto del campo de búsqueda
inputBuscar.addEventListener("input", () => {
    if (inputBuscar.value.trim() === "") {
        cargarEventos(eventos);
    }
});

// Funciones para mostrar alertas
function alertAñadirCarrito(alerta) {
    Toastify({
        text: alerta,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "green",
        },
    }).showToast();
}

function AlertSearchError(alerta) {
    Toastify({
        text: alerta,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "red",
        },
    }).showToast();
}

function alertCarrito() {
    Swal.fire({
        icon: 'warning',
        title: 'Ver carrito',
        text: 'Para continuar, debes agregar al menos una entrada al carrito!'
    });
}

// Llamada inicial para obtener los eventos
obtenerEventosJSON();


