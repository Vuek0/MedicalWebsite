<script setup>

</script>

<template>
    <div class="doctor-card">
        <p>Врач : Хафизова</p>
        <p>Специальность : Терапевт</p>
        <p>Время работы:</p>
        <div class="date">
            <p>Начало - 12:30</p>
            <p>Конец - 17:00</p>
        </div>
        <a href="tel:+998991233232">+998-99-123-32-32</a>
    </div>
</template>

<style lang="scss" scoped>
    .doctor-card{
        background: #fff;
        display: flex;
        flex-direction: column;
        gap: 3px;
        padding: 10px 50px;
        border-bottom: 3px solid #000 ;
        border-radius: 10px;
        h4, p, a{
            color: var(--dark-color);
            font-weight: bold;
        }

        a{
            font-style: italic;
            transition: 0.5s;
            // margin-top: 10px;
            &:hover{
                color: var(--primary-color);
            }
        }

        .date{
            display: flex;
            gap: 20px;
        }
    }
</style>