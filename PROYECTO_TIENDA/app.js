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
            e.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            const mensaje = document.getElementById("mensaje");

            // Validar campos vacíos
            if (!username || !password) {
                mensaje.textContent = "Usuario y contraseña son obligatorios.";
                mensaje.className = "text-center mt-4 text-sm text-red-500";
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: username,
                        password: password,
                    }),
                });

                if (!response.ok) {
                    // Intenta obtener el mensaje de error del backend
                    let errorMsg = "Usuario o contraseña incorrectos.";
                    try {
                        const errorData = await response.json();
                        if (errorData && errorData.message) {
                            errorMsg = errorData.message;
                        }
                    } catch {}
                    mensaje.textContent = errorMsg;
                    mensaje.className = "text-center mt-4 text-sm text-red-500";
                    return;
                }

                const data = await response.json();
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("rol", data.user.rol);
                mensaje.textContent = "Inicio de sesión exitoso";
                mensaje.className = "text-center mt-4 text-sm text-green-500";
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } catch (error) {
                mensaje.textContent = "Error de conexión con el servidor.";
                mensaje.className = "text-center mt-4 text-sm text-red-500";
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

    // Tarjeta "Agregar Producto" solo para admin
    if (localStorage.getItem("rol") === "admin") {
        const agregarDiv = document.createElement("div");
        agregarDiv.className = "bg-white rounded-lg shadow-md p-4 m-2 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-300 cursor-pointer";
        agregarDiv.style.minHeight = "260px";
        agregarDiv.onclick = () => mostrarFormularioProducto();
        agregarDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <div class="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 text-4xl">
                    +
                </div>
                <span class="text-lg font-semibold text-blue-700">Agregar Producto</span>
            </div>
        `;
        contenedorProductos.appendChild(agregarDiv);
    }

    // Renderiza los productos normalmente
    productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.className =
            "bg-white rounded-lg shadow-md p-4 m-2 flex flex-col items-center hover:shadow-lg transition-shadow duration-300";
        productoDiv.innerHTML = `
            <img src="${producto.imagen || 'https://firebasestorage.googleapis.com/v0/b/catalogo-laravel.firebasestorage.app/o/productos%2Fimagen.png?alt=media&token=dbed14e2-315d-4a7c-bc7d-48057bf471c0'}" alt="${producto.titulo}" class="w-32 h-32 object-cover mb-4">
            <h3 class="text-lg font-semibold mb-2">${producto.titulo}</h3>
            <p class="text-green-600 font-bold mb-2">$${producto.precio}</p>
            <div class="flex flex-col space-y-2 w-full">
                <button onclick="window.location.href='detalle.html?id=${producto.id}'" class="bg-blue-500 text-white px-4 py-2 rounded">Ver Detalles</button>
                ${localStorage.getItem("rol") === "admin" ? `
                    <button onclick="editarProducto(${producto.id})" class="bg-yellow-400 text-white px-4 py-2 rounded">Editar</button>
                    <button onclick="eliminarProducto(${producto.id})" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
                ` : ""}
            </div>
        `;
        contenedorProductos.appendChild(productoDiv);
    });
}

window.eliminarProducto = async function(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    const token = localStorage.getItem("token");
    const resp = await fetch(`http://127.0.0.1:8000/api/productos/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (resp.ok) {
        alert("Producto eliminado");
        cargarProductos();
    } else {
        alert("No se pudo eliminar el producto");
    }
}


