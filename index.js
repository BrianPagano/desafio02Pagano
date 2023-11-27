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
      
      try {
        await fs.writeFile (this.path, JSON.stringify(this.products, null, this.products.length), 'utf8')
        console.log ('Archivo creado correctamente')
          } catch (error) {
            console.error('error al crear el archivo', error.message)
          }   
    }

    async getProducts () {
      try {
        const contenidoJson = await fs.readFile (this.path, 'utf8')
        const objetoRecuperado =  JSON.parse(contenidoJson)
        return console.log(objetoRecuperado)
      } catch (error) {
        console.error ('No se puede leer el archivo, error:', error.message)
      }
    }

    async getProductByID (id) {
      try {
        const contenidoJson = await fs.readFile (this.path, 'utf8')
        const objetoRecuperado =  JSON.parse(contenidoJson)
        const findID = objetoRecuperado.find (product => product.id === id)
        if (findID) return findID
      } catch (error) {
          console.log ('Not Found')
        } 
    }
}


const productManager = new ProductManager('./archivo/products.json')
productManager.addProduct('producto prueba1', 'Este es un producto prueba', 200, 'sin imagen', 'abc123', 25)
productManager.addProduct('producto prueba2', 'Este es un producto prueba', 200, 'sin imagen', 'abc1234', 25)
productManager.addProduct('producto prueba3', 'Este es un producto prueba', 200, 'sin imagen', 'abc12345', 25)
productManager.addProduct('producto prueba3', 'Este es un producto prueba', 200, 'sin imagen', 'abc123456', 25)


//obtener los productos agregados
console.log (productManager.getProducts())

//buscar por id
console.log (productManager.getProductByID(2))
