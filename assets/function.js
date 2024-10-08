const productos = [
    { nombre: "Mitsuri Kanroji", precio: 30000 },
    { nombre: "Shinobu Kocho", precio: 20000 },
    { nombre: "Kyojuro Rengoku", precio: 35000 },
    { nombre: "Inosuke Hashibira", precio: 20000 },
    { nombre: "Nezuko y Tanjiro", precio: 40000 },
    { nombre: "Giyu Tomioka", precio: 45000 }
];

let carrito = [];

// Agregar productos al carrito
document.querySelectorAll('.btnAgregarCarrito').forEach(btn => {
    btn.addEventListener('click', function () {
        const productoSeleccionado = productos[this.getAttribute('data-producto')];
        const cantidad = 1; // cantidad por defecto

        carrito.push({
            producto: productoSeleccionado,
            cantidad
        });

        actualizarCarrito();
        const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));
        carritoModal.show();
    });
});

function actualizarCarrito() {
    const modalBody = document.getElementById('carritoModal').querySelector('.modal-body');
    modalBody.innerHTML = '';

    let total = 0;

    const productosUnicos = [...new Set(carrito.map(item => item.producto))];
    productosUnicos.forEach((producto) => {
        const cantidadTotalProducto = carrito.reduce((acc, item) => item.producto === producto ? acc + item.cantidad : acc, 0);

        // Creo la fila, y le agrego clases
        const fila = document.createElement('div');
        fila.classList.add('carrito-item', 'd-flex', 'justify-content-between', 'align-items-center');

        // creo la celda Producto
        const celdaProducto = document.createElement('span');
        celdaProducto.classList.add('p-3')
        celdaProducto.textContent = producto.nombre;
        fila.appendChild(celdaProducto);

        // Crea el campo de entrada
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.classList.add('input-cantidad'); 
        inputCantidad.value = cantidadTotalProducto;
        inputCantidad.min = '1'; 
        // actualizar la cantidad en el carrito
        inputCantidad.addEventListener('change', (e) => {
            const nuevaCantidad = parseInt(e.target.value);
            const itemIndex = carrito.findIndex(item => item.producto === producto);

            //se modifica la cantidad actualiza el carrito
            if (itemIndex > -1) {
                carrito[itemIndex].cantidad = nuevaCantidad; // Cambia la cantidad en el carrito
                if (nuevaCantidad <= 0) {
                    carrito.splice(itemIndex, 1);
                }
            }
            actualizarCarrito(); 
        });

        // Añade el campo de entrada a la fila
        fila.appendChild(inputCantidad);

        // creo la celda precio
        const celdaPrecio = document.createElement('span');
        celdaPrecio.classList.add()
        celdaPrecio.textContent = `$${(producto.precio * cantidadTotalProducto).toLocaleString('de-DE')}`;
        fila.appendChild(celdaPrecio);

        // Botón eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
            const itemIndex = carrito.findIndex(item => item.producto === producto);
            carrito.splice(itemIndex, 1);
            actualizarCarrito(); // Actualizar carrito
            if (carrito.length === 0) {
                const carritoModal = bootstrap.Modal.getInstance(document.getElementById('carritoModal'));
                if (carritoModal) {
                    carritoModal.hide(); // Cerrar el modal si no hay más productos
                }
            }
        });
        
        fila.appendChild(btnEliminar);  // Se añade el boton al final

        modalBody.appendChild(fila);   // Se añaden las celdas al body del modal

        total += producto.precio * cantidadTotalProducto;
    });

    // agregamos el total en el modal
    const totalElement = document.createElement('div');
    totalElement.classList.add('total-container');
    totalElement.textContent = `Total: $${total.toLocaleString('de-DE')}`;
    modalBody.appendChild(totalElement);
}

// finalizar compra
const btnFinalizar = document.querySelector('.btn-modal');
btnFinalizar.addEventListener('click', function() {
    let totalFinal = 0;

    // Calcular el total
    carrito.forEach(item => {
        totalFinal += item.producto.precio * item.cantidad;
    });

    // Mostrar el total en el nuevo modal
    const totalFinalText = document.getElementById('totalFinalText');
    totalFinalText.textContent = `Total a pagar: $${totalFinal.toLocaleString('de-DE')}`;

    // Mostrar el modal de total
    const totalModal = new bootstrap.Modal(document.getElementById('totalModal'));
    totalModal.show();
});

// Resetear el carrito
document.getElementById('totalModal').addEventListener('hidden.bs.modal', function() {
    carrito = []; // Vaciar el carrito
    actualizarCarrito(); // Actualizar el carrito

   // Cerrar el modal
   const carritoModal = bootstrap.Modal.getInstance(document.getElementById('carritoModal'));
   if (carritoModal) {
       carritoModal.hide(); // Cerrar el modal de carrito
   }
});
