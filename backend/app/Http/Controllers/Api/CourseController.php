<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CourseController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'topic' => 'required|string',
            'level' => 'required|string',
        ]);

        $prompt = "Buatkan kursus lengkap tentang '{$request->topic}' untuk level {$request->level}. "
            . "Output dalam format JSON:\n"
            . '{
                "title": "",
                "description": "",
                "modules": [
                    {
                        "title": "",
                        "materials": [
                            { "title": "", "content": "" },
                            ...
                        ],
                        "quizzes": [
                            { "question": "", "options": ["", "", "", ""], "answer": "" },
                            ...
                        ]
                    }
                ]
            } '
            . "Setiap kursus memiliki 5 module, setiap module memiliki 4 materi(di dalam materi berisi pembahasan mengenai judul dari materi secara lengkap dan mudah dipahami) dan 5 soal quiz.";


        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . env('GEMINI_API_KEY'), [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        if (!$response->successful()) {
            return response()->json([
                'error' => 'Failed to get response from Gemini',
                'details' => $response->json(),
            ], 500);
        }

        $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (!$text) {
            return response()->json(['error' => 'No content returned from Gemini.'], 500);
        }

        // Bersihkan ```json dan ``` jika ada
        $cleaned = preg_replace('/^```json\s*|\s*```$/', '', trim($text));
        $data = json_decode($cleaned, true);

        if (json_last_error() !== JSON_ERROR_NONE || !isset($data['title'], $data['description'], $data['modules'])) {
            return response()->json([
                'error' => 'Invalid format from Gemini response',
                'raw' => $cleaned,
                'decode_error' => json_last_error_msg(),
            ], 500);
        }

        // Simpan ke database
        $course = Course::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'user_id' => $request->user()->id,
        ]);

        foreach ($data['modules'] as $mod) {
            if (!isset($mod['title'])) continue;

            $module = Module::create([
                'course_id' => $course->id,
                'title' => $mod['title'],
            ]);

            if(!empty($mod['materials'])) {
                foreach ($mod['materials'] as $mat) {
                    $module->materials()->create([
                        'title' => $mat['title'],
                        'content' => $mat['content'],
                    ]);
                }
            }

            if(!empty($mod['quizzes'])) {
                foreach ($mod['quizzes'] as $quiz) {
                    $module->quizzes()->create([
                        'question' => $quiz['question'],
                        'options' => json_encode($quiz['options']),
                        'answer' => $quiz['answer'],
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course->load('modules.materials', 'modules.quizzes'),
        ], 201);
    }


    public function index(Request $request)
    {
        return Course::with('modules.materials', 'modules.quizzes')
            ->where('user_id', $request->user()->id)
            ->get();
    }

    public function show(Request $request, $id)
    {
        return Course::with('modules')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->modules()->delete();
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }
}
