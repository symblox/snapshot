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
      const { state } = this.proposal.msg.payload;
      let className;
      if(state === "Closed"){
        className = 'bg-purple';
      }

      return { name: state, class: className};
    }
  }
};
</script>
