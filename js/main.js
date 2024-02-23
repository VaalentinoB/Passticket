function recuperarCarrito() {
 return JSON.parse(localStorage.getItem("miCarrito")) || []
}
 const  URL = "js/cartelera.json"
const carrito = recuperarCarrito()
const eventos =[]

const btnCarrito = document.querySelector("img#carrito")
const contenedor = document.querySelector("div#contenedor")
const inputBuscar = document.querySelector("input[type=search]")

function CardHTML({ imagen, nombre, precio, id }) {

    return `<div class="card"> 
                <div><img src="${imagen}"/></div>
                <div class="card-title"><p>${nombre}</p></div>
                <div class="card-price"><p>$ ${precio.toLocaleString("es-AR")}</p></div>
                <button id="${id}" class="button button-outline button-add animate__animated animate__flash" title="Pulsa para comprar">COMPRAR</button>
            </div>`
}

function CardError() {
    return `<div class="card-error">
                <h2>ERROR 404 :( </h2>
                <h3>No se han podido cargar los productos de la web</h3>
                <h4>Intenta nuevamente o contacte con nuestro soporte!</h4>
            </div>`
}

function ClickBtn() {
    const botonesComprar = document.querySelectorAll("button.button-add")

    for (let boton of botonesComprar) {
        boton.addEventListener("click", () => {
            const eventoSeleccionado = eventos.find(eventos => eventos.id === parseInt(boton.id))
            carrito.push(eventoSeleccionado)
            localStorage.setItem("miCarrito", JSON.stringify(carrito))
            alertAñadirCarrito(`${eventoSeleccionado.nombre} se agrego al carrito correctamente!`)

        })
    }
}

function cargarEventos(array) {
    if (array.length > 0) {
        contenedor.innerHTML = ""

        array.forEach((producto) => {
            contenedor.innerHTML += CardHTML(producto)
        })
        ClickBtn()
    } else {
        contenedor.innerHTML = CardError()
    }
}


function obtenerEventosJSON() {
 fetch(URL)  
 .then((JSON)=> JSON.json()  ) 
 .then((datos)=> eventos.push(...datos))
 .then(()=> cargarEventos(eventos))
 .catch((error) => tBody.innerHTML = CardError())
}
obtenerEventosJSON()

btnCarrito.addEventListener("mousemove", () => {
if (carrito.length > 0) {
    btnCarrito.title = carrito.length + " entrada(s) en el carrito"
    } else {
        btnCarrito.title = "Ir al carrito"
    }
})

btnCarrito.addEventListener("click", () => {
    carrito.length > 0 ? location.href = " ./pages/compras.html" : alertCarrito()
})

inputBuscar.addEventListener("keypress", (e)=> { 
    if (e.key === "Enter" && inputBuscar.value.trim() !== "") {
        const resultado = eventos.filter((eventos)=> eventos.nombre.toUpperCase().includes(inputBuscar.value.trim().toUpperCase()))
       if(resultado.length === 0) {
        AlertSearchError(`${inputBuscar.value.trim()} no se a podido encontrar!`)
       }
        cargarEventos(resultado.length > 0 ? resultado:eventos)
       
    }
})

inputBuscar.addEventListener("input",() => {
    inputBuscar.value.trim() === "" && cargarEventos (eventos);
});

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
        title:'Ver carrito',
        text:'Para continuar debes agregar al menos una entrada al carrito!'

    })

}


