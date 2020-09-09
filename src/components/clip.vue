<template>
  <div class="clip-component">
    <button @click="screenShot">点我截图</button>
    <div class="img-box">
      <p>这里是截图成品效果</p>
      <img :src="imgUrl" />
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      imgUrl: ""
    };
  },
  methods: {
    screenShot() {
      this.$parent.screenShot(
        res => {
          // 截图成功
          this.imgUrl = res;
          console.log(this);
        },
        function() {
          // 结束
          console.log(this);
        }
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.img-box {
  position: fixed;
  top: 0;
  right: 0;
  border: 1px solid #ccc;
  width: 500px;
  img {
    max-width: 100%;
  }
}
</style>
