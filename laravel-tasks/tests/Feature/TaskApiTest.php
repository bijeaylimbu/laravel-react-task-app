<?php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_crud_tasks()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $res = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/task', ['title' => 'Test Task']);

        $res->assertStatus(200)->assertJsonFragment(['title' => 'Test Task']);
        $taskId = $res->json('id');

        $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/task')
            ->assertStatus(201)
            ->assertJsonCount(3);

    }

    public function test_user_cannot_access_others_tasks()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $task = Task::factory()->create(['user_id' => $user2->id, 'title' => 'Other']);

        $token = $user1->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/task/{$task->id}")
            ->assertStatus(403);
    }

    public function test_cannot_create_task_without_title()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/task', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }
    public function test_unauthenticated_user_cannot_access_tasks()
    {
        $this->getJson('/api/task')->assertStatus(401);
    }
    public function test_cannot_delete_non_existent_task()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson('/api/task/999')
            ->assertStatus(404);
    }
    public function test_can_view_single_task()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/task/{$task->id}")
            ->assertStatus(200)
            ->assertJsonFragment(['title' => $task->title]);
    }

}
