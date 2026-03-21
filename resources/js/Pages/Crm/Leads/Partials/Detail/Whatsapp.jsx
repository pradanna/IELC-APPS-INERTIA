import { MessageCircle } from "lucide-react";

export default function Whatsapp() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-14 w-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-7 w-7" />
            </div>
            <h4 className="text-base font-semibold text-gray-900">
                No WhatsApp History
            </h4>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
                Riwayat chat akan muncul di sini setelah Anda mengintegrasikan
                API WhatsApp Anda nanti.
            </p>
        </div>
    );
}
