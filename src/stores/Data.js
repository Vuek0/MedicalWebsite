import { defineStore } from "pinia";

export const useData = defineStore('currentStore', {
    state: () => ({
        doctors: null
    }),
    actions: {
    }
});