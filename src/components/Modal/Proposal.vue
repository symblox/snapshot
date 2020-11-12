<template>
    <UiModal :open="open" @close="$emit('close')" :noIcon="true">
        <form @submit.prevent="handleSubmit" class="modal-body">
            <div class="p-4"> 
                <div class="select-button">
                    {{$t('page.targets')}}
                    <UiButton class="button" @click="targetVisible = !targetVisible">{{ activeTarget }}</UiButton>
                    <div v-if="targetVisible" class="select">
                        <div
                            :class="['select-item', index === activeTarget ? 'active' : '']"
                            @click="onContract(contract,index)"
                            v-for="(contract, index) in target"
                            :key="index"
                        >
                            {{ index }}
                        </div>
                    </div>
                </div>
                <div class="select-button pt-2" v-if="activeTarget!=='Choose...'">
                    {{$t('page.function')}}
                    <UiButton class="button" @click="functionVisible = !functionVisible">{{ activeFunction }}</UiButton>
                    <div v-if="functionVisible" class="select">
                        <div
                            :class="['select-item', index === activeFunction ? 'active' : '']"
                            @click="onFunction(data,index)"
                            v-for="(data, index) in target[activeTarget].actions"
                            :key="index"
                        >
                            {{ data.signature }}
                        </div>
                    </div>
                </div>
                <div class="select-button pt-2" v-if="activeFunction!=='Choose...'">
                    {{$t('page.params')}}
                    <UiButton class="mb-2" v-for="(type, i) of target[activeTarget].actions[functionKey].params" :key="i">
                        <input
                            v-model="form.args[i]"
                            type="string"
                            class="input width-full text-center"
                            :placeholder="type"
                        />
                    </UiButton>
                </div>
            </div>
            <div class="p-4 overflow-hidden text-center border-top">
                <div class="col-6 float-left pr-2">
                <UiButton @click="$emit('close')" type="button" class="width-full">
                    {{$t('page.cancel')}}
                </UiButton>
                </div>
                <div class="col-6 float-left pl-2">
                <UiButton type="submit" class="width-full button--submit">
                    {{$t('page.confirm')}}
                </UiButton>
                </div>
            </div>
        </form>
    </UiModal>
</template>

<script>
import {TARGETS} from '@/helpers/proposal';
import { mapActions } from 'vuex';
export default {
  props: ['open', 'networkId', 'targets', 'values', 'signatures', 'calldatas'],
  data() {
    return {
        target: TARGETS[this.networkId],
        activeTarget: 'Choose...',
        activeFunction: 'Choose...',
        targetVisible: false,
        functionVisible: false,
        functionKey: 0,
        form: {
            address: '',
            signature: '',
            types: [],
            args: []
        }
    };
  },
  methods: {
    ...mapActions(['vlxToEth','encode']),
    onContract(contract,name) {
        this.activeTarget = name;
        this.targetVisible = !this.targetVisible;
        this.activeFunction = 'Choose...';
        this.form.address = contract.address;
    },
    onFunction(data,key) {
        this.functionKey = key;
        this.activeFunction = data.signature;
        this.functionVisible = !this.functionVisible;
        this.form.signature = data.signature;
        this.form.types = data.types;
        this.form.args = [];
    },
    async handleSubmit() {
        if(!this.form.address || !this.form.signature){
            this.$store.dispatch('notify', ['red', `params miss`]);
            return;
        }
        this.targets.push(this.form.address);
        this.values.push("0");
        this.signatures.push(this.form.signature);
        let callData;
        try {
            callData = await this.encode({
                coerceFunc: this.form.signature,types: this.form.types,values:this.form.args
            })
        } catch (error) {
            this.$store.dispatch('notify', ['red', `${error}`]);
            return;
        }
        this.calldatas.push(callData);
        this.form = {
            address: '',
            signature: '',
            types: [],
            args: []
        };
        this.activeTarget = 'Choose...';
        this.activeFunction = 'Choose...';
        this.targetVisible = false;
        this.functionVisible = false;
        this.functionKey = 0;
        this.$emit('close');
    }
  }
};
</script>
<style lang="scss">
.select-button {
    position: relative;
    .button {
        border-radius: 3px !important;
        width: 100%;
    }
    .select {
        z-index: 9999;
        transition: all 150ms 0ms;
        min-width: 80px;
        box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
        position: absolute;
        background-color: #fff;
        border-radius: 8px;
        padding: 10px 15px;
        top: 54px;
        right: 0px;
        .select-item {
            line-height: 30px;
            cursor: pointer;
            &:hover,
            &.active {
                color: #000;
            }
        }
    }
}
</style>
