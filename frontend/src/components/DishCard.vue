<script setup lang="ts">
/** 菜谱卡片（§10 组件）：名称/分类/难度星标/时长/口味标签，点击进详情。 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Clock, StarFilled } from '@element-plus/icons-vue'
import type { DishSummary } from '@/api/dishes'
import FlavorTags from './FlavorTags.vue'

const props = defineProps<{ dish: DishSummary }>()
const { t } = useI18n()

const difficulty = computed(() => props.dish.difficulty ?? 0)
const flavorList = computed(() => props.dish.flavors ?? [])
const categoryLabel = computed(() => t(`dish.categories.${props.dish.category}`))
</script>

<template>
  <router-link :to="{ name: 'dish-detail', params: { id: dish.dish_id } }" class="dish-card">
    <div class="card-head">
      <span class="name">{{ dish.name }}</span>
      <span class="category">{{ categoryLabel }}</span>
    </div>
    <div class="card-meta">
      <span class="diff">
        <el-icon><StarFilled v-for="i in difficulty" :key="i" /></el-icon>
        <span v-if="difficulty === 0" class="diff-empty">{{ t('dish.difficultyUnknown') }}</span>
      </span>
      <span v-if="dish.time_est" class="time">
        <el-icon><Clock /></el-icon>{{ t('dish.minutes', { n: dish.time_est }) }}
      </span>
    </div>
    <FlavorTags :flavors="flavorList" :limit="3" />
  </router-link>
</template>

<style scoped>
.dish-card {
  display: block;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  text-decoration: none;
  color: var(--text-primary);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.dish-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
  text-decoration: none;
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.category {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.card-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.diff .el-icon {
  color: var(--warning);
}

.time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
