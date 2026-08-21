<script setup lang="ts">
/**
 * 注册页（§9.2）：游客转正优先（upgrade 合并游客数据，决策 4 ✅），否则普通注册。
 * 响应式：窄屏卡片宽度改为撑满（留边距），与登录页保持一致。
 */
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const username = ref('')
const password = ref('')
const confirm = ref('')
const loading = ref(false)

const isGuestUpgrade = computed(() => userStore.isGuest)

async function onRegister() {
  if (!username.value || !password.value) {
    ElMessage.warning(t('register.fillBoth'))
    return
  }
  if (password.value !== confirm.value) {
    ElMessage.warning(t('register.mismatch'))
    return
  }
  loading.value = true
  try {
    if (isGuestUpgrade.value) {
      await userStore.upgrade(username.value, password.value)
      ElMessage.success(t('register.successUpgrade'))
    } else {
      await userStore.register(username.value, password.value)
      ElMessage.success(t('register.successNormal'))
    }
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
      <h2 class="title">{{ isGuestUpgrade ? t('register.titleUpgrade') : t('register.titleNormal') }}</h2>
      <el-alert
        v-if="isGuestUpgrade"
        type="info"
        :closable="false"
        class="tip"
        :title="t('register.upgradeTip')"
      />
      <el-form label-position="top" @submit.prevent>
        <el-form-item :label="t('register.username')">
          <el-input v-model="username" :placeholder="t('register.username')" autocomplete="username" />
        </el-form-item>
        <el-form-item :label="t('register.password')">
          <el-input
            v-model="password"
            type="password"
            show-password
            :placeholder="t('register.password')"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item :label="t('register.confirmPassword')">
          <el-input
            v-model="confirm"
            type="password"
            show-password
            :placeholder="t('register.confirmPlaceholder')"
            autocomplete="new-password"
            @keyup.enter="onRegister"
          />
        </el-form-item>
        <el-button type="primary" class="full" :loading="loading" @click="onRegister">
          {{ isGuestUpgrade ? t('register.submitUpgrade') : t('register.submitNormal') }}
        </el-button>
      </el-form>
      <div class="foot">
        {{ t('register.hasAccount') }}
        <router-link :to="{ name: 'login', query: route.query }">{{ t('register.toLogin') }}</router-link>
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

.tip {
  margin-bottom: 12px;
}

.full {
  width: 100%;
}

.foot {
  margin-top: 12px;
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
