<template>
  <div class="tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item v-track="trackConfig.loginButton">
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { TrackEventEnum } from "@/directives/track"
  import router from "@/router"
  import { login } from "@/services"
  import { useAppStore } from "@/stores/app"
  import { ref } from "vue"

  // 统一管理埋点配置
  const trackConfig = {
    loginButton: {
      event: TrackEventEnum.USER_LOGIN,
      properties: {
        user: "",
        event: "用户登录",
        time: new Date().toISOString()
      }
    }
  }

  const loginForm = ref({
    username: "",
    password: ""
  })

  const rules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }]
  }
  const loginFormRef = ref()
  // const router =useRouter()
  const handleLogin = async () => {
    loginFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        try {
          await login(loginForm.value)
          useAppStore().$patch({ userInfo: loginForm.value })
          console.log("登录成功")
          router.push("/")
        } catch (error) {
          console.error(error)
        }
      } else {
        console.log("登录失败，请检查输入")
      }
    })
  }
</script>

<style scoped></style>
