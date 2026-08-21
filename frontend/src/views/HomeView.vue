<script setup lang="ts">
/**
 * 推荐首页：Hero 大标题 + 场景快捷入口 + 人性化标签选项（人数/餐次/口味/时长）
 * + 规则推荐结果（§10：无 LLM、毫秒级——千人千面规则打分 + 荤素规划，菜单卡片 + 参考菜谱）
 * + 页面加载默认自动推荐一次（无"大家喜欢"热门流）。
 *
 * i18n 说明：mealTime / flavors 等发给后端的值必须保持中文原值不变（后端按中文匹配），
 * 页面上只对"显示文案"做多语言映射（home.mealLabel / home.flavorLabel，key=中文值，value=显示文案）。
 */
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Refresh, MagicStick } from '@element-plus/icons-vue'
import { apiRuleRecommend, type MenuPlan, type SourceRef } from '@/api/chat'
import MenuCard from '@/components/MenuCard.vue'
import SourceCard from '@/components/SourceCard.vue'

const { t, tm } = useI18n()
const appName = import.meta.env.VITE_APP_NAME || '是啊吃什么'

// ── 场景快捷入口（4 个，需求 4）：build() 里的中文值直接喂给后端，不受语言切换影响 ──
const scenes = computed(() => [
  { label: t('home.scenes.lateNight'), emoji: '🌙', build: () => ({ people: 1, mealTime: '夜宵', maxTime: 20, flavors: [] as string[] }) },
  { label: t('home.scenes.diet'), emoji: '🥗', build: () => ({ people: 1, mealTime: '晚餐', maxTime: 30, flavors: ['清淡'] }) },
  { label: t('home.scenes.guests'), emoji: '🥂', build: () => ({ people: 4, mealTime: '晚餐', maxTime: 120, flavors: [] as string[] }) },
  { label: t('home.scenes.weekend'), emoji: '🍲', build: () => ({ people: 3, mealTime: '晚餐', maxTime: 90, flavors: ['辣'] }) },
])

// ── 标签式选项（人性化）：内部值保持中文，仅显示文案走 i18n ──
const people = ref(2)
const mealTime = ref('晚餐')
const flavors = ref<string[]>([])
const maxTime = ref(30)
const mealOptions = ['早餐', '午餐', '晚餐', '夜宵']
const flavorOptions = ['辣', '清淡', '甜', '酸', '咸鲜']
const timeOptions = computed(() => [
  { label: t('home.durations.min15'), value: 15 },
  { label: t('home.durations.min30'), value: 30 },
  { label: t('home.durations.min60'), value: 60 },
  { label: t('home.durations.noRush'), value: 0 },
])

function mealLabel(v: string): string {
  const map = tm('home.mealLabel') as Record<string, string>
  return map[v] ?? v
}

function flavorLabel(v: string): string {
  const map = tm('home.flavorLabel') as Record<string, string>
  return map[v] ?? v
}

const loading = ref(false)
const plan = ref<MenuPlan | null>(null)
const reason = ref('')
const sources = ref<SourceRef[]>([])

function applyScene(build: () => { people: number; mealTime: string; maxTime: number; flavors: string[] }) {
  const s = build()
  people.value = s.people
  mealTime.value = s.mealTime
  maxTime.value = s.maxTime
  flavors.value = [...s.flavors]
  void recommend()
}

function toggleFlavor(f: string, checked: boolean) {
  if (checked) {
    if (!flavors.value.includes(f)) flavors.value.push(f)
  } else {
    flavors.value = flavors.value.filter((x) => x !== f)
  }
}

/** 规则推荐（§10，无 LLM）：千人千面规则打分 + 荤素规划，毫秒级；diversity=true 换一批 */
async function recommend() {
  loading.value = true
  plan.value = null
  reason.value = ''
  sources.value = []
  try {
    const result = await apiRuleRecommend({
      people: people.value,
      meal_time: mealTime.value,
      flavors: flavors.value,
      max_time_min: maxTime.value,
      diversity: isRefresh.value, // 换一批：探索采样（§10）
    })
    plan.value = result.plan
    reason.value = result.reason
    sources.value = result.sources
  } finally {
    loading.value = false
  }
}

