<template>
    <div class="uploadImg">
        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <video :src="videoSrc" controls="controls"></video>

                <div class="demo-upload-list-cover">
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
                :format="['mp4']"
                :before-upload="handleBeforeUpload"
                :on-format-error="handleFormatError"
                type="drag"
                :action="uploadingAddress"
                name="multipartFile"
                :headers="headers"
                style="display: inline-block;width: 300px;height:200px;line-height: 200px;" v-show="show" v-if="!status">
            <div style="width: 300px;height:200px;line-height: 200px;" v-show="show">
                <Icon type="ios-add" style="font-size: 40px"/>
            </div>
        </Upload>

        <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['mp4']"
                :before-upload="handleBeforeUpload"
                :on-format-error="handleFormatError"
                type="drag"
                :action="uploadingAddress"
                name="multipartFile"
                :headers="headers"
                style="display: inline-block;width:300px;height: 200px;line-height: 200px;" v-show="show" v-if="status">
            <div style=";width:300px;height: 200px;line-height: 200px;" v-show="show">
                <Icon type="ios-add" style="font-size: 40px"/>
            </div>
        </Upload>
    </div>
</template>

<script>
    import BASE_URL from '@/api/url'

    export default {
        name: "uploadImg",
        props: {
            videoName: {type: String},
            status: {}
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
            }
        },
        methods: {
            handleRemove(file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                this.show = true;
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
                    title: '视频',
                    desc: '视频' + file.name + ' 格式不对, 请上传MP4格式.'
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
            videoSrc: function () {
                return `${BASE_URL}/${this.$props.videoName}`
            }
        }


    }
</script>

<style scoped>
    .demo-upload-list {
        display: inline-block;
        width: 300px;
        height: 200px;
        line-height: 200px;
        text-align: center;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list video {
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

