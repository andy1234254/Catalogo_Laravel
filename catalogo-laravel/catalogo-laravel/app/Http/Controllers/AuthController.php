<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function index()
    {
        // Verifica que el usuario sea admin
        if (auth()->user()->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }
 
        // Retorna todos los usuarios
        return User::all();
    }
    public function register (Request $request)
    {
        // Lógica para registrar un nuevo usuario
        // Validar los datos de entrada
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Crear el usuario
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'rol' => 'cliente', // Asignar rol por defecto
        ]);

        // Retornar una respuesta exitosa
        return response()->json(['message' => 'Usuario registrado exitosamente'], 201);
    }
    
 
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }
        // generar token
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]); // Se retorna el token y el usuario autenticado
    }
    public function logout(Request $request)
    {
        //Revocar el token de acceso del usuario
        $request->user()->currentAccessToken()->delete();
        //Retornar una respuesta exitosa
        return response()->json(['message' => 'Sesión cerrada exitosamente'], 200);

    }
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
 
}
