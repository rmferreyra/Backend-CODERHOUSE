document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart")
  const viewCartButton = document.getElementById("viewCartButton")
  const cleanCart = document.querySelectorAll(".clean-cart")
  const email = document.querySelector(".email").textContent.trim();

  viewCartButton.addEventListener("click", async (event) => {
    event.preventDefault()

    let cartId = getCartIdFromCookie();
    if (cartId != null) {
      window.location.href = `/cart/${cartId}`;
    } else {
      const response = await fetch(`http://localhost:8080/api/carts/${email}`, {
        method: "GET",
      });
      if (response.ok) {
        const responseData = await response.json();
        cartId = responseData;
        document.cookie = `cartID=${cartId}`;
        window.location.href = `/cart/${cartId}`;
      } else {
        alert("Hubo un error en el carrito");
        return;
      }
    }
  });

  cleanCart.forEach(button => {
    button.addEventListener("click", async (event)=>{
      event.preventDefault()
      let cartId = getCartIdFromCookie()
      if (cartId){
        const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, {
          method: "DELETE",
        })
        if (response.ok) {
          location.reload()
        } else {
          alert("Error al vaciar el carrito, intente luego.")
          return
        }      
      }
    })
  })


  function getCartIdFromCookie() {
    const cookiesSplitt = document.cookie.split(";");
    const cartCookie = cookiesSplitt.find((cookie) =>
      cookie.trim().startsWith("cartID=")
    );

    if (cartCookie) {
      const [, cartId] = cartCookie.trim().split("=");
      return cartId;
    }

    return null;
  }

  addToCartButtons.forEach(button => {
    button.addEventListener("click", async (event) => {
      event.preventDefault()
      const productId = button.getAttribute("data-product-id")
      try {
        let cartId = getCartIdFromCookie()
        if (!cartId) {
          const response = await fetch(`http://localhost:8080/api/carts`, {
            method: "POST",
          })
          if (response.ok) {
            const responseData = await response.json()
            cartId = responseData.newCart._id
            document.cookie = `cartID=${cartId}`
          } else {
            alert("Error al crear el carrito")
            return
          }
        }
        const response = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, {
          method: "POST",
        })
        if (response.ok) {
          alert("Producto agregado al carrito con exito")
        } else {
          alert("Error al agregar el producto al carrito")
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error)
      }
    })
  })
})