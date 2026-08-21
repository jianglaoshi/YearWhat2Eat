<script setup lang="ts">
/**
 * 登录页（§9.2）：用户名密码 + 游客模式（决策 4 ✅）；登录后按 redirect 跳转。
 * 响应式：窄屏卡片宽度改为撑满（留边距），避免在手机上显得过窄或被裁切。
 */
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const appName = import.meta.env.VITE_APP_NAME || '是啊吃什么'

const username = ref('')
const password = ref('')
const loading = ref(false)

async function onLogin() {
  if (!username.value || !password.value) {
    ElMessage.warning(t('login.fillBoth'))
    return
  }
  loading.value = true
  try {
    await userStore.login(username.value, password.value)
    ElMessage.success(t('login.loginSuccess'))
    router.push(String(route.query.redirect || '/'))
  } catch {
    /* 拦截器已提示 */
  } finally {
    loading.value = false
  }
}

async function onGuest() {
  loading.value = true
  try {
    await userStore.guest()
    ElMessage.success(t('login.guestSuccess'))
    router.push(String(route.query.redirect || '/'))
  } catch {
    /* 拦截器已提示 */
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-wrap">
    <el-card class="auth-card">
      <h2 class="title">{{ t('login.title', { name: appName }) }}</h2>
      <el-form label-position="top" @submit.prevent>
        <el-form-item :label="t('login.username')">
          <el-input v-model="username" :placeholder="t('login.username')" autocomplete="username" />
        </el-form-item>
        <el-form-item :label="t('login.password')">
          <el-input
            v-model="password"
            type="password"
            show-password
            :placeholder="t('login.password')"
            autocomplete="current-password"
            @keyup.enter="onLogin"
          />
        </el-form-item>
        <el-button type="primary" class="full" :loading="loading" @click="onLogin">
          {{ t('login.loginBtn') }}
        </el-button>
        <el-button class="full" :loading="loading" @click="onGuest">
          {{ t('login.guestBtn') }}
        </el-button>
      </el-form>
      <div class="foot">
        {{ t('login.noAccount') }}
        <router-link :to="{ name: 'register', query: route.query }">{{ t('login.toRegister') }}</router-link>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.auth-wrap {
  display: flex;
  justify-content: center;
  padding-top: 48px;
}

.auth-card {
  width: 360px;
}

.title {
  margin: 0 0 16px;
  color: var(--text-primary);
}

.full {
  width: 100%;
  margin-bottom: 10px;
}

.foot {
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
}

/* ── 移动端适配（<=640px）─────────────────────────────── */
@media (max-width: 640px) {
  .auth-wrap {
    padding: 24px 12px 0;
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
  }
}
</style>
