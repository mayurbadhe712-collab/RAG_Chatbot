import api from './api';

const chatService = {
  sendMessage: async (message) => {
    const response = await api.post('/chat/', { message });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/chat/history');
    return response.data;
  },

  clearHistory: async () => {
    const response = await api.delete('/chat/history');
    return response.data;
  },
};

export default chatService;
