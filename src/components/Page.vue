<script setup>

const props = defineProps({
    pages: {
        type: Object,
        default: () => {}
    },
    pageName: String,
    icon: String,
})
</script>

<template>
    <div>
        <div class="page" @click="props.pages.setPage(`${pageName}`)"> 
      <img :src="icon" :alt="pageName" width="40px" height="40px">
    </div>
    </div>
</template>

<style lang="scss" scoped>
.page{
  width: 50px;
  height: 50px;
  background: #fff;
  border-bottom: 3px solid #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>