const socket = io()

const productName = document.getElementById("title").value
const productDescription = document.getElementById("description").value
const productCode = document.getElementById("code").value
const productPrice = document.getElementById("price").value
const productStock = document.getElementById("stock").value
const productCategory = document.getElementById("category").value
const productThumbnails = document.getElementById("thumbnails").value
const productStatus = document.getElementById("status").value

async function addNewProduct() {
  try {

    const response = await fetch('/realtimeproducts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: productName,
        description: productDescription,
        code: productCode,
        price: productPrice,
        status: productStatus,
        stock: productStock,
        category: productCategory,
        thumbnails: productThumbnails
      })
    })

    if (response.ok) {
      console.log('Producto agregado correctamente')
      const data = await response.text()

      socket.emit('addProduct', {
        title: productName,
        description: productDescription,
        code: productCode,
        price: productPrice,
        status: productStatus,
        stock: productStock,
        category: productCategory,
        thumbnails: productThumbnails
      })

      document.getElementById("new-product-form").reset()
    } else {
      console.error('Error al agregar el producto')
    }
  } catch (error) {
    console.error('Error en la solicitud POST', error)
  }
}

function deleteProduct(){
  const productTitleDelete = document.getElementById("titleDelete").value

  const elementos = document.querySelectorAll('.card');
  elementos.forEach(elemento => {
    const title = elemento.querySelector('.title').textContent
    console.log(title)
    if (title == productTitleDelete) {
      elemento.style.display = 'none'
    }
  })
}