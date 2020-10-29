<template>
  <UiModal :open="open" @close="$emit('close')">
    <div class="m-4 mb-0 text-center">
      <Avatar :address="address" size="64" class="mb-4" />
      <h3 v-if="address!=='0x0000000000000000000000000000000000000000'" v-text="_shorten(delegateeVlx)" />
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
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return { 
            delegateAddress: '',
            delegateeVlx: ''
        };
    },
    props: ['open', 'address', 'space'],
    async mounted() {
        this.delegateeVlx = await this.ethToVlx(this.address);
    },
    watch: {
        'address': async function(val, prev) {
            if (val && val.toLowerCase() !== prev){
                this.delegateeVlx = await this.ethToVlx(this.address);
            }
        }
    },
    methods: {
        ...mapActions(['send','ethToVlx','vlxToEth']),
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
                this.$emit('close');
                this.loading = false;
            } catch (e) {
                console.error(e);
                this.loading = false;
            }
        }
    }
};
</script>