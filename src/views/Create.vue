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
            <!-- <textarea-autosize
              v-model="form.body"
              maxlength="10240"
              class="input pt-1 mb-6"
              placeholder="What is your proposal?"
            />
            <div v-if="form.body">
              <h4 class="mb-4">Preview</h4>
              <UiMarkdown :body="form.body" />
            </div> -->
          </div>
        </div>
        <Block :title="$t('page.targets')">
          <div v-if="targets.length > 0" class="overflow-hidden mb-2">
            <draggable v-model="targets">
              <transition-group name="list">
                <div
                  v-for="(target, i) in targets"
                  :key="target.key"
                  class="d-flex mb-2"
                >
                  <UiButton class="d-flex width-full">
                    <span class="mr-4">{{ i + 1 }}</span>
                    <input
                      v-model="targets[i].text"
                      class="input height-full flex-auto text-center"
                    />
                    <span @click="removeTarget(i)" class="ml-4">
                      <Icon name="close" size="12" />
                    </span>
                  </UiButton>
                </div>
              </transition-group>
            </draggable>
          </div>
          <UiButton @click="addTarget(1)" class="d-block width-full">
            {{$t('page.addTarget')}}
          </UiButton>
        </Block>
        <Block :title="$t('page.values')">
          <div v-if="values.length > 0" class="overflow-hidden mb-2">
            <draggable v-model="values">
              <transition-group name="list">
                <div
                  v-for="(value, i) in values"
                  :key="value.key"
                  class="d-flex mb-2"
                >
                  <UiButton class="d-flex width-full">
                    <span class="mr-4">{{ i + 1 }}</span>
                    <input
                      v-model="values[i].text"
                      class="input height-full flex-auto text-center"
                    />
                    <span @click="removeValue(i)" class="ml-4">
                      <Icon name="close" size="12" />
                    </span>
                  </UiButton>
                </div>
              </transition-group>
            </draggable>
          </div>
          <UiButton @click="addValue(1)" class="d-block width-full">
            {{$t('page.addValue')}}
          </UiButton>
        </Block>
        <Block :title="$t('page.signatures')">
          <div v-if="signatures.length > 0" class="overflow-hidden mb-2">
            <draggable v-model="signatures">
              <transition-group name="list">
                <div
                  v-for="(signature, i) in signatures"
                  :key="signature.key"
                  class="d-flex mb-2"
                >
                  <UiButton class="d-flex width-full">
                    <span class="mr-4">{{ i + 1 }}</span>
                    <input
                      v-model="signatures[i].text"
                      class="input height-full flex-auto text-center"
                    />
                    <span @click="removeSignature(i)" class="ml-4">
                      <Icon name="close" size="12" />
                    </span>
                  </UiButton>
                </div>
              </transition-group>
            </draggable>
          </div>
          <UiButton @click="addSignature(1)" class="d-block width-full">
            {{$t('page.addSignature')}}
          </UiButton>
        </Block>
        <Block :title="$t('page.calldatas')">
          <div v-if="calldatas.length > 0" class="overflow-hidden mb-2">
            <draggable v-model="calldatas">
              <transition-group name="list">
                <div
                  v-for="(calldata, i) in calldatas"
                  :key="calldata.key"
                  class="d-flex mb-2"
                >
                  <UiButton class="d-flex width-full">
                    <span class="mr-4">{{ i + 1 }}</span>
                    <input
                      v-model="calldatas[i].text"
                      class="input height-full flex-auto text-center"
                    />
                    <span @click="removeCalldata(i)" class="ml-4">
                      <Icon name="close" size="12" />
                    </span>
                  </UiButton>
                </div>
              </transition-group>
            </draggable>
          </div>
          <UiButton @click="addCalldata(1)" class="d-block width-full">
            {{$t('page.addCalldata')}}
          </UiButton>
        </Block>
      </div>
      <div class="col-12 col-lg-4 float-left">
        <Block
          :title="$t('page.action')"
          :icon="space.network === '4' ? 'stars' : undefined"
          @submit="modalPluginsOpen = true"
        >
          <!-- <div class="mb-2">
            <UiButton
              @click="[(modalOpen = true), (selectedDate = 'start')]"
              class="width-full mb-2"
            >
              <span v-if="!form.start">Select start date</span>
              <span v-else v-text="$d(form.start * 1e3, 'short')" />
            </UiButton>
            <UiButton
              @click="[(modalOpen = true), (selectedDate = 'end')]"
              class="width-full mb-2"
            >
              <span v-if="!form.end">Select end date</span>
              <span v-else v-text="$d(form.end * 1e3, 'short')" />
            </UiButton>
            <UiButton class="width-full mb-2">
              <input
                v-model="form.snapshot"
                type="number"
                class="input width-full text-center"
                placeholder="Snapshot block number"
              />
            </UiButton>
          </div> -->
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
import draggable from 'vuedraggable';
import { getBlockNumber } from '@/helpers/web3';
import getProvider from '@/helpers/provider';

