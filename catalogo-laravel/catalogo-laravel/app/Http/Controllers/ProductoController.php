<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductoController extends Controller
{
   
    public function index()
    {   
        return Producto::with('categorias')->get();
    }

    public function store(Request $request)
    {   
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'imagen' => 'nullable|string',
            'stock' => 'required|integer|min:8',
            'categorias' => 'nullable|array',
            'categorias.*' => 'exists:categorias,id', // Validar que las categorías existen
        ]);
        $producto = DB::transaction(function () use ($validated, $request) {
           $producto = Producto::create($validated);
        if($request->has('categorias')) {
            $producto->categorias()->sync($request->categorias);
        }
                return $producto;
        });
               return response()->json($producto, 201);
    }

    public function show(Producto $producto)
    {
        $producto->load('categorias');
        return response()->json($producto);
    }

    public function edit(Producto $producto)
    {
        //
    }

    public function update(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'sometimes|required|string',
            'precio' => 'sometimes|required|numeric|min:0',
            'imagen' => 'nullable|string',
            'categorias' => 'nullable|array',
        ]);
        
        $producto->update($validated);
        
        if($request->has('categorias')) {
            $producto->categorias()->sync($request->categorias);
        }
        
        return response()->json($producto, 200);
        //Devolver una respuesta JSON con el producto actualizado
    }

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();
        return response()->json(['message'=>'Producto eliminado correctamente'], 204);
        //Devolver una respuesta JSON indicando que el producto ha sido eliminado
    }
}
