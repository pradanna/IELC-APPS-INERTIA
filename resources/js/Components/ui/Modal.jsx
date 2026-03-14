import React, { useEffect } from "react";

export default function Modal({ show, onClose, title, children }) {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [show]);

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                aria-hidden="true"
                onClick={onClose}
            ></div>

            {/* Modal Panel */}
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl ring-1 ring-gray-900/5 transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    {/* Header */}
                    {title && (
                        <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 sm:px-6">
                            <h3
                                className="text-base font-semibold leading-6 text-gray-900"
                                id="modal-title"
                            >
                                {title}
                            </h3>
                        </div>
                    )}
                    {/* Body */}
                    <div className="px-4 py-5 sm:p-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
