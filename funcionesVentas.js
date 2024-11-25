import { saveVenta, getDataProducto, updateProductoStock } from "./firebase.js";

// Función para cargar los productos en el formulario
window.addEventListener('DOMContentLoaded', () => {
    // Cargar productos en el select
    getDataProducto((collection) => {
        let options = '<option value="">Seleccione un producto</option>';
        collection.forEach((doc) => {
            const producto = doc.data();
            options += `<option value="${doc.id}" data-precio="${producto.precio}" data-stock="${producto.stock}">${producto.nombre}</option>`;
        });
        document.getElementById('producto').innerHTML = options;
    });
});

// Calcular el total al cambiar la cantidad o el producto
document.getElementById('cantidad').addEventListener('input', calcularTotal);
document.getElementById('producto').addEventListener('change', calcularTotal);

function calcularTotal() {
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const precio = parseFloat(document.getElementById('producto').selectedOptions[0]?.dataset.precio);

    if (cantidad && precio) {
        document.getElementById('total').value = cantidad * precio;
    } else {
        document.getElementById('total').value = '';
    }
}

// Guardar la venta
document.getElementById('btnGuardar').addEventListener('click', () => {
    const productoId = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;
    const total = document.getElementById('total').value;

    if (productoId && cantidad && total) {
        const producto = document.getElementById('producto').selectedOptions[0];
        const stockDisponible = parseInt(producto.dataset.stock);

        // Verificar si hay suficiente stock
        if (stockDisponible < cantidad) {
            Swal.fire('Error', 'No hay suficiente stock para esta venta', 'error');
            return;
        }

        const venta = {
            productoId,
            cantidad: parseInt(cantidad),
            total: parseFloat(total),
            fecha: new Date().toISOString() // Fecha de la venta
        };

        // Guardar la venta
        saveVenta(venta);

        // Actualizar el stock
        const nuevoStock = stockDisponible - cantidad;
        updateProductoStock(productoId, nuevoStock);

        limpiar(); // Limpiar después de guardar
        Swal.fire('Venta guardada', 'La venta ha sido registrada correctamente', 'success');
    } else {
        Swal.fire('Error', 'Por favor complete todos los campos', 'error');
    }
});

// Función de limpiar formulario
const limpiar = () => {
    document.querySelector('form').reset();  // Resetear el formulario
    document.getElementById('producto').selectedIndex = 0;  // Restablecer select
    document.getElementById('total').value = ''; // Limpiar el total
};
