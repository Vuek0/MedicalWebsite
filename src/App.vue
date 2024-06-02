<script setup>
import SideBar from './components/SideBar.vue'
import { useCurrentPage } from './stores/CurrentPage';
const currentPage = useCurrentPage();

</script>

<template>
  <SideBar :currentPage="currentPage"/>
  <main>
    <div v-if="currentPage.currentPage == 'som'">
      som
    </div>
    <div v-if="currentPage.currentPage == 'some'">
      some
    </div>
  </main>
</template>

<style scoped>

</style>
