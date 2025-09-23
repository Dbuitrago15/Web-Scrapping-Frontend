import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/batches', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getBatchStatus = (batchId: string) => {
  return apiClient.get(`/batches/${batchId}`);
};
