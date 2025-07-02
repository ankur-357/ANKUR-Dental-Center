import type { FileUpload } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert file to base64'));
            }
        };
        reader.onerror = error => reject(error);
    });
};

export const createFileUpload = async (file: File): Promise<FileUpload> => {
    const base64Url = await fileToBase64(file);
    return {
        name: file.name,
        url: base64Url,
        type: file.type,
        size: file.size
    };
};

export const downloadFile = (fileUpload: FileUpload) => {
    const link = document.createElement('a');
    link.href = fileUpload.url;
    link.download = fileUpload.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string): string => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('doc')) return '📝';
    if (fileType.includes('xls')) return '📊';
    return '📎';
}; 