<template>
    <UiModal :open="open" v-if="open" @close="$emit('close')" class="d-flex">
        <form @submit.prevent="handleSubmit" class="d-flex flex-column flex-auto">
            <h3 class="m-4 mb-0 text-center">{{ $t('page.confirmProposal') }}</h3>
            <div class="m-4 p-4 border rounded-2 text-white" style="overflow:scroll">
                <div class="d-flex">networkId: {{ networkId }}</div>
                <div class="d-flex">{{ form.contractType }}: {{ form.contractAddress }}</div>
                <div>
                    {{ $t('page.proposalParamsInput') }}: {{ JSON.stringify(proposalParams) }}
                </div>
                {{ $t('page.proposalParamsSend') }}:
                <div class="d-flex" v-for="(data, i) in form.args" :key="i">
                    {{ JSON.stringify(data) }}
                </div>
            </div>
            <div class="p-4 overflow-hidden text-center border-top">
                <div class="col-6 float-left pr-2">
                    <UiButton @click="$emit('close')" type="button" class="width-full">
                        {{ $t('page.cancel') }}
                    </UiButton>
                </div>
                <div class="col-6 float-left pl-2">
                    <UiButton type="submit" class="width-full button--submit" :loading="loading">
                        {{ $t('page.confirm') }}
                    </UiButton>
                </div>
            </div>
        </form>
    </UiModal>
</template>

<script>
import {mapActions} from 'vuex';
import {lsGet, lsSet} from '@/helpers/utils';

export default {
    props: ['open', 'form', 'proposalParams', 'networkId'],
    data() {
        return {
            loading: false
        };
    },
    methods: {
        ...mapActions(['send', 'getLatestProposalIds']),
        lsGet,
        lsSet,
        async handleSubmit() {
            this.loading = true;
            try {
                const result = await this.send({
                    type: 'proposal',
                    payload: {
                        contractType: this.form.contractType,
                        contractAddress: this.form.contractAddress,
                        action: this.form.action,
                        args: this.form.args
                    }
                });

                if (result) {
                    const id = await this.getLatestProposalIds(this.form.space);
                    this.lsSet(this.form.space.network + id, this.form.proposalName);
                    this.$router.push({
                        name: 'proposal',
                        params: {
                            key: this.form.key,
                            id
                        }
                    });
                }
            } catch (e) {
                console.error(e);
                this.loading = false;
            }
            this.loading = false;
            this.$emit('close');
        }
    }
};
</script>
