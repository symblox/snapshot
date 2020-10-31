<template>
  <Block
    :title="ts >= payload.end ? $t('page.results') : $t('page.currentResults')"
  >
    <div v-for="(choice, i) in payload.choices" :key="i">
      <div class="text-white mb-1">
        <span v-text="_shorten(choice, 'choice')" class="mr-1" />
        <span class="mr-1 ">
          {{ _numeral(results.totalBalances[i]) }}
          {{ _shorten(space.symbol, 'symbol') }}
        </span>
        <span
          class="float-right"
          v-text="
            $n(
              !results.totalVotesBalances
                ? 0
                : ((100 / results.totalVotesBalances) *
                    results.totalBalances[i]) /
                    1e2,
              'percent'
            )
          "
        />
      </div>
      <UiProgress
        :value="results.totalScores[i]"
        :max="results.totalVotesBalances"
        :titles="titles"
        class="mb-3"
      />
    </div>
    <div v-if="ts >= payload.end">
      <UiButton
        v-if="payload.state === 'Succeeded'"
        @click="queue"
        class="d-block width-full button--submit"
      >
        {{ $t('page.queue') }}
      </UiButton>
      <div v-if="payload.state === 'Queued'" class="mb-1">
        <b>{{ $t('page.eta') }}</b>
        <span
          :aria-label="_ms(payload.eta)"
          v-text="$d(payload.eta * 1e3, 'short')"
          class="float-right text-white tooltipped tooltipped-n"
        />
      </div>
      <UiButton
        v-if="payload.state === 'Queued'"
        @click="execute"
        class="d-block width-full button--submit"
      >
        {{ $t('page.execute') }}
      </UiButton>
      <UiButton @click="downloadReport" class="width-full mt-2">
        {{ $t('page.downloadReport') }}
      </UiButton>
    </div>
  </Block>
</template>

<script>
import { mapActions } from 'vuex';
import * as jsonexport from 'jsonexport/dist';
import plugins from '@/helpers/plugins';
import { sendTransaction } from '@/helpers/web3';
import pkg from '@/../package.json';

export default {
  props: ['id', 'space', 'payload', 'results', 'votes'],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ts() {
      return (Date.now() / 1e3).toFixed();
    },
    titles() {
      return this.space.strategies.map(strategy => strategy.params.symbol);
    },
    winningChoice() {
      let winningChoice = 0;
      let winningScore = 0;
      this.results.totalScores.forEach((score, i) => {
        if (score[0] > winningScore) {
          winningChoice = i + 1;
          winningScore = score[0];
        }
      });
      return winningChoice;
    }
  },
  methods: {
    ...mapActions(['notify', 'send']),
    async queue() {
      try {
        const result = await this.send({
          type: 'queue',
          payload: {
            contractType: 'Governor',
            contractAddress: this.space.governor,
            action: 'queue',
            args: [this.id]
          }
        });
        this.loading = false;
      } catch (e) {
        console.error(e);
        this.loading = false;
      }
    },
    async execute() {
      try {
        const result = await this.send({
          type: 'queue',
          payload: {
            contractType: 'Governor',
            contractAddress: this.space.governor,
            action: 'execute',
            args: [this.id]
          }
        });
        this.loading = false;
      } catch (e) {
        console.error(e);
        this.loading = false;
      }
    },
    async downloadReport() {
      const obj = Object.entries(this.votes)
        .map(vote => {
          return {
            address: vote[1].address,
            choice: vote[1].msg.payload.choice === 1 ? true : false,
            balance: vote[1].balance
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp, 0);

      try {
        const csv = await jsonexport(obj);
        const link = document.createElement('a');
        link.setAttribute('href', `data:text/csv;charset=utf-8,${csv}`);
        link.setAttribute('download', `${pkg.name}-report-${this.id}.csv`);
        document.body.appendChild(link);
        link.click();
      } catch (e) {
        console.error(e);
      }
    }
    //     async submitOnChain() {
    //       if (!this.space.plugins || !this.space.plugins.aragon) return;
    //       this.loading = true;
    //       const aragon = new plugins.Aragon();
    //       const callsScript = aragon.execute(
    //         this.space.plugins.aragon,
    //         this.payload.metadata.plugins.aragon[`choice${this.winningChoice}`]
    //       );
    //       console.log(
    //         `Submit on-chain
    // Proposal #${this.id} on-chain
    // Option: ${this.winningChoice}
    // Callsscript: ${callsScript}`
    //       );
    //       try {
    //         const tx = await sendTransaction(this.$auth.web3, [
    //           'DisputableDelay',
    //           this.space.plugins.aragon.disputableDelayAddress,
    //           'delayExecution',
    //           [callsScript, this.id]
    //         ]);
    //         console.log(tx);
    //       } catch (e) {
    //         console.error(e);
    //       }
    //       this.notify(['green', `The settlement is on-chain, congrats!`]);
    //       this.loading = false;
    //     }
  }
};
</script>
