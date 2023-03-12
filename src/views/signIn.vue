<template>
    <div class="row">
        <div class="col-md-8 col-10 mx-auto mt-5">
            <div class="row">    
                <router-link class="btn border-0 p-0 fw-bold fs-1 mb-5" to="/">Vue.Board</router-link>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-4 ms-auto me-auto">
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
                    <div class="row mt-5">
                        <div class="col-6 pe-1">
                            <div class="d-grid">
                                <router-link :to="{ name: 'sign-up', query: { redirect: $route.query.redirect }}" class="btn btn-outline-dark">회원가입</router-link>
                            </div>
                        </div>
                        <div class="col-6 ps-1">
                            <div class="d-grid">
                                <div class="btn btn-outline-dark" @click="onClickLogin();">로그인</div>
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
import modalAlert from '@/components/modalAlert.vue';

export default {
    components: {
        modalAlert
    },
    data() {
        return{
            inputId: "",
            inputPwd: "",
            closeAlert: false,
            alertMessage: ''
        }
    },
    methods: {
        async onClickLogin() {
            let response = await fetch(`http://localhost:3000/users?login_id=${this.inputId}&login_pwd=${this.inputPwd}`)
            let result = await response.json();
            if (!result.success) {
                this.alertMessage = result.message;
                this.closeAlert = true;
            }

            const profile = {};
            profile.user_id = result.result.user_id;
            profile.user_name = result.result.user_name;

            const token = result.result.token;
            const tokenExp = result.result.token_exp;
            
            this.$cookies.set('token', token, new Date(tokenExp));
            this.$store.commit('setUserProfile', profile);

            let redirect = this.$route.query.redirect;
            this.$router.replace(redirect);
        },
    }
}
</script>