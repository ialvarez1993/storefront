import { defineStore } from 'pinia'
import type { Filter, FilterOption, Facet } from '~/types/filters'

export const useFilterStore = defineStore('filters', {
    state: () => ({
        selectedFilters: [] as Filter[],
        priceRange: '',
        sortOrder: 'name-asc',
        openedSections: {} as Record<string, boolean>,
    }),

    actions: {
        toggleFilter(facet: Pick<Facet, 'label'>, option: FilterOption) {
            const filterIndex = this.selectedFilters.findIndex(
                filter => String(filter.label) === String(option.id)
            )

            if (filterIndex !== -1) {
                this.selectedFilters.splice(filterIndex, 1)
            } else {
                this.selectedFilters.push({
                    filterName: facet.label,
                    label: option.id,
                    id: option.value,
                })
            }
        },

        resetFilters() {
            this.selectedFilters = []
            this.priceRange = ''
            this.sortOrder = 'name-asc'
        },

        updateSortOrder(order: string) {
            this.sortOrder = order
        },
    },

    getters: {
        isFilterSelected: (state) => {
            return (option: Partial<FilterOption>): boolean => {
                return state.selectedFilters.some(
                    filter => String(filter.id) === String(option.id)
                )
            }
        },
    },
})
