import { eliminarAlmacen, getDataAlmacen, obtenerAlmacen, saveAlmacen, updateAlmacen } from "./firebase.js";

let id = 0; // Variable global para almacenar el ID del almacén seleccionado

// Agregar evento al botón Guardar
document.getElementById('btnGuardar').addEventListener('click', () => {
    document.querySelectorAll('.form-control').forEach(item => verificar(item.id));
    if (document.querySelectorAll('.is-invalid').length === 0) {
        const almacen = {
            nombre: document.getElementById('nombre').value.trim(),
        };
        if (document.getElementById('btnGuardar').value === 'Guardar') {
            saveAlmacen(almacen); // Guardar nuevo almacén
            limpiar();
        } else {
            updateAlmacen(id, almacen); // Modificar almacén existente
            limpiar();
            id = 0; // Reinicia el ID seleccionado
        }
    }
});

// Evento para cargar datos al inicio
window.addEventListener('DOMContentLoaded', () => {
    getDataAlmacen((collection) => {
        let tabla = '';
        collection.forEach((doc) => {
            const item = doc.data();
            tabla += `<tr>
                <td>${item.nombre}</td>
                <td nowrap>
                    <button class="btn btn-warning" id="${doc.id}">Editar</button>
                    <button class="btn btn-danger" id="${doc.id}">Eliminar</button>
                </td>
            </tr>`;
        });

        document.getElementById('contenido').innerHTML = tabla;

        // Botones eliminar
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
                        eliminarAlmacen(btn.id);
                        Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
                        limpiar();
                        id = 0; // Reinicia el ID seleccionado
                        document.getElementById('btnGuardar').value = 'Guardar'; // Asegura el estado del botón
                    }
                });
            });
        });

        // Botones editar
        document.querySelectorAll('.btn-warning').forEach(btn => {
            btn.addEventListener('click', async () => {
                const doc = await obtenerAlmacen(btn.id);
                const d = doc.data();
                document.getElementById('nombre').value = d.nombre;
                document.getElementById('btnGuardar').value = 'Modificar'; // Cambia el botón a "Modificar"
                id = btn.id; // Guarda el ID del documento seleccionado
            });
        });
    });
});
