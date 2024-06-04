<script setup>
import { ref } from 'vue';
import SideBar from './components/SideBar.vue';
import { usePages } from './stores/Pages';
const pages = usePages();
const isRegistered = ref(false);
const isLoginForm = ref(true);
const login = defineModel('login');
const password = defineModel('password');
</script>

<template>
  <SideBar :pages="pages"/>
  <main>
    <div class="container">
      <h1>Городская Больница</h1>
      <section class="registration" v-if="!isRegistered && !isLoginForm">
        <h2>Регистрация</h2>
        <form @submit="$event.preventDefault(); isRegistered=true;">
          <input type="text" placeholder="Логин" v-model="login">
          <input type="password" placeholder="Пароль" v-model="password">
          <button type="submit">Зарегестрироваться</button>
          <p>Уже есть аккаунт? <a href="#" class="form__link" @click="isLoginForm = true">войти</a></p>
          login:
          {{ login }}
          password:
          {{ password }}
        </form>
        
      </section>
      <section class="login" v-else-if="isLoginForm">
        <form @submit="$event.preventDefault(); isRegistered=true; isLoginForm=false">
          <h2>Вход</h2>
          <input type="text" placeholder="Логин" v-model="login">
          <input type="password" placeholder="Пароль" v-model="password">
          <button type="submit">Войти</button>
          <p>Еще нет аккаунта? <a href="#" class="form__link" @click="isLoginForm = false">Зарегестрироваться</a></p>
          login:
          {{ login }}
          password:
          {{ password }}
        </form>
        
      </section>
      <section v-else-if="pages.currentPage == 'main'">
        It's the main page<br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil cupiditate dignissimos reiciendis sint facere voluptatibus asperiores exercitationem, veniam molestiae saepe?
      </section>
      <section v-else-if="pages.currentPage == 'user'">
        It's the user page<br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil cupiditate dignissimos reiciendis sint facere voluptatibus asperiores exercitationem, veniam molestiae saepe?
      </section>
    </div>
    
  </main>
</template>

<style lang="scss" scoped>
  h1{
    font-size: 100px;
  }

  main{
    width: 100%;
  }

  .container{
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .registration, .login{

    display: flex;
    flex-direction: column;
    gap: 30px;

    h2{
      font-size: 60px;
    }
    form{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 400px;

      input{
        padding: 5px 15px;
        font-size: 30px;
      }
      button{
        width: fit-content;
        padding: 10px 20px;
        font-size: 25px;
      }

      a{
        color: cornflowerblue;

        &:hover{
          color: dodgerblue;
        }
      }
      
    }
  }

</style>
