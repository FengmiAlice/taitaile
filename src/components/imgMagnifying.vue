<template>
  <div class="demo-upload-list" >
    <template>
      <img :src="imgSrc">
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
      </div>
    </template>
    <Modal v-model="visible"  style="z-index:99999999" title="View Image">
      <img :src="imgSrc" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "imgMagnifying",
    props: ['imgSrc'],
    data() {
      return {
        visible: false,
        show: true,
      }
    },
    mounted() {
    },
    methods:{
      handleView(name) {
        this.picName = name;
        this.visible = true;
      },
    }
  }
</script>

<style scoped>
  .demo-upload-list {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }
  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
<style lang="less">



</style>
