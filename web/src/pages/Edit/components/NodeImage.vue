<template>
  <el-dialog
    class="nodeImageDialog"
    :title="$t('nodeImage.title')"
    :visible.sync="dialogVisible"
    :width="isMobile ? '90%' : '600px'"
    :top="isMobile ? '20px' : '15vh'"
  >
    <div class="title">{{ $t('nodeImage.method1') }}</div>
    <ImgUpload
      ref="ImgUpload"
      v-model="img"
      style="margin-bottom: 12px;"
    ></ImgUpload>
    <div class="title">{{ $t('nodeImage.method2') }}</div>
    <div class="inputBox">
      <span class="label">{{ $t('nodeImage.urlLabel') }}</span>
      <el-input
        v-model="imgUrl"
        size="mini"
        placeholder="http://xxx.com/xx.jpg"
        @keydown.native.stop
      ></el-input>
    </div>
    <div class="title">{{ $t('nodeImage.optional') }}</div>
    <div class="inputBox">
      <span class="label">{{ $t('nodeImage.imgTitle') }}</span>
      <el-input v-model="imgTitle" size="mini" @keydown.native.stop></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('dialog.cancel') }}</el-button>
      <el-button type="primary" @click="confirm">{{
        $t('dialog.confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ImgUpload from '@/components/ImgUpload/index.vue'
import { getImageSize, isMobile } from 'simple-mind-map/src/utils/index'
import api from '@/api/backend'

// 节点图片内容设置
export default {
  components: {
    ImgUpload
  },
  data() {
    return {
      dialogVisible: false,
      img: '',
      imgUrl: '',
      imgTitle: '',
      activeNodes: null,
      isMobile: isMobile()
    }
  },
  created() {
    this.$bus.$on('node_active', this.handleNodeActive)
    this.$bus.$on('showNodeImage', this.handleShowNodeImage)
  },
  beforeDestroy() {
    this.$bus.$off('node_active', this.handleNodeActive)
    this.$bus.$off('showNodeImage', this.handleShowNodeImage)
  },
  methods: {
    handleNodeActive(...args) {
      this.activeNodes = [...args[1]]
    },

    handleShowNodeImage() {
      this.reset()
      if (this.activeNodes.length > 0) {
        let firstNode = this.activeNodes[0]
        let img = firstNode.getImageUrl() || ''
        if (img) {
          if (/^https?:\/\//.test(img)) {
            this.imgUrl = img
          } else {
            this.img = img
          }
        }
        this.imgTitle = firstNode.getData('imageTitle') || ''
      }
      this.dialogVisible = true
    },

    cancel() {
      this.dialogVisible = false
      this.reset()
    },

    reset() {
      this.img = ''
      this.imgTitle = ''
      this.imgUrl = ''
    },

    async confirm() {
      try {
        // 删除图片
        if (!this.img && !this.imgUrl) {
          this.cancel()
          this.activeNodes.forEach(node => {
            node.setImage(null)
          })
          return
        }

        let imgUrl = ''
        let width = 100
        let height = 100

        if (this.img) {
          // If we have a base64/blob from ImgUpload
          // We need to get the actual file object.
          // Since ImgUpload doesn't expose it directly in v-model (it emits base64),
          // we can access it via ref or we need to modify ImgUpload.
          // Looking at ImgUpload.vue: selectImg(file) sets this.file = file.
          // So we can access `this.$refs.ImgUpload.file`.

          const file = this.$refs.ImgUpload.file
          if (file) {
            try {
              const res = await api.uploadFile(file)
              if (res.data.success) {
                // Construct absolute URL if needed, or relative
                // The backend returns '/uploads/filename.ext'
                // The backend returns '/uploads/filename.ext'
                // In production (and dev with proxy), we can just use the relative path.
                // The browser will resolve it against the current origin.
                imgUrl = res.data.url
              } else {
                this.$message.error('Upload failed')
                return
              }
            } catch (e) {
              console.error(e)
              this.$message.error('Upload error')
              return
            }
          } else {
            // Fallback if file not found (should not happen if img is set via file input)
            imgUrl = this.img
          }

          const res = await this.$refs.ImgUpload.getSize()
          width = res.width
          height = res.height
        } else if (this.imgUrl) {
          imgUrl = this.imgUrl
          const res = await getImageSize(imgUrl)
          width = res.width
          height = res.height
        }

        this.activeNodes.forEach(node => {
          node.setImage({
            url: imgUrl || 'none',
            title: this.imgTitle,
            width: width || 100,
            height: height || 100
          })
        })
        this.cancel()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nodeImageDialog {
  .title {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .inputBox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .label {
      width: 150px;
    }
  }
}
</style>
