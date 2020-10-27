<template>
    <div class="language">
        <UiButton class="ml-2" @click="visible = !visible">{{ languageText }}</UiButton>
        <div v-if="visible" class="language-select">
            <div
                :class="['language-select-item', lang.vlaue === active ? 'active' : '']"
                @click="onLanguage(lang)"
                v-for="(lang, index) in language"
                :key="index"
            >
                {{ lang.label }}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            language: [
                {label: 'En', vlaue: 'en'},
                {label: '中文', vlaue: 'zh-hans'}
            ],
            visible: false
        };
    },
    computed: {
        active() {
            return this.$store.state.app.language;
        },
        languageText() {
            return this.$store.state.app.language === 'en' ? 'En' : '中文';
        }
    },
    methods: {
        onLanguage(lang) {
            this.$i18n.locale = lang.vlaue;
            this.$store.dispatch('setLanguage', lang.vlaue);
            this.visible = !this.visible;
        }
    }
};
</script>
<style lang="scss">
.language {
    position: relative;
    .language-select {
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
        .language-select-item {
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
