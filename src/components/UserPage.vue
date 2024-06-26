<script setup>
// imports

import { ref, onMounted } from "vue";
import { setCookie } from "../functions/Cookies";
import ProfileText from "./ProfileText.vue";
import StyledButton from "./StyledButton.vue";
import EditDoctorModal from "./EditDoctorModal.vue";
import EditUserModal from "./EditUserModal.vue";
import FormInput from "./FormInput.vue";
import SearchInput from "./SearchInput.vue";
import SearchButton from "./SearchButton.vue";
import DoctorCard from "./DoctorCard.vue";
import UserCard from "./UserCard.vue";
import Loading from "./Loading.vue";
import { useUser } from "../stores/User";
import { usePages } from "../stores/Pages";
import { useData } from "../stores/Data";

// variables

const isEdit = defineModel("isEdit");
const isEditUser = defineModel("isEditUser");
import axios from "axios";
const isLoading = ref();
const user = useUser();
const pages = usePages();
const dataStore = useData();
const userObj = user.obj;
const isModalOpen = defineModel("modalopen");
const API_KEY = import.meta.env.VITE_API_KEY;
const type = JSON.parse(userObj.type);
const search = defineModel("search");
const searchUser = defineModel("searchUser");
const doctors = ref();
const users = ref();
const doctorFormError = ref();
const formError = ref();
const userForEdit = defineModel("userForEdit");
const doctorForEdit = defineModel("doctorForEdit");

// form models

// users ----
const userName = defineModel("userName");
const userSurname = defineModel("userSurname");
const userLogin = defineModel("userLogin");
const userPassword = defineModel("userPassword");
// ----

// doctors ----
const doctorName = defineModel("doctorName");
const doctorSurname = defineModel("doctorSurname");
const doctorLogin = defineModel("doctorLogin");
const doctorPassword = defineModel("doctorPassword");
const doctorSpecialization = defineModel("doctorSpecialization");
const doctorPhone = defineModel("doctorPhone");
const doctorStartTime = defineModel("doctorStartTime");
const doctorEndTime = defineModel("doctorEndTime");
// ----

// functions

function exitHandler(e) {
  e.preventDefault();
  setCookie("_id", "");
  location.reload();
}

