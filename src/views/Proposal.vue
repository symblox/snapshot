<template>
    <Container :slim="true">
        <div class="px-4 px-md-0 mb-3">
            <router-link :to="{name: domain ? 'home' : 'proposals'}" class="text-gray">
                <Icon name="back" size="22" class="v-align-middle" />
                {{ space.name }}
            </router-link>
        </div>
        <div>
            <div class="col-12 col-lg-8 float-left pr-0 pr-lg-5">
                <div class="px-4 px-md-0">
                    <template v-if="loaded">
                        <h1 class="mb-2">
                            {{ title }}
                            <span v-text="`#${id.slice(0, 7)}`" class="text-gray" />
                        </h1>
                        <State :proposal="proposal" class="mb-4" />
                        <div class="mb-2">
                            <p>{{ $t('page.transaction') }}</p>
                            <a
                                v-text="transactionHash"
                                :href="explorer + '/tx/' + transactionHash"
                                target="_blank"
                            />
                        </div>
                        <div class="mb-4">
                            <p>{{ $t('page.proposalParams') }}</p>
                            <div v-for="(action, i) in actions" :key="i" class="mb-1">
                                {{ i + 1 }}：
                                <a
                                    v-text="action.contractName"
                                    :href="explorer + '/address/' + action.contractAddress"
                                    target="_blank"
                                />
                                .
                                {{ action.funcName }}
                                <div>
                                    {{ $t(action.message, action.messageParams) }}
                                </div>
                            </div>
                        </div>
                        <hr />
                        <UiMarkdown :body="body" class="mb-6" />
                    </template>
                    <PageLoading v-else />
                </div>
                <Block
                    v-if="loaded && payload.state === 'Active' && !receipt.hasVoted"
                    class="mb-4"
                    :title="$t('page.voteTitle')"
                >
                    <div class="mb-3">
                        <UiButton
                            v-for="(choice, i) in payload.choices"
                            :key="i"
                            @click="selectedChoice = i + 1"
                            class="d-block width-full mb-2"
                            :class="selectedChoice === i + 1 && 'button--active'"
                        >
                            {{ choice }}
                            <a
                                v-if="_get(payload, `metadata.plugins.aragon.choice${i + 1}`)"
                                @click="modalOpen = true"
                                :aria-label="
                                    `Target address: ${
                                        payload.metadata.plugins.aragon[`choice${i + 1}`].actions[0]
                                            .targetAddress
                                    }\nCalldata: ${
                                        payload.metadata.plugins.aragon[`choice${i + 1}`].actions[0]
                                            .calldata
                                    }`
                                "
                                class="tooltipped tooltipped-n break-word"
                            >
                                <Icon name="warning" class="v-align-middle ml-1" />
                            </a>
                        </UiButton>
                    </div>
                    <UiButton
                        :disabled="voteLoading || !selectedChoice || !web3.account"
                        :loading="voteLoading"
                        @click="modalOpen = true"
                        class="d-block width-full button--submit"
                    >
                        {{ $t('page.vote') }}
                    </UiButton>
                </Block>
                <BlockVotes v-if="loaded" :space="space" :proposal="proposal" :votes="votes" />
            </div>
            <div v-if="loaded" class="col-12 col-lg-4 float-left">
                <Block :title="$t('page.information')">
                    <!-- <div class="mb-1 overflow-hidden">
            <b>Token(s)</b>
            <a
              @click="modalStrategiesOpen = true"
              class="float-right text-white"
            >
              <span v-for="(symbol, symbolIndex) of symbols" :key="symbol">
                <Token :space="space.key" :symbolIndex="symbolIndex" />
                {{ symbol }}
                <span
                  v-show="symbolIndex !== symbols.length - 1"
                  v-text="'+'"
                  class="mr-1"
                />
              </span>
            </a>
          </div> -->
                    <div class="mb-1">
                        <b>{{ $t('page.author') }}</b>
                        <User :address="proposal.address" :space="space" class="float-right" />
                    </div>
                    <div class="mb-1">
                        <b>{{ $t('page.id') }}</b>
                        <a class="float-right">
                            #{{ proposal.id }}
                            <!-- <Icon name="external-link" class="ml-1" /> -->
                        </a>
                    </div>
                    <div>
                        <div class="mb-1">
                            <b>{{ $t('page.startDate') }}</b>
                            <span
                                :aria-label="_ms(payload.start)"
                                v-text="$d(payload.start * 1e3, 'short')"
                                class="float-right text-white tooltipped tooltipped-n"
                            />
                        </div>
                        <div class="mb-1">
                            <b>{{ $t('page.endDate') }}</b>
                            <span
                                :aria-label="_ms(payload.end)"
                                v-text="$d(payload.end * 1e3, 'short')"
                                class="float-right text-white tooltipped tooltipped-n"
                            />
                        </div>
                        <!-- <div class="mb-1">
              <b>Snapshot</b>
              <a
                :href="_explorer(space.network, payload.snapshot, 'block')"
                target="_blank"
                class="float-right"
              >
                {{ $n(payload.snapshot) }}
                <Icon name="external-link" class="ml-1" />
              </a>
            </div> -->
                    </div>
                </Block>
                <BlockResults
                    :id="id"
                    :space="space"
                    :payload="payload"
                    :results="results"
                    :votes="votes"
                />
            </div>
        </div>
        <ModalConfirm
            v-if="loaded"
            :open="modalOpen"
            @close="modalOpen = false"
            @reload="loadProposal"
            :space="space"
            :proposal="proposal"
            :id="id"
            :selectedChoice="selectedChoice"
            :totalScore="totalScore"
            :scores="scores"
            :snapshot="payload.snapshot"
            :delegatee="delegatee"
        />
        <ModalStrategies
            :open="modalStrategiesOpen"
            @close="modalStrategiesOpen = false"
            :space="space"
            :strategies="space.strategies"
        />
    </Container>
