<template>
  <UiModal :open="open" @close="$emit('close')">
    <div v-if="!web3.account || step === 'connect'">
      <h3 class="m-4 mb-0 text-center">{{$t('page.connectWallet')}}</h3>
      <div class="m-4 mb-5">
        <a
          v-for="(connector, id, i) in config.connectors"
          :key="i"
          @click="$emit('login', connector.id)"
          target="_blank"
          class="mb-2 d-block"
        >
          <UiButton class="button-outline width-full v-align-middle">
            <img
              :src="
                `https://symblox.io/${connector.icon}.png`
              "
              height="28"
              width="28"
              class="mr-1 v-align-middle"
            />
            {{ connector.name }}
          </UiButton>
        </a>
      </div>
    </div>
    <div v-else>
      <h3 class="m-4 mb-0 text-center">{{$t('page.account')}}</h3>
      <div v-if="$auth.isAuthenticated" class="m-4">
        <a
          :href="_explorer(web3.network.chainId, addressVlx)"
          target="_blank"
          class="mb-2 d-block"
        >
          <UiButton class="button-outline width-full">
            <Avatar :address="web3.account" size="16" class="mr-2 ml-n1" />
            <span v-if="web3.name" v-text="web3.name" />
            <span v-else v-text="_shorten(addressVlx)" />
            <Icon name="external-link" class="ml-1" />
          </UiButton>
        </a>
        <UiButton
          @click="step = 'connect'"
          class="button-outline width-full mb-2"
        >
          {{$t('page.connectWallet')}}
        </UiButton>
        <UiButton
          @click="handleLogout"
          class="button-outline width-full text-red mb-2"
        >
          {{$t('page.logOut')}}
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['open'],
  data() {
    return {
      step: null,
      addressVlx: ''
    };
  },
  watch: {
    open() {
      this.step = null;
    }
  },
  async mounted() {
      this.addressVlx = await this.ethToVlx(this.web3.account);
  },
  methods: {
    ...mapActions(['logout','ethToVlx']),
    async handleLogout() {
      await this.logout();
      this.$emit('close');
    }
  }
};
</script>
