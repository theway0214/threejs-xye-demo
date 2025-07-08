<script lang="ts" setup>
import { ref } from 'vue'

const menuList = ref([
  {
    name: '物体贴图',
    path: '/object',
  },
  {
    name: '环境贴图',
    path: '/environment',
  },
  {
    name: '阴影 + 光照',
    path: '/shadow',
  },
  {
    name: '开门',
    path: '/open-door',
  },
])
</script>
<template>
  <div class="menu-view">
    <div class="menu-item" v-for="item in menuList" :key="item.path">
      <router-link :to="item.path" class="menu-link">
        <span class="menu-text">{{ item.name }}</span>
      </router-link>
    </div>
  </div>
</template>
<style scoped lang="less">
.menu-view {
  padding: 24px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
}
.menu-item {
  width: 140px;
  height: 140px;
  background: #fff;
  border-radius: 16px;
  margin-bottom: 0;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  &:hover {
    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.16);
    transform: translateY(-4px) scale(1.04);
  }
  &:active {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
    transform: scale(0.98);
  }
}
.menu-link {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.menu-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}
.menu-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
@media (max-width: 600px) {
  .menu-view {
    gap: 12px;
  }
  .menu-item {
    width: 90vw;
    height: 90vw;
    max-width: 180px;
    max-height: 180px;
  }
}
</style>
