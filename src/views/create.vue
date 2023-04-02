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
                    <textarea class="form-control mb-3" rows="10" v-model="inputContent" placeholder="내용을 입력해 주세요."></textarea>
                </div>
                <div class="row">
                    <label class="form-label p-0">첨부파일</label>
                    <input class="border p-3" type="file" ref='uploadImageFile' @change="onFileSelected" accept="image/*">
                </div>
            </div>
            <div class="row">
                <div class="col-3 col-md-2 col-xl-1 btn btn-outline-dark mt-5 ms-auto" @click="onClickAddPost()">등록</div>
            </div>
        </div>
    </div>
    <modal-alert v-if="alertMessage" :alert-message="alertMessage" @on-close="alertMessage=null"></modal-alert>
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
            inputTitle: "",
            inputContent: "",
            alertMessage: null,
            uploadImageFile: '',
            address: 'http://59.3.14.15:8005'
        }
    },
    methods: {
        async onClickAddPost() {
            const existsToken = this.$cookies.get('token');
            const userProfile = this.$store.getters['getUserProfile']
            const userId = userProfile.user_id;
            const fd = new FormData();
            if (this.uploadImageFile) {
                fd.append('upLoadImage', this.uploadImageFile);
            }
            fd.append('body', JSON.stringify({
                    "title": this.inputTitle,
                    "content": this.inputContent,
                    "user_id": userId
            }));

            if (this.inputTitle === ''){
                this.alertMessage = "제목을 입력해 주세요.";
                return;
            } else if (this.inputContent === ''){
                this.alertMessage = "내용을 입력해 주세요.";
                return;
            }

            const response = await fetch(`${this.address}/posts`,{
                method: 'POST',
                headers: {
                    'authorization': existsToken
                },
                body: fd
            })
            const result = await response.json();
            this.$router.push({ name: 'view', params: {post_id: result.post_id} })
        },
        onFileSelected(){
            this.uploadImageFile = this.$refs.uploadImageFile.files[0]
        }
    }
}
</script>

<style>
</style>
  