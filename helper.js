// Verifica los inputs
const verificar = (id) => {
    const input = document.getElementById(id);
    const div = document.getElementById('e-' + id);
    input.classList.remove('is-invalid');
    div.innerHTML = '';

    if (input.value.trim() === '') {
        input.classList.add('is-invalid');
        div.innerHTML = '<span class="badge bg-danger">El campo es obligatorio</span>';
        return;
    }
};

// Limpia el formulario y reinicia el estado del botón
const limpiar = () => {
    document.querySelector('form').reset(); // Resetear el formulario
    document.querySelectorAll('.form-control').forEach(item => {
        item.classList.remove('is-invalid');
        item.classList.remove('is-valid');
        const errorDiv = document.getElementById(`e-${item.name}`);
        if (errorDiv) {
            errorDiv.innerHTML = '';
        }
    });

    document.getElementById('btnGuardar').value = 'Guardar'; // Restablece el botón a "Guardar"
};




const soloNumeros = (evt) => {
    if (/^[0-9]$/.test(evt.key)) {
        return true;
    }
    evt.preventDefault();  // Impide la entrada de cualquier otra tecla
}


