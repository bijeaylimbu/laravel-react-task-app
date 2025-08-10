<?php

namespace App\Helpers;

class ApiResponse
{
    public static function success($data = [], $message = 'Success', $statusCode = 200)
    {
        return response()->json([
            'status'  => 'success',
            'message' => $message,
            'data'    => $data
        ], $statusCode);
    }

    public static function error($message = 'Error', $statusCode = 400, $errors = [])
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
            'errors'  => $errors
        ], $statusCode);
    }
}
