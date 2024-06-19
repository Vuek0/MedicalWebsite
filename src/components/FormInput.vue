<script setup>
const props = defineProps({
    placeholder: String,
    type: String,
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <input :placeholder="placeholder" :type="type" @change="emit('update:modelValue', $event.target.value);">
</template>

<style lang="scss" scoped>
    input{
        width: 100%;
        padding: 12px 15px;
        outline: 2px solid var(--primary-color);
        border: none;
        border-radius: 10px;

        &::placeholder{
            font-size: 17px;    
        }
    }
</style>