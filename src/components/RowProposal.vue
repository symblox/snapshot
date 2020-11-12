<template>
    <router-link
        class="px-4 py-3 border-top d-block text-gray"
        :to="`/symblox/proposal/${proposal.id}?name=${proposal.msg.payload.name}&key=${token}`"
    >
        <div>
            <State :proposal="proposal" class="d-inline-block mr-2 mb-2" />
            <h3 v-text="_shorten(proposal.msg.payload.name.split(';')[0], 'name')" class="d-inline-block mb-1" />
        </div>
        <div>
            <span v-text="`#${proposal.id}`" />
            By {{ _shorten(addressVlx) }}
            <Badges :address="proposal.address" :space="space" class="ml-n1" />
            <Icon v-if="isVerified" name="check" title="Verified" />
            start
            <span v-text="$d(proposal.msg.payload.start * 1e3)" />
            end
            <span v-text="$d(proposal.msg.payload.end * 1e3)" />
        </div>
    </router-link>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return { 
            addressVlx: ''
        };
    },
    props: {
        space: Object,
        token: String,
        proposal: Object,
        verified: Array,
        i: String
    },
    async mounted() {
        this.addressVlx = await this.ethToVlx(this.proposal.address);
    },
    methods: {
        ...mapActions(['ethToVlx'])
    },
    computed: {
        isVerified() {
            return Array.isArray(this.verified) && this.verified.length > 0 && this.verified.includes(this.proposal.address);
        }
    }
};
</script>
