<!-- TODO: 弹出动画 -->

<template>
  <div class="desktop">
    <div class="wallpaper" 
         :style="{ '--wallpaper-image': `url(${currentWallpaper})` }"
         @click="closeMenu"/>

    <div class="taskbar">
      <div v-bind:class="{ 'start-menu-container': true, 'active': showMenu, 'inactive': !showMenu }">
        <VPNavScreenMenu class="start-menu"/>
      </div>
      
      <!-- 左侧区域 -->
      <div class="taskbar-left">
        <!-- 开始菜单（宽） -->
        <span
          class="start-button button black-white"
          @click.stop="toggleMenu"
        >
          <VPIcon :name="props.start.icon" size="20" />
          <span class="media-only-wide"> {{ props.start.text }} </span>
        </span>        

        <!-- 使用 Plume 的搜索组件 -->
        <VPNavBarSearch v-if="props.searchBox" class="taskbar-search" />
      </div>

      <!-- 右侧区域 -->
      <div class="taskbar-right">
        <VPLink 
          v-for="(action, index) in quickActions" 
          :key="index"
          class="taskbar-action button black-white"
          :title="action.title"
          :no-icon="true"
          @click.prevent="action.handler"
        >
          <VPIcon :name="action.icon" size="16" />
        </VPLink>
        
        <VPSwitchAppearance v-if="props.switchAppearance"/>

        <div v-if="props.timer" class="system-clock black-white">
          <VPIcon name="material-symbols:schedule" size="14" />
          <span>{{ currentTime }}</span>
        </div>
      </div>
    </div>  
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import VPLink from "vuepress-theme-plume/components/VPLink.vue"
import VPNavBarSearch from "vuepress-theme-plume/components/Nav/VPNavBarSearch.vue"
import VPSwitchAppearance from "vuepress-theme-plume/components/VPSwitchAppearance.vue"
import VPNavScreenMenu from "vuepress-theme-plume/components/Nav/VPNavScreenMenu.vue"
import VPIcon from "vuepress-theme-plume/components/VPIcon.vue"

type DeskTopProps = {
  wallpapers: Array<string>,
  start: {
    icon: string,
    text: string,
  },
  searchBox: boolean,
  changeWallpaper: boolean,
  switchAppearance: boolean,
  timer: boolean,
};

const props = defineProps<DeskTopProps>()

const showMenu = ref(false)
const currentTime = ref(getTime())
const currentWallpaper = ref(props.wallpapers[0])

// 快速操作配置
const quickActions = props.changeWallpaper? [
  {
    icon: 'ion:image-outline',
    title: '更换壁纸',
    handler: changeWallpaper,
  },
]: []

// 壁纸切换逻辑

function changeWallpaper() {
  const randomWallpaper = props.wallpapers[
    Math.floor(Math.random() * props.wallpapers.length)
  ]
  currentWallpaper.value = randomWallpaper
  console.log(`change wallpaper to ${currentWallpaper.value}`)
}

// 时钟逻辑
let timer: NodeJS.Timeout
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = getTime()
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'numeric' })
}

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function closeMenu() {
  showMenu.value = false
}
</script>

<style scoped>
.desktop {
  --taskbar-height: 48px;
}

.media-only-narrow {
  display: none !important;

  @media (max-width: 768px) {
    display: flex !important;
  }
}

.media-only-wide {
  @media (max-width: 768px) {
    display: none !important;
  }
}

.wallpaper {
  /* 占满网页 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: var(--taskbar-height);

  background-image: var(--wallpaper-image);
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease; /* 添加过渡动画 */
}

@media (hover: hover){
  /* 在支持悬停的设备上应用样式 */

  .button {
    transition: background 0.3s ease;
  }

  .button:hover {
    background: var(--taskbar-bg-hover);
  }
}

.black-white {
  color: var(--vp-c-text-1);
}

.taskbar {
  --taskbar-bg: var(--vp-c-bg-soft);
  --taskbar-bg-hover: rgba(80, 80, 80, 0.15);
  
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--taskbar-height);
  background: var(--taskbar-bg);
  
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  z-index: 100;

  transition: background 0.3s ease;
}

.taskbar-left, .taskbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.start-button {
  display: flex;
  align-items: center;
  /* gap: 6px; */
  border-radius: 16px;
  padding: 0 12px;
  height: 100%;
  user-select: none;
  font-weight: 750;
}

.taskbar-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.system-clock {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  font-size: 13px;
}

.start-menu-container {
  background: var(--vp-c-bg-soft);
  --menu-width: 500px;
  width: var(--menu-width);
  height: auto;
  max-height: min(calc(var(--menu-width) * 1.5), calc(100vh - var(--taskbar-height) - 8px));
  
  position: fixed;
  bottom: calc(var(--taskbar-height) + 4px);
  left: 4px;
  border-radius: 8px;

  overflow: scroll;
  
  /* 移动端全屏 */
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    width: 100vw;
    max-height: calc(100vh - var(--taskbar-height));
    border-radius: 0;

    bottom: var(--taskbar-height);
  }
}

/* 动画 */
.start-menu-container.inactive {
  max-height: 0;
}

.start-menu-container {
  transition: all 0.3s ease-in-out;
}

.start-menu {
  position: relative;
  scale: 0.96;
}

/* 对 Chrome 浏览器 */
*::-webkit-scrollbar {
width: 4px;
height: 4px;
background: transparent;
}

*::-webkit-scrollbar-thumb {
background: transparent;
border-radius: 4px;
}

*:hover::-webkit-scrollbar-thumb {
background: hsla(0, 0%, 53%, 0.4);
}

*:hover::-webkit-scrollbar-track {
background: transparent;
}
</style>