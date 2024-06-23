import { defineStore } from "pinia";

export const useData = defineStore('dataStore', {
    state: () => ({
        doctors: null
    }),
    actions: {
        changeDoctors(arr){
            this.doctors = arr;
        }
    }
});