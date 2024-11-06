<script lang="ts" setup>
import {
  SfButton,
  SfDrawer,
  SfInput,
  SfListItem,
  useDisclosure,
  useTrapFocus,
} from "@storefront-ui/vue";
import { onClickOutside } from "@vueuse/core";
import type { Category } from "~/graphql";

const { isOpen, toggle, close } = useDisclosure();

const menuRef = ref();
const drawerRef = ref();
const formSearchTemplateRef = ref(null);

const {
  searchInputValue,
  highlightedIndex,
  search,
  searchHits,
  selectHit,
  enterPress,
  showResultSearch,
  isSearchModalOpen,
} = useSearch(formSearchTemplateRef);

const router = useRouter();
const NuxtLink = resolveComponent("NuxtLink");
const filteredCategories = inject<Category[]>("filteredTopCategories");

const goTo = (slug: string) => {
  close();
  router.push(slug);
};

useTrapFocus(drawerRef, {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: "container",
});

onClickOutside(menuRef, () => {
  close();
});
</script>

<template>
  <div>
    <div class="bg-black py-2 px-12 text-sm text-white">
      <div class="container mx-auto flex justify-between items-center">
        <span>Envíos gratis a todo Venezuela</span>
        <span>Dólares (USD)</span>
      </div>
    </div>
    <div
      v-if="isOpen || isSearchModalOpen"
      class="fixed bg-black !w-screen !h-screen inset-0 top-index"
    />
    <header
      ref="menuRef"
      class="h-14 md:pb-[6rem] md:h-20 flex z-50 md:sticky md:top-0 md:shadow-md flex-wrap md:flex-nowrap w-full py-2 md:py-5 border-0 bg-white text-black border-neutral-200 md:z-10"
    >
      <div
        class="grid grid-cols-5 items-center justify-center lg:justify-start h-full w-full narrow-container"
      >
        <NuxtLink to="/" aria-label="Homepage">
          <VsfLogo />
        </NuxtLink>
        <div>
          <label
            class="input input-bordered rounded-none flex items-center gap-2"
          >
            <input type="text" className="grow" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
        <div class="flex justify-center grid-cols-2">
          <img
            src="/public/images/icon-contacto-header.webp"
            class="w-9 object-fill"
          />
          <div class="grid grid-cols-1 ml-2">
            <div class="e">Atencion a cliente</div>
            <div>Escribenos / Llamanos</div>
          </div>
        </div>
        <div>
          <a class="flex">
            <span class="">
              <svg
                class="icon-account"
                aria-hidden="true"
                focusable="false"
                role="presentation"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="24"
                viewBox="0 0 18 24"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.267 6a6 6 0 1 1 12 0 6 6 0 1 1-12 0zm6-3.6a3.6 3.6 0 0 0 0 7.2 3.6 3.6 0 0 0 0-7.2zM9.267 15.6a6 6 0 0 0-6 6V24h-2.4v-2.4a8.401 8.401 0 0 1 16.8 0V24h-2.4v-2.4a6 6 0 0 0-6-6z"
                  fill="#000"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.267 6a6 6 0 1 1 12 0 6 6 0 1 1-12 0zm6-3.6a3.6 3.6 0 0 0 0 7.2 3.6 3.6 0 0 0 0-7.2z"
                  fill="#000"
                ></path>
              </svg>
            </span>

            <span class="ml-2"> Mi cuenta </span>
          </a>
        </div>
        <div class="justify-end" bis_skin_checked="1">
          <a class="site-header-cart--button" href="/cart">
            <span class="site-header-cart--count" data-header-cart-count="">
            </span>
            <span class="site-header-cart-icon site-header-cart-icon--svg">
              <svg
                width="30"
                height="29"
                viewBox="0 0 30 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.217 3.44A3.088 3.088 0 0 0 3.186.868H.919A.903.903 0 0 0 0 1.787c0 .52.398.919.919.919h2.297a1.19 1.19 0 0 1 1.194 1.01l1.93 11.73c0 .062 0 .154.03.215l.338 2.083c.306 1.776 1.807 3.063 3.614 3.063H25.39c.52 0 .92-.399.92-.92a.903.903 0 0 0-.92-.918l-15.038-.001a1.839 1.839 0 0 1-1.806-1.532l-.185-1.103h17.672c.428 0 .796-.275.887-.673l2.757-10.474c.06-.275 0-.582-.153-.797-.184-.214-.429-.367-.735-.367H6.31l-.092-.582zm21.378 2.45-2.297 8.637H8.055L6.615 5.89h20.98zM13.782 24.91a3.15 3.15 0 0 0-3.155-3.155c-1.745 0-3.124 1.409-3.124 3.155a3.15 3.15 0 0 0 3.155 3.155c1.746-.001 3.124-1.44 3.124-3.155zm-4.44 0c0-.704.58-1.317 1.316-1.317.735 0 1.318.581 1.318 1.317 0 .705-.582 1.317-1.318 1.317a1.328 1.328 0 0 1-1.317-1.317zM24.287 24.91a3.15 3.15 0 0 0-3.155-3.155 3.15 3.15 0 0 0-3.155 3.155 3.15 3.15 0 0 0 3.155 3.155c1.746-.031 3.155-1.44 3.155-3.155zm-4.44 0c0-.704.58-1.317 1.316-1.317.735 0 1.318.581 1.318 1.317 0 .705-.582 1.317-1.318 1.317a1.328 1.328 0 0 1-1.317-1.317z"
                  fill="#000"
                ></path>
              </svg>
            </span>
          </a>
        </div>
        <div>Carrito</div>
        <div>Ferreteria</div>
        <div>Digital</div>
      </div>
    </header>
  </div>
</template>
