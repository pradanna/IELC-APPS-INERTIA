<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PtExam;
use Illuminate\Support\Str;

class PtExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exams = [
            [
                'title' => 'General English Placement Test',
                'description' => 'Tes penempatan bahasa Inggris umum yang mencakup tata bahasa (grammar), kosakata (vocabulary), dan pemahaman bacaan (reading comprehension).',
                'duration_minutes' => 60,
                'is_active' => true,
                'standalone_questions' => [
                    [
                        'text' => 'She ___ to the market yesterday.',
                        'points' => 1,
                        'options' => [
                            ['text' => 'go', 'correct' => false],
                            ['text' => 'goes', 'correct' => false],
                            ['text' => 'went', 'correct' => true],
                            ['text' => 'gone', 'correct' => false],
                        ]
                    ],
                    [
                        'text' => 'I have been living in Jakarta ___ 5 years.',
                        'points' => 1,
                        'options' => [
                            ['text' => 'since', 'correct' => false],
                            ['text' => 'for', 'correct' => true],
                            ['text' => 'in', 'correct' => false],
                            ['text' => 'at', 'correct' => false],
                        ]
                    ],
                    [
                        'text' => 'If it rains tomorrow, we ___ at home.',
                        'points' => 1,
                        'options' => [
                            ['text' => 'would stay', 'correct' => false],
                            ['text' => 'will stay', 'correct' => true],
                            ['text' => 'stayed', 'correct' => false],
                            ['text' => 'staying', 'correct' => false],
                        ]
                    ],
                    [
                        'text' => 'He is the ___ student in the classroom.',
                        'points' => 1,
                        'options' => [
                            ['text' => 'tall', 'correct' => false],
                            ['text' => 'taller', 'correct' => false],
                            ['text' => 'tallest', 'correct' => true],
                            ['text' => 'most tall', 'correct' => false],
                        ]
                    ],
                    [
                        'text' => 'I do not have ___ money left in my wallet.',
                        'points' => 1,
                        'options' => [
                            ['text' => 'some', 'correct' => false],
                            ['text' => 'many', 'correct' => false],
                            ['text' => 'any', 'correct' => true],
                            ['text' => 'a few', 'correct' => false],
                        ]
                    ],
                ],
                'groups' => [
                    [
                        'instruction' => 'Read the following text carefully and answer questions 6 to 10.',
                        'reading_text' => "The Amazon rainforest is the largest tropical rainforest in the world. It covers over 5.5 million square kilometers and spans across nine countries in South America, with the majority located in Brazil. Often referred to as the 'lungs of the Earth,' it produces about 20% of the world's oxygen. The Amazon is home to incredibly diverse ecosystems, containing millions of species of insects, plants, and animals. However, deforestation remains a significant threat to its survival, primarily driven by agriculture and logging.",
                        'questions' => [
                            [
                                'text' => 'What is the Amazon rainforest often referred to as?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'The heart of South America', 'correct' => false],
                                    ['text' => 'The lungs of the Earth', 'correct' => true],
                                    ['text' => 'The largest desert', 'correct' => false],
                                    ['text' => 'The longest river', 'correct' => false],
                                ]
                            ],
                            [
                                'text' => 'How many countries does the Amazon rainforest span across?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'Five countries', 'correct' => false],
                                    ['text' => 'Seven countries', 'correct' => false],
                                    ['text' => 'Nine countries', 'correct' => true],
                                    ['text' => 'Eleven countries', 'correct' => false],
                                ]
                            ],
                            [
                                'text' => 'In which continent is the Amazon rainforest primarily located?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'North America', 'correct' => false],
                                    ['text' => 'Africa', 'correct' => false],
                                    ['text' => 'Asia', 'correct' => false],
                                    ['text' => 'South America', 'correct' => true],
                                ]
                            ],
                            [
                                'text' => 'Approximately how much of the world’s oxygen is produced by the Amazon?',
                                'points' => 1,
                                'options' => [
                                    ['text' => '10%', 'correct' => false],
                                    ['text' => '20%', 'correct' => true],
                                    ['text' => '30%', 'correct' => false],
                                    ['text' => '50%', 'correct' => false],
                                ]
                            ],
                            [
                                'text' => 'According to the text, what is the main cause of deforestation in the Amazon?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'Climate change', 'correct' => false],
                                    ['text' => 'Urban development', 'correct' => false],
                                    ['text' => 'Agriculture and logging', 'correct' => true],
                                    ['text' => 'Tourism', 'correct' => false],
                                ]
                            ],
                        ]
                    ]
                ]
            ],
            [
                'title' => 'IELTS Preparation Diagnostic Test',
                'description' => 'Diagnostic test untuk calon siswa kelas IELTS Preparation. Mengukur kemampuan Academic Reading secara mendalam.',
                'duration_minutes' => 90,
                'is_active' => true,
                'standalone_questions' => [], // Tidak ada soal mandiri, semuanya dari wacana
                'groups' => [
                    [
                        'instruction' => 'Read Passage 1 and answer questions 1-5.',
                        'reading_text' => "Global warming is the long-term heating of Earth's climate system observed since the pre-industrial period (between 1850 and 1900) due to human activities, primarily fossil fuel burning, which increases heat-trapping greenhouse gas levels in Earth's atmosphere. Carbon dioxide (CO2) is the most prominent greenhouse gas. The consequences of climate change are already observable, including rising sea levels, shrinking glaciers, and more extreme weather events. The Paris Agreement is a legally binding international treaty on climate change adopted in 2015 to combat these effects.",
                        'questions' => [
                            [
                                'text' => 'What period is considered the pre-industrial period in the text?',
                                'points' => 1,
                                'options' => [
                                    ['text' => '1750 to 1800', 'correct' => false],
                                    ['text' => '1800 to 1850', 'correct' => false],
                                    ['text' => '1850 to 1900', 'correct' => true],
                                    ['text' => '1900 to 1950', 'correct' => false],
                                ]
                            ],
                            [
                                'text' => 'What is the most prominent greenhouse gas mentioned?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'Oxygen', 'correct' => false],
                                    ['text' => 'Methane', 'correct' => false],
                                    ['text' => 'Carbon dioxide', 'correct' => true],
                                    ['text' => 'Nitrous oxide', 'correct' => false],
                                ]
                            ],
                            [
                                'text' => 'Which of the following is NOT mentioned as a consequence of climate change?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'Rising sea levels', 'correct' => false],
                                    ['text' => 'Shrinking glaciers', 'correct' => false],
                                    ['text' => 'Extreme weather events', 'correct' => false],
                                    ['text' => 'Increased volcanic activity', 'correct' => true],
                                ]
                            ],
                            [
                                'text' => 'When was the Paris Agreement adopted?',
                                'points' => 1,
                                'options' => [
                                    ['text' => '1990', 'correct' => false],
                                    ['text' => '2000', 'correct' => false],
                                    ['text' => '2010', 'correct' => false],
                                    ['text' => '2015', 'correct' => true],
                                ]
                            ],
                            [
                                'text' => 'What primarily causes the increase of heat-trapping greenhouse gases?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'Solar flares', 'correct' => false],
                                    ['text' => 'Fossil fuel burning', 'correct' => true],
                                    ['text' => 'Ocean currents', 'correct' => false],
                                    ['text' => 'Earthquakes', 'correct' => false],
                                ]
                            ],
                        ]
                    ],
                    [
                        'instruction' => 'Read Passage 2 and answer questions 6-10.',
                        'reading_text' => "The history of the Internet begins with the development of electronic computers in the 1950s. Initial concepts of wide area networking originated in several computer science laboratories in the United States, United Kingdom, and France. The US Department of Defense awarded contracts as early as the 1960s, including for the development of the ARPANET project, directed by Robert Taylor. ARPANET was the first computer network to implement the TCP/IP protocol suite. In 1989, Tim Berners-Lee invented the World Wide Web, linking hypertext documents into an information system, accessible from any node on the network.",
                        'questions' => [
                            [
                                'text' => 'In which decade did the development of electronic computers begin according to the text?',
                                'points' => 1,
                                'options' => [
                                    ['text' => '1940s', 'correct' => false],
                                    ['text' => '1950s', 'correct' => true],
                                    ['text' => '1960s', 'correct' => false],
                                    ['text' => '1970s', 'correct' => false],
                                ]
                            ],
                            [
                                'text' => 'Which organization awarded contracts for the ARPANET project?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'US Department of Education', 'correct' => false],
                                    ['text' => 'US Department of Defense', 'correct' => true],
                                    ['text' => 'UK Ministry of Defense', 'correct' => false],
                                    ['text' => 'French Government', 'correct' => false],
                                ]
                            ],
                            [
                                'text' => 'Who directed the ARPANET project?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'Tim Berners-Lee', 'correct' => false],
                                    ['text' => 'Robert Taylor', 'correct' => true],
                                    ['text' => 'Alan Turing', 'correct' => false],
                                    ['text' => 'Bill Gates', 'correct' => false],
                                ]
                            ],
                            [
                                'text' => 'What protocol suite was first implemented by ARPANET?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'HTTP/FTP', 'correct' => false],
                                    ['text' => 'TCP/IP', 'correct' => true],
                                    ['text' => 'SMTP/POP', 'correct' => false],
                                    ['text' => 'DNS', 'correct' => false],
                                ]
                            ],
                            [
                                'text' => 'What did Tim Berners-Lee invent in 1989?',
                                'points' => 1,
                                'options' => [
                                    ['text' => 'The electronic computer', 'correct' => false],
                                    ['text' => 'The World Wide Web', 'correct' => true],
                                    ['text' => 'The TCP/IP protocol', 'correct' => false],
                                    ['text' => 'The ARPANET', 'correct' => false],
                                ]
                            ],
                        ]
                    ]
                ]
            ]
        ];

        foreach ($exams as $examData) {
            // Buat Paket Ujian
            $exam = PtExam::create([
                'title' => $examData['title'],
                'slug' => Str::slug($examData['title']),
                'description' => $examData['description'],
                'duration_minutes' => $examData['duration_minutes'],
                'is_active' => $examData['is_active'],
            ]);

            // Insert Soal Mandiri
            if (isset($examData['standalone_questions'])) {
                foreach ($examData['standalone_questions'] as $qData) {
                    $question = $exam->questions()->create([
                        'question_text' => $qData['text'],
                        'points' => $qData['points'],
                    ]);

                    foreach ($qData['options'] as $optData) {
                        $question->options()->create([
                            'option_text' => $optData['text'],
                            'is_correct' => $optData['correct'],
                        ]);
                    }
                }
            }

            // Insert Grup Soal (Reading) dan Soal di Dalamnya
            if (isset($examData['groups'])) {
                foreach ($examData['groups'] as $gData) {
                    $group = $exam->ptQuestionGroups()->create([
                        'instruction' => $gData['instruction'],
                        'reading_text' => $gData['reading_text'],
                    ]);

                    foreach ($gData['questions'] as $qData) {
                        $question = $exam->questions()->create([
                            'pt_question_group_id' => $group->id, // Hubungkan dengan grup
                            'question_text' => $qData['text'],
                            'points' => $qData['points'],
                        ]);

                        foreach ($qData['options'] as $optData) {
                            $question->options()->create([
                                'option_text' => $optData['text'],
                                'is_correct' => $optData['correct'],
                            ]);
                        }
                    }
                }
            }
        }
    }
}
