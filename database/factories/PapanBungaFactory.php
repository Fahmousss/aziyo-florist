<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PapanBunga>
 */
class PapanBungaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nama = fake()->sentence(3);
        return [
            'nama' => $nama,
            'slug' => Str::slug($nama),
            'deskripsi' => fake()->text(30),
            'harga' => 300000,
            'is_tersedia' => fake()->boolean(60)
        ];
    }
}
