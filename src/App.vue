<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss"></style>
<script>
export default {};
</script>
<style lang="scss">
*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: inherit;
}

html {
  box-sizing: border-box;
  font-size: 62.5%;
  list-style: none;
}
ul {
  list-style: none;
}
button {
  display: inline-block;
  outline: none;
  border: none;
  transition: all 0.3s;
  &:hover {
    opacity: 0.9;
  }
  &:active {
    transform: translateY(2px);
  }
}
a{
  color:currentColor;
  text-decoration: none;
}
.dividing-line {
  font-size: 14px;
  letter-spacing: 10px;
}
</style>
