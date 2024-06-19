<script setup>
    const props = defineProps({
        value: String,
        innerValue: String,
    })
</script>

<template>
    <option :value="value">{{ innerValue }}</option>    
</template>

<style lang="scss" scoped>
    option{
        padding: 10px;
    }
</style>