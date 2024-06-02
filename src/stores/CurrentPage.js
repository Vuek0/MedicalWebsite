import { defineStore } from "pinia";

export const useCurrentPage = defineStore('currentStore', {
    state: () => ({
        currentPage: "some",
    }),
    actions: {
        setPage(page){
            this.currentPage = page;
        }
    }
});