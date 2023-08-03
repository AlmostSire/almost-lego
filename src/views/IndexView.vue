<template>
  <div class="homepage-container">
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header">
        <div class="page-title">
          <RouterLink to="/">慕课乐高</RouterLink>
        </div>
      </a-layout-header>
      <a-layout-content class="home-layout">
        <RouterView></RouterView>
      </a-layout-content>
      <a-layout-footer>
        © 慕课网（imooc.com）版权所有 | 津ICP备20000929号-2
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style>
.page-title {
  color: #fff;
}
</style>
