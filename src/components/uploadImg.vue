<template>
    <div class="uploadImg">
        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="imgSrc">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png','bmp']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                type="drag"
                :action="uploadingAddress"
                name="multipartFile"
                :headers="headers"
                :with-credentials="true"
                style="display: inline-block;width:100px;" v-show="show" v-if="!status">
            <div style="width: 100px;height:100px;line-height: 100px;" v-show="show">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
        </Upload>

        <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png','bmp']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                type="drag"
                :action="uploadingAddress"
                name="multipartFile"
                :headers="headers"
                :with-credentials="true"
                style="display: inline-block;width:100px;" v-show="show" v-if="status">
            <div style="width: 100px;height:100px;line-height: 100px;" v-show="show">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
        </Upload>

        <Modal v-model="visible" title="View Image">
            <img :src="imgSrc" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
    import BASE_URL from '@/api/url'

    export default {
        name: "uploadImg",
        props: {
            imgName: {type: String},
            status: {type: Boolean}
        },
        data() {
            return {
                show: true,
                uploadingAddress: `${BASE_URL}/file/admin/uploadFile`,
                defaultList: [{
                    'name': '',
                    'url': ''
                }],

                headers: {
                    'token': window.sessionStorage.getItem('token'),
                },
                visible: false,
                uploadList: [],
                picName: '',
            }
        },
        methods: {
            handleView(name) {
                this.picName = name;
                this.visible = true;
            },
            handleRemove(file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                this.show = true;
                this.$emit('removeImgUrl', file);
            },
            handleSuccess(res, file) {
                let check = this.uploadList.length < 1;
                if (!check) {
                    this.show = false;
                }
                this.$emit('fetchImgUrl', res.data)
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '图片格式不对',
                    desc: '图片' + file.name + ' 格式不对, 请上传JPG或者PNG格式.'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '图片大小不对',
                    desc: '图片' + file.name + ' 太大了, 请不要超过2M.'
                });
            },
            handleBeforeUpload() {
                let check = this.uploadList.length < 1;
                if (!check) {
                    this.show = false;
                }
                return check;
            }
        },
        mounted() {
            this.uploadList = this.$refs.upload.fileList;
            if( this.defaultList[0].status === "finished"){
                this.show = false
            }


        },


        computed: {
            imgSrc: function () {
                if(this.$props.imgName !=='default'){
                    return  this.$props.imgName.indexOf('http') ===-1?`${BASE_URL}/${this.$props.imgName}`:this.$props.imgName
                }

            }
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