import { eliminarProducto, getDataProducto, obtenerProducto, saveProducto, updateProducto, getDataCategoria, getDataAlmacen, obtenerAlmacen, obtenerCategoria } from "./firebase.js";

let id = 0;

const cargarAlmacenes = () => {
    getDataAlmacen((collection) => {
        const select = document.getElementById('almacen');
        let options = '<option value="">Seleccione un almacén</option>';
        collection.forEach((doc) => {
            const almacen = doc.data();
            options += `<option value="${doc.id}">${almacen.nombre}</option>`;
        });
        select.innerHTML = options;
    });
};

const cargarCategorias = () => {
    getDataCategoria((collection) => {
        const select = document.getElementById('categoria');
        let options = '<option value="">Seleccione una categoría</option>';
        collection.forEach((doc) => {
            const categoria = doc.data();
            options += `<option value="${doc.id}">${categoria.nombre}</option>`;
        });
        select.innerHTML = options;
    });
};

// Función para manejar la tabla y mostrar nombres en lugar de IDs
getDataProducto(async (collection) => {
    let tabla = '';
    for (const doc of collection.docs) {
        const item = doc.data();

        // Obtener nombres de almacén y categoría
        const almacenDoc = await obtenerAlmacen(item.almacen);
        const categoriaDoc = await obtenerCategoria(item.categoria);

        const nombreAlmacen = almacenDoc.exists() ? almacenDoc.data().nombre : 'Sin asignar';
        const nombreCategoria = categoriaDoc.exists() ? categoriaDoc.data().nombre : 'Sin asignar';

        // Generar la fila de la tabla
        tabla += `<tr>
            <td>${item.codigo}</td>
            <td>${item.nombre}</td>
            <td>${nombreAlmacen}</td> <!-- Mostrar el nombre del almacén -->
            <td>${nombreCategoria}</td> <!-- Mostrar el nombre de la categoría -->
            <td>${item.stock}</td>
            <td nowrap>
                <button class="btn btn-warning" id="${doc.id}">Editar</button>
                <button class="btn btn-danger" id="${doc.id}">Eliminar</button>
            </td>
        </tr>`;
    }
    document.getElementById('contenido').innerHTML = tabla;

    // Lógica para botones de eliminar y editar
    document.querySelectorAll('.btn-danger').forEach(btn => {
        btn.addEventListener('click', () => {
            Swal.fire({
                title: "¿Estás seguro de eliminar el registro?",
                text: "No podrás revertir los cambios",
                icon: "error",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Eliminar"
            }).then((result) => {
                if (result.isConfirmed) {
                    eliminarProducto(btn.id);
                    Swal.fire({
                        title: "Eliminado",
                        text: "Su registro ha sido eliminado",
                        icon: "success"
                    });
                }
            });
        });
    });

    document.querySelectorAll('.btn-warning').forEach(btn => {
        btn.addEventListener('click', async () => {
            const doc = await obtenerProducto(btn.id);
            const d = doc.data();
            document.getElementById('codigo').value = d.codigo;
            document.getElementById('nombre').value = d.nombre;
            document.getElementById('almacen').value = d.almacen;
            document.getElementById('categoria').value = d.categoria;
            document.getElementById('stock').value = d.stock;
            document.getElementById('btnGuardar').value = 'Modificar';
            id = btn.id;
        });
    });
});

// Evento para guardar o actualizar productos
document.getElementById('btnGuardar').addEventListener('click', () => {
    document.querySelectorAll('.form-control').forEach(item => {
        verificar(item.id);
    });
    if (document.querySelectorAll('.is-invalid').length == 0) {
        const producto = {
            'codigo': document.getElementById('codigo').value.trim(),
            'nombre': document.getElementById('nombre').value.trim(),
            'almacen': document.getElementById('almacen').value,
            'categoria': document.getElementById('categoria').value,
            'stock': document.getElementById('stock').value.trim()
        };

        if (document.getElementById('btnGuardar').value == 'Guardar') {
            saveProducto(producto);
            limpiar();
        } else {
            updateProducto(id, producto);
            limpiar();
            id = 0;
        }
    }
});

// Cargar almacenes y categorías al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    cargarAlmacenes();
    cargarCategorias();
});