// Firebase config (asegúrate de tener esto al inicio)
const firebaseConfig = {
  apiKey: "AIzaSyAXAs3gZQj1oyc4hvfSf8ndsDjVOLZbLMc",
  authDomain: "catalogo-laravel.firebaseapp.com",
  projectId: "catalogo-laravel",
  storageBucket: "catalogo-laravel.firebasestorage.app", // <-- CORREGIDO
  messagingSenderId: "557585264194",
  appId: "1:557585264194:web:4b9508d03e577f3f6a87db",
  measurementId: "G-HD8SYL4806"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();


// Mostrar el modal para editar producto (botón "Editar")
window.editarProducto = function(id) {
    const producto = productos.find(p => p.id == id); // Usa == para comparar string y número
    mostrarFormularioProducto(producto);
};

// Función para mostrar el modal y rellenar datos si es edición
function mostrarFormularioProducto(producto = null) {
    document.getElementById("modal-bg").classList.remove("hidden");
    document.getElementById("form-title").textContent = producto ? "Editar Producto" : "Nuevo Producto";
    document.getElementById("productoId").value = producto ? producto.id : "";
    document.getElementById("titulo").value = producto ? producto.titulo : "";
    document.getElementById("descripcion").value = producto ? producto.descripcion : "";
    document.getElementById("precio").value = producto ? producto.precio : "";
    document.getElementById("stock").value = producto ? producto.stock : "";
    document.getElementById("imagen").value = "";
    document.getElementById("categoria").value = (producto && producto.categorias && producto.categorias.length > 0)
        ? producto.categorias[0].id
        : "";
}

// Ocultar el modal
function ocultarFormularioProducto() {
    document.getElementById("modal-bg").classList.add("hidden");
}

// Cerrar modal al hacer clic en cancelar o en la X
document.getElementById("cancelarForm").onclick = ocultarFormularioProducto;
document.getElementById("cerrarModal").onclick = ocultarFormularioProducto;

// Cerrar modal al hacer clic fuera del formulario
document.getElementById("modal-bg").onclick = function(e) {
    if (e.target === this) ocultarFormularioProducto();
};

// Manejar envío del formulario (crear o editar producto)
document.getElementById("productoForm").onsubmit = async function (e) {
    e.preventDefault();
    const spinner = document.getElementById("spinner");
    const spinnerText = document.getElementById("spinner-text");
    const btnGuardar = document.querySelector('#productoForm button[type="submit"]');
    btnGuardar.disabled = true;

    try {
        spinner.classList.remove("hidden");
        spinnerText.textContent = "Subiendo imagen...";

        const id = document.getElementById("productoId").value;
        const idNum = parseInt(id, 10);
        const titulo = document.getElementById("titulo").value;
        const descripcion = document.getElementById("descripcion").value;
        const precio = document.getElementById("precio").value;
        const stock = document.getElementById("stock").value;
        const imagenInput = document.getElementById("imagen");
        let imagenUrl = "";
        const categoriaId = document.getElementById("categoria").value;

        // Validar imagen obligatoria al crear
        if ((!id || isNaN(idNum)) && imagenInput.files.length === 0) {
            spinner.classList.add("hidden");
            btnGuardar.disabled = false;
            alert("Debes seleccionar una imagen para el producto.");
            return;
        }

        // Subir imagen a Firebase si hay archivo
        if (imagenInput.files.length > 0) {
            const archivo = imagenInput.files[0];
            const storageRef = storage.ref().child('productos/' + Date.now() + '_' + archivo.name);
            imagenUrl = await new Promise((resolve, reject) => {
                const uploadTask = storageRef.put(archivo);
                uploadTask.on(
                    "state_changed",
                    null,
                    (error) => reject(error),
                    async () => {
                        const url = await uploadTask.snapshot.ref.getDownloadURL();
                        resolve(url);
                    }
                );
            });
        }

        spinnerText.textContent = "Guardando producto...";

        const token = localStorage.getItem("token");
        let body = {
            titulo,
            descripcion,
            precio: parseFloat(precio),
            stock: parseInt(stock),
            categorias: [parseInt(categoriaId)]
        };

        // Si es edición y no se subió imagen, conserva la anterior
        if (id && !isNaN(idNum)) {
            if (imagenUrl) {
                body.imagen = imagenUrl;
            } else {
                const producto = productos.find(p => p.id == idNum);
                if (producto && producto.imagen) body.imagen = producto.imagen;
            }
        } else {
            // Si es nuevo, imagen es obligatoria
            body.imagen = imagenUrl;
        }

        let url = "http://127.0.0.1:8000/api/productos";
        let method = "POST";
        if (id && !isNaN(idNum)) {
            url += "/" + idNum;
            method = "PUT";
        }

        const resp = await fetch(url, {
            method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (resp.ok) {
            ocultarFormularioProducto();
            await cargarProductos();
        } else {
            alert("Error al guardar el producto");
        }
    } catch (error) {
        alert("Error al subir la imagen o guardar el producto");
        console.error(error);
    } finally {
        spinner.classList.add("hidden");
        btnGuardar.disabled = false;
    }
};
});