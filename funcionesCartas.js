import { getDataProducto, obtenerAlmacen, obtenerCategoria } from "./firebase.js";

const productosContainer = document.getElementById('productos-container');

// Obtener los productos de Firebase
getDataProducto(async (collection) => {
    let contenido = '';
    for (const doc of collection.docs) {
        const producto = doc.data();

        // Obtener nombres de almacén y categoría
        const almacenDoc = await obtenerAlmacen(producto.almacen);
        const categoriaDoc = await obtenerCategoria(producto.categoria);

        const nombreAlmacen = almacenDoc.exists() ? almacenDoc.data().nombre : 'Sin asignar';
        const nombreCategoria = categoriaDoc.exists() ? categoriaDoc.data().nombre : 'Sin asignar';

        // Generar contenido para cada carta
        contenido += `
        <div class="col-md-4">
                    <div class="card mb-4 shadow-sm" style="border: 1px solid #ddd; border-radius: 5px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <div style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="${producto.imagen}" alt="${producto.nombre}" style="max-width: 100%; max-height: 100%; object-fit: cover;">
                        </div>
                        <div class="card-body" style="padding: 10px;">
                            <h5 class="card-title" style="margin-bottom: 10px; font-size: 18px;">${producto.nombre}</h5>
                            <p class="card-text" style="margin: 5px 0;"><strong>Código:</strong> ${producto.codigo}</p>
                            <p class="card-text" style="margin: 5px 0;"><strong>Almacén:</strong> ${nombreAlmacen}</p>
                            <p class="card-text" style="margin: 5px 0;"><strong>Categoría:</strong> ${nombreCategoria}</p>
                            <p class="card-text" style="margin: 5px 0;"><strong>Stock:</strong> ${producto.stock}</p>
                            <p class="card-text" style="margin: 5px 0;"><strong>Precio:</strong> ${producto.precio}</p>
                        </div>
                    </div>
                </div>`;
    }
    productosContainer.innerHTML = contenido;
});