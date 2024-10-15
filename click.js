// Asegúrate de que SweetAlert2 esté incluido en tu proyecto
document.querySelector('.btn-comprar').addEventListener('click', function() {
    Swal.fire({
        title: '¡Compra realizada!',
        text: 'Gracias por tu compra. Procesaremos tu pedido.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
});
