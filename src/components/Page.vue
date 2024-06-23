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
        <img :src="icon" :alt="pageName" width="30px" height="30px">
      </div>
    </div>
</template>

<style lang="scss" scoped>
.page{
  width: 50px;
  height: 50px;
  background: var(--dark-color);
  border-bottom: 2px solid var(--primary-color);
  border-right: 1px solid var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

img{
  transition: .2s;
}

.page:hover{
  img{
    width: 40px;
    height: 40px;
  }
}
</style>