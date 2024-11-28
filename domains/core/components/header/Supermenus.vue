<script lang="ts" setup>
import { ref } from "vue";
import "primeicons/primeicons.css";
import type { Category } from "~/graphql";

const filteredCategories = inject<Category[]>("filteredTopCategories");

const items = ref([
  {
    label: "headerCatalog.homeImprovementStore",
    icon: "pi pi-building",
    root: true,
    items: [
      [
        {
          items: [
            {
              label: "superMenu.titleMain1",
              icon: "pi pi-star",
              subtext: "kjikj",
              link1: "/category/20",
              link2: "/category/21",
              link3: "/category/22",
              link4: "/category/23",
              link5: "/category/24",
              title1: "superMenu.title1Main1",
              title2: "superMenu.title2Main1",
              title3: "superMenu.title3Main1",
              title4: "superMenu.title4Main1",
              title5: "superMenu.title5Main1",
            },
          ],
        },
      ],
      [
        {
          items: [
            {
              label: "superMenu.titleMain3",
              icon: "pi pi-compass",
              subtext: "Industry-specific solutions",
              link1: "/category/45",
              link2: "/category/41",
              link3: "/category/43",
              link4: "/category/44",
              link5: "/category/45",
              title1: "superMenu.title1Main3",
              title2: "superMenu.title2Main3",
              title3: "superMenu.title3Main3",
              title4: "superMenu.title4Main3",
              title5: "superMenu.title5Main3",
              link: "/clutches",
            },
          ],
        },
      ],
      [
        {
          items: [
            {
              label: "superMenu.titleMain2",
              icon: "pi pi-users",
              title1: "superMenu.title1Main2",
              title2: "superMenu.title2Main2",
              title3: "superMenu.title3Main2",
              title4: "superMenu.title4Main2",
              title5: "superMenu.title5Main2",
              link1: "/category/31",
              link2: "/category/32",
              link3: "/category/33",
              link4: "/category/34",
              link5: "/category/35",
              subtext: "Success stories & testimonials",
              link: "/sneakers",
            },
          ],
        },
      ],
      [
        {
          items: [
            {
              image: "/images/lavadora.png",
              label: "superMenu.detailsSuperMenuButton",
              subtext: "superMenu.detailsSuperMenu",
            },
          ],
        },
      ],
    ],
  },
]);
</script>

<style scoped>
.mega-menu-wrapper {
  --primary-color: #ffc107;
  --primary-light: #ffc107;
}

.custom-megamenu {
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.root-item {
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.root-item:hover {
  background-color: #f3f4f6;
  color: #000000;
}

.menu-item:hover {
  background-color: #d7d9db;
  transform: translateX(4px);
  border-radius: 1rem;
}

.menu-item:hover .icon-wrapper {
  background-color: var(--primary-color);
  color: white;
}

.custom-button {
  border: none;
  background: linear-gradient(45deg,
      var(--primary-color),
      var(--primary-light));
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
}

.promo-item {
  transition: all 0.3s ease;
}

.promo-item:hover {
  transform: translateY(-4px);
}
</style>

<template>
  <div class="mega-menu-wrapper">
    <MegaMenu :model="items" class="!border-none !text-black !border-transparent !static">
      <template #item="{ item }">
        <!-- Root Menu Items -->
        <a v-if="item.root"
          class="root-item group/hovero flex items-center cursor-pointer px-6 py-[0.5rem] overflow-hidden relative">
          <i v-if="item.icon" :class="[
            item.icon,
            'mr-2 !text-black group-hover/hovero:!text-[#FFC107] text-xl ',
          ]"></i>
          <span class="font-medium !text-black group-hover/hovero:!text-[#FFC107] hover:text-teal-50">
            {{ $t(item.label) }}
          </span>
          <i class="pi !text-black pi-chevron-down ml-2 group-hover/hovero:!text-[#FFC107] text-sm"></i>
        </a>

        <!-- Regular Menu Items -->
        <a v-else-if="!item.image"
          class="menu-item !bg-black/5 flex items-center p-4 cursor-pointer mb-2 gap-3 transition-all duration-200">
          <span
            class="icon-wrapper inline-flex items-center justify-center rounded-xl bg-primary/10 text-primary w-12 h-12 transition-all duration-200">
            <i :class="[item.icon, 'text-xl']"></i>
          </span>
          <span class="inline-flex flex-col gap-1">
            <span class="font-bold text-lg text-black hover:text-primary transition-colors duration-200">
              {{ $t(item.label) }}
            </span>
            <!-- Lista de Links -->
            <ul>
              <NuxtLink :to="item.link1">
                <li v-if="item.title1" class="text-gray-600 py-1 hover:text-yellow-500 text-sm">
                  {{ $t(item.title1) }}
                </li>
              </NuxtLink>
              <NuxtLink :to="item.link2">
                <li :to="item.link2" v-if="item.title2" class="text-gray-600 py-1 hover:text-yellow-500 text-sm">
                  {{ $t(item.title2) }}
                </li>
              </NuxtLink>
              <NuxtLink :to="item.link3">
                <li :to="item.link3" v-if="item.title3" class="text-gray-600 py-1 text-sm hover:text-yellow-500">
                  {{ $t(item.title3) }}
                </li>
              </NuxtLink>
              <NuxtLink :to="item.link4">
                <li :to="item.link4" v-if="item.title4" class="text-gray-600 py-1 text-sm hover:text-yellow-500">
                  {{ $t(item.title4) }}
                </li>
              </NuxtLink>

              <NuxtLink class="py-14" :to="item.link5">
                <li :to="item.link5" v-if="item.title5" class="text-gray-600 py-1 text-sm hover:text-yellow-500">
                  {{ $t(item.title5) }}
                </li>
              </NuxtLink>
            </ul>
          </span>
        </a>

        <!-- Image Items -->
        <div v-else class="promo-item flex flex-col items-start gap-4 p-4 rounded-xl bg-gray-50">
          <div class="relative w-full overflow-hidden rounded-lg">
            <NuxtImg :src="item.image"
              class="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300" />
          </div>
          <span class="text-gray-700">{{ $t(item.subtext) }}</span>
          <Button :label="$t(item.label)" class="custom-button w-full justify-center" severity="primary" raised>
            <template #icon>
              <i class="pi pi-arrow-right ml-2"></i>
            </template>
          </Button>
        </div>
      </template>
    </MegaMenu>
  </div>
</template>
