<script setup lang="ts">
</script>
<template>
  <Setting />
  <Drawer />
  <ControlPanel/>
  <Viewer />
</template>
<script lang="ts" setup>
import Viewer from './components/Viewer.vue'
import ControlPanel from './components/ControlPanel.vue'
import Drawer from './components/FileBrowser.vue'
import Setting from './components/Setting.vue'
</script>
<style scoped>
</style>
