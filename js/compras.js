function recuperarCarrito() {
    return JSON.parse(localStorage.getItem("miCarrito"))
}
const carrito = recuperarCarrito()



const tBody = document.querySelector("table tbody")
const btnComprar = document.querySelector("button#btnComprar")
const btnPrice = document.querySelector("td#price")
const btnBorrar = document.querySelector("button#btnDelete")



function CardHTML2(eventos) {
    return `<tr>
  <td>${eventos.nombre}</td>
    <td>$ ${eventos.precio}</td>
    
</tr>`
}



if (carrito) {
    tBody.innerHTML = ""
    carrito.forEach((eventos) => {
        tBody.innerHTML += CardHTML2(eventos)
        totalPriceHTML()
    })

}

function HTMLOff() {
    return `<tr>
                <td>Gracias por</td>
                <td>utilizar PassTicket!</td>
                <td>Redirigiendo...</td>
                <td data-eliminar="" class="boton-delete" title="delete">X</td>
            </tr>`
}

function totalPrice() {
    if (carrito.length > 0) {
        let totalP = carrito.reduce((acc, eventos) => acc + eventos.precio, 0)
        return totalP
    } else {
        return 0.0
    }
}


function totalPriceHTML() {
    const totalPHTML = document.querySelector("td#price")
    totalPHTML.textContent = `$ ${totalPrice().toLocaleString("es-AR")}`
}


function purchaseCompleted() {
    Swal.fire({
        icon: 'success',
        title: 'Finalizado',
        text: 'Gracias por tu compra en PassTicket!',
        footer: 'Te esperamos para seguir viviendo muchos mas shows juntxs!'

    })
    redirigirIndex()
}

function redirigirIndex() {
    Toastify({
        text: "Redirigiendo al menu principal...✨",
        duration: 3500,
        destination: "https://github.com/apvarun/toastify-js",
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "rainbow",
        },
    }).showToast();

    setTimeout(() => {
        location.href = " ../index.html"
    }, 5500)
}

function deleteAlert() {
    Swal.fire({
        icon: 'warning',
        title: '¿Estas seguro que quieres eliminar la compra?',
        text: 'Tenga en cuenta que si elimina, no podra volver hacia atras',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',

    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("miCarrito")
            carrito.lenght = 0;
            btnComprar.setAttribute("disabled", "true")
            tBody.innerHTML = HTMLOff()
            redirigirIndex()
        }
    })
}


function confirmPurchaseAlert() {
    Swal.fire({
        icon: 'question',
        title: '¿Estas seguro que quieres confirmar la compra?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',

    }).then((resultado) => {
        if (resultado.isConfirmed) {
            localStorage.removeItem("miCarrito")
            carrito.lenght = 0;
            btnComprar.setAttribute("disabled", "true")
            tBody.innerHTML = HTMLOff()
            purchaseCompleted()
        } else {

        }
    })
}


btnBorrar.addEventListener("click", () => {
    deleteAlert()
}
)


btnComprar.addEventListener("click", () => {
    confirmPurchaseAlert()
})