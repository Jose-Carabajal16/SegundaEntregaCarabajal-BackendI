import fs from 'fs/promises';

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    // Carga los productos desde el archivo
    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error("Error al cargar los productos:", error);
            this.products = [];
        }
    }

    // Guarda los productos en el archivo
    async saveProducts() { 
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }
    }

    // Devolver todos los productos
    async getProducts() {
        await this.loadProducts(); 
        return this.products;
    }

    // Devolver un producto por ID
    async getProductById(id) {
        await this.loadProducts(); 
        const producto = this.products.find(produ => produ.id === id);
        if (!producto) {
            console.log('Producto no encontrado');
            return null;
        }
        return producto; 
    }

    // Agrega un nuevo producto
    async addProduct(producto) {
        await this.loadProducts(); 
        const existeProducto = this.products.find(produ => produ.code === producto.code);
        if (existeProducto) {
            console.log(`El producto con el código: ${existeProducto.code} ya existe`);
            return;
        }
        const id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
        const newProduct = { id, ...producto };
        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct; 
    }

    // Actualiza un producto por ID
    async updateProduct(id, productoModificado = {}) {
        await this.loadProducts(); 
        const indiceProducto = this.products.findIndex(produ => produ.id === id);
        if (indiceProducto === -1) {
            console.log(`El producto con el id: ${id} no existe`);
            return null;
        }


        const productoExistente = this.products[indiceProducto];

        const productoActualizado = {
            ...productoExistente, 
            ...productoModificado, 
            id: productoExistente.id 
        };

        this.products[indiceProducto] = productoActualizado;

        // Guardar los productos actualizados
        await this.saveProducts();
        return this.products[indiceProducto]; 
    }
    //borrar un producto    
    async deleteProduct(id) {
        await this.loadProducts(); 
        const indiceProducto = this.products.findIndex(produ => produ.id === id);
        
        if (indiceProducto === -1) {
            console.log(`El producto con el id: ${id} no existe`);
            return null;
        }
    
        const productoEliminado = this.products[indiceProducto];
        
        console.log('Producto eliminado:', productoEliminado); 

        this.products = this.products.filter(produ => produ.id !== id);
        
        await this.saveProducts();

        return productoEliminado;
    }
    

}


export default ProductManager;
