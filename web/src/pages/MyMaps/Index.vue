<template>
  <div class="my-maps-container">
    <div class="header">
      <h2>Mes Cartes Mentales</h2>
      <div class="actions">
        <el-button type="primary" icon="el-icon-plus" @click="createNewMap"
          >Nouvelle Carte</el-button
        >
        <el-button @click="$router.push('/')">Retour à l'éditeur</el-button>
      </div>
    </div>

    <div class="maps-grid" v-loading="loading">
      <el-card
        v-for="map in mindMaps"
        :key="map.uuid"
        class="map-card"
        shadow="hover"
      >
        <div slot="header" class="clearfix">
          <span class="map-title" @click="openMap(map.uuid)">{{
            map.title
          }}</span>
          <el-dropdown
            class="map-actions"
            trigger="click"
            @command="cmd => handleCommand(cmd, map)"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="open">Ouvrir</el-dropdown-item>
              <el-dropdown-item command="share">Partager</el-dropdown-item>
              <el-dropdown-item command="delete" divided style="color: #f56c6c"
                >Supprimer</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="map-info" @click="openMap(map.uuid)">
          <div class="info-item">
            <i class="el-icon-time"></i>
            Modifié le: {{ formatDate(map.updated_at) }}
          </div>
          <div class="info-item" v-if="map.is_public">
            <el-tag size="mini" type="success">Partagé</el-tag>
          </div>
        </div>
      </el-card>

      <div v-if="!loading && mindMaps.length === 0" class="empty-state">
        <el-empty description="Aucune carte mentale trouvée"></el-empty>
      </div>
    </div>

    <!-- Dialog Partage -->
    <el-dialog
      title="Partager la carte"
      :visible.sync="shareDialogVisible"
      width="400px"
    >
      <div v-if="currentMap">
        <p>Lien de partage :</p>
        <el-input v-model="shareUrl" readonly>
          <el-button
            slot="append"
            icon="el-icon-document-copy"
            @click="copyShareUrl"
          ></el-button>
        </el-input>
        <div style="margin-top: 20px">
          <el-switch
            v-model="currentMap.is_public"
            active-text="Public"
            inactive-text="Privé"
            @change="toggleShare"
          >
          </el-switch>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/backend'
import { mapState } from 'vuex'
import exampleData from '@/config/exampleData'

export default {
  data() {
    return {
      mindMaps: [],
      loading: false,
      shareDialogVisible: false,
      currentMap: null,
      shareUrl: ''
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.fetchMaps()
  },
  methods: {
    async fetchMaps() {
      this.loading = true
      try {
        const res = await api.getMyMaps()
        if (res.data.success) {
          this.mindMaps = res.data.data.mindmaps
        }
      } catch (error) {
        this.$message.error('Erreur lors du chargement des cartes')
      } finally {
        this.loading = false
      }
    },
    async createNewMap() {
      try {
        const { value: title } = await this.$prompt(
          'Entrez le titre de la nouvelle carte',
          'Nouvelle Carte',
          {
            confirmButtonText: 'Créer',
            cancelButtonText: 'Annuler'
          }
        )

        if (!title) return

        const res = await api.createMindMap({
          title: title,
          data: exampleData
        })
        if (res.data.success) {
          this.$message.success('Carte créée')
          // Rediriger vers l'éditeur avec l'UUID
          this.$router.push(`/?uuid=${res.data.data.mindmap.uuid}`)
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('Erreur lors de la création')
        }
      }
    },
    openMap(uuid) {
      this.$router.push(`/?uuid=${uuid}`)
    },
    handleCommand(command, map) {
      if (command === 'open') {
        this.openMap(map.uuid)
      } else if (command === 'delete') {
        this.$confirm(
          'Voulez-vous vraiment supprimer cette carte ?',
          'Confirmation',
          {
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler',
            type: 'warning'
          }
        ).then(async () => {
          try {
            await api.deleteMindMap(map.uuid)
            this.$message.success('Carte supprimée')
            this.fetchMaps()
          } catch (error) {
            this.$message.error('Erreur lors de la suppression')
          }
        })
      } else if (command === 'share') {
        this.currentMap = map
        this.shareDialogVisible = true
        if (map.share_token) {
          this.shareUrl = `${window.location.origin}/share/${map.share_token}`
        } else {
          this.shareUrl = ''
        }
      }
    },
    async toggleShare(val) {
      try {
        if (val) {
          // Activer le partage
          const res = await api.shareMindMap(this.currentMap.uuid, true)
          if (res.data.success) {
            this.currentMap.share_token = res.data.data.shareToken
            this.shareUrl = res.data.data.shareUrl
            // Update local URL to full URL
            this.shareUrl = `${window.location.origin}/share/${res.data.data.shareToken}`
            this.$message.success('Partage activé')
          }
        } else {
          // Désactiver
          await api.unshareMindMap(this.currentMap.uuid)
          this.currentMap.share_token = null
          this.shareUrl = ''
          this.$message.success('Partage désactivé')
        }
      } catch (error) {
        this.currentMap.is_public = !val // Revert switch
        this.$message.error('Erreur lors de la modification du partage')
      }
    },
    copyShareUrl() {
      navigator.clipboard.writeText(this.shareUrl).then(() => {
        this.$message.success('Copié !')
      })
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString()
    }
  }
}
</script>

<style scoped>
.my-maps-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.maps-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.map-card {
  width: 300px;
  cursor: pointer;
  transition: transform 0.2s;
}

.map-card:hover {
  transform: translateY(-5px);
}

.map-title {
  font-weight: bold;
  font-size: 16px;
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.map-actions {
  float: right;
  padding: 3px 0;
}

.map-info {
  color: #666;
  font-size: 14px;
}

.info-item {
  margin-bottom: 5px;
}

.empty-state {
  width: 100%;
  text-align: center;
  padding: 50px;
}
</style>
