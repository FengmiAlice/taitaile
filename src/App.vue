<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
  @import "./App";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.size{
  width: 100%;
  height: 100%;
}
html,body{
.size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
.size;
}

</style>
