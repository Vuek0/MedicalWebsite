<script setup>
import { ref } from 'vue'
import Page from './Page.vue';
const props = defineProps({
  pages: {
    type: Object,
    default: () => {}
  },
})

</script>

<template>
  <aside>
    <Page v-for="page in props.pages.pages" :pages="props.pages" :pageName="page.name" :key="page.name" :icon="page.icon"/>
  </aside>
</template>

<style lang="scss" scoped>

aside{
  width: fit-content;
  height: 100vh;
  width: 50px;
  background: rgb(220, 220, 220);
}
.page{
  width: 50px;
  height: 50px;
  background: #fff;
  border-bottom: 3px solid #000;
  cursor: pointer;
}
</style>
