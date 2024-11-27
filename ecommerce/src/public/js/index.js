const socket = io();

// actualizacion de productos
socket.on('updateProducts', (products) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 

    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.title} - $${product.price}`;

        // boton de eliminar para cada producto
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => {
            deleteProduct(product.id);
        };
        listItem.appendChild(deleteButton);

        productList.appendChild(listItem);
    });
});

// funcion para añadir producto
function addProduct(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    socket.emit('addProduct', { title, price });
}

// funcion para eliminar producto
function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}

