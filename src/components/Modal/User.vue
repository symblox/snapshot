<template>
  <UiModal :open="open" @close="$emit('close')">
    <div class="m-4 mb-0 text-center">
      <Avatar :address="address" size="64" class="mb-4" />
      <h3 v-text="_shorten(addressVlx)" />
    </div>
    <div class="m-4">
      <a
        :href="_explorer(space.network, addressVlx)"
        target="_blank"
        class="mb-2 d-block"
      >
        <UiButton class="button-outline width-full">
          See on explorer
          <Icon name="external-link" class="ml-1" />
        </UiButton>
      </a>
    </div>
  </UiModal>
</template>

<script>
import {mapActions} from 'vuex';
export default {
  data() {
      return {
          addressVlx: ''
      };
  },
  props: ['open', 'address', 'space'],
  async mounted() {
      this.addressVlx = await this.ethToVlx(this.address);
  },
  methods: {
        ...mapActions(['ethToVlx'])     
  }
};
</script>
