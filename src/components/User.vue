<template>
  <span>
    <a @click="modalOpen = true" class="no-wrap">
      <Avatar :address="address" size="16" class="mr-1" />
      {{ name }}
      <Badges :address="address" :space="space" />
    </a>
    <ModalUser
      :open="modalOpen"
      @close="modalOpen = false"
      :space="space"
      :address="address"
    />
  </span>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['address', 'space'],
  data() {
    return {
      modalOpen: false,
      vlxAddress: ''
    };
  },
  async mounted() {
      this.vlxAddress = await this.ethToVlx(this.address);
  },
  computed: {
    name() {
      return this.web3.account &&
        this.address.toLowerCase() === this.web3.account.toLowerCase()
        ? 'You'
        : this._shorten(this.vlxAddress);
    }
  },
  methods: {
    ...mapActions(['ethToVlx'])
  }
};
</script>
