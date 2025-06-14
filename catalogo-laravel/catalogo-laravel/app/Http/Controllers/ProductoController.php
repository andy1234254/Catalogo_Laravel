<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductoController extends Controller
{
    // Devuelve todos los productos con sus categorías asociadas
    public function index()
    {   
        return Producto::with('categorias')->get();
    }

    // Crea un nuevo producto
    public function store(Request $request)
    {   
        // Valida los datos recibidos
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'imagen' => 'nullable|string',
            'stock' => 'required|integer|min:8', // OJO: stock mínimo 8
            'categorias' => 'nullable|array',
            'categorias.*' => 'exists:categorias,id', // Cada categoría debe existir
        ]);

        // Usa una transacción para crear el producto y asociar categorías
        $producto = DB::transaction(function () use ($validated, $request) {
            $producto = Producto::create($validated); // Crea el producto
            if($request->has('categorias')) {
                $producto->categorias()->sync($request->categorias); // Asocia categorías
            }
            return $producto;
        });

        // Devuelve el producto creado con código 201 (creado)
        return response()->json($producto, 201);
    }

    // Devuelve un producto específico con sus categorías
    public function show(Producto $producto)
    {
        $producto->load('categorias');
        return response()->json($producto);
    }

    // (No implementado) Muestra el formulario de edición (no se usa en API REST)
    public function edit(Producto $producto)
    {
        //
    }

    // Actualiza un producto existente
    public function update(Request $request, Producto $producto)
    {
        // Valida los datos recibidos (solo los campos enviados)
        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'sometimes|required|string',
            'precio' => 'sometimes|required|numeric|min:0',
            'imagen' => 'nullable|string',
            'stock' => 'sometimes|required|integer|min:0',
            'categorias' => 'nullable|array',
        ]);

        // Solo actualiza los campos que vienen en la request
        if ($request->has('titulo')) $producto->titulo = $request->titulo;
        if ($request->has('descripcion')) $producto->descripcion = $request->descripcion;
        if ($request->has('precio')) $producto->precio = $request->precio;
        if ($request->has('stock')) $producto->stock = $request->stock;
        if ($request->has('imagen')) $producto->imagen = $request->imagen;

        $producto->save();

        // 2Si se envían categorías, sincroniza la relación
        if($request->has('categorias')) {
            $producto->categorias()->sync($request->categorias);
        }

        // Devuelve el producto actualizado
        return response()->json($producto, 200);
    }

    // Elimina un producto por ID
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id); // Busca el producto o falla
        $producto->delete(); // Elimina el producto
        // Devuelve respuesta 204 (sin contenido) y mensaje
        return response()->json(['message'=>'Producto eliminado correctamente'], 204);
    }
}
