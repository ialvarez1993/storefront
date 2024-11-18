<script setup lang="ts">
import {
  SfButton,
  SfLink,
  SfCheckbox,
  SfInput,
  SfLoaderCircular,
} from "@storefront-ui/vue";

definePageMeta({
  layout: false,
});

const { login, loading } = useAuth();

const email = ref("");
const password = ref("");
const rememberMe = ref<boolean>();
const isLoading = ref<boolean>();

const handleLogin = async () => {
  await login({ email: email.value, password: password.value });
};

const NuxtLink = resolveComponent("NuxtLink");
</script>

<template>
  <NuxtLayout name="auth" :heading="$t('auth.login.heading')">
    <div class="login-container">
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label>
            <UiFormLabel class="form-label">{{
              $t("form.emailLabel")
            }}</UiFormLabel>
            <SfInput
              v-model="email"
              name="email"
              autocomplete="email"
              class="input-field"
              placeholder="your@email.com"
            />
          </label>
        </div>

        <div class="form-group">
          <label>
            <UiFormLabel class="form-label">{{
              $t("form.passwordLabel")
            }}</UiFormLabel>
            <UiFormPasswordInput
              v-model="password"
              name="password"
              autocomplete="current-password"
              required
              placeholder="••••••••"
            />
          </label>
        </div>

        <label class="remember-me !hidden">
          <SfCheckbox v-model="rememberMe" name="rememberMe" class="checkbox" />
          <span class="remember-text">{{
            $t("auth.login.rememberMeLabel")
          }}</span>
        </label>

        <SfButton
          type="submit"
          class="submit-button"
          :disabled="isLoading"
          :class="{ 'opacity-70': isLoading }"
        >
          <SfLoaderCircular v-if="isLoading" class="loader" size="sm" />
          <span v-else>
            {{ $t("auth.login.submitLabel") }}
          </span>
        </SfButton>

        <SfButton
          :tag="NuxtLink"
          to="/reset-password"
          variant="tertiary"
          class="forgot-password"
          data-testid="login-page-reset-button"
        >
          {{ $t("auth.login.forgotPasswordLabel") }}
        </SfButton>
      </form>

      <UiAlert class="create-account-banner" variant="neutral">
        <i18n-t tag="span" keypath="auth.login.createAccountBanner">
          <SfLink
            :tag="NuxtLink"
            to="signup"
            variant="primary"
            class="create-account-link"
            data-testid="login-page-signup-button"
          >
            {{ $t("auth.login.createAccountLinkLabel") }}
          </SfLink>
        </i18n-t>
      </UiAlert>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.login-container {
  @apply flex flex-col items-center justify-center min-h-screen w-full max-w-md mx-auto px-4 mt-20;
  background: linear-gradient(to bottom right, #ffffff, #f3f4f6);
}

.login-form {
  @apply w-full bg-white rounded-xl shadow-lg p-8 space-y-6;
  border: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);

  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.input-field {
  @apply w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-yellow-500  focus:ring-yellow-200 transition-all duration-200;

  &:hover {
    @apply border-gray-300;
  }

  &::placeholder {
    @apply text-gray-400;
  }
}

.remember-me {
  @apply flex items-center space-x-2 mt-4;
}

.remember-text {
  @apply text-sm text-gray-600;
}

.checkbox {
  @apply text-yellow-600 focus:ring-yellow-500;
}

.submit-button {
  @apply w-full py-3 px-4 bg-yellow-600 text-white rounded-lg font-medium  focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200;

  &:disabled {
    @apply cursor-not-allowed;
  }
}

.loader {
  @apply mx-auto;
}

.forgot-password {
  @apply w-full text-center text-sm text-gray-600  transition-colors duration-200;
}

.create-account-banner {
  @apply mt-8 w-full bg-gray-50 rounded-lg p-6 text-center;
}

.create-account-link {
  @apply font-medium text-yellow-600  transition-colors duration-200;

  &:hover {
    @apply underline;
  }
}

// Responsive adjustments
@media (max-width: 640px) {
  .login-form {
    @apply p-6;
  }

  .create-account-banner {
    @apply p-4;
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .login-container {
    background: linear-gradient(to bottom right, #1a1a1a, #2d3748);
  }

  .login-form {
    @apply bg-gray-800;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .form-label {
    @apply text-gray-300;
  }

  .input-field {
    @apply bg-gray-700 border-gray-600 text-white;

    &::placeholder {
      @apply text-gray-400;
    }
  }

  .remember-text {
    @apply text-gray-300;
  }

  .forgot-password {
    @apply text-gray-400;
  }

  .create-account-banner {
    @apply bg-gray-800 text-gray-300;
  }
}
</style>
