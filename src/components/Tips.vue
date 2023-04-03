<template>
    <div class="text-container">
        <transition name="fade">
            <div v-if="show" :key="currentIndex" >{{ currentText }}</div>
        </transition>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue';

const textList = ['Try using larger elements to layout internal elements.', 'Not satisfied or made a mistake, use undo.', 'Screenshots or copy code to save your work.'];
const currentIndex = ref(0);
const show = ref(false);

const currentText = computed(() => {
    return textList[currentIndex.value];
});

watchEffect((onInvalidate) => {
    const interval = setInterval(() => {
        show.value = false;
        setTimeout(() => {
            currentIndex.value = (currentIndex.value + 1) % textList.length;
            show.value = true;
        }, 500);
    }, 5000);

    onInvalidate(() => {
        clearInterval(interval);
    });
});
</script>
  
<style>
.text-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    user-select: none
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
  
  