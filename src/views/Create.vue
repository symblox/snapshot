<template>
  <Container :slim="true">
    <div class="px-4 px-md-0 mb-3">
      <router-link
        :to="{ name: domain ? 'home' : 'proposals' }"
        class="text-gray"
      >
        <Icon name="back" size="22" class="v-align-middle" />
        {{ space.name }}
      </router-link>
    </div>
    <div>
      <div class="col-12 col-lg-8 float-left pr-0 pr-lg-5">
        <div class="px-4 px-md-0">
          <div class="d-flex flex-column mb-6">
            <input
              v-autofocus
              v-model="name"
              maxlength="128"
              class="h1 mb-2 input"
              :placeholder="$t('page.createTitle')"
            />
            <textarea-autosize
              v-model="body"
              maxlength="10240"
              class="input pt-1 mb-6"
              :placeholder="$t('page.body')"
            />
            <div v-if="body">
              <h4 class="mb-4">Preview</h4>
              <UiMarkdown :body="body" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4 float-left">
        <Block
          :title="$t('page.action')"
          :icon="space.network === '4' ? 'stars' : undefined"
          @submit="modalPluginsOpen = true"
        >
          <UiButton class="d-flex width-full mb-2" v-for="(data, i) in targets" :key="i">
            <span class="mr-4">{{ i + 1 }}</span>
            {{signatures[i]}}
            <span @click="removeTarget(i)" class="ml-4">
              <Icon name="close" size="12" />
            </span>
          </UiButton>

          <UiButton
            @click="modalOpen = true"
            class="button--submit width-full mb-2"
          >
            {{$t('page.addAction')}}
          </UiButton>
          <UiButton
            @click="handleSubmit"
            :disabled="!isValid"
            :loading="loading"
            class="d-block width-full button--submit"
          >
            {{$t('page.publish')}}
          </UiButton>
        </Block>
      </div>
    </div>
    <ModalProposal
      :targets="targets"
      :values="values"
      :signatures="signatures"
      :calldatas="calldatas"
      :open="modalOpen"
      :networkId="web3.network.chainId"
      @close="modalOpen = false"
    />
    <!-- <ModalSelectDate
      :value="form[selectedDate]"
      :selectedDate="selectedDate"
      :open="modalOpen"
      @close="modalOpen = false"
      @input="setDate"
    /> -->
    <!-- <ModalPlugins
      :proposal="{ ...form, choices }"
      :value="form.metadata.plugins"
      v-model="form.metadata.plugins"
      :open="modalPluginsOpen"
      @close="modalPluginsOpen = false"
    /> -->
  </Container>
</template>

<script>
import { mapActions } from 'vuex';
// import draggable from 'vuedraggable';
import { getBlockNumber } from '@/helpers/web3';
import getProvider from '@/helpers/provider';

export default {
  // components: {
  //   draggable
  // },
  data() {
    return {
      name: "",
      body: "",
      key: this.$route.params.key,
      loading: false,
      targets: [],
      values: [],
      signatures: [],
      calldatas: [],
      blockNumber: -1,
      params: {},
      scores: 0,
      delegatee: '',
      latestProposalState: '',
      form: {
        contractType: 'Governor',
        contractAddress: '',
        action: 'propose',
        args: [],
      },
      modalOpen: false,
      modalPluginsOpen: false,
      selectedDate: '',
      counter: 0
    };
  },
  computed: {
    space() {
      const space = this.app.spaces[this.web3.network.chainId];
      return space || {};
    },
    isValid() {
      return (
        !this.loading &&
        this.web3.account &&
        this.name &&
        this.targets.length > 0 &&
        this.targets.length === this.values.length &&
        this.targets.length === this.signatures.length &&
        this.targets.length === this.calldatas.length
      );
    }
  },
  async mounted() {
    this.blockNumber = await getBlockNumber(getProvider(this.space.network));
    await this.loadData();
  },
  watch: {
      'web3.account': async function(val, prev) {
        if (val && val.toLowerCase() !== prev){
          this.loading = true;
          await this.loadData();
          this.loading = false;
        }
      },
      'web3.network.chainId': async function(val, prev) {
        if (val.toString() !== prev.toString()){
          this.loading = true;
          await this.loadData();
          this.loading = false;
        }
      },
  },
  methods: {
    ...mapActions(['send','getLatestProposalIds','getGovernorParams','getPower','getDelegatee','getProposalState']),
    async loadData() {
      this.params = await this.getGovernorParams(this.space);
      this.delegatee = await this.getDelegatee(this.space);
      const {scores} = await this.getPower({
          space: this.space,
          address: this.web3.account,
          blockNumber: null
      });
      this.scores = scores || [];
      const id = await this.getLatestProposalIds(this.space);
      this.latestProposalState = await this.getProposalState({
          space: this.space,
          id
      });
    },
    removeTarget(i) {
      this.targets.splice(i, 1);
      this.values.splice(i, 1);
      this.signatures.splice(i, 1);
      this.calldatas.splice(i, 1);
    },

    async handleSubmit() {
      if(!this.params || !this.params.proposalThreshold || !this.scores){
        this.$store.dispatch('notify', ['red', `not contract data`]);
        return;
      }

      if(this.latestProposalState === "Pending" || this.latestProposalState === "Active"){
        this.$store.dispatch('notify', ['red', `already has a active or pending proposal`]);
        return;
      }

      if(parseFloat(this.scores[0])<parseFloat(this.params.proposalThreshold)){
        this.$store.dispatch('notify', ['red', `proposer votes below proposal threshold, min is ${parseFloat(this.params.proposalThreshold).toFixed(2)} SYX`]);
        return;
      }

      if(this.delegatee !== this.web3.account){
        this.$store.dispatch('notify', ['red', `delegatee is not you self`]);
        return;
      }

      this.loading = true;
      this.form.contractAddress = this.space.governor;
      let proposalName = this.name;
      if(this.body)proposalName += (";" + this.body);
      this.form.args = [this.targets,this.values,this.signatures,this.calldatas,proposalName];
      try {
        const result = await this.send({
          type: 'proposal',
          payload: this.form
        });

        if(result){
          const id = await this.getLatestProposalIds(this.space);
          this.$router.push({
            name: 'proposal',
            params: {
              key: this.key,
              id
            },
            query: {
              name: proposalName
            }
          });
        }else{
          // this.$store.dispatch('notify', ['red', `already has a active or pending proposal`]);  
          this.loading = false;
        }
      } catch (e) {
        console.error(e);
        this.loading = false;
      }
    }
  }
};
</script>

<style>
.list-leave-active,
.list-enter-active {
  transition: all 0.3s;
}
.list-move {
  transition: transform 0.3s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
}
</style>
