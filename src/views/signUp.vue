<template>
    <div class="row">
        <div class="col-md-8 col-10 mx-auto mt-5">
            <div class="row">    
                <router-link class="btn border-0 p-0 fw-bold fs-1 mb-5" to="/">Vue.Board</router-link>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-4 ms-auto me-auto">
                    <div class="mb-3 row">
                        <label for="userName" class="col-4 col-form-label">이름</label>
                        <div class="col-8">
                            <input type="text" v-model.trim="inputName" class="form-control" id="userName">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="loginId" class="col-4 col-form-label">아이디</label>
                        <div class="col-8">
                            <input type="text" v-model.trim="inputId" class="form-control" id="loginId">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="loginPwd" class="col-4 col-form-label">비밀번호</label>
                        <div class="col-8">
                            <input type="password" v-model.trim="inputPwd" class="form-control" id="loginPwd">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="checkPwd" class="col-4 col-form-label">확인</label>
                        <div class="col-8">
                            <input type="password" v-model.trim="checkPwd" class="form-control" id="checkPwd">
                        </div>
                    </div>
                    <div class="row mt-5">
                        <div class="col-6 ms-auto">
                            <div class="d-grid">
                                <router-link :to="{ name: 'sign-in', query: { redirect: $route.query.redirect }}" class="btn btn-outline-dark" @click="onClickAddUser()" >회원가입</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <modal-alert v-if="closeAlert" :alertMessage="alertMessage" @on-close="closeAlert=false"></modal-alert>
</template>

<script>
import modalAlert from '@/components/modalAlert.vue'

export default {
    components: {
        modalAlert
    },
    data() {
        return{
            inputName: "",
            inputId: "",
            inputPwd: "",
            checkPwd: "",
            closeAlert:false,
            alertMessage: '',
            address: 'http://59.3.14.15:8005'
        }
    },
    methods: {
        async onClickAddUser() {
            if (this.inputPwd !== this.checkPwd){
                this.alertMessage = "비밀번호가 다릅니다.";
                this.closeAlert = true;
            }
            await fetch(`${this.address}/users`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    "user_name": this.inputName,
                    "login_id": this.inputId,
                    "login_pwd": this.inputPwd
                })
            })
        },
    }
}
</script>