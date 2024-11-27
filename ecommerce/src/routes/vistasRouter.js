import { Router } from 'express';
import ProductManager from '../dao/productManager.js';

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

// Ruta para la pagina principal
router.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render("index");
});


// Ruta para la vista de todos los productos
router.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
    res.status(200).render("index", { payload: products });
});

// Ruta para la vista de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.status(200).render("realTimeProducts", { payload: products });
});


export default router;

