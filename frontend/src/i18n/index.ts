/**
 * 多语言（i18n）：中文 / 日本語。
 * 范围说明：门面部分（导航、登录、注册、通用交互提示）已全量覆盖；
 * 菜谱详情、个人中心等更深层页面文案暂保留中文，后续可按需继续补充翻译。
 */
import { createI18n } from 'vue-i18n'

const STORAGE_KEY = 'yeahwhat2eat-locale'

const messages = {
  'zh-CN': {
    nav: {
      home: '推荐',
      dishes: '菜谱',
    },
    header: {
      login: '登录 / 注册',
      logout: '退出',
      logoutConfirmTitle: '提示',
      logoutConfirmMsg: '确定退出登录吗？',
      guestLabel: '游客#{id}',
      notLoggedIn: '未登录',
    },
    login: {
      title: '登录 {name}',
      username: '用户名',
      password: '密码',
      loginBtn: '登录',
      guestBtn: '游客逛逛（数据可随时转正）',
      noAccount: '还没有账号？',
      toRegister: '去注册',
      fillBoth: '请输入用户名和密码',
      loginSuccess: '登录成功',
      guestSuccess: '已进入游客模式',
    },
    register: {
      titleUpgrade: '游客转正',
      titleNormal: '注册',
      username: '用户名',
      password: '密码',
      confirmPassword: '确认密码',
      confirmPlaceholder: '再次输入密码',
      submitUpgrade: '注册并合并游客数据',
      submitNormal: '注册',
      upgradeTip: '当前为游客模式，注册后浏览/收藏/评分等数据将自动合并到新账号',
      hasAccount: '已有账号？',
      toLogin: '去登录',
      fillBoth: '请填写用户名和密码',
      mismatch: '两次密码不一致',
      successUpgrade: '注册成功，游客数据已合并进新账号',
      successNormal: '注册成功',
    },
    dish: {
      searchPlaceholder: '搜索菜名 / 食材',
      difficultyUnknown: '难度未知',
      minutes: '{n} 分钟',
      emptyList: '没有符合条件的菜谱',
      categories: {
        all: '全部',
        vegetable_dish: '素菜',
        meat_dish: '荤菜',
        aquatic: '水产',
        breakfast: '早餐',
        staple: '主食',
        'semi-finished': '半成品',
        soup: '汤粥',
        drink: '饮料',
        condiment: '酱料',
        dessert: '甜品',
      },
    },
    home: {
      heroTitle: '今天吃什么？',
      heroSub: '让 {name} 根据你的口味与食材，配一桌好菜',
      scenes: {
        lateNight: '深夜食堂',
        diet: '减脂餐',
        guests: '招待朋友',
        weekend: '周末大餐',
      },
      peopleLabel: '人数',
      peopleUnit: '{n} 人',
      peopleMore: '5+',
      mealTimeLabel: '餐次',
      // 下面几个 Label 映射的 key 是后端实际使用的中文值（不可改），value 是界面显示文案
      mealLabel: {
        '早餐': '早餐',
        '午餐': '午餐',
        '晚餐': '晚餐',
        '夜宵': '夜宵',
      },
      flavorLabel: {
        '辣': '辣',
        '清淡': '清淡',
        '甜': '甜',
        '酸': '酸',
        '咸鲜': '咸鲜',
      },
      flavorTitle: '口味',
      durationLabel: '时长',
      durations: {
        min15: '15 分钟内',
        min30: '30 分钟内',
        min60: '1 小时内',
        noRush: '不赶时间',
      },
      recommendBtn: '推荐菜单',
      refreshBtn: '换一批',
    },
    common: {
      language: '语言',
    },
  },
  ja: {
    nav: {
      home: 'おすすめ',
      dishes: 'レシピ',
    },
    header: {
      login: 'ログイン / 新規登録',
      logout: 'ログアウト',
      logoutConfirmTitle: '確認',
      logoutConfirmMsg: '本当にログアウトしますか？',
      guestLabel: 'ゲスト#{id}',
      notLoggedIn: '未ログイン',
    },
    login: {
      title: '{name} にログイン',
      username: 'ユーザー名',
      password: 'パスワード',
      loginBtn: 'ログイン',
      guestBtn: 'ゲストとして利用（後でアカウント登録可）',
      noAccount: 'アカウントをお持ちでない方',
      toRegister: '新規登録へ',
      fillBoth: 'ユーザー名とパスワードを入力してください',
      loginSuccess: 'ログインしました',
      guestSuccess: 'ゲストモードで開始しました',
    },
    register: {
      titleUpgrade: 'ゲストから本登録',
      titleNormal: '新規登録',
      username: 'ユーザー名',
      password: 'パスワード',
      confirmPassword: 'パスワード（確認）',
      confirmPlaceholder: 'もう一度パスワードを入力',
      submitUpgrade: '登録してゲストデータを引き継ぐ',
      submitNormal: '登録する',
      upgradeTip: '現在ゲストモードです。登録すると閲覧・お気に入り・評価などのデータが新しいアカウントに自動的に引き継がれます',
      hasAccount: 'すでにアカウントをお持ちの方',
      toLogin: 'ログインへ',
      fillBoth: 'ユーザー名とパスワードを入力してください',
      mismatch: 'パスワードが一致しません',
      successUpgrade: '登録が完了し、ゲストデータを引き継ぎました',
      successNormal: '登録が完了しました',
    },
    dish: {
      searchPlaceholder: 'レシピ名・食材で検索',
      difficultyUnknown: '難易度不明',
      minutes: '{n} 分',
      emptyList: '条件に合うレシピがありません',
      categories: {
        all: 'すべて',
        vegetable_dish: '野菜料理',
        meat_dish: '肉料理',
        aquatic: '魚介類',
        breakfast: '朝食',
        staple: '主食',
        'semi-finished': '半調理品',
        soup: 'スープ・お粥',
        drink: 'ドリンク',
        condiment: '調味料',
        dessert: 'デザート',
      },
    },
    home: {
      heroTitle: '今日は何を食べる？',
      heroSub: '{name} があなたの好みと食材に合わせて、献立を考えます',
      scenes: {
        lateNight: '夜食',
        diet: 'ダイエット食',
        guests: 'おもてなし',
        weekend: '週末のごちそう',
      },
      peopleLabel: '人数',
      peopleUnit: '{n} 人',
      peopleMore: '5人以上',
      mealTimeLabel: '食事の時間帯',
      // key は後端 API が実際に使う中国語の値（変更不可）、value は表示テキスト
      mealLabel: {
        '早餐': '朝食',
        '午餐': '昼食',
        '晚餐': '夕食',
        '夜宵': '夜食',
      },
      flavorLabel: {
        '辣': '辛い',
        '清淡': 'あっさり',
        '甜': '甘い',
        '酸': '酸っぱい',
        '咸鲜': 'うま味',
      },
      flavorTitle: '味の好み',
      durationLabel: '調理時間',
      durations: {
        min15: '15分以内',
        min30: '30分以内',
        min60: '1時間以内',
        noRush: '時間の制限なし',
      },
      recommendBtn: '献立を提案',
      refreshBtn: '他の候補を見る',
    },
    common: {
      language: '言語',
    },
  },
} as const

function detectDefaultLocale(): 'zh-CN' | 'ja' {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'zh-CN' || saved === 'ja') return saved
  return 'zh-CN'
}

const i18n = createI18n({
  legacy: false,
  locale: detectDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages,
})

export function setLocale(locale: 'zh-CN' | 'ja') {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
}

export default i18n
