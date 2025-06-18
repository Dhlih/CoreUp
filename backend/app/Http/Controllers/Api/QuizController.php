<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function index($moduleId){
        $quizzes = Quiz::where('module_id', $moduleId)->select('id', 'question', 'options')->get();
        return response()->json($quizzes);
    }

    public function submit(Request $request, $quizId){
        $request->validate([
            'answer' => 'required|string',
        ]);

        $quiz = Quiz::findOrFail($quizId);
        $user = $request->user();

        $isCorrect = strtolower(trim($request->answer)) === strtolower(trim($quiz->answer));
        if ($isCorrect){
            $user->exp += 100;

            $user->level = $this->calculateLevel($user->exp);
            $user->save();
        }
    }

     private function calculateLevel($exp)
    {
        $level = 0;
        $threshold = 1000;

        while ($exp >= $threshold) {
            $exp -= $threshold;
            $level++;
            $threshold *= 2;
        }

        return $level;
    }
}
