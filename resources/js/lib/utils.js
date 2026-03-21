/**
 * Maps a lead status string to a badge type for styling.
 * @param {string} status - The lead status (e.g., 'New', 'Contacted').
 * @returns {string} The corresponding badge type ('info', 'success', etc.).
 */
export function getLeadStatusType(status) {
    const lowerStatus = status?.toLowerCase() || "";
    switch (lowerStatus) {
        case "new":
        case "contacted":
            return "info";
        case "qualified":
            return "success";
        case "lost":
            return "danger";
        case "pending":
        case "scheduled":
            return "warning";
        default:
            return "default";
    }
}

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
