<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
 Route::resource('productos', ProductoControllet::class);
 //Asocia la url y metodo HTTP(GET, POST, PUT, DELETE) a un controlador y sus metodos