<script setup>
import { ref } from "vue";
import StyledButton from "./StyledButton.vue";
const props = defineProps({
  handler: Function,
  text: String,
  visit: Object,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="wrapper" :class="{ open: isOpen }">
    <div class="modal">
      <button
        class="close"
        name="close-modal"
        @click="emit('update:modelValue', false)"
      >
        <span></span>
        <span></span>
      </button>
      <div class="body">
        <h3>Приём</h3>
        <p>Доктор : {{ visit.doctor.name }} {{ visit.doctor.surname }}</p>
        <p>Дата : {{ visit.date }}</p>
        <p>Время : {{ visit.time }}</p>
        <p>Диагноз : {{ visit.diagnose || "Пусто" }}</p>
        <p>Лечение : {{ visit.treatment || "Пусто" }}</p>
        <p>Статус : {{ visit.status }}</p>
        <div class="referrals">
          <h3>Направления :</h3>
          <p v-if="!visit.referrals">Ничего не найдено</p>
        </div>

        <StyledButton v-if="handler" @click="handler" :text="'Подтвердить'" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999999999999999;
  background: rgba($color: #000000, $alpha: 0.5);
  font-weight: bold;
  transition: opacity 0.5s;
  .modal {
    max-width: 500px;
    height: fit-content;
    z-index: 1;
    background: var(--dark-color);
    padding: 50px;
    position: relative;
    .body {
      display: flex;
      flex-direction: column;
      gap: 20px;

      button {
        font-weight: bold;
        font-size: 18px;
        width: fit-content;
        padding: 10px 50px;
      }
    }

    .close {
      cursor: pointer;
      border: none;
      span {
        position: absolute;
        top: 25px;
        right: 10px;
        display: block;
        background: var(--primary-color);
        width: 30px;
        height: 3px;
      }
      span:nth-child(1) {
        transform: rotate(45deg);
      }
      span:nth-child(2) {
        transform: rotate(-45deg);
      }
    }
  }
}
</style>
