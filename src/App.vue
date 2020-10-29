<template>
  <div :class="space && space.skin" id="app" class="overflow-hidden">
    <UiLoading v-if="app.loading || !app.init" class="overlay big" />
    <div v-else>
      <Topnav />
      <div class="pb-6 overflow-hidden">
        <router-view :key="$route.path" class="flex-auto" />
      </div>
    </div>
    <Notifications />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['init'])
  },
  mounted() {
    this.init();
  },
  computed: {
    space() {
      try {
        //const key = this.domain || this.$route.params.key;
        return this.app.spaces[this.web3.network.chainId];
      } catch (e) {
        return {};
      }
    }
  },
  watch: {
      'web3.network.chainId': async function(val, prev) {
        if (val.toString() !== prev.toString()){
          this.space = this.app.spaces[val];
        }
      },
  },
};
</script>
