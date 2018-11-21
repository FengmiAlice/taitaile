<template>
    <div class="custom-bread-crumb">
        <Breadcrumb :style="{fontSize: `${fontSize}px`}" separator=">" >
            <Icon type="md-menu" />
            <BreadcrumbItem v-for="item in list" :to="item.to" :key="`bread-crumb-${item.name}`" >
                {{ showTitle(item) }}
            </BreadcrumbItem>
        </Breadcrumb>
    </div>
</template>

<script>
    import { showTitle } from '@/common/util'
    import './custom-bread-crumb.less'

    export default {
        name: "custom-bread-crumb",
        props: {
            list: {
                type: Array,
                default: () => []
            },
            fontSize: {
                type: Number,
                default: 14
            },

        },
        mounted(){

        },
        methods: {
            showTitle(item) {
                return showTitle(item)
            },
        },
    }
</script>

<style scoped>
    .custom-bread-crumb{
        float: left;
    }
</style>
