import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './AuthContext';
import { watchEffect, h } from 'vue';

export default {
  props: {
    requiredRole: String
  },
  setup(props, { slots }) {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();

    watchEffect(() => {
      if (authStore.loading) {
        return;
      }

      if (!authStore.user) {
        router.push({
          name: 'login',
          query: { from: route.fullPath }
        });
        return;
      }

      if (props.requiredRole && authStore.user.role !== props.requiredRole) {
        router.push('/unauthorized');
        return;
      }
    });

    return () => {
      if (authStore.loading) {
        return h('div', 'Loading...');
      }

      if (!authStore.user ||
          (props.requiredRole && authStore.user.role !== props.requiredRole)) {
        return null;
      }

      return slots.default?.();
    };
  }
};
