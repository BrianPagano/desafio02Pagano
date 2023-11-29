const fs = require ('fs').promises

class ProductManager {

    constructor(filePath) {
        this.products = []
        this.id = 1
        this.path = filePath   
    }

    async addProduct(title,description,price,thumbnail,code,stock) {
 
      //Valido que todos los campos son obligatorios
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        return console.error ("Todos los campos son obligatorios. Producto no agregado.")
      }

      //valido si ya existe el code
      const codeExist = this.products.find(product => product.code === code)
      if (codeExist) {
       console.error (`El producto con code: ${code} ya existe, por favor seleccione otro`)
       return
      }

      const newProduct = {
        id: this.id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      }
      //pusheo el nuevo producto
      this.products.push(newProduct)
      //incremento el ID solo si todos los chequeos pasan ok
      this.id++
      
      await this.updateFile()

      }

    async updateFile() {
      try {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'), 'utf8')
        console.log("Archivo actualizado correctamente")
      } catch (error) {
        console.error("Error al actualizar el archivo:", error.message)
      }
    }

    async updateProduct(productUpdated) {
      try {
        let product = this.products.find((p) => p.id === productUpdated.id)
        if (!product) {
          console.error("Producto no encontrado con ID:", productUpdated.id)
          return
        }
  
        let productIndex = this.products.indexOf(product)
        this.products[productIndex] = productUpdated
  
        // Actualiza el archivo después de la modificación
        this.updateFile()
  
        console.log("Producto actualizado correctamente")
      } catch (error) {
        console.error("Error al actualizar el producto:", error.message)
      }
    }
  

    async getProducts() {
      try {
        const contenidoJson = await fs.readFile(this.path, 'utf8')
        if (!contenidoJson.trim()) {
          return [] // Devuelve un array vacío si el archivo está vacío
        }
        const objetoRecuperado = JSON.parse(contenidoJson)
        console.log(objetoRecuperado)
        return objetoRecuperado // Devuelve el array de productos
      } catch (error) {
        console.error('No se puede leer el archivo, error:', error.message)
      }
    }

    async getProductByID (id) {
      try {
        const contenidoJson = await fs.readFile (this.path, 'utf8')
        const objetoRecuperado =  JSON.parse(contenidoJson)
        const findID = objetoRecuperado.find (product => product.id === id)
        if (findID) return console.log (findID)
      } catch (error) {
          console.log ('Not Found')
        } 
    }
  }


async function test() {
  const productManager = new ProductManager('./archivo/products.json')

  // Obtener los productos agregados
  const productsBeforeAdd = await productManager.getProducts()
  console.log("Productos antes de agregar:", productsBeforeAdd)

  // Agregar productos de prueba
  await productManager.addProduct('producto prueba1', 'Este es un producto prueba', 200, 'sin imagen', 'abc123', 25)

  // Obtener los productos despues de agregar el de prueba
  const productsAfterAdd = await productManager.getProducts()
  console.log("Productos despues de agregar:", productsAfterAdd)
}

test()

/* //modifico producto por id
await productManager.updateProduct({
  id: 1,
  title: 'producto modificado',
  description: 'Este es un producto modificado',
  price: 300,
  thumbnail: 'imagen modificada',
  code: 'abc567',
  stock: 30,
}) 
 */

/* //buscar por id
await productManager.getProductByID(2) */