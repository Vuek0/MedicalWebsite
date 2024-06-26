<script setup>
import { onMounted, ref } from "vue";
import Page from "./Page.vue";
const isOpen = ref();
const props = defineProps({
  pages: {
    type: Object,
    default: () => {},
  },
  userObj: Object,
});

onMounted(function () {
  if (window.innerHeight < 600) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
  }
});

function sideBarHandler() {
  if (isOpen.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
  }
}
</script>

<template>
  <div class="sidebar">
    <div class="wrapper">
      <div class="open" @click="sideBarHandler" :class="{ active: isOpen }">
        <span></span><span></span><span></span>
      </div>
    </div>
    <aside :class="{ active: isOpen }">
      <div class="space"></div>
      <Page
        class="page"
        v-for="page in props.pages.pages"
        :userObj="userObj"
        :pages="props.pages"
        :pageName="page.name"
        :key="page.name"
        :icon="page.icon"
      />
    </aside>
  </div>
</template>

<style lang="scss" scoped>
aside {
  position: sticky;
  width: 50px;
  height: 100vh;
  background: var(--dark-color);
  transition: 0.5s;
}

.wrapper {
  position: absolute;
  top: 10px;
  left: 10px;
}

.open {
  z-index: 9999999999999999999999999;
  position: relative;
  width: 25.6px;
  height: 25.6px;
  border: none;
  background: transparent;
  display: none;

  span {
    position: absolute;
    width: 19.2px;
    height: 2.5px;
    background: var(--primary-color);
    left: 3.33px;
  }
  span:nth-child(1) {
    transition: 0.5s;
    transform: translateY(-6.4px);
  }
  span:nth-child(2) {
    transition: 0.5s;
    opacity: 1;
  }
  span:nth-child(3) {
    transition: 0.5s;

    transform: translateY(6.4px);
  }
}

@media (max-width: 600px) {
  aside {
    position: relative;
    left: -200px;
    width: 0px;
    height: auto;
  }
  aside.active {
    left: 0;
    width: 50px;
  }

  .space {
    height: 50px;
    border-bottom: 3px solid var(--primary-color);
    border-right: 3px solid var(--primary-color);

    // background: var(--dark-color);
  }

  .open {
    transition: 1s linear;
    display: flex;
    align-items: center;
    margin-left: auto;
    &.active {
      position: relative;
      width: 25.6px;
      height: 25.6px;
      border: none;
      background: transparent;

      span {
        position: absolute;
        width: 19.2px;
        height: 2.5px;
        background: var(--primary-color);
        left: 3.33px;
      }
      span:nth-child(1) {
        transition: 0.5s;
        transform: translateY(0);
        transform: rotate(45deg);
      }
      span:nth-child(2) {
        opacity: 0 !important;
      }
      span:nth-child(3) {
        transition: 0.5s;
        transform: translateY(0);
        transform: rotate(-45deg);
      }
    }
  }
}
</style>
