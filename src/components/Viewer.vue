<template>
    <div id="nlu-container" v-html="safeCode" :style="`${store.controlPanel.freeze ? 'pointer-events: none;': 'pointer-events: auto'}`">
    </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, watch } from 'vue';
import DOMPurify from 'dompurify';
import { addSelectableBorders, findComponents } from '../utils'
import { useMajorStore } from '../store';

const store = useMajorStore()
const safeCode = computed(() => {
    return DOMPurify.sanitize(store.code, { USE_PROFILES: { html: true } })
})
watch(() => [store.page.codes.length, store.code], () => {
    const code = document.querySelector('#nlu-container')
    nextTick(() => {
            const components = findComponents(code?.childNodes[0] as HTMLElement)
            addSelectableBorders(components, "nlp-selected", "nlp-selectable")
    })
}, {
    flush: 'post',
    deep: true
})
</script>
<style lang="scss">
#nlu-container {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: #000000 #ffffff;
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-track {
        background: #ffffff;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #000000;
        border-radius: 20px;
        border: 3px solid #ffffff;
    }
}
.nlp-selected {
    border: 2px solid blue !important;
}
.nlp-selectable {
    border: 2px solid green !important;
}
</style>
  