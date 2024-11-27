import { Router } from 'express';
import ProductManager from '../dao/productManager.js';

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts(); 
        res.status(200).json({payload: products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({error: 'Error al obtener los productos' });
    }
});

// Ruta para obtener un producto por ID
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);

    if (isNaN(id)) {
        return res.status(400).json({error: 'El id debe ser numérico' });
    }

    try {
        const products = await productManager.getProducts();
        const producto = products.find(product => product.id === id);

        if (!producto) {
            return res.status(404).json({error: `El producto con el id: ${id} no es válido` });
        }

        return res.status(200).json({payload: producto });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({error: 'Error en el servidor' });
    }
});

// POSt Ruta para agregar un nuevo producto
router.post("/", async (req, res) => {
    let { title, ...otros } = req.body;

    if (!title) {
        return res.status(400).json({error: 'Debe completar el título de los productos' });
    }

    try {
        let productos = await productManager.getProducts();
        let existeProducto = productos.find(produ => produ.title.toLowerCase() === title.toLowerCase());

        if (existeProducto) {
            return res.status(400).json({error: `El producto ${title} ya existe` });
        }

        let productoNuevo = await productManager.addProduct({ title, ...otros });
        return res.status(200).json({payload: productoNuevo });
        
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        return res.status(500).json({error: 'Error en el servidor al agregar el producto' });
    }
});

// PUT→ Ruta para actualizar un producto por ID
router.put("/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El id debe ser numérico' });
    }
    // verificacion para saber si el id esta en el body
    if (req.body.id && req.body.id !== id) {
        return res.status(400).json({ error: 'No se permite modificar el id del producto' });
    }

    try {
        const productoModificado = await productManager.updateProduct(id, req.body);
        if (!productoModificado) {
            return res.status(404).json({ error: `El producto con el id: ${id} no es válido` });
        }
        return res.status(200).json({ payload: productoModificado });

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return res.status(500).json({ error: 'Error en el servidor al actualizar el producto' });
    }
});
// Ruta para buscar productos por nombre
router.post("/search", async (req, res) => {
    let { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Debe completar el nombre del producto' });
    }

    try {
        const products = await productManager.getProducts();
        const producto = products.find(product => product.title.toLowerCase() === title.toLowerCase());

        if (!producto) {
            return res.status(404).json({ error: `Error: El producto con el nombre '${title}' no existe en la lista` });
        }

        return res.status(200).json({ payload: producto });
    } catch (error) {
        console.error('Error al buscar el producto:', error);
        return res.status(500).json({ error: 'Error en el servidor al buscar el producto' });
    }
});


//DELETE 
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El id debe ser numérico' });
    }
    try {
        let productoEliminado = await productManager.deleteProduct(id);

        if (productoEliminado) {
            console.log('Producto eliminado (en router):', productoEliminado); 
            return res.status(200).json({ message: `Producto '${productoEliminado.title}' eliminado con éxito` });
        } else {
            return res.status(404).json({ error: `El producto con el id: ${id} no existe` });
        }

    } catch (error) {
        console.error('Error al borrar el producto:', error);
        return res.status(500).json({ error: 'Error en el servidor al borrar el producto' });
    }
});





export default router;

