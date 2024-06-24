import { defineStore } from "pinia";

export const useData = defineStore('dataStore', {
    state: () => ({
        doctors: null,
        activeDoctors: null
    }),
    actions: {
        changeDoctors(arr){
            this.doctors = arr;
        },

        changeActiveDoctors(arr){
            this.doctors = arr;
        }
    }
});