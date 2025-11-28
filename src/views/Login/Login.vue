<template>
  <div
    class="login-container tw-flex tw-min-h-screen tw-flex-col tw-items-center tw-justify-center tw-bg-base tw-px-4 tw-py-12 sm:tw-px-6 lg:tw-px-8"
  >
    <div class="login-title-wrapper tw-mb-8">
      <h1 class="login-title tw-text-5xl tw-font-bold tw-text-light">
        <img src="../../assets//XiaoHang.png" alt="" class="tw-h-12 tw-w-24" />
      </h1>
    </div>
    <div class="login-box-wrapper tw-w-full tw-max-w-md">
      <div
        class="login-box tw-w-full tw-space-y-8 tw-rounded-lg tw-bg-base tw-p-8 tw-shadow-lg"
      >
        <div class="tw-text-center">
          <div
            class="tw-mb-2 tw-flex tw-items-center tw-justify-center tw-gap-3"
          >
            <h2 class="tw-text-3xl tw-font-bold tw-text-light">
              {{ t("login.title") }}
            </h2>
          </div>

          <div class="tw-flex tw-items-center tw-justify-center tw-gap-2">
            <el-icon :size="16">
              <Reading />
            </el-icon>
            <p class="tw-text-light">{{ t("login.description") }}</p>
          </div>
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
              :placeholder="t('login.placeholder.username')"
              :prefix-icon="User"
              size="large"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="t('login.placeholder.password')"
              :prefix-icon="Lock"
              size="large"
              show-password
            ></el-input>
          </el-form-item>

          <div class="tw-flex tw-items-center tw-justify-between">
            <el-checkbox v-model="loginForm.remember">
              {{ t("login.remember") }}
            </el-checkbox>
            <el-link type="primary" :underline="false">
              {{ t("login.forgot") }}
            </el-link>
          </div>

          <div>
            <el-button
              type="primary"
              class="tw-w-full"
              size="large"
              :loading="loading"
              @click="handleLogin(false)"
            >
              {{ t("login.button.login") }}
            </el-button>
          </div>
          <div>
            <el-button
              type="info"
              class="tw-w-full"
              size="large"
              plain
              @click="handleLogin(true)"
            >
              {{ t("login.button.guest") }}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import router from "@/router"
  import { login } from "@/services"
  import { Lock, Reading, User } from "@element-plus/icons-vue"
  import { ElMessage } from "element-plus"
  import { ref } from "vue"
  import { useI18n } from "@/hooks/useI18n"

  const loading = ref(false)
  const { t } = useI18n()
  const loginForm = ref({
    username: "",
    password: "",
    remember: false
  })

  const rules = {
    username: [
      {
        required: true,
        message: t("login.validation.username"),
        trigger: "blur"
      }
    ],
    password: [
      {
        required: true,
        message: t("login.validation.password"),
        trigger: "blur"
      }
    ]
  }

  const loginFormRef = ref()

  const validateForm = async () => {
    if (!loginFormRef.value) return false
    try {
      await loginFormRef.value.validate()
      return true
    } catch (error) {
      return false
    }
  }

  const handleLogin = async (isGuest = false) => {
    if (loading.value) return
    loading.value = true

    try {
      if (!isGuest) {
        const valid = await validateForm()
        if (!valid) return
      }

      const loginInfo = isGuest
        ? { username: "visitor", password: "123456" }
        : loginForm.value
      await login(loginInfo)
      router.push("/")
    } catch (error) {
      ElMessage.error(t("login.message.loginFailed"))
      console.error(error)
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  .login-container {
    position: relative;
    background: linear-gradient(180deg, #dde9ff 0%, #f2f5ff 60%, #e9effa 100%);
    background-size: 400% 400%;
    animation: backgroundFlow 15s ease infinite;
    overflow: hidden;
  }

  .login-title-wrapper {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 16px;
    animation: fadeIn 0.8s ease-out;
    margin-bottom: 30px;
  }

  .title-icon {
    color: #667eea;
    filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.4));
  }

  .login-title {
    position: relative;
    text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
  }

  .welcome-icon {
    color: #667eea;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }

  .login-container::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(102, 126, 234, 0.08) 0%,
      transparent 70%
    );
    animation: rotate 20s linear infinite;
  }

  .login-container::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 50%,
        rgba(118, 75, 162, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(79, 172, 254, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 20%,
        rgba(102, 126, 234, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  .login-box-wrapper {
    position: relative;
    z-index: 1;
    padding: 3px;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 25%,
      #f093fb 50%,
      #4facfe 75%,
      #667eea 100%
    );
    background-size: 400% 400%;

    animation: gradientFlow 3s ease infinite;
    box-sizing: border-box;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  }

  .login-box {
    position: relative;
    width: 100%;
    border-radius: 16px;
    background: var(--el-bg-color);
    box-sizing: border-box;
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

  @keyframes gradientFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes backgroundFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
