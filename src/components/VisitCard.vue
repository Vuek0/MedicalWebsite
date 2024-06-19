<script setup>

</script>

<template>
    <div class="visit-card">
        <h4>Приём</h4>
        <p>Врач : Хафизова (Терапевт)</p>
        <div class="date">
            <p>Дата: 20.06.2024</p>
            <p>Время: 12:30</p>
        </div>
        <p>Статус: Не завершён</p>
    </div>
</template>

<style lang="scss" scoped>
    .visit-card{
        background: #fff;
        display: flex;
        flex-direction: column;
        padding: 10px 50px;
        border-bottom: 3px solid #000 ;
        h4, p{
            color: var(--dark-color);
            font-weight: bold;
        }

        .date{
            display: flex;
            gap: 20px;
        }
    }
</style>