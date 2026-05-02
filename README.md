<div align="center">

# 🧠 Sexy Brain

**中文名「大脑蚕」(bushi)**

*尊重前额叶,养成 21 世纪最性感的大脑。*
*AI 在烧 token,人类在烧前额叶。*

[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![three.js](https://img.shields.io/badge/three.js-r184-000000?logo=threedotjs&logoColor=white)](https://threejs.org)

</div>

一个交互式 3D 大脑图谱 + 前额叶训练小游戏,帮用户练习**注意力控制**、**情绪调节**、**工作记忆**与**抑制控制**。

---

## 📖 产品概述

**核心概念** —— 把脑科学(前额叶训练)与《杀戮尖塔》Roguelike 卡牌机制结合起来,做成一个浏览器即开即用的认知训练网站。

**目标用户** —— 想提升专注力、工作记忆、认知灵活性的人群:学生、职场打工人、ADHD 倾向者……

**产品特色**

| | |
|---|---|
| 🧪 **硬核且科学** | 基于经典认知心理学范式(Stroop、N-Back 等) |
| 🎮 **游戏化多巴胺** | Roguelike 爬塔路线 · 卡牌构筑 · 遗物系统 |
| 📊 **即时与长效反馈** | 局内积分实时反馈 + 局外用户数据可视化追踪 |
| 🔬 **原理透明化** | 每个挑战背后的神经科学机制可一键查看 |

---

## 🧩 核心架构与模块划分

系统分为四个主要模块,当前进度:

| 模块 | 内容 | 状态 |
|---|---|---|
| **① 3D 表现层** _The Shell_ | 首页 3D 大脑交互、剖切、脑区高亮 | ✅ 已完成 |
| **② 核心测评系统** _The Assessment_ | 新用户 3 阶段基准测试,生成前额叶战力雷达图 | 🚧 待开发 |
| **③ Roguelike 引擎** _The Core_ | 地图生成、状态管理、卡牌与积分结算 | 🚧 待开发 |
| **④ 小游戏库** _The Mini-games_ | 具体的认知训练任务模块 | 🔄 待迭代 |

> 当前发布版本对应**模块 ①** 的全部能力,以及**模块 ③/④** 的早期原型(神经回路地图 + 30 张静态训练卡)。

---

## ✨ 已实现功能

### 主页 · 3D 大脑图谱

- 加载 `public/brain.glb` 真实人脑模型(缺失时自动降级为占位球体)
- 鼠标悬停 / 点击高亮脑区,变金色
- 透明度滑块 · 剖切平面(矢状面 / 水平面 / 冠状面)+ 剖切位置滑块
- 缩放 · 全屏 · 自动旋转

### 训练游戏层(原型)

入口:主页右下角 **▶ START TRAINING**。

| 屏幕 | 说明 |
|---|---|
| **StartScreen** | 沉浸式开场 |
| **ModuleSelect** | 5 个训练模块卡片(注意力 / 情绪 / 记忆 / 抑制 / Boss),数据见 [src/game/data/cards.ts](src/game/data/cards.ts) |
| **NeuralMap** | 每个模块 6 个节点的神经回路图,SVG 路径动画 + 节点逐级解锁 |
| **CardDetail** | 抽卡详情(触发句 / 怎么做 / 再选择) |
| **Reward** | 完成奖励页,XP + 桑叶币 + 称号变化 |
| **ShareCard** | 雷达图分享卡片 |

> 玩家进度通过 `localStorage` 持久化,无需账号。

### 主题系统

右上角浮层切换按钮(z-100,所有界面通用),深色 ↔ 浅色米色双主题。三维场景通过 `MutationObserver` 监听 `data-theme`,实时同步切换 contact shadow 与默认 mesh 颜色。

---

## 🧰 技术栈

| | |
|---|---|
| 构建 / 框架 | **Vite 6** · **React 19** · **TypeScript** |
| 样式 | **Tailwind CSS v4**(`@theme` token + `data-theme` 切换) |
| 3D 渲染 | **three.js** · **@react-three/fiber** · **@react-three/drei** |
| 动画 | **motion**(Framer Motion v12) |
| 图标 | **lucide-react** |

---

## 📁 项目结构

```
src/
├── App.tsx                     # 主页(3D 大脑图谱)
├── main.tsx                    # 根入口,挂载 App + GameRoot + ThemeToggle
├── index.css                   # Tailwind + 主题 token 定义
│
├── components/
│   ├── BrainCanvas.tsx         # three.js 场景,加载 brain.glb
│   ├── Navbar.tsx              # 顶部 Logo + tagline
│   ├── RightControls.tsx       # 右侧控制面板(缩放 / 剖切 / 全屏)
│   └── ThemeToggle.tsx         # 浮层主题切换按钮
│
├── lib/
│   └── useTheme.ts             # 主题 hook,localStorage 持久化
│
└── game/
    ├── GameRoot.tsx            # 游戏屏幕路由
    ├── PlayerContext.tsx       # 玩家状态 Context
    ├── ErrorBoundary.tsx       # 错误捕获 + 兜底背景
    │
    ├── data/
    │   ├── cards.ts            # 5 个模块 + 30 张训练卡
    │   └── playerState.ts      # 进度 / 称号 / 奖励规则
    │
    ├── screens/
    │   ├── StartScreen.tsx
    │   ├── ModuleSelect.tsx
    │   ├── NeuralMap.tsx
    │   ├── CardDetail.tsx
    │   └── Reward.tsx
    │
    └── components/
        ├── TopBar.tsx          # 游戏内顶部进度条
        └── ShareCard.tsx       # 雷达图分享弹窗
```

---

## 🚀 本地开发

**前置环境:** Node.js 20+

```bash
git clone https://github.com/Sanyuexi-JoyceChen/Sexy-Brain.git
cd Sexy-Brain
npm install
npm run dev          # http://localhost:3000
```

**其他常用命令:**

```bash
npm run build        # 生产构建 → dist/
npm run preview      # 预览生产构建
npm run lint         # tsc --noEmit 类型检查
npm run clean        # 删除 dist
```

---

<div align="center">

**用前额叶训练前额叶。**

</div>
