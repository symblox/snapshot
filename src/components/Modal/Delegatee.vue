<template>
  <UiModal :open="open" @close="$emit('close')">
    <div class="m-4 mb-0 text-center">
      <Avatar :address="address" size="64" class="mb-4" />
      <h3 v-if="address!=='0x0000000000000000000000000000000000000000'" v-text="_shorten(address)" />
      <h3 v-else v-text="'Set delegatee'" />
    </div>
    <div class="m-4">
        <input
            v-autofocus
            v-model="delegateAddress"
            maxlength="128"
            class="h1 mb-2 input"
            placeholder="Address"
            style="width: 100%"
        />
    </div>
    <div class="m-4">
        <UiButton class="button--submit width-full" @click="delegate">
            Delegate
        </UiButton>
    </div>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return { 
            delegateAddress: ''
        };
    },
    props: ['open', 'address', 'space'],
    methods: {
        ...mapActions(['send']),
        async delegate() {
            try {
                await this.send({
                    type: 'delegate',
                    payload: {
                        contractType: 'SYX',
                        contractAddress: this.space.token,
                        action: 'delegate',
                        args: [this.delegateAddress]
                    }
                });

                this.loading = false;
            } catch (e) {
                console.error(e);
                this.loading = false;
            }
        }
    }
};
</script>