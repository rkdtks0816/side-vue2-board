<template>
    <div class="fixed-top w-100 h-100 d-flex align-items-center justify-content-center">
        <div>사용자 확인중....</div>
    </div>
</template>

<script>
export default {
    name: 'authenticate-page',
    data() {
        return {

        }
    },
    mounted() {
        this.checkCookie()
    },
    methods: {
        async checkCookie() {
            const existsToken = this.$cookies.get('token');
            let redirect = this.$route.query.redirect;            
            try{
                let response = await fetch(`http://localhost:3000/users/profile`, {headers: {'authorization': existsToken}});
                let result = await response.json();
                this.$store.commit('setUserProfile', result.profile);
                this.$router.push(redirect);
            }catch(e){                
                this.$router.push(redirect);
            }            
        }
    }
}

</script>