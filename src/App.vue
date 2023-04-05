<script lang="ts" setup>
import Viewer from './components/Viewer.vue'
import ControlPanel from './components/ControlPanel.vue'
import Drawer from './components/FileBrowser.vue'
import Setting from './components/Setting.vue'
import Draw from './components/Draw.vue'
import { useMajorStore } from './store';
const store = useMajorStore()
</script>
<template>
  <Setting />
  <Drawer />
  <ControlPanel/>
  <Viewer/>
  <!-- <Draw /> -->
</template>

<style scoped>
</style>
