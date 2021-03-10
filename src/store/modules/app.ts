import Vue from 'vue';
import {getInstance} from '@snapshot-labs/lock/plugins/vue';
import {getScores} from '@snapshot-labs/snapshot.js/src/utils';
import client from '@/helpers/client';
import ipfs from '@/helpers/ipfs';
import {formatEther, parseEther} from '@ethersproject/units';
import {abiEncode, abiDecode} from '@/helpers/content';
import {vlxToEth, ethToVlx} from '@/helpers/vlxAddressConversion';
import getProvider from '@/helpers/provider';
import {formatProposal, formatProposals, formatSpace} from '@/helpers/utils';
import {
    getBlockNumber,
    getBlockTimestamp,
    signMessage,
    getContract,
    sendTransaction
} from '@/helpers/web3';
import {version} from '@/../package.json';

const state = {
    init: false,
    loading: false,
    spaces: {},
    language: 'en' // en || zh-CN
};

const proposalState = {
    '0': 'Pending',
    '1': 'Active',
    '2': 'Canceled',
    '3': 'Defeated',
    '4': 'Succeeded',
    '5': 'Queued',
    '6': 'Expired',
    '7': 'Executed'
};

const mutations = {
    SET_LANGUAGE: (state, language) => {
        state.language = language;
    },
    SET(_state, payload) {
        Object.keys(payload).forEach(key => {
            Vue.set(_state, key, payload[key]);
        });
    },
    SEND_REQUEST() {
        console.debug('SEND_REQUEST');
    },
    SEND_SUCCESS() {
        console.debug('SEND_SUCCESS');
    },
    SEND_FAILURE(_state, payload) {
        console.debug('SEND_FAILURE', payload);
    },
    GET_USER_LAST_PROPOSAL_REQUEST() {
        console.debug('GET_USER_LAST_PROPOSAL_REQUEST');
    },
    GET_USER_LAST_PROPOSAL_SUCCESS() {
        console.debug('GET_USER_LAST_PROPOSAL_SUCCESS');
    },
    GET_USER_LAST_PROPOSAL_FAILURE() {
        console.debug('GET_USER_LAST_PROPOSAL_FAILURE');
    },
    GET_PROPOSAL_STATE_REQUEST() {
        console.debug('GET_PROPOSAL_STATE_REQUEST');
    },
    GET_PROPOSAL_STATE_SUCCESS() {
        console.debug('GET_PROPOSAL_STATE_SUCCESS');
    },
    GET_PROPOSAL_ACTIONS_REQUEST() {
        console.debug('GET_PROPOSAL_ACTIONS_REQUEST');
    },
    GET_PROPOSAL_ACTIONS_SUCCESS() {
        console.debug('GET_PROPOSAL_ACTIONS_SUCCESS');
    },
    GET_PROPOSAL_ACTIONS_FAILURE() {
        console.debug('GET_PROPOSAL_ACTIONS_FAILURE');
    },
    GET_PROPOSAL_STATE_FAILURE() {
        console.debug('GET_PROPOSAL_STATE_FAILURE');
    },
    GET_GOVERNOR_PARAMS_REQUEST() {
        console.debug('GET_GOVERNOR_PARAMS_REQUEST');
    },
    GET_GOVERNOR_PARAMS_SUCCESS() {
        console.debug('GET_GOVERNOR_PARAMS_SUCCESS');
    },
    GET_GOVERNOR_PARAMS_FAILURE() {
        console.debug('GET_GOVERNOR_PARAMS_FAILURE');
    },
    GET_DELEGATEE_REQUEST() {
        console.debug('GET_DELEGATEE_REQUEST');
    },
    GET_DELEGATEE_SUCCESS() {
        console.debug('GET_DELEGATEE_SUCCESS');
    },
    GET_DELEGATEE_FAILURE() {
        console.debug('GET_DELEGATEE_FAILURE');
    },
    GET_PROPOSALS_REQUEST() {
        console.debug('GET_PROPOSALS_REQUEST');
    },
    GET_PROPOSALS_SUCCESS() {
        console.debug('GET_PROPOSALS_SUCCESS');
    },
    GET_PROPOSALS_FAILURE(_state, payload) {
        console.debug('GET_PROPOSALS_FAILURE', payload);
    },
    GET_PROPOSAL_REQUEST() {
        console.debug('GET_PROPOSAL_REQUEST');
    },
    GET_PROPOSAL_SUCCESS() {
        console.debug('GET_PROPOSAL_SUCCESS');
    },
    GET_PROPOSAL_FAILURE(_state, payload) {
        console.debug('GET_PROPOSAL_FAILURE', payload);
    },
    GET_POWER_REQUEST() {
        console.debug('GET_POWER_REQUEST');
    },
    GET_POWER_SUCCESS() {
        console.debug('GET_POWER_SUCCESS');
    },
    GET_POWER_FAILURE(_state, payload) {
        console.debug('GET_POWER_FAILURE', payload);
    }
};

