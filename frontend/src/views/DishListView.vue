<script setup lang="ts">
/** 菜谱浏览（§10）：分类 Tab + 难度/口味筛选 + 搜索 + 分页卡片。 */
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiDishList, type DishSummary } from '@/api/dishes'
import DishCard from '@/components/DishCard.vue'

const { t } = useI18n()

// value 是传给后端的实际分类值（不随语言变化），label 随语言切换（走 i18n）
const categoryValues = ['', 'vegetable_dish', 'meat_dish', 'aquatic', 'breakfast', 'staple', 'semi-finished', 'soup', 'drink', 'condiment', 'dessert']
const categories = computed(() =>
  categoryValues.map((value) => ({
    value,
    label: t(`dish.categories.${value || 'all'}`),
  })),
)

const category = ref('')
const keyword = ref('')
const page = ref(1)
const pageSize = 24
const total = ref(0)
const dishes = ref<DishSummary[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const resp = await apiDishList({
      category: category.value || undefined,
      keyword: keyword.value || undefined,
      page: page.value,
      page_size: pageSize,
    })
    const data = resp as { items?: DishSummary[]; total?: number } | DishSummary[]
    if (Array.isArray(data)) {
      dishes.value = data
      total.value = data.length
    } else {
      dishes.value = data.items ?? []
      total.value = data.total ?? 0
    }
  } finally {
    loading.value = false
  }
}

watch([category, keyword], () => {
  page.value = 1
  void load()
})
watch(page, () => void load())

onMounted(() => void load())
</script>

<template>
  <div class="dish-list-view">
    <div class="toolbar">
      <el-radio-group v-model="category" class="cats">
        <el-radio-button v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</el-radio-button>
      </el-radio-group>
      <el-input v-model="keyword" :placeholder="t('dish.searchPlaceholder')" clearable style="width: 220px" />
    </div>

    <div v-loading="loading" class="grid">
      <DishCard v-for="d in dishes" :key="d.dish_id" :dish="d" />
    </div>

    <el-pagination
      v-if="total > pageSize"
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      class="pager"
    />
    <el-empty v-if="!loading && dishes.length === 0" :description="t('dish.emptyList')" />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.cats {
  flex-wrap: wrap;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 14px;
  min-height: 120px;
}

.pager {
  margin-top: 16px;
  justify-content: center;
}
/* ── 移动端适配（<=640px）─────────────────────────────── */
@media (max-width: 640px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar :deep(.el-input) {
    width: 100% !important;
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
}
</style>
