<script setup>
import { ref } from "vue";
import { usePages } from "../stores/Pages";
const pages = usePages();
const isModalOpen = defineModel("isModalOpen");
const currentVisit = defineModel("currentVisit");

const props = defineProps({
  visit: Object,
  name: String,
  surname: String,
  userName: String,
  userSurname: String,
  date: String,
  time: String,
  status: String,
  type: String,
  isMainPage: Boolean,
});

const specialization = JSON.parse(props.type).specialization;
function toVisit() {
  if (props.isMainPage) {
    const url = new URL(window.location.href);
    url.searchParams.set("visit", props.visit._id);
    window.history.pushState(null, "", url.toString());
    pages.currentPage = "visits";
    currentVisit.value = props.visit;
    isModalOpen.value = true;
  } else {
    currentVisit.value = props.visit;
    isModalOpen.value = true;
  }
}
</script>

<template>
  <div class="visit-card">
    <h4>Приём</h4>
    <p>Врач : {{ name }} {{ surname }} ({{ specialization }})</p>
    <p v-if="userName && userSurname">
      Пациент : {{ userName }} {{ userSurname }}
    </p>
    <div class="date">
      <p>Дата: {{ date }}</p>
      <p>Время: {{ time }}</p>
    </div>
    <p>Статус: {{ status }}</p>
    <a href="#" @click="toVisit">Перейти к приёму</a>
  </div>
</template>

<style lang="scss" scoped>
.visit-card {
  width: fit-content;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 40px;
  border-bottom: 3px solid #000;
  border-radius: 10px;
  h4,
  p,
  a {
    color: var(--dark-color);
    font-weight: bold;
  }

  a {
    font-style: italic;
    transition: 0.5s;
    // margin-top: 10px;
    &:hover {
      color: var(--primary-color);
    }
  }

  .date {
    display: flex;
    gap: 20px;
  }
}
</style>
