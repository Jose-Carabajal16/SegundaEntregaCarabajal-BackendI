import { Router } from 'express';
import CartManager from '../dao/cartManager.js';

const router = Router();
const cartManager = new CartManager("./src/data/carts.json");

// ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.addCart();
        res.status(201).json({ payload: nuevoCarrito });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error en el servidor al crear el carrito' });
    }
});

// ruta para obtener los  carrito
router.get("/:cid", async (req, res) => {
    let { cid } = req.params;
    cid = Number(cid);

    if (isNaN(cid)) {
        return res.status(400).json({ error: 'El id del carrito debe ser numérico' });
    }

    try {
        const carrito = await cartManager.getCartById(cid);
        if (!carrito) {
            return res.status(404).json({ error: `El carrito con el id: ${cid} no existe` });
        }
        res.status(200).json({ payload: carrito.products });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error en el servidor al obtener el carrito' });
    }
});

// ruta para agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
    let { cid, pid } = req.params;
    cid = Number(cid);
    pid = Number(pid);

    if (isNaN(cid) || isNaN(pid)) {
        return res.status(400).json({ error: 'El id del carrito y el id del producto deben ser numéricos' });
    }

    try {
        const carrito = await cartManager.addProductToCart(cid, pid);
        if (!carrito) {
            return res.status(404).json({ error: `El carrito con el id: ${cid} no existe` });
        }
        res.status(201).json({ payload: carrito });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ error: 'Error en el servidor al agregar el producto al carrito' });
    }
});

export default router;
