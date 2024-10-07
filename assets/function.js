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

// Actualizar el carrito en la tabla
function actualizarCarrito() {
    const modalBody = document.getElementById('carritoModal').querySelector('.modal-body');
    modalBody.innerHTML = '';

    let total = 0;

    const productosUnicos = [...new Set(carrito.map(item => item.producto))];
    productosUnicos.forEach((producto) => {
        const cantidadTotalProducto = carrito.reduce((acc, item) => item.producto === producto ? acc + item.cantidad : acc, 0);

        // Creo la fila, y le agrego clases
        const fila = document.createElement('div');
        fila.classList.add('carrito-item', 'd-flex', 'justify-content-between', 'align-items-center', 'p-3');

        // creo la celda Producto
        const celdaProducto = document.createElement('span');
        celdaProducto.textContent = producto.nombre;
        fila.appendChild(celdaProducto);

        // creo la celda Cantidad
        const celdaCantidad = document.createElement('span');
        celdaCantidad.textContent = cantidadTotalProducto;
        fila.appendChild(celdaCantidad);

        // creo la celda precio
        const celdaPrecio = document.createElement('span');
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
