<template>
  <div class="login-container">
    <el-card class="login-card">
      <div slot="header" class="clearfix">
        <span class="title">Connexion Simple Mind Map</span>
      </div>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Votre email"></el-input>
        </el-form-item>
        <el-form-item label="Mot de passe" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="Votre mot de passe"
            @keyup.enter.native="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            :loading="loading"
            style="width: 100%"
            >Se connecter</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
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
            message: 'Veuillez entrer votre mot de passe',
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
    ...mapActions(['login']),
    async onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            await this.login(this.form)
            this.$message.success('Connexion réussie')
            this.$router.push('/my-maps')
          } catch (error) {
            this.$message.error(
              error.response?.data?.message || 'Erreur de connexion'
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
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
