<script setup>
import { onMounted, ref } from "vue";
import FormInput from "./components/FormInput.vue";
import SubmitButton from "./components/StyledButton.vue";
import SideBar from "./components/SideBar.vue";
import Loading from "./components/Loading.vue";
import { usePages } from "./stores/Pages";
import { useUser } from "./stores/User";
import axios from "axios";
import VisitsPage from "./components/VisitsPage.vue";
import { getCookie, setCookie } from "./functions/Cookies";
import UserPage from "./components/UserPage.vue";
import MainPage from "./components/MainPage.vue";
import ContactsPage from "./components/ContactsPage.vue";
const pages = usePages();
const user = useUser();
const isLoading = ref(false);
const isRegistered = ref(false);
const isLoginForm = ref(true);
const name = defineModel("name");
const surname = defineModel("surname");
const login = defineModel("login");
const password = defineModel("password");
const formError = ref();
const API_KEY = import.meta.env.VITE_API_KEY;

function removeParam(param, urlParams) {
  if (urlParams.has(param)) {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.pushState(null, "", url.toString());
  }
}

onMounted(async () => {
  isLoading.value = true;
  const urlParams = new URLSearchParams(window.location.search);
  name.value = urlParams.get("name");
  surname.value = urlParams.get("surname");
  login.value = urlParams.get("login");
  password.value = urlParams.get("password");
  removeParam("name", urlParams);
  removeParam("surname", urlParams);
  removeParam("login", urlParams);
  removeParam("password", urlParams);

  // console.log(urlParams);
  if (name.value && surname.value && login.value && password.value) {
    isLoginForm.value = false;
    registrationHandler();
  } else if (login.value && password.value) {
    loginHandler();
  }
  if (getCookie("_id")) {
    const id = getCookie("_id");
    axios
      .get(
        `https://medical-server-six.vercel.app/users?key=${API_KEY}&_id=${id}`
      )
      .then((res) => {
        user.obj = res.data;
        isRegistered.value = true;
        isLoginForm.value = false;
        isLoading.value = false;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    isLoading.value = false;
  }
});

async function loginHandler(e) {
  if (e) {
    e.preventDefault();
  }
  isLoading.value = true;
  formError.value = "";
  if (login.value && password.value) {
    const response = await axios
      .get(
        `https://medical-server-six.vercel.app/users?login=${login.value}&password=${password.value}&key=${API_KEY}`
      )
      .then((res) => {
        const userData = res.data;
        if (userData.status && userData.status !== 200) {
          formError.value = userData.message;
          console.log(user);
        } else {
          user.obj = userData;
          console.log(userData._id);
          isLoginForm.value = false;
          isRegistered.value = true;
          if (!getCookie("_id")) setCookie("_id", userData._id, 3);
        }
        isLoading.value = false;
      });
  } else {
    formError.value = "Поля не могут быть пустыми";
    console.log(formError);
  }
}

async function registrationHandler(e) {
  if (e) {
    e.preventDefault();
  }
  if (name.value && surname.value && login.value && password.value) {
    isLoading.value = true;
    const data = {
      name: name.value,
      surname: surname.value,
      login: login.value,
      password: password.value,
      type: '{"accountType" : "pacient"}',
    };
    try {
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
          const object = res.data;
          console.log(object);
          if (res.status == 200) {
            if (!getCookie("_id")) setCookie("_id", object.data._id, 3);
            user.obj = object;
            isRegistered.value = true;
            location.reload();
          }
        })
        .catch((err) => {
          formError.value = err.response.data.message;
        });
    } catch (err) {
      console.log(err);
    }
  } else {
    formError.value = "Поля не могут быть пустыми";
    console.log(formError);
  }
  isLoading.value = false;
}
</script>

<template>
  <SideBar :pages="pages" v-if="user.obj" :userObj="user.obj" />
  <main>
    <div class="container">
      <a href="#" @click="pages.currentPage = 'main'"
        ><img src="./assets/logo.png" alt="logo"
      /></a>
      <Loading v-if="isLoading" />
      <section
        class="registration"
        v-if="!isRegistered && !isLoginForm && !isLoading"
      >
        <form @submit="registrationHandler">
          <h2>Регистрация</h2>
          <div class="formError" v-if="formError">
            <p>{{ formError }}</p>
          </div>
          <FormInput
            type="text"
            placeholder="Name"
            v-model="name"
            :value="name"
          />
          <FormInput
            type="text"
            placeholder="Surname"
            v-model="surname"
            :value="surname"
          />
          <FormInput
            type="text"
            placeholder="Логин"
            v-model="login"
            :value="login"
          />
          <FormInput
            type="password"
            placeholder="Пароль"
            v-model="password"
            :value="password"
          />
          <SubmitButton :text="'Зарегестрироваться'" />
          <p>
            Уже есть аккаунт?
            <a href="#" class="form__link" @click="isLoginForm = true">войти</a>
          </p>
        </form>
      </section>
      <section class="login" v-else-if="isLoginForm && !isLoading">
        <form @submit="loginHandler">
          <h2>Вход</h2>
          <div class="formError" v-if="formError">
            <p>{{ formError }}</p>
          </div>
          <FormInput
            type="text"
            placeholder="Логин"
            v-model="login"
            :value="login"
          />
          <FormInput
            type="password"
            placeholder="Пароль"
            v-model="password"
            :value="password"
          />
          <SubmitButton :text="'Войти'" />
          <p>
            Еще нет аккаунта?
            <a href="#" class="form__link" @click="isLoginForm = false"
              >Зарегестрироваться</a
            >
          </p>
        </form>
      </section>
      <MainPage v-else-if="!isLoading && pages.currentPage == 'main'" />
      <UserPage v-else-if="!isLoading && pages.currentPage == 'user'" />
      <VisitsPage v-else-if="!isLoading && pages.currentPage == 'visits'" />
      <ContactsPage v-else-if="!isLoading && pages.currentPage == 'contacts'" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
$primary-color: #0be9a2;
$bg-color: #f4f4f4;
$dark-color: #066648;

h1 {
  font-size: 100px;
}

main {
  width: 100%;
}

.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.formError {
  background: red;
  color: aliceblue;
  padding: 5px 15px;
  width: 100%;
}

section {
  margin-top: 30px;
}

.registration,
.login {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;

  h2 {
    font-size: 60px;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-width: 250px;
    text-align: center;

    a {
      color: cornflowerblue;

      &:hover {
        color: dodgerblue;
      }
    }
  }
}
</style>
