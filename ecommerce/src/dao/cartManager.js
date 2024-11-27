import fs from 'fs/promises';
class CartManager{
    constructor(path){
        this.path = path;
        this.carts = [];
    }
    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.error("Error al cargar los carritos:", error);
            this.carts = [];
        }
    }
    // gurdar los productos cargados en el carrito
    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
        }
    }
    // Devuelve todos los carritos que se formaron
    async getCarts() {
        await this.loadCarts();
        return this.carts;
    }

    //devuelve los carritos por su ID
    async getCartById(id) {
        await this.loadCarts();
        const cart = this.carts.find(cart => cart.id === id);
        if(!cart){
            console.log("Carrito no encontrado")
            return null;
        }
        return cart 
    }
    //Agregar un nuevo carrito
    async addCart() {
        await this.loadCarts();
        const id = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
        const newCart = { id, products: [] };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }
    //agregar nuevos productos al carrito
    async addProductToCart(cid, pid) {
        await this.loadCarts();
        const cart = this.carts.find(cart => cart.id === cid);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await this.saveCarts();
        return cart;
    }


}
export default CartManager;