<template>
  <div class="admin-users-container">
    <div class="header">
      <div style="display: flex; align-items: center;">
        <el-button
          icon="el-icon-arrow-left"
          circle
          @click="$router.push('/')"
          style="margin-right: 15px;"
        ></el-button>
        <h2>Gestion des Utilisateurs</h2>
      </div>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
        >Nouvel Utilisateur</el-button
      >
    </div>

    <el-table :data="users" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column
        prop="username"
        label="Nom d'utilisateur"
      ></el-table-column>
      <el-table-column prop="email" label="Email"></el-table-column>
      <el-table-column prop="role" label="Rôle">
        <template slot-scope="scope">
          <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'success'">
            {{ scope.row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)"
            >Éditer</el-button
          >
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >Supprimer</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog Ajouter/Editer -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Mot de passe" prop="password">
          <el-input
            v-model="form.password"
            show-password
            :placeholder="isEdit ? 'Laisser vide si inchangé' : ''"
          ></el-input>
        </el-form-item>
        <el-form-item label="Rôle" prop="role">
          <el-select v-model="form.role" placeholder="Select role">
            <el-option label="Utilisateur" value="user"></el-option>
            <el-option label="Administrateur" value="admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting"
          >Confirmer</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/backend'

export default {
  data() {
    return {
      users: [],
      loading: false,
      dialogVisible: false,
      submitting: false,
      isEdit: false,
      form: {
        id: null,
        username: '',
        email: '',
        password: '',
        role: 'user'
      },
      rules: {
        username: [{ required: true, message: 'Requis', trigger: 'blur' }],
        email: [
          { required: true, message: 'Requis', trigger: 'blur' },
          { type: 'email', message: 'Invalide', trigger: 'blur' }
        ],
        role: [{ required: true, message: 'Requis', trigger: 'change' }]
        // Password rule is dynamic check below
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        const res = await api.getUsers()
        if (res.data.success) {
          this.users = res.data.data.users
        }
      } catch (error) {
        this.$message.error('Erreur chargement utilisateurs')
      } finally {
        this.loading = false
      }
    },
    handleAdd() {
      this.isEdit = false
      this.form = {
        id: null,
        username: '',
        email: '',
        password: '',
        role: 'user'
      }
      this.dialogVisible = true
      if (this.$refs.form) this.$refs.form.resetFields()
    },
    handleEdit(row) {
      this.isEdit = true
      this.form = {
        id: row.id,
        username: row.username,
        email: row.email,
        password: '', // Empty for edit implies no change
        role: row.role
      }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      this.$confirm(
        'Voulez-vous vraiment supprimer cet utilisateur ?',
        'Attention',
        {
          type: 'warning'
        }
      ).then(async () => {
        try {
          await api.deleteUser(row.id)
          this.$message.success('Supprimé')
          this.fetchUsers()
        } catch (error) {
          this.$message.error('Erreur suppression')
        }
      })
    },
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.isEdit && !this.form.password) {
            this.$message.error('Mot de passe requis pour la création')
            return
          }

          this.submitting = true
          try {
            if (this.isEdit) {
              await api.updateUser(this.form.id, this.form)
              this.$message.success('Mis à jour')
            } else {
              await api.createUser(this.form)
              this.$message.success('Créé')
            }
            this.dialogVisible = false
            this.fetchUsers()
          } catch (error) {
            this.$message.error(error.response?.data?.message || 'Erreur')
          } finally {
            this.submitting = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.admin-users-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
