import create from 'zustand';

const defaultUser = { id: 1, name: 'John Doe', email: 'student@example.com' };

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

export const useChatStore = create((set, get) => ({
  messages: [],
  sessionId: null,
  isLoading: false,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  setMessages: (messages) => set({ messages }),
  setSessionId: (sessionId) => set({ sessionId }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearChat: () => set({ messages: [], sessionId: null }),
}));

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
  updateUnreadCount: (count) => set({ unreadCount: count }),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

export const useLearningStore = create((set) => ({
  performances: [],
  recommendations: [],
  isLoading: false,

  setPerformances: (performances) => set({ performances }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
