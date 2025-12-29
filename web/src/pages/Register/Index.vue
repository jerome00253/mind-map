<template>
  <div class="register-container">
    <el-card class="register-card">
      <div slot="header" class="clearfix">
        <span class="title">Inscription Simple Mind Map</span>
      </div>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="Nom d'utilisateur" prop="username">
          <el-input v-model="form.username" placeholder="Pseudo"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Email"></el-input>
        </el-form-item>
        <el-form-item label="Mot de passe" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="Mot de passe"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            :loading="loading"
            style="width: 100%"
            >S'inscrire</el-button
          >
        </el-form-item>
      </el-form>
      <div class="footer">
        <router-link to="/login">Déjà un compte ? Se connecter</router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: "Veuillez choisir un nom d'utilisateur",
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: 'Veuillez entrer votre email',
            trigger: 'blur'
          },
          { type: 'email', message: 'Email invalide', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: 'Veuillez choisir un mot de passe',
            trigger: 'blur'
          },
          {
            min: 6,
            message: 'Le mot de passe doit contenir au moins 6 caractères',
            trigger: 'blur'
          }
        ]
      },
      loading: false
    }
  },
  methods: {
    ...mapActions(['register']),
    async onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            await this.register(this.form)
            this.$message.success('Inscription réussie')
            this.$router.push('/')
          } catch (error) {
            this.$message.error(
              error.response?.data?.message || "Erreur d'inscription"
            )
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.footer {
  text-align: center;
  margin-top: 20px;
}
</style>
