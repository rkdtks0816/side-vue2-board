<template>  
    <div class="modal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">알림</h1>
                    <button type="button" class="btn-close" @click="$emit('on-close')"></button>
                </div>
                <div class="modal-body">
                    {{ confirm-message }}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark" @click="$emit('on-close')">취소</button>
                    <button type="button" class="btn btn-dark" @click="$emit('on-confirm')">확인</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'modal-confirm',
        props: [
            'confirm-message'
        ]
    }
</script>
<style>
    .modal {
        display: block;
        background-color: rgba(var(--bs-dark-rgb), 0.5);
    }
</style>