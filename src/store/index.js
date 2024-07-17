import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    checkins: [],
  },
  mutations: {
    SET_CHECKINS(state, checkins) {
      state.checkins = checkins;
    },
    ADD_CHECKIN(state, checkin) {
      state.checkins.push(checkin);
    },
  },
  actions: {
    async loadCheckins({ commit }) {
      try {
        const response = await axios.get('http://localhost:5173/api/checkins');
        commit('SET_CHECKINS', response.data);
      } catch (error) {
        console.error('Failed to load checkins:', error);
      }
    },
    async addCheckin({ commit }, checkin) {
      try {
        const response = await axios.post('http://localhost:5173/api/checkins', checkin);
        commit('ADD_CHECKIN', response.data);
      } catch (error) {
        console.error('Failed to add checkin:', error);
      }
    },
  },
  getters: {
    allCheckins: (state) => state.checkins,
    lastCheckin: (state) => state.checkins[state.checkins.length - 1],
  },
});