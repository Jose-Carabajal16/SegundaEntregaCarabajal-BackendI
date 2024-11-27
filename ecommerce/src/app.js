import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { Server } from 'socket.io';

// Importaciones de rutas
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import vistasRouter from './routes/vistasRouter.js';
import ProductManager from './dao/productManager.js'; 

const PORT = 8080;
const app = express();
const __dirname = path.resolve();

// configuracion de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// archivos estaticos
app.use(express.static(path.join(__dirname, 'src/public')));

// configuracion de Handlebars
app.engine('handlebars', engine({
    layoutsDir: './src/views/layouts', 
    defaultLayout: 'main' 
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// ProductManager
const productManager = new ProductManager('./src/data/products.json');

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', vistasRouter);

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('Bienvenido a la Home');
});

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
const io = new Server(httpServer);

// eventos de WebSocket
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // lista de productos actual al conectarse
    const allProducts = await productManager.getProducts();
    socket.emit('updateProducts', allProducts);

    // manejo de agregar un nuevo producto
    socket.on('addProduct', async (productData) => {
        await productManager.addProduct(productData);
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });

    // eliminacion de un producto
    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });
});
