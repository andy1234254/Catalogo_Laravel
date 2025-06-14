// Referencias a elementos del DOM
const contenedorProductos = document.getElementById("productos"); // Contenedor donde se mostrarán los productos
const inputBusqueda = document.getElementById("busqueda"); // Input de búsqueda



// Variables globales
let productos = []; // Aquí se guardan todos los productos cargados de la API
let categoriaSeleccionada = "all"; // Categoría seleccionada para filtrar

// Lógica principal que se ejecuta cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
    // --- LOGIN ---
    const loginform = document.getElementById("loginForm");
    if (loginform) {
        // Maneja el envío del formulario de login
        loginform.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evita el envío tradicional

            // Obtiene usuario y contraseña
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            const mensaje = document.getElementById("mensaje"); // Elemento para mostrar mensajes

            // Valida campos vacíos
            if (!username || !password) {
                mensaje.textContent = "Usuario y contraseña son obligatorios.";
                mensaje.className = "text-center mt-4 text-sm text-red-500";
                return;
            }

            try {
                // Hace la petición al backend para autenticar
                const response = await fetch("http://127.0.0.1:8000/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: username, // Cambia a 'username' si tu backend lo requiere
                        password: password,
                    }),
                });

                // Si la respuesta es incorrecta, muestra mensaje de error
                if (!response.ok) {
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

                // Si el login es exitoso, guarda token y rol en localStorage
                const data = await response.json();
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("rol", data.user.rol);

                // Muestra mensaje de éxito y redirige al index
                mensaje.textContent = "Inicio de sesión exitoso";
                mensaje.className = "text-center mt-4 text-sm text-green-500";
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } catch (error) {
                // Si hay error de red, muestra mensaje
                mensaje.textContent = "Error de conexión con el servidor.";
                mensaje.className = "text-center mt-4 text-sm text-red-500";
            }
        });
    }

    // --- PRODUCTOS ---
    if (contenedorProductos && inputBusqueda) {
        cargarProductos(); // Carga los productos al cargar la página
        inputBusqueda.addEventListener("input", filtrarProductos); // Filtra productos al escribir
    }

    // --- LOGOUT ---
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("token"); // Elimina el token
            window.location.href = "login.html"; // Redirige al login
        });
    }

    // --- FUNCIONES DE PRODUCTOS ---

    // Carga productos desde la API
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
                mostrarProductos(productos); // Muestra todos los productos
            }
        } catch (error) {
            console.error("Error al cargar los productos:", error);
        }
    }

    // Filtra productos por categoría y texto de búsqueda
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

    // Muestra los productos en el DOM
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

    // Elimina un producto (solo admin)
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
    };

    // --- FIREBASE CONFIGURACIÓN ---
    const firebaseConfig = {
        apiKey: "AIzaSyAXAs3gZQj1oyc4hvfSf8ndsDjVOLZbLMc",
        authDomain: "catalogo-laravel.firebaseapp.com",
        projectId: "catalogo-laravel",
        storageBucket: "catalogo-laravel.firebasestorage.app", // <-- CORREGIDO
        messagingSenderId: "557585264194",
        appId: "",
        measurementId: "G-HD8SYL4806"
    };
    firebase.initializeApp(firebaseConfig);
    const storage = firebase.storage();

    // --- MODAL DE PRODUCTO (crear/editar) ---

    // Abre el modal para editar producto
    window.editarProducto = function(id) {
        const producto = productos.find(p => p.id == id); // Busca el producto por ID
        mostrarFormularioProducto(producto);
    };

    // Muestra el formulario de producto (para crear o editar)
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

    // Oculta el modal
    function ocultarFormularioProducto() {
        document.getElementById("modal-bg").classList.add("hidden");
    }

    // Cierra el modal al hacer clic en cancelar o en la X
    document.getElementById("cancelarForm").onclick = ocultarFormularioProducto;
    document.getElementById("cerrarModal").onclick = ocultarFormularioProducto;

    // Cierra el modal al hacer clic fuera del formulario
    document.getElementById("modal-bg").onclick = function(e) {
        if (e.target === this) ocultarFormularioProducto();
    };

    // Maneja el envío del formulario de producto (crear o editar)
    //Evento onesubmit
    document.getElementById("productoForm").onsubmit = async function (e) {
        e.preventDefault(); // Evita que el formulario recargue la página al enviarse

        // Referencias a elementos del modal para mostrar feedback al usuario
        const spinner = document.getElementById("spinner");
        const spinnerText = document.getElementById("spinner-text");
        const btnGuardar = document.querySelector('#productoForm button[type="submit"]');
        btnGuardar.disabled = true; // Desactiva el botón para evitar envíos múltiples

        try {
            spinner.classList.remove("hidden"); // Muestra el spinner de carga
            spinnerText.textContent = "Subiendo imagen..."; // Mensaje de estado

            // Obtiene los valores del formulario
            const id = document.getElementById("productoId").value; // ID del producto (vacío si es nuevo)
            const idNum = parseInt(id, 10); // Convierte el ID a número
            const titulo = document.getElementById("titulo").value;
            const descripcion = document.getElementById("descripcion").value;
            const precio = document.getElementById("precio").value;
            const stock = document.getElementById("stock").value;
            const imagenInput = document.getElementById("imagen"); // Input de archivo de imagen
            let imagenUrl = ""; // Aquí se guardará la URL de la imagen subida
            const categoriaId = document.getElementById("categoria").value;

            // Validación: Si es creación y no hay imagen, muestra alerta y detiene el proceso
            if ((!id || isNaN(idNum)) && imagenInput.files.length === 0) {
                spinner.classList.add("hidden");
                btnGuardar.disabled = false;
                alert("Debes seleccionar una imagen para el producto.");
                return;
            }

            // Si el usuario seleccionó una imagen, súbela a Firebase Storage
            if (imagenInput.files.length > 0) {
                const archivo = imagenInput.files[0];
                const storageRef = storage.ref().child('productos/' + Date.now() + '_' + archivo.name);
                imagenUrl = await new Promise((resolve, reject) => {
                    const uploadTask = storageRef.put(archivo);
                    uploadTask.on(
                        "state_changed",
                        null,
                        (error) => reject(error), // Si hay error al subir
                        async () => {
                            const url = await uploadTask.snapshot.ref.getDownloadURL();
                            resolve(url); // Obtiene la URL de la imagen subida
                        }
                    );
                });
            }

            spinnerText.textContent = "Guardando producto..."; // Cambia el mensaje del spinner

            // Prepara los datos a enviar al backend
            const token = localStorage.getItem("token");
            let body = {
                titulo,
                descripcion,
                precio: parseFloat(precio),
                stock: parseInt(stock),
                categorias: [parseInt(categoriaId)]
            };

            // Si es edición y no se subió imagen nueva, conserva la imagen anterior
            if (id && !isNaN(idNum)) {
                if (imagenUrl) {
                    body.imagen = imagenUrl;
                } else {
                    const producto = productos.find(p => p.id == idNum);
                    if (producto && producto.imagen) body.imagen = producto.imagen;
                }
            } else {
                // Si es nuevo, la imagen es obligatoria
                body.imagen = imagenUrl;
            }

            // Decide si es creación (POST) o edición (PUT)
            let url = "http://127.0.0.1:8000/api/productos";
            let method = "POST";
            if (id && !isNaN(idNum)) {
                url += "/" + idNum;
                method = "PUT";
            }

            // Envía la petición al backend con los datos del producto
            const resp = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            // Si la respuesta es exitosa, cierra el modal y recarga los productos
            if (resp.ok) {
                ocultarFormularioProducto();
                await cargarProductos();
            } else {
                alert("Error al guardar el producto");
            }
        } catch (error) {
            // Si ocurre un error en cualquier parte del proceso, muestra alerta
            alert("Error al subir la imagen o guardar el producto");
            console.error(error);
        } finally {
            // Oculta el spinner y habilita el botón de guardar
            spinner.classList.add("hidden");
            btnGuardar.disabled = false;
        }
    };
});