const actions = {
    setLanguage({commit}, language) {
        commit('SET_LANGUAGE', language);
    },
    init: async ({commit, dispatch}) => {
        commit('SET', {loading: true});
        // const connector = await Vue.prototype.$auth.getConnector();
        // if (connector) await dispatch('login', connector);
        await dispatch('getSpaces');
        commit('SET', {loading: false, init: true});
    },
    loading: ({commit}, payload) => {
        commit('SET', {loading: payload});
    },
    decode: ({commit}, payload) => {
        return abiDecode(payload.types, payload.values);
    },
    encode: ({commit}, payload) => {
        return abiEncode(payload.types, payload.values);
    },
    ethToVlx({commit}, address) {
        return ethToVlx(address);
    },
    vlxToEth({commit}, address) {
        return vlxToEth(address);
    },
    formatEther: async ({commit}, amount) => {
        return await formatEther(amount);
    },
    parseEther: async ({commit}, amount) => {
        return await parseEther(amount);
    },
    getSpaces: async ({commit}) => {
        //let spaces: any = await client.request('spaces');
        let spaces: any = {};
        spaces['111'] = {
            domain: 'https://app.symblox.io/',
            name: 'symblox',
            network: '111',
            skin: 'yearn',
            symbol: 'SYX',
            token: '0x946b06FE625aB1AaA27294F8ed09713C8812626c',
            governor: '0xf175A628Fc110296596BD0eddEbE0f1c5e84d2CA',
            logsFromBlock: 2957399,
            members: [],
            strategies: [],
            secondsPerBlock: 10
        };
        spaces['106'] = {
            domain: 'https://app.symblox.io/',
            name: 'symblox',
            network: '106',
            skin: 'yearn',
            symbol: 'SYX',
            token: '0x01Db6ACFA20562Ba835aE9F5085859580A0b1386',
            governor: '0x7DF0c84197D35356b1d4F29912082371f3469fF5',
            logsFromBlock: 3654175,
            members: [],
            strategies: [],
            secondsPerBlock: 5
        };

        spaces = Object.fromEntries(
            Object.entries(spaces).map(space => [space[0], formatSpace(space[0], space[1])])
        );
        commit('SET', {spaces});
        return spaces;
    },
    send: async ({commit, dispatch}, {type, payload}) => {
        const auth = getInstance();
        commit('SEND_REQUEST');
        try {
            const result: any = await sendTransaction(auth.web3, [
                payload.contractType,
                payload.contractAddress,
                payload.action,
                [...payload.args]
            ]);
            console.log('tx: ', result);
            commit('SEND_SUCCESS');
            dispatch('notify', ['green', `Your ${type} is in!`]);

            return true;
        } catch (e) {
            commit('SEND_FAILURE', e);
            const errorMessage =
                e && e.error_description
                    ? `Oops, ${e.error_description}`
                    : 'Oops, something went wrong!';
            dispatch('notify', ['red', errorMessage]);
            return false;
        }
    },
    getLatestProposalIds: async ({commit}, space) => {
        commit('GET_USER_LAST_PROPOSAL_REQUEST');
        try {
            const auth = getInstance();
            const accounts = await auth.web3.listAccounts();
            const provider = getProvider(space.network);
            const contract = await getContract(space.governor, 'Governor', provider);
            const proposalId = await contract.latestProposalIds(accounts[0]);
            commit('GET_USER_LAST_PROPOSAL_SUCCESS');
            return proposalId.toString();
        } catch (e) {
            commit('GET_USER_LAST_PROPOSAL_FAILURE', e);
        }
    },
    getProposalState: async ({commit}, {space, id}) => {
        console.log('getProposalState');
        commit('GET_PROPOSAL_STATE_REQUEST');
        try {
            const provider = getProvider(space.network);
            const contract = await getContract(space.governor, 'Governor', provider);
            const stateId = await contract.state(id);
            commit('GET_PROPOSAL_STATE_SUCCESS');
            return proposalState[stateId];
        } catch (e) {
            console.log(e);
            commit('GET_PROPOSAL_STATE_FAILURE', e);
        }
    },
    getProposalActions: async ({commit}, {space, id}) => {
        console.log('getProposalActions');
        commit('GET_PROPOSAL_ACTIONS_REQUEST');
        try {
            const provider = getProvider(space.network);
            const contract = await getContract(space.governor, 'Governor', provider);
            const params = await contract.getActions(id);
            commit('GET_PROPOSAL_ACTIONS_SUCCESS');
            return params;
        } catch (e) {
            console.log(e);
            commit('GET_PROPOSAL_ACTIONS_FAILURE', e);
        }
    },
    getDelegatee: async ({commit}, space) => {
        commit('GET_DELEGATEE_REQUEST');
        try {
            const auth = getInstance();
            const contract = await getContract(space.token, 'SYX', auth.web3);
            const accounts = await auth.web3.listAccounts();
            const delegatee = await contract.delegates(accounts[0]);
            commit('GET_DELEGATEE_SUCCESS');
            return delegatee;
        } catch (e) {
            commit('GET_DELEGATEE_FAILURE', e);
        }
    },
    getGovernorParams: async ({commit}, space) => {
        commit('GET_GOVERNOR_PARAMS_REQUEST');
        try {
            const auth = getInstance();
            const governorContract = await getContract(space.governor, 'Governor', auth.web3);
            const proposalMaxOperations = await governorContract.proposalMaxOperations();
            const proposalThreshold = await governorContract.proposalThreshold();
            commit('GET_GOVERNOR_PARAMS_SUCCESS');
            return {
                proposalMaxOperations: proposalMaxOperations.toString(),
                proposalThreshold: (proposalThreshold / 10 ** 18).toString()
            };
        } catch (e) {
            commit('GET_GOVERNOR_PARAMS_FAILURE', e);
        }
    },
    getProposals: async ({commit}, space) => {
        commit('GET_PROPOSALS_REQUEST');
        try {
            const provider = getProvider(space.network);
            const contract = await getContract(space.governor, 'Governor', provider);

            const curBlockNumber = await getBlockNumber(provider);
            const curTimestamp = await getBlockTimestamp(provider, curBlockNumber);

            const proposalCreatedFilter = contract.filters.ProposalCreated();
            proposalCreatedFilter['fromBlock'] = space.logsFromBlock;

            const proposalCreatedLogs = await provider.getLogs(proposalCreatedFilter);

            const proposals: any = await Promise.all(
                proposalCreatedLogs.map(async log => {
                    const logData = contract.interface.parseLog(log);
                    const {description, proposer, id, startBlock, endBlock} = logData.args;
                    let startTimestamp, endTimestamp;
                    if (curBlockNumber > startBlock) {
                        startTimestamp = await getBlockTimestamp(provider, parseFloat(startBlock));
                    } else {
                        startTimestamp =
                            curTimestamp + (startBlock - curBlockNumber) * space.secondsPerBlock;
                    }

                    if (curBlockNumber > endBlock) {
                        endTimestamp = await getBlockTimestamp(provider, parseFloat(endBlock));
                    } else {
                        endTimestamp =
                            curTimestamp + (endBlock - curBlockNumber) * space.secondsPerBlock;
                    }

                    const proposal = await contract.proposals(id);
                    let stateId = await contract.state(id);
                    if (proposal.executed) {
                        stateId = 7;
                    }

                    return {
                        id: id.toString(),
                        address: proposer,
                        msg: {
                            payload: {
                                transactionHash: log.transactionHash,
                                name: description,
                                start: startTimestamp,
                                end: endTimestamp,
                                state: proposalState[stateId]
                            }
                        }
                    };
                })
            );

            commit('GET_PROPOSALS_SUCCESS');
            return proposals.reverse();
        } catch (e) {
            commit('GET_PROPOSALS_FAILURE', e);
        }
    },
    getReceipt: async ({commit}, payload) => {
        try {
            const auth = getInstance();
            const accounts = await auth.web3.listAccounts();
            const contract = await getContract(payload.space.governor, 'Governor', auth.web3);
            const receipt = await contract.getReceipt(payload.id, accounts[0]);

            return receipt;
        } catch (error) {
            return {
                hasVoted: false
            };
        }
    },
    getProposal: async ({commit}, payload) => {
        commit('GET_PROPOSAL_REQUEST');
        try {
            const provider = getProvider(payload.space.network);
            const contract = await getContract(payload.space.governor, 'Governor', provider);

            const blockNumber = await getBlockNumber(provider);
            const curTimestamp = await getBlockTimestamp(provider, blockNumber);
            const proposal = await contract.proposals(payload.id);
            let stateId = await contract.state(payload.id);

            if (proposal.executed) {
                stateId = 7;
            }

            let startTimestamp, endTimestamp;
            if (blockNumber > proposal.startBlock) {
                startTimestamp = await getBlockTimestamp(provider, parseFloat(proposal.startBlock));
            } else {
                startTimestamp =
                    curTimestamp +
                    (proposal.startBlock - blockNumber) * payload.space.secondsPerBlock;
            }

            if (blockNumber > proposal.endBlock) {
                endTimestamp = await getBlockTimestamp(provider, parseFloat(proposal.endBlock));
            } else {
                endTimestamp =
                    curTimestamp +
                    (proposal.endBlock - blockNumber) * payload.space.secondsPerBlock;
            }

            const result: any = {};
            result.proposal = {
                address: proposal.proposer,
                id: proposal.id,
                msg: {
                    token: payload.space.governor,
                    type: 'proposal',
                    payload: {
                        name: payload.name,
                        choices: ['Yes', 'No'],
                        startBlock: proposal.startBlock,
                        endBlock: proposal.endBlock,
                        start: startTimestamp,
                        end: endTimestamp,
                        state: proposalState[stateId],
                        eta: proposal.eta
                        //hasVoted: ,
                    }
                }
            };

            const voteCastFilter = contract.filters.VoteCast();
            voteCastFilter['fromBlock'] = payload.space.logsFromBlock;
            const voteCastLogs = await provider.getLogs(voteCastFilter);
            result.votes = await Promise.all(
                voteCastLogs.map(async log => {
                    const logData = contract.interface.parseLog(log);
                    const {voter, proposalId, support, votes} = logData.args;
                    if (proposalId.toString() === payload.id) {
                        return {
                            address: voter,
                            addressVlx: ethToVlx(voter),
                            msg: {
                                type: 'vote',
                                payload: {
                                    choice: support ? 1 : 2
                                }
                            },
                            scores: [votes / 10 ** 18],
                            balance: votes / 10 ** 18
                        };
                    }
                })
            );
            result.votes = result.votes.filter(res => res != undefined);

            const forVotes = proposal.forVotes / 10 ** 18,
                againstVotes = proposal.againstVotes / 10 ** 18;
            result.results = {
                // totalVotes: [proposal.forVotes, proposal.againstVotes],
                totalBalances: [forVotes, againstVotes],
                totalScores: [forVotes, againstVotes],
                totalVotesBalances:
                    parseFloat(forVotes.toString()) + parseFloat(againstVotes.toString())
            };
            commit('GET_PROPOSAL_SUCCESS');
            return result;
        } catch (e) {
            commit('GET_PROPOSAL_FAILURE', e);
        }
    },
    getPower: async ({commit}, {space, address, blockNumber}) => {
        commit('GET_POWER_REQUEST');
        try {
            const provider = getProvider(space.network);
            const contract = await getContract(space.token, 'SYX', provider);
            if (!blockNumber) {
                blockNumber = (await getBlockNumber(getProvider(space.network))) - 1;
            }
            const balance = await contract.getPriorVotes(address, blockNumber);

            //const blockTag = snapshot > blockNumber ? 'latest' : parseInt(snapshot);
            // let scores: any = await getScores(
            //   space.strategies,
            //   space.network,
            //   getProvider(space.network),
            //   [address],
            //   // @ts-ignore
            //   blockTag
            // );
            // scores = scores.map((score: any) =>
            //   Object.values(score).reduce((a, b: any) => a + b, 0)
            // );
            const scores: any = [balance / 10 ** 18];
            commit('GET_POWER_SUCCESS');
            return {
                scores,
                totalScore: scores.reduce((a, b: any) => a + b, 0)
            };
        } catch (e) {
            commit('GET_POWER_FAILURE', e);
            return {
                scores: [],
                totalScore: 0
            };
        }
    }
};

export default {
    state,
    mutations,
    actions
};