/** 换一批（§10）：同约束下 diversity 探索采样，产出不同菜单 */
const isRefresh = ref(false)

async function refresh() {
  isRefresh.value = true
  try {
    await recommend()
  } finally {
    isRefresh.value = false
  }
}

// 页面加载默认自动推荐一次（§10：规则推荐毫秒级，打开即有结果）
onMounted(() => void recommend())
</script>

<template>
  <div class="home-view">
    <!-- Hero 区（需求 4：更美观、更人性化） -->
    <section class="hero">
      <h1 class="hero-title">{{ t('home.heroTitle') }}</h1>
      <p class="hero-sub">{{ t('home.heroSub', { name: appName }) }}</p>
      <div class="scene-row">
        <button
          v-for="s in scenes"
          :key="s.label"
          class="scene-chip"
          :disabled="loading"
          @click="applyScene(s.build)"
        >
          <span class="scene-emoji">{{ s.emoji }}</span>{{ s.label }}
        </button>
      </div>
    </section>

    <!-- 人性化选项 -->
    <section class="ask-card app-card">
      <div class="opt-row">
        <span class="opt-label">{{ t('home.peopleLabel') }}</span>
        <el-radio-group v-model="people">
          <el-radio-button v-for="n in [1, 2, 3, 4]" :key="n" :value="n">{{ t('home.peopleUnit', { n }) }}</el-radio-button>
          <el-radio-button :value="5">{{ t('home.peopleMore') }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="opt-row">
        <span class="opt-label">{{ t('home.mealTimeLabel') }}</span>
        <el-radio-group v-model="mealTime">
          <el-radio-button v-for="m in mealOptions" :key="m" :value="m">{{ mealLabel(m) }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="opt-row">
        <span class="opt-label">{{ t('home.flavorTitle') }}</span>
        <el-check-tag
          v-for="f in flavorOptions"
          :key="f"
          :checked="flavors.includes(f)"
          class="flavor-chip"
          @change="(checked: boolean) => toggleFlavor(f, checked)"
        >
          {{ flavorLabel(f) }}
        </el-check-tag>
      </div>
      <div class="opt-row">
        <span class="opt-label">{{ t('home.durationLabel') }}</span>
        <el-radio-group v-model="maxTime">
          <el-radio-button v-for="opt in timeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="opt-actions">
        <el-button type="primary" size="large" :loading="loading" @click="recommend">
          <el-icon><MagicStick /></el-icon>{{ t('home.recommendBtn') }}
        </el-button>
        <el-button size="large" :disabled="!plan" @click="refresh">
          <el-icon><Refresh /></el-icon>{{ t('home.refreshBtn') }}
        </el-button>
      </div>
    </section>

    <!-- 推荐结果（规则推荐 §10：菜单卡片 + 推荐理由 + 参考菜谱，毫秒级） -->
    <section v-if="plan" class="result">
      <MenuCard :plan="plan" />
      <p v-if="reason" class="reason">{{ reason }}</p>
      <SourceCard v-if="sources.length" :items="sources" />
    </section>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Hero：大标题 + 场景入口 */
.hero {
  text-align: center;
  padding: 28px 16px 8px;
}

.hero-title {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  color: var(--text-strong);
  letter-spacing: 1px;
}

.hero-sub {
  margin: 8px 0 20px;
  color: var(--text-secondary);
  font-size: 15px;
}

.scene-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.scene-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.scene-chip:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.scene-chip:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.scene-emoji {
  font-size: 16px;
}

/* 选项区 */
.opt-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  flex-wrap: wrap;
}

.opt-label {
  min-width: 44px;
  font-size: 14px;
  color: var(--text-secondary);
}

.flavor-chip {
  margin-right: 8px;
}

.opt-actions {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
}

/* 结果区 */
.result {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.reason {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}
/* ── 移动端适配（<=640px）─────────────────────────────── */
@media (max-width: 640px) {
  .hero {
    padding: 16px 8px 4px;
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-sub {
    font-size: 13px;
    margin: 6px 0 14px;
  }

  .scene-chip {
    padding: 6px 12px;
    font-size: 13px;
  }

  .opt-row {
    gap: 8px;
  }

  .opt-actions {
    flex-direction: column;
  }

  .opt-actions .el-button {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>
