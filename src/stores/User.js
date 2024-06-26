import { defineStore } from "pinia";

export const useUser = defineStore("userStore", {
  state: () => ({
    obj: null,
    currentDoctor: {},
  }),
  actions: {
    // setPage(page){
    //     this.currentPage = page;
    // }
  },
});
