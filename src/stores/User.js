import { defineStore } from "pinia";

export const useUser = defineStore('userStore', {
    state: () => ({
        obj: {
            
        },
        currentDoctor: {
            
        }
    }),
    actions: {
        // setPage(page){
        //     this.currentPage = page;
        // }
    }
});