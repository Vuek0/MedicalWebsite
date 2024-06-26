<script setup>
import { ref } from "vue";
import FormInput from "./FormInput.vue";
import StyledButton from "./StyledButton.vue";
import Loading from "./Loading.vue";
import axios from "axios";
const API_KEY = import.meta.env.VITE_API_KEY;
const props = defineProps({
  text: String,
  user: Object,
});
const formError = ref();
const isLoading = ref();
const userName = defineModel("userName");
const userSurname = defineModel("userSurname");
const userLogin = defineModel("userLogin");
const userPassword = defineModel("userPassword");
userName.value = props.user.name;
userSurname.value = props.user.surname;
userLogin.value = props.user.login;

const emit = defineEmits(["update:modelValue"]);

function handler(e) {
  formError.value = "";
  if (userName.value && userSurname.value && userLogin.value) {
    isLoading.value = true;
    let data;
    if (userPassword) {
      data = {
        _id: props.user._id,
        name: userName.value,
        surname: userSurname.value,
        login: userLogin.value,
        password: userPassword.value,
        type: '{"accountType" : "pacient"}',
      };
    } else {
      data = {
        _id: props.user._id,
        name: userName.value,
        surname: userSurname.value,
        login: userLogin.value,
        type: '{"accountType" : "pacient"}',
      };
    }

    axios
      .put(`https://medical-server-six.vercel.app/users?key=${API_KEY}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        alert("Аккаунт обновлен успешно");
        isLoading.value = false;
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    formError.value = "Поля не могут быть пустыми";
    console.log(formError);
  }
}
</script>

<template>
  <div class="wrapper" :class="{ open: isOpen }">
    <div class="modal">
      <Loading v-if="isLoading" />
      <button
        v-if="!isLoading"
        class="close"
        name="close-modal"
        @click="emit('update:modelValue', false)"
      >
        <span></span>
        <span></span>
      </button>
      <div class="body" v-if="!isLoading">
        <h2>Пользователь</h2>
        <div class="formError" v-if="formError">
          <p>{{ formError }}</p>
        </div>
        <FormInput
          :value="userName"
          :type="'text'"
          :placeholder="'Имя'"
          v-model="userName"
        />
        <FormInput
          :value="userSurname"
          :type="'text'"
          :placeholder="'Фамилия'"
          v-model="userSurname"
        />
        <FormInput
          :value="userLogin"
          :type="'text'"
          :placeholder="'Логин'"
          v-model="userLogin"
        />
        <FormInput
          :value="userPassword"
          :type="'password'"
          :placeholder="'Пароль'"
          v-model="userPassword"
        />

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
