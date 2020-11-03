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
    <div v-else-if="step === 'delegate'">
      <div class="m-4 mb-0 text-center">
        <Avatar :address="delegatee" size="64" class="mb-4" />
        <h3 v-if="delegatee!=='0x0000000000000000000000000000000000000000'" v-text="_shorten(delegateeVlx)" />
        <h3 v-else v-text="$t('page.setDelegatee')" />
      </div>
      <div class="m-4">
          <input
              v-autofocus
              v-model="delegateAddress"
              maxlength="128"
              class="h1 mb-2 input"
              :placeholder="$t('page.address')"
              style="width: 100%"
          />
      </div>
      <div class="m-4">
          <UiButton class="button--submit width-full" @click="delegate">
              {{$t('page.delegate')}}
          </UiButton>
      </div>
    </div>
    <div v-else>
      <h3 class="m-4 mb-0 text-center">{{$t('page.account')}}</h3>
      <div v-if="$auth.isAuthenticated" class="m-4">
        <span v-text="$t('page.account')" class="pt-2" style="flex: 1;margin-right: 10px;"></span>
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
        <span v-text="$t('page.delegatee')" class="pt-2" style="flex: 1;margin-right: 10px;"></span>
        <UiButton @click="step = 'delegate'" class="button-outline width-full mb-2">
            <Avatar
                v-if="delegatee && delegatee !== '0x0000000000000000000000000000000000000000'"
                :address="delegatee"
                size="16"
                class="mr-0 mr-sm-2 mr-md-2 mr-lg-2 mr-xl-2 ml-n1"
            />
            <span v-if="delegatee && delegatee !== '0x0000000000000000000000000000000000000000'" v-text="_shorten(delegateeVlx)" />
            <span v-else v-text="$t('page.setDelegatee')" />
        </UiButton>
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
      addressVlx: '',
      delegatee: '',
      delegateeVlx: '',
      delegateAddress: ''
    };
  },
  computed: {
    space() {
      const space = this.app.spaces[this.web3.network.chainId];
      return space || {};
    }
  },
  watch: {
    open() {
      this.step = null;
    },
    'web3.account': async function(val, prev) {
      if (val && val.toLowerCase() !== prev){
        this.addressVlx = await this.ethToVlx(this.web3.account);
        await this.loadDelegatee();
      }
    },
    'web3.network.chainId': async function(val, prev) {
      if (val.toString() !== prev.toString()){   
        await this.loadDelegatee();
      }
    },
  },
  async mounted() {
      this.addressVlx = await this.ethToVlx(this.web3.account);
      await this.loadDelegatee();
  },
  methods: {
    ...mapActions(['logout','send','getDelegatee','ethToVlx','vlxToEth']),
    async handleLogout() {
      await this.logout();
      this.$emit('close');
    },
    async loadDelegatee() {
      this.delegatee = await this.getDelegatee(this.space);
      this.delegateeVlx = await this.ethToVlx(this.delegatee);
    },
    async delegate() {
      try {
        const addressEth = await this.vlxToEth(this.delegateAddress);
        await this.send({
          type: 'delegate',
          payload: {
            contractType: 'SYX',
            contractAddress: this.space.token,
            action: 'delegate',
            args: [addressEth]
          }
        });
        await this.loadDelegatee();
        this.$emit('close');
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>
