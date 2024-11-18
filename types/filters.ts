export interface FilterOption {
    id: string
    value: string
    label: string
    htmlColor?: string
}

export interface Facet {
    id: string | null
    label: string
    type: 'price' | 'select' | 'radio' | 'color'
    options: FilterOption[]
}

export interface Filter {
    filterName: string
    label?: string
    id: string
}

export interface Category {
    id: number
    name: string
    slug: string
}
