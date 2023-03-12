<template>
    <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
            <li class="page-item">
                <a class="page-link" @click="onClickPreBtn()" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li :class="['page-item', {'active' : splitStartNo + i - 1 === Number(currPageNo)}]" v-for="i in splitLength" :key="i">
                <a class="page-link" @click="onClickChangePage(splitStartNo + i - 1)"> {{ splitStartNo + i - 1 }} </a>
            </li>
            <li class="page-item">
                <a class="page-link" @click="onClickNextBtn()" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
    export default {
        name: 'page-navigation',
        props: [
            'posts-count',
            'curr-page-no',
            'view-page-count'
        ],
        data() {
            return {
                splitNo: 1,
                splitStartNo: 1,
                splitLastNo: 1,
                splitLength: 1,
                lastPageNo: 1
            }
        },
        mounted() {
            this.loadLastPageNo();
            this.loadSplit();
        },
        methods: {
            loadLastPageNo() {
                const viewPageCount = 10;
                this.lastPageNo = (this.postsCount % viewPageCount === 0) ? this.postsCount / viewPageCount : Math.ceil(this.postsCount / viewPageCount);
            },
            loadSplit() {
                const splitCount = 5;
                this.splitStartNo = 1 + (this.splitNo - 1) * splitCount;
                this.splitLastNo = (this.splitNo * splitCount < this.lastPageNo) ? this.splitNo * splitCount : this.lastPageNo;
                this.splitLength = this.splitLastNo - this.splitStartNo + 1;
            },
            onClickPreBtn() {
                if (this.splitNo === 1) {
                    this.onClickChangePage(this.splitStartNo)
                } else {
                    this.splitNo -= 1;
                    this.loadSplit();
                    this.onClickChangePage(this.splitLastNo)
                }
            },
            onClickNextBtn() {
                if (this.splitLastNo === this.lastPageNo) {
                    this.onClickChangePage(this.splitLastNo)
                } else {
                    this.splitNo += 1;
                    this.loadSplit();
                    this.onClickChangePage(this.splitStartNo)
                }
            },
            onClickChangePage(currPageNo) {
                this.$emit('onClickChangePage', currPageNo)
            }
        },
        watch: {
            postsCount() {
                this.loadLastPageNo();
                this.loadSplit();
            }
        }
    }
</script>

<style>
    .navbar .nav-item .nav-link.active{
        font-weight: bold;
        color: var(--bs-gray-800);
    }
    .pagination .page-item .page-link{
        color: var(--bs-dark-text);
        cursor: pointer;
    }
    .pagination .page-item.active>.page-link{
        background-color: var(--bs-dark-text);
        color: var(--bs-white);
        border-color: var(--bs-dark-text)
    }
</style>