<script setup>
const props = defineProps({
    placeholder: String,
    type: String,
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <input :placeholder="placeholder" :type="type" @input="emit('update:modelValue', $event.target.value)">
</template>

<style lang="scss" scoped>
    input{
        padding: 5px 15px;
        font-size: 30px;
    }
</style>