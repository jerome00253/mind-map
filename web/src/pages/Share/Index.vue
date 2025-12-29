<template>
  <div class="share-container">
    <div class="header">
      <div class="left">
        <span class="logo">Simple Mind Map</span>
        <span class="divider">|</span>
        <span class="title">{{ title }}</span>
      </div>
      <div class="right">
        <el-button size="mini" @click="exportMap">Exporter</el-button>
        <span v-if="author" class="author">Par {{ author }}</span>
      </div>
    </div>
    <div class="mind-map-container" ref="mindMapContainer"></div>
  </div>
</template>

<script>
import MindMap from 'simple-mind-map'
import MiniMap from 'simple-mind-map/src/plugins/MiniMap.js'
import Watermark from 'simple-mind-map/src/plugins/Watermark.js'
import Drag from 'simple-mind-map/src/plugins/Drag.js'
import Export from 'simple-mind-map/src/plugins/Export.js'
import Select from 'simple-mind-map/src/plugins/Select.js'
import RichText from 'simple-mind-map/src/plugins/RichText.js'
import AssociativeLine from 'simple-mind-map/src/plugins/AssociativeLine.js'
import TouchEvent from 'simple-mind-map/src/plugins/TouchEvent.js'
import NodeImgAdjust from 'simple-mind-map/src/plugins/NodeImgAdjust.js'
import RainbowLines from 'simple-mind-map/src/plugins/RainbowLines.js'
import NodeBase64ImageStorage from 'simple-mind-map/src/plugins/NodeBase64ImageStorage.js'
import Themes from 'simple-mind-map-plugin-themes'
import api from '@/api/backend'

// Register plugins
MindMap.usePlugin(MiniMap)
  .usePlugin(Watermark)
  .usePlugin(Drag)
  .usePlugin(Export)
  .usePlugin(Select)
  .usePlugin(RichText)
  .usePlugin(AssociativeLine)
  .usePlugin(NodeImgAdjust)
  .usePlugin(TouchEvent)
  .usePlugin(RainbowLines)
  .usePlugin(NodeBase64ImageStorage)

Themes.init(MindMap)

export default {
  data() {
    return {
      mindMap: null,
      title: 'Chargement...',
      author: '',
      token: ''
    }
  },
  async mounted() {
    this.token = this.$route.params.token
    if (this.token) {
      await this.loadSharedMap()
    } else {
      this.$message.error('Lien invalide')
    }
  },
  methods: {
    async loadSharedMap() {
      const loading = this.$loading({
        lock: true,
        text: 'Chargement de la carte...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await api.getSharedMindMap(this.token)
        if (res.data.success) {
          const { mindmap, isOwner } = res.data.data
          this.title = mindmap.title
          this.author = res.data.data.author || 'Inconnu'

          let data = JSON.parse(mindmap.data)

          this.initMindMap(data)
        }
      } catch (error) {
        this.$message.error('Impossible de charger la carte partagée')
      } finally {
        loading.close()
      }
    },
    initMindMap(data) {
      this.mindMap = new MindMap({
        el: this.$refs.mindMapContainer,
        data: data.root,
        layout: data.layout,
        theme: data.theme.template,
        themeConfig: data.theme.config,
        viewData: data.view,
        readonly: true, // Read-only mode
        nodeTextEditZIndex: 1000,
        nodeNoteTooltipZIndex: 1000
      })
    },
    exportMap() {
      this.mindMap.export('png', true, this.title)
    }
  }
}
</script>

<style scoped>
.share-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.left {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.logo {
  font-weight: bold;
  color: #409eff;
}

.divider {
  margin: 0 10px;
  color: #ddd;
}

.title {
  font-weight: 500;
}

.right {
  display: flex;
  align-items: center;
}

.author {
  margin-left: 15px;
  color: #999;
  font-size: 12px;
}

.mind-map-container {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
