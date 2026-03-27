import { useForm, usePage } from '@inertiajs/react';
import { User, Calendar, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

export default function ProfileForm({ lead, signature, expires }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: lead.name || '',
        dob: lead.dob ? lead.dob.split('T')[0] : '',
        phone: lead.phone || '',
        email: lead.email || '',
        address: lead.address || '',
        parent_name: lead.parent_name || '',
        parent_phone: lead.parent_phone || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.lead.update.submit', { 
            lead: lead.id,
            signature: signature,
            expires: expires
        }));
    };

    if (flash?.success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-lg">
                    <div className="bg-white py-16 px-10 shadow-2xl rounded-3xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-50 mb-8 border border-green-100">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Terima Kasih!</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {flash.success}
                        </p>
                        <div className="pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">Tim kami akan segera memverifikasi data Anda.</p>
                            <p className="text-xs text-gray-400 mt-4 italic italic">Anda dapat menutup jendela browser ini sekarang.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Lengkapi Data Profil
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Mohon lengkapi atau perbarui data diri Anda di bawah ini
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 border"
                                    placeholder="Nama Lengkap"
                                    required
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        value={data.dob}
                                        onChange={(e) => setData('dob', e.target.value)}
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 border"
                                    />
                                </div>
                                {errors.dob && <p className="mt-2 text-sm text-red-600">{errors.dob}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nomor Telepon / WA</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 border"
                                        placeholder="08..."
                                    />
                                </div>
                                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 border"
                                    placeholder="nama@email.com"
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows="3"
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 border"
                                    placeholder="Alamat Lengkap"
                                ></textarea>
                            </div>
                            {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Informasi Orang Tua / Wali (Opsional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Orang Tua</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.parent_name}
                                            onChange={(e) => setData('parent_name', e.target.value)}
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 border"
                                            placeholder="Nama Orang Tua"
                                        />
                                    </div>
                                    {errors.parent_name && <p className="mt-2 text-sm text-red-600">{errors.parent_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nomor Telepon Orang Tua</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.parent_phone}
                                            onChange={(e) => setData('parent_phone', e.target.value)}
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 bg-gray-50 border"
                                            placeholder="08..."
                                        />
                                    </div>
                                    {errors.parent_phone && <p className="mt-2 text-sm text-red-600">{errors.parent_phone}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Memproses...' : 'Simpan Profil'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
