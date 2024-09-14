// utils.js 파일

export function formatDate(dateString) {
    const dateObject = new Date(dateString);
    return `${dateObject.getFullYear() % 100}.${(dateObject.getMonth() + 1).toString().padStart(2, '0')}.${dateObject.getDate().toString().padStart(2, '0')}`;
}
