<script setup lang="ts">
import {
  RefreshLeft,
  RefreshRight,
  DocumentAdd,
  Delete,
  Setting,
  Files,
  CloseBold
} from '@element-plus/icons'
import { Openai, Dialog } from '../openai';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';
import { useMajorStore } from '../store';
import { extractHtmlCodeFromMd, replaceElement } from '../utils';
import AsciiArt from './AsciiArt.vue';
const question = ref<HTMLTextAreaElement | null>(null)
const store = useMajorStore()

const generate = async () => {
  if (store.setting.sk === '') {
    ElMessage({
      message: 'Please set the OpenAI API key first',
      type: 'error',
    })
    return
  }
  const bridge = new Openai(store.setting.sk, store.setting.model, store.setting.maxTokens);
  if (!question.value) return
  const info = `generate a TailwindCSS code for ${question.value} Webpage.`
  const prompts: Dialog[] = [
    { role: 'system', content: 'As a code generator, your task is to create a code example using TailwindCSS for a specific type of webpage. Your output should be in Markdown format. Please note that the code should not include any image elements.' },
    { role: 'user', content: 'generate a TailwindCSS code for 灰色按钮 Webpage.' },
    { role: 'assistant', content: `\`\`\`htm<button  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Click me</button>\`\`\`` },
    { role: 'user', content: info }
  ];
  store.controlPanel.freeze = true
  const answer = await bridge.ask(prompts, {
    onMessage: (message: any) => {
      console.log(message)
    }
  })
  store.controlPanel.freeze = false
  const text = extractHtmlCodeFromMd(answer).join("\n");
  store.initHistory(text)
  store.controlPanel.action = 'edit'
  ElMessage({
    message: 'generate success',
    type: 'success',
  })
}
const edit = async () => {
  if (store.setting.sk === '') {
    ElMessage({
      message: 'Please set the OpenAI API key first',
      type: 'error',
    })
    return
  }
  const bridge = new Openai(store.setting.sk, store.setting.model, store.setting.maxTokens);
  const info = `Modify blow TailwindCSS code: ${window?.selectedElement?.outerHTML}. Base following requirements: ${question.value}`
  const prompts: Dialog[] = [
    { role: 'system', content: 'As an expert in TailwindCSS, your task is to modify a code snippet according to specific natural language requirements and return the modified code in Markdown format. The code should not include any image elements.' },
    { role: 'user', content: 'Change the text of the button to cancel:<button  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Click me</button>' },
    { role: 'assistant', content: `\`\`\`htm<button  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">cancel</button>\`\`\`` },
    { role: 'user', content: info }
  ];
  store.controlPanel.freeze = true
  const answer = await bridge.ask(prompts, {
    onMessage: (message: any) => {
      console.log(message)
    }
  })
  store.controlPanel.freeze = false
  const text = extractHtmlCodeFromMd(answer).join("\n");
  console.log(text, 'text')
  if (window.selectedElement !== null) {
    replaceElement(window.selectedElement, text)
    const code = document.querySelector('#nlu-container')
    store.addHistory(code?.innerHTML || '')
    ElMessage({
      message: 'edit success',
      type: 'success',
    })
  }

}
const placeholder = computed(() => {
  if (store.controlPanel.action === 'edit') {
    return 'Tell me how you would like to edit this component.'
  }
  return 'Input the type of page or component you want to generate and provide a detailed description.'
})
</script>

<template>
  <div class="controlPanelContainer">
    <div class="header">
      <div class="pageAction">
        <el-tooltip class="box-item" effect="dark" content="Add New Page" placement="top">
          <el-icon size="30" @click="store.newPage">
            <DocumentAdd />
          </el-icon>
        </el-tooltip>

        <el-tooltip class="box-item" effect="dark" content="Undo" placement="top">
          <el-icon size="30" @click="store.pre">
            <RefreshLeft />
          </el-icon>
        </el-tooltip>

        <el-tooltip class="box-item" effect="dark" content="Redo" placement="top">
          <el-icon size="30" @click="store.next">
            <RefreshRight />
          </el-icon>
        </el-tooltip>

        <el-tooltip class="box-item" effect="dark" content="Clear current page" placement="top">
          <el-icon size="30" @click="store.clear" color="red">
            <Delete />
          </el-icon>
        </el-tooltip>
      </div>

      <div class="setting">
        <el-tooltip class="box-item" effect="dark" content="Open settings dialog" placement="top">
          <el-icon size="30" @click="store.openSettingDialog">
            <Setting />
          </el-icon>
        </el-tooltip>

        <el-tooltip class="box-item" effect="dark" content="Open file history" placement="top">
          <el-icon size="30" @click="store.openDrawer">
            <Files />
          </el-icon>
        </el-tooltip>

        <el-tooltip class="box-item" effect="dark" content="Fatal bug, used to wipe out everything with file history."
          placement="top">
          <el-icon size="30" @click="store.reset" color="red">
            <CloseBold />
          </el-icon>
        </el-tooltip>
      </div>


    </div>
    <div class="main">
      <el-input v-model="question" :autosize="{ minRows: 5, maxRows: 7 }" type="textarea"
        :placeholder="placeholder"></el-input>
      <el-button type="primary" :loading="store.controlPanel.freeze" plain v-if="store.controlPanel.action === 'generate'"
        @Click="generate">generate</el-button>
      <el-button type="primary" :loading="store.controlPanel.freeze" plain v-else @Click="edit">edit</el-button>
    </div>
    <div class="footer"></div>
  </div>
</template>
<style lang="scss" scoped>
.controlPanelContainer {
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: calc(50% - 25%);
  width: 50%;
  padding: 10px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

  .header {
    height: 40px;
    width: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    
  }

  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .el-input {
      width: 200px;
      flex: 1;
      height: 100%;
      border-radius: 8px;
      border-color: #e1e1e1;
      box-shadow: none;

      &:focus {
        border-color: #0099ff;
        box-shadow: 0 0 4px rgba(0, 153, 255, 0.5);
      }

      &::placeholder {
        color: #c4c4c4;
      }
    }

    .el-button {
      width: 100px;
      flex: 0;
      width: 120px;
      height: 48px;
      margin-left: 20px;
      border-radius: 4px;
      background-color: #0099ff;
      color: #fff;

      &:hover {
        background-color: darken(#0099ff, 10%);
      }
    }
  }

  .footer {
    height: 12px;
    background-color: #f2f2f2;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
