<script setup>
import { ref, onMounted } from "vue";
const isNone = ref();

const props = defineProps({
  pages: {
    type: Object,
    default: () => {},
  },
  userObj: Object,
  pageName: String,
  icon: String,
});

onMounted(async () => {
  try {
    if (
      JSON.parse(props.userObj.type).accountType == "admin" &&
      (props.pageName === "main" || props.pageName === "visits")
    ) {
      isNone.value = true;
    }

    if (
      JSON.parse(props.userObj.type).accountType === "doctor" &&
      props.pageName === "main"
    ) {
      isNone.value = true;
    }
  } catch (err) {
    console.log(err);
  }
});
</script>

<template>
  <div :class="{ none: isNone }">
    <div class="page" @click="props.pages.setPage(`${pageName}`)">
      <img :src="icon" :alt="pageName" width="30px" height="30px" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
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

.none {
  display: none;
}

img {
  transition: 0.2s;
}

.page:hover {
  img {
    width: 40px;
    height: 40px;
  }
}
</style>
