import type { Commit } from "vuex/types/index.js";
import authApi from "./authApi";

// Définition du type de l'état stocké dans le store
interface AuthState {
  isAuthenticated: boolean;
  user: any;
}

// Récupération des données initiales depuis le localStorage (si l'utilisateur est déjà connecté).
const user = localStorage.getItem('user') ?? null;
const parsedUser = user ? JSON.parse(user) : null;

// Etat initial du store
const state = {
  isAuthenticated: !!parsedUser, 
  user: parsedUser,
} as AuthState;

// Opérations de mutation du store
const mutations = {
  SET_AUTHENTICATED(state: AuthState) {
    state.isAuthenticated = true;
  },
  SET_UNAUTHENTICATED(state: AuthState) {
    state.isAuthenticated = false;
    state.user = null; 
  },
  SET_USER(state: AuthState, userData: any) {
    state.user = userData;
  },
};

// Opérations asynchrones sur le store
const actions = {
  login({ commit }: { commit: Commit }, credentials: { email: string, password: string }) {
    return authApi.login(credentials).then((userData) => {
      commit('SET_AUTHENTICATED');
      commit('SET_USER', userData);
      return Promise.resolve(userData);
    }, (error) => {
      return Promise.reject(error);
    });
  },
  logout({ commit }: { commit: Commit }) {
    authApi.logout();
    commit('SET_UNAUTHENTICATED');
  },
  register({ commit }: { commit: Commit }, credentials: { email: string, password: string, confirmPassword: string }) {
    return authApi.register(credentials).then((userData) => {
      commit('SET_AUTHENTICATED');
      commit('SET_USER', userData);
      return Promise.resolve(userData);
    }, (error) => {
      return Promise.reject(error);
    });
  },
};

// Getters pour récupérer des données du store depuis un composant
const getters = {
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  currentUser: (state: AuthState) => state.user,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
