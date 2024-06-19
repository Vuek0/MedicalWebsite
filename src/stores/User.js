import { defineStore } from "pinia";

export const useUser = defineStore('currentStore', {
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