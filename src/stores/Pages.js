import { defineStore } from "pinia";

export const usePages = defineStore('pagesStore', {
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
            },
            {
                name: "visits",
                icon: '/icons/visits.svg'
            },
            {
                name: "contacts",
                icon: '/icons/contacts.svg'
            }
        ],
    }),
    actions: {
        setPage(page){
            this.currentPage = page;
        }
    }
});