export default {
  components: {
    draggable
  },
  data() {
    return {
      name: "",
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
        // body: '',
        args: [],
        // start: '',
        // end: '',
        // snapshot: '',
        // metadata: {}
      },
      modalOpen: false,
      modalPluginsOpen: false,
      selectedDate: '',
      counter: 0
    };
  },
  computed: {
    space() {
      return this.app.spaces[this.web3.network.chainId];
    },
    isValid() {
      // const ts = (Date.now() / 1e3).toFixed();
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
    this.addTarget(1);
    this.addValue(1);
    this.addSignature(1);
    this.addCalldata(1);
    this.blockNumber = await getBlockNumber(getProvider(this.space.network));
    await this.loadData();
  
    //console.log(this.params)
    // this.form.snapshot = this.blockNumber;
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
          this.space = this.app.spaces[val];
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
    addTarget(num) {
      if(this.targets.length+num>parseFloat(this.params.proposalMaxOperations||10)){
        this.$store.dispatch('notify', ['red', `proposal max operations is ${this.params.proposalMaxOperations}`]);
        return;
      }
       
      for (let i = 1; i <= num; i++) {
        this.counter++;
        this.targets.push({ key: this.counter, text: '' });
      }
    },
    removeTarget(i) {
      this.targets.splice(i, 1);
    },
    addValue(num) {
      if(this.values.length+num>parseFloat(this.params.proposalMaxOperations||10)){
        this.$store.dispatch('notify', ['red', `proposal max operations is ${this.params.proposalMaxOperations}`]);
        return;
      }
      for (let i = 1; i <= num; i++) {
        this.counter++;
        this.values.push({ key: this.counter, text: '' });
      }
    },
    removeValue(i) {
      this.values.splice(i, 1);
    },
    addSignature(num) {
      if(this.signatures.length+num>parseFloat(this.params.proposalMaxOperations||10)){
        this.$store.dispatch('notify', ['red', `proposal max operations is ${this.params.proposalMaxOperations}`]);
        return;
      }
      for (let i = 1; i <= num; i++) {
        this.counter++;
        this.signatures.push({ key: this.counter, text: '' });
      }
    },
    removeSignature(i) {
      this.signatures.splice(i, 1);
    },
    addCalldata(num) {
      if(this.calldatas.length+num>parseFloat(this.params.proposalMaxOperations||10)){
        this.$store.dispatch('notify', ['red', `proposal max operations is ${this.params.proposalMaxOperations}`]);
        return;
      }
      for (let i = 1; i <= num; i++) {
        this.counter++;
        this.calldatas.push({ key: this.counter, text: '' });
      }
    },
    removeCalldata(i) {
      this.calldatas.splice(i, 1);
    },
    // setDate(ts) {
    //   if (this.selectedDate) {
    //     this.form[this.selectedDate] = ts;
    //   }
    // },
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
      const targets = this.targets.map(target => target.text);
      const values = this.values.map(value => value.text);
      const signatures = this.signatures.map(signature => signature.text);
      const calldatas = this.calldatas.map(calldata => calldata.text);
      this.form.contractAddress = this.space.governor;
      this.form.args = [targets,values,signatures,calldatas,this.name];
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
              name: this.name
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
