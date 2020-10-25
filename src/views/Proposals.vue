<template>
    <div>
        <Container>
            <div class="mb-3 d-flex">
                <div class="flex-auto">
                    <div v-text="space.name" />
                    <div class="d-flex flex-items-center flex-auto">
                        <h2 class="mr-2">
                            Proposals
                            <UiCounter :counter="Object.keys(proposalsWithFilter).length" class="ml-1" />
                        </h2>
                    </div>
                </div>
                <router-link v-if="$auth.isAuthenticated" :to="{name: 'create', params: {key}}">
                    <UiButton>New proposal</UiButton>
                </router-link>
            </div>
        </Container>
        <Container :slim="true">
            <Block :slim="true">
                <div class="px-4 py-3 bg-gray-dark overflow-auto menu-tabs rounded-top-0 rounded-md-top-2">
                    <router-link
                        v-for="state in states"
                        :key="state"
                        v-text="state"
                        :to="`/${key}/${state}`"
                        :class="selectedState === state && 'text-white'"
                        class="mr-3 text-gray tab"
                    />
                </div>
                <RowLoading v-if="loading" />
                <div v-if="loaded">
                    <RowProposal
                        v-for="(proposal, i) in proposalsWithFilter"
                        :key="i"
                        :proposal="proposal"
                        :space="space"
                        :token="key"
                        :verified="space.verified"
                        :i="i"
                    />
                </div>
                <p v-if="loaded && Object.keys(proposalsWithFilter).length === 0" class="p-4 m-0 border-top d-block">
                    There aren't any proposals here yet!
                </p>
            </Block>
        </Container>
    </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    data() {
        return {
            key: 'symblox', // Default project ID
            loading: false,
            loaded: false,
            proposals: {},
            selectedState: 'all'
        };
    },
    computed: {
        // key() {
        //   return this.domain || this.$route.params.key;
        // },
        space() {
            const space = this.app.spaces[this.key];
            return space || {};
        },
        states() {
            const states = ['all', 'pending', 'active', 'canceled', 'defeated', 'succeeded', 'queued', 'expired', 'executed'];

            return states;
            // return this.space.filters.onlyMembers
            //   ? states.filter(state => !['core', 'community'].includes(state))
            //   : states;
        },
        totalProposals() {
            return Object.keys(this.proposals).length;
        },
        proposalsWithFilter() {
            const ts = (Date.now() / 1e3).toFixed();
            if (this.totalProposals === 0) return {};
            return Object.fromEntries(
                Object.entries(this.proposals)
                    .filter(proposal => {
                        if (['all', undefined].includes(this.selectedState)) return true;

                        if (this.selectedState.toLocaleLowerCase() === proposal[1].msg.payload.state.toLocaleLowerCase()) return true;
                    })
                    .sort((a, b) => b[1].msg.payload.end - a[1].msg.payload.end, 0)
            );
        }
    },
    methods: {
        ...mapActions(['getProposals'])
    },
    async created() {
        this.loading = true;
        this.selectedState = this.$route.params.tab || this.space.filters.defaultTab;
        this.proposals = await this.getProposals(this.space);
        this.loading = false;
        this.loaded = true;
    }
};
</script>
