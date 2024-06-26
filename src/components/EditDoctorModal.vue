<script setup>
import { ref } from "vue";
import StyledButton from "./StyledButton.vue";
import FormInput from "./FormInput.vue";
import Loading from "./Loading.vue";
import axios from "axios";
const props = defineProps({
  text: String,
  doctor: Object,
});

// variables ----

const type = JSON.parse(props.doctor.type);
const formError = ref();
const isLoading = ref();
const API_KEY = import.meta.env.VITE_API_KEY;
// models

const name = defineModel("name");
const doctorSurname = defineModel("doctorSurname");
const doctorLogin = defineModel("doctorLogin");
const doctorPassword = defineModel("doctorPassword");
const doctorSpecialization = defineModel("doctorSpecialization");
const doctorPhone = defineModel("doctorPhone");
const doctorStartTime = defineModel("doctorStartTime");
const doctorEndTime = defineModel("doctorEndTime");
name.value = props.doctor.name;
doctorSurname.value = props.doctor.surname;
doctorLogin.value = props.doctor.login;
doctorSpecialization.value = type.specialization;
doctorPhone.value = type.phone;
doctorStartTime.value = type.workTime.start;
doctorEndTime.value = type.workTime.end;

// -------------------

function handler(e) {
  e.preventDefault();
  formError.value = "";
  if (
    name.value &&
    doctorSurname.value &&
    doctorLogin.value &&
    doctorSpecialization.value &&
    doctorPhone.value &&
    doctorStartTime.value &&
    doctorEndTime.value
  ) {
    isLoading.value = true;
    let data;
    if (doctorPassword.value) {
      data = {
        _id: props.doctor._id,
        name: name.value,
        surname: doctorSurname.value,
        login: doctorLogin.value,
        password: doctorPassword.value,
        type: `
{
      "accountType" : "doctor",
      "specialization" : "${doctorSpecialization.value}",
      "workTime" : {
        "start" : "${doctorStartTime.value}",
        "end" : "${doctorEndTime.value}"
      },
      "phone" : "${doctorPhone.value}"
}`,
      };
    } else {
      data = {
        _id: props.doctor._id,
        name: name.value,
        surname: doctorSurname.value,
        login: doctorLogin.value,
        type: `
{
      "accountType" : "doctor",
      "specialization" : "${doctorSpecialization.value}",
      "workTime" : {
        "start" : "${doctorStartTime.value}",
        "end" : "${doctorEndTime.value}"
      },
      "phone" : "${doctorPhone.value}"
}`,
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
  }
}

const emit = defineEmits(["update:modelValue"]);
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
        <h2>Доктор</h2>
        <form>
          <div class="formError" v-if="formError">
            <p>{{ formError }}</p>
          </div>
          <FormInput
            :value="name"
            :type="'text'"
            :placeholder="'Имя'"
            v-model="name"
          />
          <FormInput
            :value="doctorSurname"
            :type="'text'"
            :placeholder="'Фамилия'"
            v-model="doctorSurname"
          />
          <FormInput
            :value="doctorLogin"
            :type="'text'"
            :placeholder="'Логин'"
            v-model="doctorLogin"
          />
          <label>
            Если не хотите менять пароль не заполнять!

            <FormInput
              :value="doctorPassword"
              :type="'password'"
              :placeholder="'Пароль'"
              v-model="doctorPassword"
            />
          </label>
          <FormInput
            :value="doctorSpecialization"
            :type="'text'"
            :placeholder="'Специализация'"
            v-model="doctorSpecialization"
          />
          <FormInput
            :value="doctorPhone"
            :type="'tel'"
            :placeholder="'Телефон'"
            v-model="doctorPhone"
          />
          <label>
            Начало работы

            <FormInput
              :value="doctorStartTime"
              :type="'time'"
              v-model="doctorStartTime"
            />
          </label>
          <label>
            Конец работы

            <FormInput
              :value="doctorEndTime"
              :type="'time'"
              v-model="doctorEndTime"
          /></label>
        </form>
        <StyledButton v-if="handler" @click="handler" :text="'Подтвердить'" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.formError {
  background: red;
  color: aliceblue;
  padding: 5px 15px;
  width: 100%;
}

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

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
