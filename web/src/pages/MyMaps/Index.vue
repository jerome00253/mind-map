<template>
  <div class="my-maps-container">
    <div class="header">
      <h2>Mes Cartes Mentales</h2>
      <div class="header-right">
        <el-button type="primary" icon="el-icon-plus" @click="createNewMap"
          >Nouvelle Carte</el-button
        >
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
          <div class="info-item" v-if="map.role !== 'owner'">
            <el-tag size="mini" type="warning" effect="dark"
              >Partagé par {{ map.owner_username }}</el-tag
            >
          </div>
        </div>
      </el-card>

      <div v-if="!loading && mindMaps.length === 0" class="empty-state">
        <el-empty description="Aucune carte mentale trouvée"></el-empty>
      </div>
    </div>

    <!-- Dialog Partage -->
    <!-- Dialog Partage -->
    <el-dialog
      title="Partager la carte"
      :visible.sync="shareDialogVisible"
      width="500px"
    >
      <div v-if="currentMap">
        <!-- Section Partage Interne -->
        <!-- Section Partage Interne -->
        <div v-if="currentMap.role === 'owner'" class="share-section">
          <h3>Partager avec des utilisateurs</h3>
          <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <el-select
              v-model="shareUsername"
              filterable
              remote
              reserve-keyword
              placeholder="Chercher un utilisateur..."
              :remote-method="searchUser"
              :loading="searchingUsers"
              @change="verifyUserSelect"
              style="flex: 1"
            >
              <el-option
                v-for="item in foundUsers"
                :key="item.id"
                :label="item.username"
                :value="item.username"
              >
              </el-option>
            </el-select>
            <el-button
              type="primary"
              @click="addUserPermission"
              icon="el-icon-plus"
              :disabled="!shareUsername"
              >Ajouter</el-button
            >
          </div>

          <div v-loading="shareLoading" class="permissions-list">
            <div
              v-for="perm in sharePermissions"
              :key="perm.id"
              class="permission-item"
            >
              <span>{{ perm.username }} ({{ perm.permission }})</span>
              <el-button
                type="text"
                style="color: #f56c6c;"
                icon="el-icon-delete"
                @click="removePermission(perm.id)"
              ></el-button>
            </div>
            <div
              v-if="sharePermissions.length === 0"
              style="color: #999; font-style: italic;"
            >
              Aucun partage actif.
            </div>
          </div>
        </div>
        <div v-else class="share-info">
          <el-alert
            title="Vous n'êtes pas le propriétaire de cette carte, vous ne pouvez pas gérer les partages."
            type="info"
            :closable="false"
          ></el-alert>
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
      shareUrl: '',
      // Sharing UI
      shareUsername: '',
      sharePermissions: [],
      shareLoading: false,
      // User Search
      searchingUsers: false,
      foundUsers: []
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
          this.$router.push(`/edit?uuid=${res.data.data.mindmap.uuid}`)
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('Erreur lors de la création')
        }
      }
    },
    openMap(uuid) {
      this.$router.push(`/edit?uuid=${uuid}`)
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
        this.shareUsername = ''
        // Load default user list
        this.searchUser('')

        if (map.role === 'owner') {
          this.fetchPermissions(map.uuid)
        } else {
          this.sharePermissions = [] // Cannot share if not owner
        }
        // Public Link Logic (Hidden or Secondary)
        if (map.share_token) {
          this.shareUrl = `${window.location.origin}/share/${map.share_token}`
        } else {
          this.shareUrl = ''
        }
      }
    },

    // User Search
    async searchUser(query) {
      this.searchingUsers = true
      try {
        const res = await api.searchUsers(query)
        if (res.data.success) {
          this.foundUsers = res.data.data
        } else {
          this.foundUsers = []
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.searchingUsers = false
      }
    },

    verifyUserSelect() {
      // Optional: confirm selection
    },

    // Permission Management
    async fetchPermissions(uuid) {
      this.shareLoading = true
      try {
        const res = await api.getMapPermissions(uuid)
        if (res.data.success) {
          this.sharePermissions = res.data.data
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.shareLoading = false
      }
    },
    async addUserPermission() {
      if (!this.shareUsername) return
      try {
        await api.addMapPermission(
          this.currentMap.uuid,
          this.shareUsername,
          'edit'
        ) // Default to edit for collaboration
        this.$message.success('Utilisateur ajouté')
        this.shareUsername = ''
        this.fetchPermissions(this.currentMap.uuid)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.$message.error('Utilisateur introuvable')
        } else if (error.response && error.response.status === 400) {
          this.$message.warning(error.response.data.message)
        } else {
          this.$message.error("Erreur lors de l'ajout")
        }
      }
    },
    async removePermission(userId) {
      try {
        await api.removeMapPermission(this.currentMap.uuid, userId)
        this.$message.success('Accès révoqué')
        this.fetchPermissions(this.currentMap.uuid)
      } catch (error) {
        this.$message.error('Erreur')
      }
    },
    // Public Share (Keeping it for now but separate)
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
            this.$message.success('Partage public activé')
          }
        } else {
          // Désactiver
          await api.unshareMindMap(this.currentMap.uuid)
          this.currentMap.share_token = null
          this.shareUrl = ''
          this.$message.success('Partage public désactivé')
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

.permission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f5f7fa;
  margin-bottom: 5px;
  border-radius: 4px;
}
</style>
