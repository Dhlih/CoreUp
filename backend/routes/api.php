<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\QuizController;
use Illuminate\Support\Facades\Route;

Route::prefix("auth")->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::post('/courses', [CourseController::class, 'generate']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    Route::get('/modules/{module}/quizzes', [QuizController::class, 'index']);
    Route::post('/quizzes/{quiz}/submit', [QuizController::class, 'submit']);
});
