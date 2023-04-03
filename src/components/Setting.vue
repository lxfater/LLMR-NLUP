<template>
    <el-dialog v-model="store.setting.settingDialogVisible" title="Settings" width="60%">
        <el-form label-width="100px" style="max-width: 460px">
            <el-form-item label="API key">
                <el-input v-model="store.setting.sk" />
            </el-form-item>
            <el-form-item label="Max tokens">
                <el-input v-model="store.setting.maxTokens" />
            </el-form-item>
            <el-form-item label="Model">
                <el-select v-model="store.setting.model" placeholder="Select your Model">
                    <el-option label="gpt-3.5-turbo" value="gpt-3.5-turbo" />
                    <el-option label="gpt-3.5-turbo-0301" value="gpt-3.5-turbo-0301" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="store.closeSettingDialog">Close</el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { useMajorStore } from '../store';
const store = useMajorStore()
</script>
<style scoped>
.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>
  