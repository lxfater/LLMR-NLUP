<script setup lang="ts">
import { useMajorStore } from '../store';
import {
  Delete,
} from '@element-plus/icons'
const store = useMajorStore()
</script>

<template>
<el-drawer v-model="store.drawer.visible"  :with-header="false">
  <div class="drawerContainer">
    <el-card shadow="hover" v-for="i in store.drawer.files" @click="store.setPage(i)" class="card">
      <div class="title">{{ i.name }}</div>
      <div class="action">
        <el-button type="danger" :icon="Delete" circle @click="store.deletePage" />
      </div>
    </el-card>
  </div>
  </el-drawer>
</template>
<script lang="ts" setup>
</script>
<style lang="scss" scoped>
::v-deep(.el-card__body) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .title {
        font-size: 12px;
        font-weight: 700;
        color: #333;
    }
    .action {
    }
}
</style>