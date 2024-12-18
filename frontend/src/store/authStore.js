import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,  // User data
    isLoggedIn: false,  // Login state

    // Set user data
    setUser: (userData) => set({ user: userData }),

    // Set login state
    setIsLoggedIn: (state) => set({ isLoggedIn: state }),

    // Log out the user
    logout: () => set({ user: null, isLoggedIn: false }),
}));

export default useAuthStore;
