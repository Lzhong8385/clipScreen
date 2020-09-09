<template>
  <div id="app">
    <div class="container" ref="target">
      <clip />
      <div id="nav">
        <router-link to="/">Home</router-link>|
        <router-link to="/about">About</router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>
<script>
import clip from "@/components/clip";
import ClipScreen from "@/utils/clipScreen";
export default {
  components: {
    clip
  },
  methods: {
    screenShot(success, complete) {
      new ClipScreen(this.$refs.target, {
        success,
        complete
      });
    }
  }
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
