document.addEventListener("DOMContentLoaded", () => {
  const addProduct = document.querySelector("#new-product-form > button");
  const deleteProduct = document.querySelector("#delete-product-form > button");

  addProduct.addEventListener("click", async (event) => {
    event.preventDefault();
    const productName = document.getElementById("title").value;
    const productDescription = document.getElementById("description").value;
    const productCode = document.getElementById("code").value;
    const productPrice = document.getElementById("price").value;
    const productStock = document.getElementById("stock").value;
    const productCategory = document.getElementById("category").value;
    const productThumbnails = document.getElementById("thumbnails").value;
    const productStatus = document.getElementById("status").value;
    try {

        const response = await fetch("/api/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: productName,
          description: productDescription,
          price: productPrice,
          thumbnails: productThumbnails,
          code: productCode,
          stock: productStock,
          status: productStatus,
          category: productCategory,
        }),
      });

      if (response.ok) {
        alert("Producto agregado correctamente");
        setTimeout(function () {
          location.reload();
        }, 1000);
      } else {
        console.error("Error al agregar el producto");
      }
    } catch (error) {
      console.error("Error en la solicitud POST", error);
    }
  });

  deleteProduct.addEventListener("click", async (event) => {
    event.preventDefault();
    const productId = document.querySelector("#idDelete").value;
    console.log(typeof productId);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Producto fue eliminado con exito");
        setTimeout(function () {
          location.reload();
        }, 1000);
      } else {
        console.error("No se encontro el producto");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  });
});