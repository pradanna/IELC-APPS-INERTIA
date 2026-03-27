import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/ui/Modal';
import Button from '@/Components/ui/Button';
import InputLabel from '@/Components/ui/InputLabel';
import Select from '@/Components/ui/Select';
import { Calendar, Clock, MapPin, UserCheck } from 'lucide-react';

export default function AddScheduleModal({ show, onClose, studyClass, rooms = [], teachers = [], schedule = null }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        teacher_id: '',
        room_id: '',
        day_of_week: '1',
        start_time: '14:00',
    });

    useEffect(() => {
        if (show) {
            if (schedule) {
                setData({
                    teacher_id: schedule.teacher_id || '',
                    room_id: schedule.room_id || '',
                    day_of_week: schedule.day_of_week?.toString() || '1',
                    start_time: schedule.start_time?.substring(0, 5) || '14:00',
                });
            } else {
                reset();
            }
        }
    }, [show, schedule]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (schedule) {
            put(route('admin.study-classes.update-schedule', schedule.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('admin.study-classes.store-schedule', studyClass.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const days = [
        { value: '1', label: 'Senin' },
        { value: '2', label: 'Selasa' },
        { value: '3', label: 'Rabu' },
        { value: '4', label: 'Kamis' },
        { value: '5', label: 'Jumat' },
        { value: '6', label: 'Sabtu' },
        { value: '7', label: 'Minggu' },
    ];

    const roomOptions = rooms.map(room => ({
        value: room.id,
        label: `${room.name} (Kapasitas: ${room.capacity})`
    }));

    const teacherOptions = (studyClass?.teachers || teachers).map(t => ({
        value: t.id,
        label: t.name
    }));

    // Calculate end time for preview
    const calculateEndTime = (start) => {
        if (!start) return '--:--';
        const [hours, minutes] = start.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        date.setHours(date.getHours() + 1);
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Modal show={show} onClose={onClose} title={schedule ? "Edit Jadwal Sesi" : "Tambah Jadwal Sesi"} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-1">
                <div className="space-y-6">
                    <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100 flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-primary-600">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-primary-600 font-medium uppercase tracking-tight">{schedule ? 'Mengubah Jadwal' : 'Menambah Jadwal Untuk'}</p>
                            <p className="text-sm font-bold text-gray-900">{studyClass?.name}</p>
                        </div>
                    </div>

                    {/* Teacher Selection */}
                    <div className="space-y-1.5">
                        <InputLabel htmlFor="teacher_id" value="Pilih Pengajar (Guru)" />
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                <UserCheck size={16} />
                            </div>
                            <Select
                                id="teacher_id"
                                value={data.teacher_id}
                                onChange={(val) => setData('teacher_id', val)}
                                options={teacherOptions}
                                placeholder="Pilih Guru Pengajar..."
                                className="pl-9"
                                required
                            />
                        </div>
                        {errors.teacher_id && <p className="text-xs text-red-500 mt-1">{errors.teacher_id}</p>}
                    </div>

                    {/* Room Selection */}
                    <div className="space-y-1.5">
                        <InputLabel htmlFor="room_id" value="Pilih Ruangan" />
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                <MapPin size={16} />
                            </div>
                            <Select
                                id="room_id"
                                value={data.room_id}
                                onChange={(val) => setData('room_id', val)}
                                options={roomOptions}
                                placeholder="Pilih Ruang Kelas..."
                                className="pl-9"
                                required
                            />
                        </div>
                        {errors.room_id && <p className="text-xs text-red-500 mt-1">{errors.room_id}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Day Selection */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="day_of_week" value="Hari" />
                            <Select
                                id="day_of_week"
                                value={data.day_of_week}
                                onChange={(val) => setData('day_of_week', val)}
                                options={days}
                                required
                            />
                            {errors.day_of_week && <p className="text-xs text-red-500 mt-1">{errors.day_of_week}</p>}
                        </div>

                        {/* Start Time Selection */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="start_time" value="Jam Mulai" />
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Clock size={16} />
                                </div>
                                <input
                                    type="time"
                                    id="start_time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                                    required
                                />
                            </div>
                            {errors.start_time && <p className="text-xs text-red-500 mt-1">{errors.start_time}</p>}
                        </div>
                    </div>

                    {/* Preview Duration */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">Durasi (Otomatis 1 Jam):</span>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                            <span className="text-primary-600">{data.start_time}</span>
                            <span className="text-gray-300">→</span>
                            <span className="text-primary-600">{calculateEndTime(data.start_time)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="link"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 font-semibold"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-primary-600 text-white hover:bg-primary-700 font-bold px-6 py-2 rounded-lg"
                    >
                        {processing ? 'Menyimpan...' : (schedule ? 'Perbarui Jadwal' : 'Simpan Jadwal')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
