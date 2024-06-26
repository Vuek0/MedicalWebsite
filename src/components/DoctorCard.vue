<script setup>
    const props = defineProps({
        name : String,
        surname : String,
        type: String,
    })
    const typeObj = JSON.parse(props.type);
    const specialization = typeObj.specialization;
    const workTime = typeObj.workTime;
    const phone = typeObj.phone;
</script>

<template>
    <div class="doctor-card">
        <p>Врач : {{ name }} {{ surname }}</p>
        <p>Специальность : {{ specialization }}</p>
        <p>Время работы:</p>
        <div class="date">
            <p>Начало - {{ workTime.start }}</p>
            <p>Конец - {{ workTime.end }}</p>
        </div>
        <a href="tel:+998991233232">{{ phone }}</a>
    </div>
</template>

<style lang="scss" scoped>
    .doctor-card{
        width: 100%;
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