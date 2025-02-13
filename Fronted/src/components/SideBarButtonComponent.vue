<template>
  <q-btn
    class="button"
    :class="{ 'clicked-button': isActive }"
    :label="item.label"
    @click="handleClick"
  />
</template>

<script>
export default {
  name: 'SideBarButtonComponent',
  props: {
    item: {
      type: Object,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.button {
  font-size: 25px;
  width: 90%;
  border-radius: 50px;
  background-color: white;
  color: black;
  font-weight: bold;
  padding: 10px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  margin-top: 20px;
}

.clicked-button {
  background-color: red;
  color: white;
}
</style>
