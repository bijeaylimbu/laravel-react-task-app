<?php
namespace App\Http\Controllers\API;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $req)
    {
        $data = $req->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',

        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return ApiResponse::success(
            ['user' => $user, 'token' => $token],
            'User registered successfully',
            200
        );
    }

    public function login(Request $req)
    {
        $data = $req->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => ['The provided credentials are incorrect.']]);
        }
        $user->tokens()->delete();

        $token = $user->createToken('api-token')->plainTextToken;

        return ApiResponse::success(
            ['user' => $user, 'token' => $token],
            'User login successfully',
            201
        );
    }

    public function logout(Request $req)
    {
        $req->user()->currentAccessToken()->delete();
        return ApiResponse::success(
            null,
            'Logout Successfully',
            200
        );
    }
}