</template>

<script>
import {mapActions} from 'vuex';
import networks from '@/helpers/networks.json';
import {TARGETS} from '@/helpers/proposal';
import {lsGet, lsSet} from '@/helpers/utils';

export default {
    data() {
        return {
            key: 'symblox',
            id: this.$route.params.id,
            loading: false,
            loaded: false,
            voteLoading: false,
            proposal: {},
            votes: {},
            results: [],
            receipt: {},
            hasVoted: false,
            modalOpen: false,
            modalStrategiesOpen: false,
            selectedChoice: 0,
            totalScore: 0,
            delegatee: '',
            scores: []
        };
    },
    computed: {
        networkId() {
            return this.web3.network.chainId;
        },
        explorer() {
            return networks[this.web3.network.chainId].explorer;
        },
        space() {
            const space = this.app.spaces[this.web3.network.chainId];
            return space || {};
        },
        payload() {
            return this.proposal.msg ? this.proposal.msg.payload : {};
        },
        title() {
            return (
                this.lsGet(
                    this.app.spaces[this.web3.network.chainId].network + this.proposal.id
                ).split(';')[0] || ''
            );
        },
        body() {
            const context = this.lsGet(
                this.app.spaces[this.web3.network.chainId].network + this.proposal.id
            );
            if (context) {
                const title = context.split(';')[0];
                return context.slice(title.length + 1, context.length);
            } else {
                return '';
            }
        },
        transactionHash() {
            const context = this.lsGet(
                this.app.spaces[this.web3.network.chainId].network +
                    this.proposal.id +
                    'transactionHash'
            );
            if (context) {
                return context;
            } else {
                return '';
            }
        },
        ts() {
            return (Date.now() / 1e3).toFixed();
        },
        symbols() {
            return this.space.strategies.map(strategy => strategy.params.symbol);
        }
    },
    watch: {
        'web3.account': async function(val, prev) {
            if (val && val.toLowerCase() !== prev) {
                this.loading = true;
                this.loaded = false;
                await this.loadPower();
                await this.loadProposal();
                this.loading = false;
                this.loaded = true;
            }
        },
        'web3.network.chainId': async function(val, prev) {
            if (val.toString() !== prev.toString()) {
                this.loading = true;
                this.loaded = false;
                await this.loadPower();
                await this.loadProposal();
                this.loading = false;
                this.loaded = true;
            }
        }
    },
    methods: {
        ...mapActions([
            'getProposal',
            'getProposalActions',
            'getPower',
            'encode',
            'decode',
            'send',
            'getReceipt',
            'getDelegatee'
        ]),
        lsGet,
        lsSet,
        async loadProposal() {
            const proposalObj = await this.getProposal({
                space: this.space,
                id: this.id
            });
            this.receipt = await this.getReceipt({
                space: this.space,
                id: this.id
            });
            const actions = await this.getProposalActions({
                space: this.space,
                id: this.id
            });
            const rewardManagerAddress = TARGETS[this.networkId].rewardManager.address;
            const syxTokenAddress = TARGETS[this.networkId].symblox.address;
            const decode = this.decode;
            this.actions = [];
            for (let i = 0; i < actions[0].length; i++) {
                const v = actions[0][i];
                let contractName;
                switch (v.toLowerCase()) {
                    case rewardManagerAddress.toLowerCase():
                        contractName = 'RewardManager';
                        break;
                    case syxTokenAddress.toLowerCase():
                        contractName = 'SymbloxToken';
                        break;
                    default:
                        contractName = v;
                }
                const funcName = actions[2][i];
                const types = funcName
                    .split('(')[1]
                    .split(')')[0]
                    .split(',');
                const data = await decode({
                    types: types,
                    values: actions[3][i]
                });
                let message, messageParams;
                switch (funcName) {
                    case 'add(uint256,address,bool)':
                        message = 'page.addPool';
                        messageParams = {
                            ratio: data[0] / 10 ** 18,
                            lpToken: data[1]
                        };
                        break;
                    case 'set(uint256,uint256,bool)':
                        message = 'page.setRewardRatio';
                        messageParams = {
                            poolId: data[0],
                            ratio: data[1] / 10 ** 18
                        };
                        break;
                    case 'setConnectorImpl(uint8,address)':
                        message = 'page.setConnectorImpl';
                        messageParams = {
                            poolId: data[0],
                            address: data[1]
                        };
                        break;
                    case 'mint(address,uint256)':
                        message = 'page.mintSyx';
                        messageParams = {
                            farm: data[0],
                            amount: data[1]
                        };
                        break;
                    default:
                        message = '';
                }

                this.actions.push({
                    contractName,
                    contractAddress: v,
                    funcName: funcName.split('(')[0] + '(' + data.join(',') + ')',
                    message,
                    messageParams,
                    data
                });
            }

            if (proposalObj) {
                this.proposal = proposalObj.proposal;
                this.votes = proposalObj.votes;
                this.results = proposalObj.results;
                this.hasVoted = proposalObj.hasVoted;
            } else {
                this.proposal = {};
                this.votes = {};
                this.results = [];
                this.hasVoted = false;
            }
        },
        async loadPower() {
            if (!this.web3.account) return;
            const {scores, totalScore} = await this.getPower({
                space: this.space,
                address: this.web3.account,
                blockNumber: this.payload.startBlock
            });
            this.totalScore = totalScore || 0;
            this.scores = scores || [];
            this.delegatee = await this.getDelegatee(this.space);
        }
    },
    async created() {
        this.loading = true;
        await this.loadProposal();
        await this.loadPower();
        this.loading = false;
        this.loaded = true;
    }
};
</script>
