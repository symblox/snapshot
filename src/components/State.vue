<template>
    <span class="State" :class="state.class" v-text="state.name" />
</template>

<script>
export default {
    props: {
        proposal: Object
    },
    data() {
        return {};
    },
    computed: {
        state() {
            const stateText = {
                All: this.$t('page.all'),
                Pending: this.$t('page.pending'),
                Active: this.$t('page.active'),
                Canceled: this.$t('page.canceled'),
                Defeated: this.$t('page.defeated'),
                Succeeded: this.$t('page.succeeded'),
                Queued: this.$t('page.queued'),
                Expired: this.$t('page.expired'),
                Executed: this.$t('page.executed')
            };
            if(!this.proposal.msg || !this.proposal.msg.payload){
                return {name: stateText['All'], class: 'All'};
            }
            const {state} = this.proposal.msg.payload;
            
            return {name: stateText[state], class: state};
        }
    }
};
</script>
