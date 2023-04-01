<template>
    <div class="nlu-container" id="nlu-code" v-html="safeCode">

    </div>
    <div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-white" style="z-index: 999;">
        <div class="px-4 py-2 flex justify-between items-center">
            <textarea
                placeholder="Specify the type of interface you want, such as a chat interface, login interface, registration interface, etc."
                ref=question
                class="flex-1 p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500"></textarea>
            <button class="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2" @click="ask"
                v-if="state === 'generate'">generate</button>
            <button class="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2" v-else @click="edit">edit</button>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import { Openai } from '../openai'
import DOMPurify from 'dompurify';
import { ElMessage } from 'element-plus'
import { addBorderOnHover, findComponents, addBorderOnClick } from '../utils'
import setting from './../setting.json'
const state = ref<'generate' | 'edit'>('generate')
const question = ref<HTMLTextAreaElement | null>(null)
const safeCode = computed(() => {
    return DOMPurify.sanitize(code.value, { USE_PROFILES: { html: true } })
})
const bridge = new Openai(setting.sk, 'gpt-3.5-turbo', '1500')
const code = ref('')
const ask = async () => {
    if (!question.value) return
    const info = `generate a TailwindCSS code for ${question.value.value} Webpage.`

    const answer = await bridge.ask([
        { role: 'system', content: 'As a code generator, your task is to create a code example using TailwindCSS for a specific type of webpage. Your output should be in Markdown format. Please note that the code should not include any image elements.' },
        { role: 'user', content: 'generate a TailwindCSS code for 灰色按钮 Webpage.' },
        { role: 'assistant', content: `\`\`\`htm<button  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Click me</button>\`\`\`` },
        { role: 'user', content: info }
    ], {
        onMessage: (message: any) => {
            console.log(message)
        }
    }) as string
    function extractHtmlCodeFromMd(mdText: string) {
        const htmlBlocks = mdText.match(/```html\n([\s\S]+?)\n```/g);
        if (!htmlBlocks) return [mdText];
        const cleanedBlocks = htmlBlocks.map((block) => block.replace(/```html\n|```/g, ""));
        return cleanedBlocks;
    }
    const text = extractHtmlCodeFromMd(answer).join("\n");
    code.value = text
    ElMessage({
        message: '生成成功',
        type: 'success',
    })
    state.value = 'edit'
}
const render = ref(true)
watch([safeCode,render], () => {
    const code = document.querySelector('#nlu-code')
    if (code) {
        nextTick(() => {
            const components = findComponents(code as HTMLElement)
            addBorderOnHover(components, "10px solid blue", "10px solid green")
        })
    }
})

const edit = async () => {
    const info = `Modify blow TailwindCSS code: ${window?.selectedElement?.outerHTML}. Base following requirements: ${question.value?.value}`
    const answer = await bridge.ask([
        { role: 'system', content: 'As an expert in TailwindCSS, your task is to modify a code snippet according to specific natural language requirements and return the modified code in Markdown format. The code should not include any image elements.' },
        { role: 'user', content: 'Change the text of the button to cancel：<button  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Click me</button>' },
        { role: 'assistant', content: `\`\`\`htm<button  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">cancel</button>\`\`\`` },
        { role: 'user', content: info }
    ], {
        onMessage: (message: any) => {
            console.log(message)
        }
    }) as string
    function extractHtmlCodeFromMd(mdText: string) {
        const htmlBlocks = mdText.match(/```html\n([\s\S]+?)\n```/g);
        if (!htmlBlocks) return [mdText];
        const cleanedBlocks = htmlBlocks.map((block) => block.replace(/```html\n|```/g, ""));
        return cleanedBlocks;
    }
    const text = extractHtmlCodeFromMd(answer).join("\n");
    function replaceElement(originalElement: Element, replacementHtml: string): void {
        const containerElement = document.createElement("div");
        containerElement.innerHTML = replacementHtml;
        const newElement = containerElement.children[0];
        originalElement.replaceWith(newElement);
        window.selectedElement = newElement

    }


    replaceElement(window.selectedElement, text)

    render.value = !render.value
    
}

</script>
  
<style >
.nlu-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
</style>
  