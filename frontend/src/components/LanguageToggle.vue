<script setup lang="ts">
/** 语言切换器（中文 / 日本語），风格与 ThemeToggle 保持一致。 */
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

const { locale, t } = useI18n()

const options = [
  { value: 'zh-CN', label: '中文' },
  { value: 'ja', label: '日本語' },
]

function onChange(value: string) {
  setLocale(value as 'zh-CN' | 'ja')
}
</script>

<template>
  <el-select
    :model-value="locale"
    size="small"
    class="lang-select"
    :aria-label="t('common.language')"
    @change="onChange"
  >
    <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
  </el-select>
</template>

<style scoped>
.lang-select {
  width: 96px;
}
</style>
