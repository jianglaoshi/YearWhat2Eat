<script setup lang="ts">
/**
 * 应用外壳（§10）：Header（展示名 VITE_APP_NAME / 主题切换 / 语言切换 / 用户菜单）+ 路由出口。
 * 响应式：窄屏（<=640px）导航文字缩小、品牌名隐藏、header 各区域换行排布，避免拥挤。
 */
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageToggle from '@/components/LanguageToggle.vue'

const appName = import.meta.env.VITE_APP_NAME || '是啊吃什么'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

// 刷新页面后 access token 在内存中丢失：有登录态但无 token 时静默续期（§9.2）
onMounted(() => {
  if (userStore.user && !userStore.accessToken) {
    void userStore.tryRefresh()
  }
})

const navItems = computed(() => [
  { name: 'home', label: t('nav.home') },
  { name: 'dishes', label: t('nav.dishes') },
  // 聊天入口已暂时屏蔽（免费部署资源不足以支撑完整对话链路，见部署文档）
])

const displayName = computed(() => {
  if (!userStore.user) return t('header.notLoggedIn')
  return userStore.user.is_guest
    ? t('header.guestLabel', { id: userStore.user.id })
    : userStore.user.username
})

async function handleLogout() {
  await ElMessageBox.confirm(t('header.logoutConfirmMsg'), t('header.logoutConfirmTitle'), {
    type: 'warning',
  }).catch(() => null)
  userStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <router-link :to="{ name: 'home' }" class="brand">
          <span class="brand-logo">吃</span>
          <span class="brand-name">{{ appName }}</span>
        </router-link>

        <nav class="nav">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="nav-link"
            :class="{ active: route.name === item.name }"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="header-actions">
          <LanguageToggle />
          <ThemeToggle />
          <template v-if="userStore.isLoggedIn">
            <router-link :to="{ name: 'profile' }" class="user-chip">{{ displayName }}</router-link>
            <el-button link type="primary" @click="handleLogout">{{ t('header.logout') }}</el-button>
          </template>
          <template v-else>
            <router-link :to="{ name: 'login' }">
              <el-button type="primary" size="small">{{ t('header.login') }}</el-button>
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <main class="page-container">
      <router-view />
    </main>

    <footer class="app-footer">
      {{ appName }} · 千人千面菜谱推荐 · 数据源 HowToCook
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  width: 100%;
  max-width: min(76%, 1700px);
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

@media (max-width: 1280px) {
  .header-inner {
    max-width: 100%;
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.brand-logo {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: var(--accent);
  color: var(--bg-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.nav {
  display: flex;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.nav-link {
  padding: 6px 12px;
  border-radius: 6px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 15px;
  white-space: nowrap;
}

.nav-link:hover {
  background: var(--bg-hover);
  text-decoration: none;
}

.nav-link.active {
  color: var(--accent);
  font-weight: 600;
  background: var(--bg-hover);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.user-chip {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
}

.user-chip:hover {
  text-decoration: none;
  color: var(--accent);
}

.app-footer {
  margin-top: auto;
  padding: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  border-top: 1px solid var(--border);
}

/* ── 移动端适配（<=640px）─────────────────────────────── */
@media (max-width: 640px) {
  .header-inner {
    padding: 8px 12px;
    gap: 10px;
  }

  /* 窄屏隐藏品牌文字，只留图标，给导航和操作区腾地方 */
  .brand-name {
    display: none;
  }

  .nav {
    order: 3;
    flex-basis: 100%;
    justify-content: space-around;
    gap: 0;
    border-top: 1px solid var(--border);
    padding-top: 6px;
    margin-top: 2px;
  }

  .nav-link {
    padding: 6px 10px;
    font-size: 14px;
  }

  .header-actions {
    gap: 8px;
  }

  .user-chip {
    max-width: 72px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .app-footer {
    padding: 12px 8px;
    font-size: 11px;
  }
}
</style>
