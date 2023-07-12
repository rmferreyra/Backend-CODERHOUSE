import fs from 'fs/promises'
import path from 'path'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {

  constructor(filename) {
    this.filename = filename
    this.filepath = path.join(__dirname, this.filename)
    this.products = []
  }
  
    // async addProduct(producto) {
    //     const data = await fs.readFile(this.filepath, 'utf-8')
    //     const productos = JSON.parse(data)
      
    //     const newId = productos[productos.length - 1]?.id || 0
      
    //     productos.push({
    //         ...producto,            
    //         id:newId + 1
    //     })
        
    //     await fs.writeFile(this.filepath, JSON.stringify(productos,null,2))
    // }

    async getProducts(){
        const data = await fs.readFile(this.filepath, 'utf-8')
        const productos = JSON.parse(data)
        return productos
    }

//     async getProductById(id){
//         const data = await fs.readFile(this.filepath, 'utf-8')
//         const productos = JSON.parse(data)
        
//         const searchResult = productos.find((el) => el.id === id);
    
//         let respuesta = searchResult??"NOT FOUND"
   
//         return respuesta;        
//     }

//     async deleteProduct(id){
//         const data = await fs.readFile(this.filepath, 'utf-8')
//         const productos = JSON.parse(data)
//         const indiceObjeto = productos.findIndex(objeto => objeto.id === id);
//         productos.splice(indiceObjeto, 1);
//         await fs.writeFile(this.filepath, JSON.stringify(productos,null,2))             
//     }

//     async updateProduct(id, updatedFields) {
//         const data = await fs.readFile(this.filepath, 'utf-8')
//         const productos = JSON.parse(data)
//         const productoIndex = productos.findIndex((objeto) => objeto.id === id);
    
//         if (productoIndex !== -1) {
//           const productoActualizado = {
//             ...productos[productoIndex],
//             ...updatedFields,
//             id: productos[productoIndex].id
//           };
    
//           productos[productoIndex] = productoActualizado;
//           await fs.writeFile(this.filepath, JSON.stringify(productos, null, 2));
//         }
//       }
//     }
  
//   const producto1 = new ProductManager(path.join(__dirname,'productos.json'));
  
//   async function main(){
//   await producto1.addProduct({
//     title: "Montana",
//     descripcion: "Tour por Alta Montaña con degustaciones varias",
//     price: 8500,
//     thumbnail: "./images/altaMontana.jpg",
//     code: "almo01",
//     stock: 1,
//   });

//   await producto1.addProduct({
//     title: "Bodega",
//     descripcion: "Paseo y almuerzo por bodega",
//     price: 15000,
//     thumbnail: "./images/bodega.jpg",
//     code: "bode01",
//     stock: 1,
//   });

//   await producto1.addProduct({
//     title: "City",
//     descripcion: "City Tour con almuerzo",
//     price: 12000,
//     thumbnail: "./images/city.jpg",
//     code: "city01",
//     stock: 1,
//   });

//   await producto1.updateProduct(1, {
//     price: 9500,
//     stock: 2
//   });

//   console.log(await producto1.getProducts());

}

// main()

export default ProductManager