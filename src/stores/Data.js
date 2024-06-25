import { defineStore } from "pinia";

export const useData = defineStore('dataStore', {
    state: () => ({
        doctors: null,
        activeDoctors: null,
        allDoctors: null,
        visits: null,
    }),
    actions: {
        changeDoctors(arr){
            this.doctors = arr;
        },

        changeActiveDoctors(arr){
            this.activeDoctors = arr;
        },

        changeAllDoctors(arr){
            this.allDoctors = arr;
        },

        
    }
});