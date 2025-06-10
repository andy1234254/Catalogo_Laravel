<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = [
        'titulo',
        'descripcion',
        'precio',
        'imagen',
        'stock',
        'slug',
    ];
    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'categoria_producto');
    }
    public function carritoProductos(){
        return $this->hasMany(CarritoProducto::class);
    }
    public function pedidoProductos()
    {
        return $this->hasMany(PedidoProducto::class);
    }
}
