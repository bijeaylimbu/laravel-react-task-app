<?php
namespace App\Http\Controllers\API;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $req)
    {
        $tasks = $req->user()->tasks()->orderBy('created_at', 'desc')->get();
        return ApiResponse::success(
            ['tasks' => $tasks],
            'tasks fetch successfully',
            201
        );
    }

    public function store(Request $req)
    {
        $data = $req->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        $task = $req->user()->tasks()->create($data);

         return ApiResponse::success(
            ['task' => $task],
            'tasks added successfully',
            200
        );
    }

    public function show(Request $req, Task $task)
    {
        $this->authorizeTask($req->user(), $task);
        return $task;
    }

    public function update(Request $req, Task $task)
    {
        $this->authorizeTask($req->user(), $task);

        $data = $req->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        $task->update($data);
         return ApiResponse::success(
            ['task' => $task],
            'tasks updated successfully',
            201
        );
    }

    public function destroy(Request $req, Task $task)
    {
        $this->authorizeTask($req->user(), $task);
        $task->delete();
          return ApiResponse::success(
            null,
            'tasks deleted successfully',
            201
        );
    }

    protected function authorizeTask($user, Task $task)
    {
        if ($task->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }
    }
}
