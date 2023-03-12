<template>
    <div class="row">
        <div class="col-md-8 col-10 mx-auto mt-5"> 
            <div class="row">    
                <router-link class="btn border-0 p-0 fw-bold fs-1 mb-5 text-start" to="/">Vue.Board</router-link>
            </div>
            <div class="fs-5 fw-bold">
                <div class="row">
                    <label class="form-label p-0">제목</label>
                    <input type="email" class="form-control mb-3" v-model="inputTitle" placeholder="제목을 입력해 주세요.">
                </div>
                <div class="row">
                    <label class="form-label p-0">내용</label>
                    <textarea class="form-control" rows="10" v-model="inputContent" placeholder="내용을 입력해 주세요."></textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-3 col-md-2 col-xl-1 btn btn-outline-dark mt-5 ms-auto" @click="onClickEditPost()">수정</div>
            </div>
        </div>
    </div>
    <modal-alert v-if="closeAlert" :alert-message="alertMessage" @on-close="closeAlert=false"></modal-alert>
</template>

<script>
import modalAlert from '@/components/modalAlert.vue';

export default {
    name: 'create-cp',
    components: {
        modalAlert
    },
    data() {
        return{
            post: {},
            inputTitle: "",
            inputContent: "",
            closeAlert:false,
            alertMessage: ''
        }
    },
    mounted() {
        this.loadBeforePost();
    },
    methods: {
        async loadBeforePost() {
            const postId = this.$route.params.post_id;
            let response = await fetch(`http://localhost:3000/posts/post?post_id=${postId}`);
            let result = await response.json();
            if (!result.success) {
                return alert(result.message);
            }
            this.post = result.post;
            this.inputTitle = result.post.title;
            this.inputContent = result.post.content;
        },
        async onClickEditPost() {
            const postId = this.post.post_id;
            const userId = this.post.user_id;
            const existsToken = this.$cookies.get('token');
            if (this.inputTitle === ''){
                this.alertMessage = "제목을 입력해 주세요.";
                this.closeAlert = true;
                return;
            } else if (this.inputContent === ''){
                this.alertMessage = "내용을 입력해 주세요.";
                this.closeAlert = true;
                return;
            }

            const response = await fetch('http://localhost:3000/posts',{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'authorization': existsToken
                },
                body: JSON.stringify({
                    "post_id": postId,
                    "title": this.inputTitle,
                    "content": this.inputContent,
                    "user_id": userId
                })
            })
            const result = await response.json();

            this.alertMessage = result.message;
            this.closeAlert = true;
            if (result.success) {
                this.$router.push({ name: 'view', params: {post_id: postId} })
            }
        },
    }
}
</script>

<style>
</style>
  