onMounted(async () => {
  if (!dataStore.allDoctors) {
    axios
      .get(`https://medical-server-six.vercel.app/users/doctors?key=${API_KEY}`)
      .then((data) => {
        doctors.value = data.data;
        dataStore.changeAllDoctors(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    doctors.value = dataStore.allDoctors;
  }

  if (JSON.parse(userObj.type).accountType === "admin") {
    console.log("yes");
    if (!dataStore.allUsers) {
      axios
        .get(
          `https://medical-server-six.vercel.app/users/pacients?key=${API_KEY}`
        )
        .then((data) => {
          users.value = data.data;
          dataStore.allUsers = data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      users.value = dataStore.allUsers;
    }
  }
});

function searchingDoctors(e) {
  e.preventDefault();
  const result = [];
  const input = search.value.toLowerCase();
  doctors.value.forEach((item) => {
    const doctor = `${item.name.toLowerCase()} ${item.surname.toLowerCase()}`;
    if (doctor.includes(input)) {
      result.push(item);
    }
  });
  doctors.value = result;
}

function putBackDoctors() {
  if (!search.value) {
    doctors.value = dataStore.allDoctors;
  }
}

function searchingUsers(e) {
  e.preventDefault();
  const result = [];
  console.log(searchUser.value);
  const input = searchUser.value.toLowerCase();
  if (users.value.length == 0) {
    users.value = dataStore.allUsers;
  }
  users.value.forEach((item) => {
    console.log(item);
    const user = `${item.name.toLowerCase()} ${item.surname.toLowerCase()}`;
    if (user.includes(input)) {
      result.push(item);
    }
  });
  users.value = result;
}

function putBack() {
  if (!searchUser.value) {
    users.value = dataStore.allUsers;
  }
}

async function addDoctor(e) {
  e.preventDefault();
  doctorFormError.value = "";
  if (
    doctorName.value &&
    doctorSurname.value &&
    doctorLogin.value &&
    doctorPassword.value &&
    doctorSpecialization.value &&
    doctorPhone.value &&
    doctorStartTime.value &&
    doctorEndTime.value
  ) {
    isLoading.value = true;
    const data = {
      name: doctorName.value,
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
    axios
      .post(
        `https://medical-server-six.vercel.app/users?key=${API_KEY}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        alert("Аккаунт создан успешно");
        isLoading.value = false;
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    doctorFormError.value = "Поля не могут быть пустыми";
  }
}

async function addUser(e) {
  e.preventDefault();
  formError.value = "";
  if (
    userName.value &&
    userSurname.value &&
    userLogin.value &&
    userPassword.value
  ) {
    isLoading.value = true;
    const data = {
      name: userName.value,
      surname: userSurname.value,
      login: userLogin.value,
      password: userPassword.value,
      type: '{"accountType" : "pacient"}',
    };
    axios
      .post(
        `https://medical-server-six.vercel.app/users?key=${API_KEY}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        alert("Аккаунт создан успешно");
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
  <Loading v-if="isLoading" />
  <section v-else-if="type.accountType === 'pacient'" class="pacient">
    <ProfileText />
    <StyledButton @click="exitHandler" :text="'Выйти из аккаунта'" />
  </section>

  <section v-else-if="type.accountType === 'doctor'">
    <h2>Врач</h2>
    <ProfileText />
    <StyledButton @click="exitHandler" :text="'Выйти из аккаунта'" />
  </section>

  <section v-else-if="type.accountType === 'admin' && !isLoading" class="admin">
    <div class="doctors">
      <div class="header">
        <h2>Доктора</h2>
        <form class="search" @submit="searchingDoctors">
          <SearchInput
            v-model="search"
            :type="'text'"
            @change="putBackDoctors"
          />
          <SearchButton />
        </form>
      </div>
      <div class="cards">
        <h4 v-if="doctors && doctors.length == 0">Ничего не найдено</h4>
        <DoctorCard
          v-for="item in doctors"
          :key="item"
          :name="item.name"
          :surname="item.surname"
          :login="item.login"
          :type="item.type"
          :doctor="item"
          :isEditable="true"
          v-model:isEdit="isEdit"
          v-model:doctorForEdit="doctorForEdit"
        />
      </div>
      <EditDoctorModal v-if="isEdit" v-model="isEdit" :doctor="doctorForEdit" />
    </div>
    <div class="forms">
      <h2>Добавление новых</h2>

      <form class="addDoctors" @submit="addDoctor">
        <h3>Добавление Доктора</h3>
        <div class="formError" v-if="doctorFormError">
          <p>{{ doctorFormError }}</p>
        </div>
        <FormInput :type="'text'" :placeholder="'Имя'" v-model="doctorName" />
        <FormInput
          :type="'text'"
          :placeholder="'Фамилия'"
          v-model="doctorSurname"
        />
        <FormInput
          :type="'text'"
          :placeholder="'Логин'"
          v-model="doctorLogin"
        />
        <FormInput
          :type="'password'"
          :placeholder="'Пароль'"
          v-model="doctorPassword"
        />
        <FormInput
          :type="'text'"
          :placeholder="'Специализация'"
          v-model="doctorSpecialization"
        />
        <FormInput
          :type="'tel'"
          :placeholder="'Телефон'"
          v-model="doctorPhone"
        />
        <label>
          Начало работы

          <FormInput :type="'time'" v-model="doctorStartTime" />
        </label>
        <label>
          Конец работы

          <FormInput :type="'time'" v-model="doctorEndTime"
        /></label>
        <StyledButton :text="'Создать'" />
      </form>

      <form class="addVisitors" @submit="addUser">
        <h3>Добавление посетителя</h3>
        <div class="formError" v-if="formError">
          <p>{{ formError }}</p>
        </div>
        <FormInput :type="'text'" :placeholder="'Имя'" v-model="userName" />
        <FormInput
          :type="'text'"
          :placeholder="'Фамилия'"
          v-model="userSurname"
        />
        <FormInput :type="'text'" :placeholder="'Логин'" v-model="userLogin" />
        <FormInput
          :type="'password'"
          :placeholder="'Пароль'"
          v-model="userPassword"
        />

        <StyledButton :text="'Создать'" />
      </form>

      <StyledButton @click="exitHandler" :text="'Выйти из аккаунта'" />
    </div>
    <div class="pacients">
      <div class="header">
        <h2>Пациенты</h2>

        <form class="search" @submit="searchingUsers">
          <SearchInput v-model="searchUser" :type="'text'" @change="putBack" />
          <SearchButton />
        </form>
      </div>

      <div class="cards">
        <h4 v-if="users && users.length == 0">Ничего не найдено</h4>
        <UserCard
          v-for="item in users"
          :key="item"
          :name="item.name"
          :surname="item.surname"
          :login="item.login"
          :isEditable="true"
          :user="item"
          v-model:isEditUser="isEditUser"
          v-model:userForEdit="userForEdit"
        />
      </div>
      <EditUserModal
        v-if="isEditUser"
        v-model="isEditUser"
        :user="userForEdit"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.formError {
  background: red;
  color: aliceblue;
  padding: 5px 15px;
  width: 100%;
}

.pacient {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.forms {
  display: flex;
  flex-direction: column;
  gap: 50px;

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

.admin {
  display: flex;
  width: 100%;
  padding: 0 20px;
  gap: 50px;
  .header {
    display: flex;
    justify-content: space-between;
  }
  .doctors {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .cards {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }

  .pacients {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .search {
    display: flex;
    width: fit-content;
  }

  & > div {
    width: 33.3%;
    // display: flex;
    // background: #fff;
  }
}

@media (max-width: 1305px) {
  .admin {
    flex-wrap: wrap;
    & > div:nth-child(1),
    & > div:nth-child(2) {
      width: calc(50% - 50px);
    }

    & > div:last-child {
      width: 100%;
    }
  }
}

@media (max-width: 947px) {
  .admin {
    & > div {
      width: 100% !important;
    }
  }
}
</style>
