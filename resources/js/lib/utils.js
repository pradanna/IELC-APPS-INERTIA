/**
 * Maps a lead status string to a badge type for styling.
 * @param {string} status - The lead status (e.g., 'New', 'Contacted').
 * @returns {string} The corresponding badge type ('info', 'success', etc.).
 */

const MONTHS = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

/**
 * Mengonversi sebuah string menjadi Title Case.
 * Contoh: "john doe" -> "John Doe"
 * @param {string} str - String yang akan dikonversi.
 * @returns {string} String dalam format Title Case.
 */
export function toTitleCase(str) {
    if (!str) return "";
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
    );
}

export const formatRp = (val) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(val || 0);
