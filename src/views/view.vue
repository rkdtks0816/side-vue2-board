<template>
    <div class="row">
        <div class="col-md-8 col-10 mx-auto mt-5"> 
            <div class="row">    
                <router-link class="btn border-0 p-0 fw-bold fs-1 mb-5 text-start" to="/">Vue.Board</router-link>
            </div>
            <div class="border-bottom">
                <div class="row">
                    <div class="col fs-3 pb-2">{{ post.title }}</div>
                </div>
                <div class="row">
                    <div class="col fs-6 pb-2">{{ post.user_name }} | {{ post.created_at }}</div>
                    <div class="col fs-6 pb-2 fw-light text-end"></div>
                </div>
            </div>
            <div class="mt-3">
                <div class="row">
                    <div class="col fs-4">{{ post.content }}</div>
                </div>
            </div>
            <div class="mt-3" v-if="post.post_id">
                <div class="row">
                    <img :src="`http://localhost:3000/img/${post.post_id}/1.png`" />
                </div>
            </div>
            <div class="mt-5">
                <div class="row">
                    <div class="col">
                        <textarea class="border w-100 h-100" rows="2" v-model="inputComment"></textarea>
                    </div>
                    <div class="col-3 col-md-2 col-xl-1 btn btn-light border pt-3" id="addCommentBt" @click="onClickAddComment()">등록</div>
                </div>
            </div>
            <div class="mt-2 pb-2 border-bottom" v-for="comment in comments" :key="comment.comment_id">
                <div class="row">
                    <div class="col fs-6 fw-bold mb-2"> {{ comment.user_name }} </div>
                </div>
                <div class="row">
                    <div class="col fs-5 mb-2"> {{ comment.content }} </div>
                </div>
                <div class="row">
                    <div class="col fs-6 fw-light"> {{ comment.created_at }} </div>
                    <div class="col-3 col-md-2 col-xl-1 p-0 btn btn-outline-dark" v-if="!checkOwnUser(comment.user_id)" @click="onClickDeleteComment(comment.comment_id, comment.post_id, comment.user_id)">삭제</div>
                </div>
            </div>
            <div class="row">
                <div class="text-end p-0">
                    <template v-if="!checkOwnUser(post.user_id)">
                        <div class="col-3 col-md-2 col-xl-1 btn btn-outline-dark mt-5 ms-auto" @click="onClickDeletePost()">삭제</div>
                        <div class="col-3 col-md-2 col-xl-1 btn btn-outline-dark mt-5 ms-3" @click="onClickEditPost()">수정</div>
                    </template>
                    <router-link to="/" class="col-3 col-md-2 col-xl-1 btn btn-outline-dark mt-5 ms-3">목록</router-link>
                </div>
            </div>
        </div>
        <modal-confirm v-if="confirmMessage" :confirm-message="confirmMessage" @on-close="confirmMessage=null" @on-confirm="onClickModalLogin()"></modal-confirm>
        <modal-alert v-if="alertMessage" :alert-message="alertMessage" @on-close="alertMessage=null"></modal-alert>
    </div>
</template>
  
<script>
import modalConfirm from '@/components/modalConfirm.vue';
import modalAlert from '@/components/modalAlert.vue';

export default {
    name: 'view-cp',
    components: {
        modalConfirm,
        modalAlert
    },
    data() {
        return{
            postId: 0,
            post: {},
            comments: [],
            inputComment: '',
            modalType: '',
            confirmMessage: null,
            alertMessage: null,
            imgSrc: ''
        }
    },
    mounted() {
        this.loadPost();  
        this.loadComments();  
    },
    methods: {
        async loadPost() {
            this.postId = this.$route.params.post_id;
            let response = await fetch(`http://localhost:3000/posts/post?post_id=${this.postId}`);
            let result = await response.json();
            if (!result.success) {
                this.alertMessage = result.message;
                return;
            }
            this.post = result.post;
        },
        onClickEditPost() {                
            const OwnUser = this.checkOwnUser(this.post.user_id);
            if (OwnUser === 'guest') {
                this.confirmMessage = "로그인 후 이용하실 수 있습니다."
                return;
            } else if (OwnUser === 'menber') {
                this.alertMessage = "수정할 권한이 없습니다."
                return;
            }
            this.$router.push({name: 'edit', params: {post_id: this.post.post_id}})
        },
        async onClickDeletePost() {
            const postId = this.post.post_id;
            const userId = this.post.user_id;               
            const OwnUser = this.checkOwnUser(userId);
            if (OwnUser === 'guest') {
                this.confirmMessage = "로그인 후 이용하실 수 있습니다."
                return;
            } else if (OwnUser === 'menber') {
                this.alertMessage = "삭제할 권한이 없습니다."
                return;
            }
            const existsToken = this.$cookies.get('token');             
            
            let response = await fetch(`http://localhost:3000/posts?post_id=${postId}&user_id=${userId}`, {
                method: 'DELETE',
                headers: {'authorization': existsToken}
            })

            let result = await response.json();
            this.alertMessage = result.message;
            if (result.success) {
                this.$router.push('/');
            }
        },
        async loadComments() {
            this.comments = [];
            let response = await fetch(`http://localhost:3000/comments?post_id=${this.postId}`)
            let rows = await response.json();
            this.comments = rows.comments;
        },
        async onClickAddComment() {
            const existsToken = this.$cookies.get('token');
            if (!existsToken) {
                this.confirmMessage = "로그인 후 이용하실 수 있습니다."
                return;
            }

            if (this.inputComment === ''){
                this.alertMessage = '댓글을 입력해 주세요.';
                return;
            }

            await fetch('http://localhost:3000/comments',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'authorization': existsToken
                },
                body: JSON.stringify({
                    "content": this.inputComment,
                    "post_id": this.postId,
                    "user_id": this.userProfile.user_id
                })
            })
            
            this.inputComment = '';
            this.alertMessage = '등록 되었습니다.';
            this.loadComments();  
        },
        async onClickDeleteComment(commentId, postId, userId) {
            const existsToken = this.$cookies.get('token');
            const OwnUser = this.checkOwnUser(userId);
            if (OwnUser === 'guest') {
                this.confirmMessage = "로그인 후 이용하실 수 있습니다."
                return;
            } else if (OwnUser === 'menber') {
                this.alertMessage = "삭제할 권한이 없습니다."
                return;
            }
            
            let response = await fetch(`http://localhost:3000/comments?comment_id=${commentId}&post_id=${postId}&user_id=${userId}`, {
                method: 'DELETE',
                headers: {'authorization': existsToken}
            })

            let result = await response.json();
            this.alertMessage = result.message;
            this.loadComments();
        },
        checkOwnUser(userId) {
            if (!this.userProfile){
                return 'guest';
            }else if(this.userProfile.user_id !== userId){
                return 'member';
            }else{
                return null;
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
}
</script>

<style>
</style>
  