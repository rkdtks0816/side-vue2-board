<template>
    <div class="row">
        <div class="col-md-8 col-10 mx-auto mt-5"> 
            <nav class="navbar navbar-expand">
                <div class="container-fluid p-0">
                    <router-link class="navbar-brand fw-bold fs-1" to="/">Vue.Board</router-link>
                    <ul class="navbar-nav ms-auto mb-lg-0">
                        <li class="nav-item">
                            <div class="nav-link btn border-0" @click="onClickLogin()">{{ (!userProfile) ? '로그인' : '로그아웃' }}</div>
                        </li>
                        <li class="nav-item" v-if="userProfile">
                            <button type="button" class="nav-link active btn border-0" @click="onClickAddPostBT()">글쓰기</button>
                        </li>             
                    </ul> 
                </div>
            </nav>        
            <div class="mt-5">
                <table class="table table-hover">
                    <colgroup>
                        <col width="50px"/>
                        <col width=""/>
                        <col width="100px"/>
                        <col width="100px"/>
                    </colgroup>
                    <thead class="table-light">
                        <tr>
                            <th class="text-center">번호</th>
                            <th>제목</th>
                            <th>작성자</th>                            
                            <th class="text-center">작성 일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="post, index in posts" :key="post.post_id" 
                            @click="$router.push({ name: 'view', params: {post_id: post.post_id} })"
                        >
                            <th class="text-center" scope="row"> {{ (index + 1) + (currPageNo - 1) * viewPageCount }} </th>                            
                            <td>
                                {{ post.title }} 
                            </td>
                            <td> {{ post.user_name }} </td>
                            <td class="text-center"> {{ post.created_at.slice(0, 10) }} </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <page-navigation :curr-page-no="currPageNo" :posts-count="postsCount" :view-page-count="viewPageCount" @on-click-change-page="onClickChangePage"></page-navigation>
        </div>
        <modal-confirm v-if="confirmMessage" :confirm-message="confirmMessage" @on-close="confirmMessage=null" @on-confirm="onClickModalLogin()"></modal-confirm>
        <modal-alert v-if="alertMessage" :alert-message="alertMessage" @on-close="alertMessage=null"></modal-alert>
    </div>
</template>

<script>
import pageNavigation from '@/components/pageNavigation.vue';
import modalConfirm from '@/components/modalConfirm.vue';
import modalAlert from '@/components/modalAlert.vue';

export default {
    name: "board-cp",
    components: {         
        pageNavigation,
        modalConfirm,
        modalAlert
    },
    data() {
        return {
            posts: [],
            currPageNo: 1,
            postsCount: 0,
            viewPageCount: 10,
            confirmMessage: null,
            alertMessage: null,
            address: 'http://59.3.14.15:8005'
        }
    },
    mounted() {
        this.loadPosts();
        this.loadCount();
    },
    methods: {
        async loadPosts() {
            this.currPageNo = (this.$route.query.page) ? this.$route.query.page : 1;
            let response = await fetch(`${this.address}/posts?page_no=${this.currPageNo}`)
            let rows = await response.json();
            this.posts = rows.posts;
        },            
        async loadCount() {
            let response = await fetch(`${this.address}/posts/count`)
            let result = await response.json();
            this.postsCount = result.result.count;
        },
        onClickLogin() {
            if (!this.userProfile) {
                this.$router.push({name: 'sign-in', query:{redirect: this.$route.fullPath}});
            } else { 
                this.$cookies.remove('token');
                this.$store.commit('setUserProfile', null);
                this.alertMessage = '로그아웃 되었습니다.';
            }
        },
        onClickChangePage(currPageNo) {
            this.$router.push(`/?page=${currPageNo}`);
        },
        onClickAddPostBT() {
            if (!this.userProfile) {
                this.confirmMessage = '로그인 후 이용하실 수 있습니다.'
            } else {
                this.$router.push('create')
            }
        },
        onClickModalLogin() {
            this.$router.push({ name: 'sign-in', query: { redirect:  this.$route.fullPath}})
        }

    },
    computed: {
        userProfile() {
            return this.$store.getters['getUserProfile']
        }
    },
    watch: {
        $route() {
            this.loadPosts();
        }
    }
}
</script>

<style>
</style>
