<script setup>
import StyledButton from "./StyledButton.vue";
const props = defineProps({
  name: String,
  surname: String,
  login: String,
  isEditable: Boolean,
  user: Object,
});
const isEditUser = defineModel("isEditUser");
const userForEdit = defineModel("userForEdit");
</script>

<template>
  <div class="doctor-card">
    <p>Имя : {{ name }}</p>
    <p>Фамилия : {{ surname }}</p>
    <p>Логин : {{ login }}</p>
    <StyledButton
      v-if="isEditable"
      :text="'Редактировать'"
      @click="
        isEditUser = true;
        userForEdit = user;
      "
    />
  </div>
</template>

<style lang="scss" scoped>
.doctor-card {
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 50px;
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
  button {
    width: fit-content;
  }
}
</style>
