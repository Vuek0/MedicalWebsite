<script setup>
import { ref } from "vue";
import { useUser } from "../stores/User";
const user = useUser();
const userObj = user.obj;
const info = JSON.parse(userObj.type);
const isDoctor = ref();
if (info.accountType === "doctor") isDoctor.value = true;
</script>

<template>
  <div class="info">
    <h2>Информация о пользователе:</h2>
    <p>Имя : {{ userObj.name }}</p>
    <p>Фамилия : {{ userObj.surname }}</p>
    <p>Логин : {{ userObj.login }}</p>
    <div v-if="isDoctor">
      <p>Специализация : {{ info.specialization }}</p>
      <p>Номер телефона : {{ info.phone }}</p>
      <p>Начало работы: {{ info.workTime.start }}</p>
      <p>Конец работы: {{ info.workTime.end }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 2px solid var(--primary-color);
  padding: 100px 30px;
  gap: 15px;

  h2 {
    font-size: 30px;
    text-decoration: underline;
  }
  p {
    font-size: 25px;
    font-weight: bold;
  }
}

@media (max-width: 600px) {
  .info {
    h2 {
      font-size: 20px;
    }
  }
}
</style>
