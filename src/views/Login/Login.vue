<template>
  <div
    class="login-container tw-flex tw-min-h-screen tw-items-center tw-justify-center tw-bg-base tw-px-4 tw-py-12 sm:tw-px-6 lg:tw-px-8"
  >
    <div
      class="login-box tw-w-full tw-max-w-md tw-space-y-8 tw-rounded-lg tw-bg-base tw-p-8 tw-shadow-lg"
    >
      <div class="tw-text-center">
        <h2 class="tw-mb-2 tw-text-3xl tw-font-bold tw-text-light">欢迎回来</h2>
        <p class="tw-text-light">登录后开始您的博客运维</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        class="tw-space-y-6"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            :prefix-icon="User"
            size="large"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          ></el-input>
        </el-form-item>

        <div class="tw-flex tw-items-center tw-justify-between">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码？</el-link>
        </div>

        <div>
          <el-button
            type="primary"
            class="tw-w-full"
            size="large"
            :loading="loading"
            @click="handleLogin(false)"
            >登录</el-button
          >
        </div>
        <div>
          <el-button
            type="info"
            class="tw-w-full"
            size="large"
            plain
            @click="handleLogin(true)"
            >游客访问</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import router from "@/router"
  import { login } from "@/services"
  import { Lock, User } from "@element-plus/icons-vue"
  import { ElMessage } from "element-plus"
  import { ref } from "vue"

  const loading = ref(false)
  const loginForm = ref({
    username: "",
    password: "",
    remember: false
  })

  const rules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }]
  }

  const loginFormRef = ref()

  const handleLogin = async (isGuest?: boolean) => {
    loading.value = true

    loginFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true
        try {
          const loginInfo = isGuest
            ? { username: "visitor", password: "123456" }
            : loginForm.value
          await login(loginInfo)
          router.push("/")
        } catch (error) {
          ElMessage.error("登录失败")
          console.error(error)
        } finally {
          loading.value = false
        }
      }
    })
  }
</script>

<style scoped>
  .login-container {
    background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  }

  .login-box {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
