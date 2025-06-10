<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\AuthController;

//Rutas Publicas
Route::get('productos', [ProductoController::class, 'index']);
Route::get('productos/{producto}', [ProductoController::class, 'show']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('is_admin')->group(function () {
    Route::post('productos', [ProductoController::class, 'store']);
    Route::put('productos/{id}', [ProductoController::class, 'update']);
    Route::delete('productos/{id}', [ProductoController::class, 'destroy']);
});
}
);
