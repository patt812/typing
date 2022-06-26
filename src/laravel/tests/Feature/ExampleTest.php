<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_the_application_returns_a_successful_response()
    {
        $response = $this->get('/api/sentence');
        $response->assertStatus(200);
        echo $response[0]["sentence"];
        // $this->assertEquals($response[0]->id, 1);
    }
}
