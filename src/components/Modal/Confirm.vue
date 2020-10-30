<template>
  <UiModal :open="open" v-if="open" @close="$emit('close')" class="d-flex">
    <form @submit.prevent="handleSubmit" class="d-flex flex-column flex-auto">
      <h3 class="m-4 mb-0 text-center">{{$t('page.confirmVote')}}</h3>
      <h4 class="m-4 mb-0 text-center">
        {{$t('page.confirmVoteTip')}} "{{
          proposal.msg.payload.choices[selectedChoice - 1]
        }}"? {{$t('page.confirmVoteTip2')}}
      </h4>
      <div class="m-4 p-4 border rounded-2 text-white">
        <div class="d-flex">
          <span v-text="$t('page.option')" class="flex-auto text-gray mr-1" />
          {{ proposal.msg.payload.choices[selectedChoice - 1] }}
        </div>
        <!-- <div class="d-flex">
          <span v-text="'Snapshot'" class="flex-auto text-gray mr-1" />
          <a
            :href="
              _explorer(space.network, proposal.msg.payload.snapshot, 'block')
            "
            target="_blank"
            class="float-right"
          >
            {{ $n(proposal.msg.payload.snapshot) }}
            <Icon name="external-link" class="ml-1" />
          </a>
        </div> -->
        <div class="d-flex">
          <span v-text="$t('page.votingPower')" class="flex-auto text-gray mr-1" />
           <span>
            {{ _numeral(totalScore) }}
            SYX
           
          </span>
          <!-- <span v-for="(symbol, i) of symbols" :key="symbol">
            {{ _numeral(scores[i]) }}
          
            {{ symbol }}
            <span v-show="i !== symbols.length - 1" v-text="'+'" class="mr-1" />
          </span> -->
        </div>
      </div>
      <div class="p-4 overflow-hidden text-center border-top">
        <div class="col-6 float-left pr-2">
          <UiButton @click="$emit('close')" type="button" class="width-full">
            {{$t('page.cancel')}}
          </UiButton>
        </div>
        <div class="col-6 float-left pl-2">
          <UiButton
            :disabled="loading"
            :loading="loading"
            type="submit"
            class="width-full button--submit"
          >
            {{$t('page.vote')}}
          </UiButton>
        </div>
      </div>
    </form>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: [
    'open',
    'space',
    'proposal',
    'id',
    'selectedChoice',
    'delegatee',
    'totalScore',
    'scores'
  ],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    symbols() {
      return this.space.strategies.map(strategy => strategy.params.symbol);
    }
  },
  methods: {
    ...mapActions(['send']),
    async handleSubmit() {
      if(this.delegatee === "0x0000000000000000000000000000000000000000"){
        this.$store.dispatch('notify', ['red', this.$t('page.noDelegateeTip')]);
        return;
      }

      if(parseFloat(this.totalScore)<=0){
        this.$store.dispatch('notify', ['red', this.$t('page.votesZeroTip')]);
        return;
      }

      if(this.delegatee !== this.web3.account){
        this.$store.dispatch('notify', ['red', this.$t('page.delegateeNoSelfTip')]);
        return;
      }
      
      this.loading = true;
      await this.send({
        type: 'proposal',
        payload: {
          contractType: "Governor",
          contractAddress: this.space.governor,
          action: "castVote",
          args: [this.id, this.selectedChoice === 1?true:false]
        }
      });
      this.$emit('reload');
      this.$emit('close');
      this.loading = false;
    }
  }
};
</script>
