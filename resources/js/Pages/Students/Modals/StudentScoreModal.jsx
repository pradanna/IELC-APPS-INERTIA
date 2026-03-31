import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/ui/Modal';
import Button from '@/Components/ui/Button';
import Select from '@/Components/ui/Select';
import TextArea from '@/Components/ui/TextArea';
import { BookOpen, Headphones, Mic, Calculator, Send } from 'lucide-react';

export default function StudentScoreModal({ show, onClose, student, studyClass }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        study_class_id: '',
        assessment_type: 'progress_report',
        reading: 0,
        listening: 0,
        speaking: 0,
        final_feedback: '',
    });

    useEffect(() => {
        if (show) {
            clearErrors();
            reset();
            if (studyClass) {
                setData('study_class_id', studyClass.id);
            }
        }
    }, [show, studyClass]);

    // Options for Assessment Type
    const assessmentOptions = [
        { value: 'progress_report', label: 'Progress Report' },
        { value: 'mid_term', label: 'Mid-Term Exam' },
        { value: 'final_term', label: 'Final Exam' },
        { value: 'placement_test', label: 'Placement Test' },
        { value: 'quiz', label: 'Quiz' },
    ];

    // Calculate total score dynamically (average)
    const totalScore = (
        (parseFloat(data.reading) || 0) + 
        (parseFloat(data.listening) || 0) + 
        (parseFloat(data.speaking) || 0)
    ) / 3;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.student-scores.store', student.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    if (!student || !studyClass) return null;

    return (
        <Modal 
            show={show} 
            onClose={onClose} 
            title="Isi Progress Report / Skor Siswa"
            maxWidth="xl"
        >
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                {/* Header Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">PENGISIAN NILAI UNTUK:</p>
                    <div className="flex justify-between items-end">
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">{student.name}</h4>
                            <p className="text-xs text-primary-600 font-medium">{studyClass.package_name} • {studyClass.name}</p>
                        </div>
                    </div>
                </div>

                {/* Assessment Type */}
                <div className="space-y-1">
                    <Select
                        label="Assessment Type"
                        options={assessmentOptions}
                        value={data.assessment_type}
                        onChange={(val) => setData('assessment_type', val)}
                        placeholder="Pilih Jenis Assessment"
                        className="w-full"
                    />
                    {errors.assessment_type && <p className="text-xs text-red-500">{errors.assessment_type}</p>}
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
                            <BookOpen size={14} className="text-blue-500" /> Reading
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={data.reading}
                            onChange={e => setData('reading', e.target.value)}
                            className="w-full text-sm py-2 px-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            placeholder="0-100"
                        />
                        {errors.reading && <p className="text-[10px] text-red-500">{errors.reading}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
                            <Headphones size={14} className="text-emerald-500" /> Listening
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={data.listening}
                            onChange={e => setData('listening', e.target.value)}
                            className="w-full text-sm py-2 px-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            placeholder="0-100"
                        />
                        {errors.listening && <p className="text-[10px] text-red-500">{errors.listening}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
                            <Mic size={14} className="text-purple-500" /> Speaking
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={data.speaking}
                            onChange={e => setData('speaking', e.target.value)}
                            className="w-full text-sm py-2 px-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            placeholder="0-100"
                        />
                        {errors.speaking && <p className="text-[10px] text-red-500">{errors.speaking}</p>}
                    </div>
                </div>

                {/* Total Score Display (Calculated) */}
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                            <Calculator size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider leading-none">Total Average</p>
                            <p className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">Otomatis Terkalkulasi</p>
                        </div>
                    </div>
                    <div className="text-2xl font-black text-primary-700">
                        {totalScore.toFixed(1)}
                    </div>
                </div>

                {/* Feedback */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase">Final Feedback / Catatan</label>
                    <TextArea
                        value={data.final_feedback}
                        onChange={e => setData('final_feedback', e.target.value)}
                        placeholder="Berikan catatan mengenai perkembangan siswa..."
                        rows={4}
                    />
                    {errors.final_feedback && <p className="text-[10px] text-red-500">{errors.final_feedback}</p>}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                    <Button variant="outline" type="button" onClick={onClose} disabled={processing}>
                        Batal
                    </Button>
                    <Button variant="primary" type="submit" className="gap-2" disabled={processing}>
                        <Send size={16} />
                        {processing ? 'Menyimpan...' : 'Simpan Progress Report'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
