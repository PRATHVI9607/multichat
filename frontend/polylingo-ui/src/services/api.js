import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // The address of your FastAPI backend

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPersonas = () => {
    return apiClient.get('/personas/personas');
};

export const processNlp = (text, persona, userId) => {
    return apiClient.post('/nlp/response', { text, persona, user_id: userId });
};

export const transcribeAudio = (audioFile) => {
    const formData = new FormData();
    formData.append('audio_file', audioFile);

    return apiClient.post('/stt/stt', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const synthesizeSpeech = (text) => {
    return apiClient.post('/tts/tts', { text }, { responseType: 'blob' });
};
