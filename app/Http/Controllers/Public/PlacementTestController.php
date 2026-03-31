<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\PtAnswer;
use App\Models\PtSession;
use App\Actions\PtExam\SubmitPlacementTestAction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlacementTestController extends Controller
{
    public function show($slug, $token)
    {
        $session = PtSession::with(['lead', 'ptExam'])->where('token', $token)->firstOrFail();

        // Pastikan slug pada URL sesuai dengan paket ujian
        if ($session->ptExam->slug !== $slug) {
            abort(404);
        }

        // Jika sudah selesai, redirect ke halaman result
        if ($session->status === 'completed') {
            return redirect()->route('public.placement-test.result', ['slug' => $slug, 'token' => $token]);
        }

        return Inertia::render('Public/PlacementTest/Landing', [
            'session' => [
                'token' => $session->token,
                'status' => $session->status,
                'lead_name' => $session->lead->name ?? 'Student',
            ],
            'exam' => [
                'title' => $session->ptExam->title,
                'description' => $session->ptExam->description,
                'duration_minutes' => $session->ptExam->duration_minutes,
                'slug' => $session->ptExam->slug,
            ]
        ]);
    }

    public function start($slug, $token)
    {
        $session = PtSession::where('token', $token)->firstOrFail();

        if ($session->ptExam->slug !== $slug) {
            abort(404);
        }

        if ($session->status === 'pending') {
            $session->update([
                'status' => 'in_progress',
                'started_at' => now(),
            ]);
        }

        return redirect()->route('public.placement-test.exam', ['slug' => $slug, 'token' => $token]);
    }

    public function exam($slug, $token)
    {
        $session = PtSession::with([
            'ptExam.questions.options',
            'ptExam.ptQuestionGroups.questions.options'
        ])->where('token', $token)->firstOrFail();

        if ($session->ptExam->slug !== $slug) abort(404);

        if ($session->status === 'completed') {
            return redirect()->route('public.placement-test.result', ['slug' => $slug, 'token' => $token]);
        }

        $exam = $session->ptExam;

        // Hitung sisa waktu
        $durationSeconds = $exam->duration_minutes * 60;
        $remainingSeconds = $durationSeconds;

        if ($session->started_at) {
            $elapsed = now()->diffInSeconds($session->started_at);
            $remainingSeconds = max(0, $durationSeconds - $elapsed);
        }

        // Menggabungkan soal mandiri & soal grup untuk dipilah menjadi "Pages"
        $items = collect();
        foreach ($exam->questions->whereNull('pt_question_group_id') as $q) {
            $items->push((object)['type' => 'standalone', 'created_at' => $q->created_at, 'data' => $q]);
        }
        foreach ($exam->ptQuestionGroups as $g) {
            $items->push((object)['type' => 'group', 'created_at' => $g->created_at, 'data' => $g]);
        }
        $items = $items->sortBy('created_at')->values();

        $pages = [];
        $questionNumber = 1;

        foreach ($items as $item) {
            if ($item->type === 'standalone') {
                $q = $item->data;
                $pages[] = [
                    'id' => 'q_' . $q->id,
                    'type' => 'standalone',
                    'questions' => [[
                        'id' => $q->id,
                        'number' => $questionNumber++,
                        'text' => $q->question_text,
                        'audio_path' => $q->audio_path,
                        'options' => $q->options->map(fn($o) => ['id' => $o->id, 'text' => $o->option_text]),
                    ]]
                ];
            } else {
                $g = $item->data;
                $groupQuestions = [];
                foreach ($g->questions as $q) {
                    $groupQuestions[] = [
                        'id' => $q->id,
                        'number' => $questionNumber++,
                        'text' => $q->question_text,
                        'audio_path' => $q->audio_path,
                        'options' => $q->options->map(fn($o) => ['id' => $o->id, 'text' => $o->option_text]),
                    ];
                }
                $pages[] = [
                    'id' => 'g_' . $g->id,
                    'type' => 'group',
                    'instruction' => $g->instruction,
                    'reading_text' => $g->reading_text,
                    'audio_path' => $g->audio_path,
                    'questions' => $groupQuestions,
                ];
            }
        }

        return Inertia::render('Public/PlacementTest/Exam', [
            'session' => [
                'token' => $session->token,
                'slug' => $exam->slug,
                'remaining_seconds' => $remainingSeconds,
            ],
            'exam_title' => $exam->title,
            'pages' => $pages,
        ]);
    }

    public function review($slug, $token)
    {
        $session = PtSession::with([
            'ptExam.questions.options',
            'ptExam.ptQuestionGroups.questions.options'
        ])->where('token', $token)->firstOrFail();

        if ($session->ptExam->slug !== $slug) abort(404);

        // Review hanya bisa diakses jika status sudah completed
        if ($session->status !== 'completed') {
            return redirect()->route('public.placement-test.landing', ['slug' => $slug, 'token' => $token]);
        }

        $exam = $session->ptExam;

        // Menggabungkan soal mandiri & soal grup (mirip dengan fungsi exam)
        $items = collect();
        foreach ($exam->questions->whereNull('pt_question_group_id') as $q) {
            $items->push((object)['type' => 'standalone', 'created_at' => $q->created_at, 'data' => $q]);
        }
        foreach ($exam->ptQuestionGroups as $g) {
            $items->push((object)['type' => 'group', 'created_at' => $g->created_at, 'data' => $g]);
        }
        $items = $items->sortBy('created_at')->values();

        $pages = [];
        $questionNumber = 1;

        foreach ($items as $item) {
            if ($item->type === 'standalone') {
                $q = $item->data;
                $pages[] = [
                    'id' => 'q_' . $q->id,
                    'type' => 'standalone',
                    'questions' => [[
                        'id' => $q->id,
                        'number' => $questionNumber++,
                        'text' => $q->question_text,
                        'audio_path' => $q->audio_path,
                        // Khusus review, kita lempar status is_correct ke React
                        'options' => $q->options->map(fn($o) => ['id' => $o->id, 'text' => $o->option_text, 'is_correct' => $o->is_correct]),
                    ]]
                ];
            } else {
                $g = $item->data;
                $groupQuestions = [];
                foreach ($g->questions as $q) {
                    $groupQuestions[] = [
                        'id' => $q->id,
                        'number' => $questionNumber++,
                        'text' => $q->question_text,
                        'audio_path' => $q->audio_path,
                        // Khusus review, kita lempar status is_correct ke React
                        'options' => $q->options->map(fn($o) => ['id' => $o->id, 'text' => $o->option_text, 'is_correct' => $o->is_correct]),
                    ];
                }
                $pages[] = [
                    'id' => 'g_' . $g->id,
                    'type' => 'group',
                    'instruction' => $g->instruction,
                    'reading_text' => $g->reading_text,
                    'audio_path' => $g->audio_path,
                    'questions' => $groupQuestions,
                ];
            }
        }

        // Ambil riwayat jawaban siswa
        $userAnswers = \App\Models\PtAnswer::where('pt_session_id', $session->id)
            ->pluck('pt_question_option_id', 'pt_question_id')
            ->toArray();

        return Inertia::render('Public/PlacementTest/Exam', [
            'session' => [
                'token' => $session->token,
                'slug' => $exam->slug,
            ],
            'exam_title' => $exam->title . ' (Review Evaluasi)',
            'pages' => $pages,
            'is_review' => true,
            'user_answers' => (object)$userAnswers, // Object JSON
        ]);
    }

    public function submit(Request $request, $slug, $token, SubmitPlacementTestAction $action)
    {
        $session = PtSession::with([
            'ptExam.questions.options',
            'ptExam.ptQuestionGroups.questions.options'
        ])->where('token', $token)->firstOrFail();

        if ($session->ptExam->slug !== $slug) abort(404);

        if ($session->status !== 'completed') {
            $action->execute($session, $request->input('answers', []));
        }

        return redirect()->route('public.placement-test.result', ['slug' => $slug, 'token' => $token]);
    }

    public function result($slug, $token)
    {
        $session = PtSession::with(['lead', 'ptExam.questions', 'ptExam.ptQuestionGroups.questions'])->where('token', $token)->firstOrFail();

        if ($session->ptExam->slug !== $slug) abort(404);

        if ($session->status !== 'completed') {
            return redirect()->route('public.placement-test.landing', ['slug' => $slug, 'token' => $token]);
        }

        $totalQuestions = $session->ptExam->questions->whereNull('pt_question_group_id')->count();
        foreach ($session->ptExam->ptQuestionGroups as $group) {
            $totalQuestions += $group->questions->count();
        }

        $correctAnswers = PtAnswer::where('pt_session_id', $session->id)->where('is_correct', true)->count();

        return Inertia::render('Public/PlacementTest/Result', [
            'session' => [
                'lead_name' => $session->lead->name ?? 'Student',
                'final_score' => $session->final_score,
            ],
            'exam' => [
                'title' => $session->ptExam->title,
            ],
            'stats' => [
                'total_questions' => $totalQuestions,
                'correct_answers' => $correctAnswers,
            ]
        ]);
    }
}
