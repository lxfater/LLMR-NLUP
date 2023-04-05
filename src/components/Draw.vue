<template>
  <div>
    <canvas ref="canvasRef"></canvas>
    <el-button @click="changeTo('rect')">矩形</el-button>
    <el-button @click="changeTo('text')">文本</el-button>
    <el-button @click="changeTo('idle')">普通状态</el-button>
    <el-button @click="getObject">获取数据</el-button>
    {{ state }}
  </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { fabric } from 'fabric';
const canvasRef = ref<HTMLCanvasElement>();
console.log(fabric, 'fabric')
let state = ref<'idle' | 'rect' | 'text' | 'delete'>('idle');
const changeTo = (status: 'idle' | 'rect' | 'text' | 'delete') => {
  state.value = status;
}
let canvas: fabric.Canvas;
const getObject = () => {
  function isTextInRect(topLeftX: number, topLeftY: number, width: any, height: any, textX: number, textY: number) {
    var rectRight = topLeftX + width;
    var rectBottom = topLeftY + height;
    return textX >= topLeftX && textX <= rectRight && textY >= topLeftY && textY <= rectBottom;
  }
  let types = canvas.toObject();
  console.log(types)
  let rect = types.objects.filter((item: any) => item.type === 'rect');
  let text = types.objects.filter((item: any) => item.type === 'i-text');
  console.log(rect.map((x) => {
      let q = text.filter((y) => {
        return isTextInRect(x.left, x.top, x.width, x.height, y.left, y.top)
      }).map(x => x.text)
    return {
      width: x.width,
      height: x.height,
      left: x.left,
      top: x.top,
      text: q.join(',')
    }
  }))

}
onMounted(() => {
  canvas = new fabric.Canvas(canvasRef.value, {
    selection: false,
    backgroundColor: 'white'
  });
  canvas.setWidth(800);
  canvas.setHeight(600);
  let currentShape: { enterEditing: () => void; set: (arg0: { width: number; height: number; }) => void; left: number; top: number; } | null = null;
  let drawing = false;
  const mousedown = (event: fabric.IEvent) => {
    drawing = true;
    if (state.value === 'rect') {
      // 创建矩形对象
      currentShape = new fabric.Rect({
        left: event.e.offsetX,
        top: event.e.offsetY,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
        selectable: false,
        hasControls: false
      });

      // 添加矩形对象到画布中
      canvas.add(currentShape);
    }

    if (state.value === 'text') {
      currentShape = new fabric.IText('', {
        left: event.e.offsetX,
        top: event.e.offsetY,
        fontSize: 20,
        fill: 'black',
        selectable: false,
        hasControls: false
      });
      canvas.add(currentShape);
      currentShape.enterEditing();
    }

  }
  const mousemove = (event: fabric.IEvent) => {
    if (state.value === 'rect' && drawing) {
      currentShape.set({
        width: event.e.offsetX - currentShape.left,
        height: event.e.offsetY - currentShape.top,
      });
      canvas.renderAll();
    }
  }
  const mouseup = () => {
    if (state.value === 'rect') {
      drawing = false;
    }
  }
  canvas.on("mouse:down", mousedown);
  canvas.on("mouse:move", mousemove);
  canvas.on("mouse:up", mouseup);
})
</script>
<style scoped>
.editor {
  width: 50vw;
  height: 50vh;
  border: 2px solid #ccc;
}

canvas {
  border: 1px solid #ccc;
}
</style>
  
  