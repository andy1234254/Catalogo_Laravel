// Referencias a elementos del DOM
const contenedorProductos = document.getElementById("productos"); // Contenedor donde se mostrarán los productos
const inputBusqueda = document.getElementById("busqueda"); // Formulario de búsqueda

// Botones de filtro
const btnTodos = document.getElementById("btn-todos");
const btnTecnologia = document.getElementById("btn-tecnologia");
const btnHombre = document.getElementById("btn-hombre");
const btnMujer = document.getElementById("btn-mujer");
const btnJoyas = document.getElementById("btn-joyas");

// Variable global para almacenar todos los productos cargados desde la API
let productos = [];
let categoriaSeleccionada = "all";

// Lógica de login
document.addEventListener("DOMContentLoaded", () => {
    const loginform = document.getElementById("loginForm");

    if (loginform) {
        loginform.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evita el comportamiento por defecto del formulario
            const username = document.getElementById("username").value; // Obtiene el nombre de usuario
            const password = document.getElementById("password").value; // Obtiene la contraseña
            const mensaje = document.getElementById("mensaje"); // Mensaje de error
            try {
                const response = await fetch("http://127.0.0.1:8000/api/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username,
                            password,
                        }),
                    });
                // Verifica si la respuesta es exitosa
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }
                const data = await response.json();
                localStorage.setItem("token", data.token); // Guarda el token en localStorage
                mensaje.textContent = "Inicio de sesion exitoso"; // Mensaje de éxito
                mensaje.classList.add("text-green-500"); // Cambia el color del mensaje a verde
                setTimeout(() => {
                    window.location.href = "index.html"; // Redirige a la página principal después de 1.5 segundos
                }, 1500);
            } catch (error) {
                console.error("Error al iniciar sesión:", error); // Muestra el error en la consola
                mensaje.textContent = "Error al iniciar sesión"; // Mensaje de error
                mensaje.classList.add("text-red-500"); // Cambia el color del mensaje a rojo
            }
        });
    }

    if (contenedorProductos && inputBusqueda) {
        cargarProductos(); // Carga los productos al cargar la página
        inputBusqueda.addEventListener("input", filtrarProductos); // Agrega un evento al campo de búsqueda

        // Eventos para los botones de filtro
        btnTodos.addEventListener("click", () => {
            categoriaSeleccionada = "all";
            filtrarProductos();
        });
        btnTecnologia.addEventListener("click", () => {
            categoriaSeleccionada = "electronics";
            filtrarProductos();
        });
        btnHombre.addEventListener("click", () => {
            categoriaSeleccionada = "men's clothing";
            filtrarProductos();
        });
        btnMujer.addEventListener("click", () => {
            categoriaSeleccionada = "women's clothing";
            filtrarProductos();
        });
        btnJoyas.addEventListener("click", () => {
            categoriaSeleccionada = "jewelery";
            filtrarProductos();
        });
    }

    // Botón de cerrar sesión
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("token"); // Elimina el token
            window.location.href = "login.html"; // Redirige al login
        });
    }
});

// Lógica de productos
async function cargarProductos() {
    try {
        const respuesta = await fetch("http://127.0.0.1:8000/api/productos");
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }
        productos = await respuesta.json();
        if (productos.length === 0) {
            console.log("No hay productos disponibles");
        } else {
            mostrarProductos(productos); // Muestra todos los productos al cargar la página
        }
    } catch (error) {
        console.error("Error al cargar los productos:", error); // Muestra el error en la consola
    }
}

function filtrarProductos() {
    let filtrados = productos;
    if (categoriaSeleccionada !== "all") {
        filtrados = productos.filter((p) => p.category === categoriaSeleccionada);
    }
    const texto = inputBusqueda.value.toLowerCase();
    if (texto.trim() !== "") {
        filtrados = filtrados.filter((p) =>
            p.titulo.toLowerCase().includes(texto) ||
            p.descripcion.toLowerCase().includes(texto)
        );
    }
    mostrarProductos(filtrados); // Muestra los productos filtrados
}

function mostrarProductos(productos) {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.className =
            "bg-white rounded-lg shadow-md p-4 m-2 flex flex-col items-center hover:shadow-lg transition-shadow duration-300";
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}" class="w-32 h-32 object-cover mb-4">
            <h3 class="text-lg font-semibold mb-2">${producto.titulo}</h3>
            <p class="text-gray-700 mb-2">${producto.descripcion}</p>
            <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300" onclick="window.location.href='detalle.html?id=${producto.id}'">
                Ver Detalles
            </button>
            <button class="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300">
                Agregar al carrito
            </button>
        `;
        contenedorProductos.appendChild(productoDiv);
    });
}