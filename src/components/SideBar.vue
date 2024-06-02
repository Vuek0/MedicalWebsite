<script setup>
import { ref } from 'vue'

const props = defineProps({
  currentPage: {
    type: Object,
    default: () => {}
  },
})
console.log(props.currentPage);

</script>

<template>
  <aside>
    <div class="page">
      
    </div>
    <h1 @click="props.currentPage.setPage('some')">so</h1>
    <h2 @click="props.currentPage.setPage('som')">2sa</h2>
  </aside>
</template>

<style scoped>

aside{
  width: fit-content;
  height: 100vh;
  width: 50px;
}
.page{
  width: 50px;
  height: 50px;
  background: #fff;
}
</style>
