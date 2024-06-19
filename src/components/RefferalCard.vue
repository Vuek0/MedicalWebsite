<script setup>
 const props = defineProps({

 })
</script>

<template>
    <div class="referral">
        <h4>Направление: </h4>
        <p>От : Хафизова ( Терапевт )</p>
        <p>К кому: Аманов ( Хирург )</p>
    </div>
</template>

<style lang="scss" scoped>
    .referral{
        border-bottom: 3px solid #000;
        background: #fff;
        display: flex;
        flex-direction: column;
        padding: 20px 60px;
        gap: 3px;
        h4, p{
            color: var(--dark-color);
            font-weight: bold;
        }
    }
</style>