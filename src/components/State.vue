<template>
    <span class="State" :class="state.class" v-text="state.name" />
</template>

<script>
export default {
    props: {
        proposal: Object
    },
    computed: {
        state() {
            const {state} = this.proposal.msg.payload;
            return {name: state, class: state};
        }
    }
};
</script>
