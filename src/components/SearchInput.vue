<script setup>
const props = defineProps({
  placeholder: String,
  type: String,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <input
    :placeholder="placeholder"
    :type="type"
    @change="emit('update:modelValue', $event.target.value)"
  />
</template>

<style lang="scss" scoped>
input {
  width: 150px;
  padding: 12px 15px;
  //   outline: 2px solid var(--primary-color);
  border: none;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  font-size: 18px;
  //   border-radius: 10px;

  &::placeholder {
    font-size: 17px;
  }
}
</style>
