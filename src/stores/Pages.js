import { defineStore } from "pinia";

export const usePages = defineStore('currentStore', {
    state: () => ({
        currentPage: "main",
        pages: [
            {
                name: "main",
                icon: '/icons/main.svg'
            }, 
            {
                name: "user",
                icon: '/icons/user.svg'
            }
        ],
    }),
    actions: {
        setPage(page){
            this.currentPage = page;
        }
    }
});