<script setup>
    const props = defineProps({
        text: String
    })
</script>

<template>
    <button type="submit">{{ props.text }}</button>
</template>

<style lang="scss" scoped>
    button{
        padding: 10px;
        border-radius: 10px;
        outline: none;
        border: none;
        background: var(--primary-color);
        color: var(--dark-color);
        transition: 1s;
        // color: #0be9a2;
        // background-color: #066648;
        &:hover{
            box-shadow: 0px 5px 9px -2px rgba($color: #06a472, $alpha: 1.0);
            transform: translateY(-5px);
        }
        &:focus{
            transition: 0s;
            border: 1px solid #fff;
        }
        cursor: pointer;
    }
</style>