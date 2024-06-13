<script setup>
const props = defineProps({
    userObj : Object,
})
</script>

<template>
    <section>
        <h2>Информация о пользователе: </h2>
        <div class="info">
            <p>Имя : {{ userObj.name }}</p>
            <p>Фамилия : {{ userObj.surname }}</p>
            <p>Логин : {{ userObj.login }}</p>
        </div>
        <button>Выйти из аккаунта</button>
    </section>
</template>

<style lang="scss" scoped>
    section{
        text-align: center;
    }
    .info{
        display: flex;
        flex-direction: column;
        gap: 15px;
        p{
            font-size: 20px;
            font-weight: bold;
        }
    }
    button{
        padding: 20px 40px;
    }
</style>