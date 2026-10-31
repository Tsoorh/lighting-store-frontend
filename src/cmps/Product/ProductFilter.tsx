import React, { useState, useEffect, useMemo } from 'react'
import type { FullProduct, ProductFilterCriteria, hebrewEnglishObj } from '../../model/product.model'
import { PRODUCT_OPTIONS } from '../../constants/product.constants'
import { useLanguage } from '../../hooks/useLanguage'
import { Icons } from '../Icons'
import { optionsService } from '../../services/options.service'
import '../../assets/styles/cmps/ProductFilter.css'

interface ProductFilterProps {
    filters: ProductFilterCriteria
    onFilterChange: (newFilters: ProductFilterCriteria) => void
    onResetFilters: () => void
    products: FullProduct[]
    filteredCount: number
    totalCount: number
    currentCategory: string
    sortOrder: string
    onSortChange: (order: string) => void
    showPriceFilter?: boolean
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
    filters,
    onFilterChange,
    onResetFilters,
    products,
    filteredCount,
    totalCount,
    currentCategory,
    sortOrder,
    onSortChange,
    showPriceFilter = false
}) => {
    const { language } = useLanguage()
    const isEn = language === 'en'

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    // All accordions start collapsed / closed by default
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

    // Dynamic socket options state loaded from database
    const [dynamicScrewTypes, setDynamicScrewTypes] = useState<string[]>([])

    useEffect(() => {
        let isMounted = true
        async function loadSocketOptions() {
            try {
                const opts = await optionsService.getSocketOptions()
                if (isMounted && opts && Array.isArray(opts.screwTypes)) {
                    setDynamicScrewTypes(opts.screwTypes)
                }
            } catch (err) {
                console.warn('Failed to load dynamic socket options, using fallbacks', err)
            }
        }
        loadSocketOptions()

        const onSocketOptionsChanged = (e: Event) => {
            const detail = (e as CustomEvent).detail
            if (detail && Array.isArray(detail.screwTypes) && isMounted) {
                setDynamicScrewTypes(detail.screwTypes)
            }
        }
        window.addEventListener('socket-options-changed', onSocketOptionsChanged)
        return () => {
            isMounted = false
            window.removeEventListener('socket-options-changed', onSocketOptionsChanged)
        }
    }, [])

    // Close drawer on Escape key
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsDrawerOpen(false)
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Prevent background scrolling while drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isDrawerOpen])

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Toggle multi-select array field
    const handleToggleFilter = (field: 'category' | 'material' | 'woodType' | 'screwType', value: string) => {
        const currentList = filters[field] || []
        const isSelected = currentList.includes(value)
        const updatedList = isSelected 
            ? currentList.filter(item => item !== value)
            : [...currentList, value]

        onFilterChange({
            ...filters,
            [field]: updatedList.length > 0 ? updatedList : undefined
        })
    }

    // Handle search text change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const txt = e.target.value
        onFilterChange({
            ...filters,
            txt: txt.trim() !== '' ? txt : undefined
        })
    }

    // Handle price range change
    const handlePriceChange = (min?: number, max?: number) => {
        onFilterChange({
            ...filters,
            minPrice: min,
            maxPrice: max
        })
    }

    // Calculate active filters count for badge
    const activeFiltersCount = useMemo(() => {
        let count = 0
        if (filters.txt) count += 1
        if (filters.category && filters.category.length > 0) count += filters.category.length
        if (filters.material && filters.material.length > 0) count += filters.material.length
        if (filters.woodType && filters.woodType.length > 0) count += filters.woodType.length
        if (filters.screwType && filters.screwType.length > 0) count += filters.screwType.length
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count += 1
        return count
    }, [filters])

    // Dynamic screw types: combined from database options and products
    const availableScrewTypes = useMemo(() => {
        const set = new Set<string>()
        // 1. Add from dynamic DB options if available
        if (dynamicScrewTypes.length > 0) {
            dynamicScrewTypes.forEach(t => set.add(t.trim()))
        } else {
            PRODUCT_OPTIONS.SCREW_TYPES.forEach(t => set.add(t.trim()))
        }
        // 2. Add any screwType that exists on the current loaded products
        products.forEach(p => {
            if (p.socketType?.screwType && p.socketType.screwType.trim()) {
                set.add(p.socketType.screwType.trim())
            }
        })
        return Array.from(set).filter(Boolean)
    }, [dynamicScrewTypes, products])

    // Facet item counts based on loaded category products
    const facetCounts = useMemo(() => {
        const counts: Record<string, number> = {}

        products.forEach(p => {
            // Categories
            p.category?.forEach(c => {
                const enKey = `cat_${c.en.toLowerCase()}`
                counts[enKey] = (counts[enKey] || 0) + 1
            })

            // Materials
            p.material?.forEach(m => {
                const enKey = `mat_${m.en.toLowerCase()}`
                counts[enKey] = (counts[enKey] || 0) + 1
            })

            // Wood Types from woodType array and price list
            const seenWoods = new Set<string>()
            p.woodType?.forEach(w => seenWoods.add(w.en.toLowerCase()))
            p.price?.forEach(pr => {
                if (pr.wood?.en) seenWoods.add(pr.wood.en.toLowerCase())
            })
            seenWoods.forEach(w => {
                counts[`wood_${w}`] = (counts[`wood_${w}`] || 0) + 1
            })
        })

        return counts
    }, [products])

    // Helper counts
    const getMaterialCount = (enName: string) => {
        return facetCounts[`mat_${enName.toLowerCase()}`] || 0
    }

    const getWoodCount = (enName: string) => {
        const key = enName.toLowerCase()
        if (key === 'oak') {
            return (facetCounts['wood_oak'] || 0) + (facetCounts['wood_oak/american walnut'] || 0)
        }
        if (key === 'american walnut') {
            return (facetCounts['wood_american walnut'] || 0) + (facetCounts['wood_oak/american walnut'] || 0)
        }
        return facetCounts[`wood_${key}`] || 0
    }

    // Strict exact count equality - no substring leakage
    const getScrewCount = (screw: string) => {
        const target = screw.trim().toLowerCase()
        return products.filter(p => {
            const st = (p.socketType?.screwType || '').trim().toLowerCase()
            return st === target
        }).length
    }

    const getCategoryCount = (enName: string) => {
        const key = enName.toLowerCase()
        if (key === 'hanging' || key === 'pendant') {
            return (facetCounts['cat_hanging'] || 0) + (facetCounts['cat_pendant'] || 0)
        }
        return facetCounts[`cat_${key}`] || 0
    }

    // Category options list for the "all" category view (Accessories removed!)
    const categoryOptions: hebrewEnglishObj[] = [
        { en: 'Hanging', he: 'גופי תאורה תלויים' },
        { en: 'Wall', he: 'גופי תאורה לקיר' },
        { en: 'Ceiling', he: 'גופי תאורה צמודי תקרה' }
    ]

    const isAllCategory = currentCategory.toLowerCase() === 'all'

    // Visible category options (only show options with matching products > 0 or already selected)
    const visibleCategories = categoryOptions.filter(cat => {
        const isChecked = filters.category?.includes(cat.en) || false
        return isChecked || getCategoryCount(cat.en) > 0
    })

    // Visible material options (only show materials with products > 0 or already selected)
    const visibleMaterials = PRODUCT_OPTIONS.MATERIALS.filter(mat => {
        const isChecked = filters.material?.includes(mat.en) || false
        return isChecked || getMaterialCount(mat.en) > 0
    })

    // Visible wood options (only show wood types with products > 0 or already selected)
    const visibleWoodTypes = PRODUCT_OPTIONS.WOOD_TYPES.filter(wood => {
        const isChecked = filters.woodType?.includes(wood.en) || false
        return isChecked || getWoodCount(wood.en) > 0
    })

    // Visible socket / bulb options (only show sockets with products > 0 in current category or already selected)
    const visibleScrewTypes = availableScrewTypes.filter(screw => {
        const isChecked = filters.screwType?.includes(screw) || false
        return isChecked || getScrewCount(screw) > 0
    })

    return (
        <div className={`product-filter-container ${isEn ? 'ltr' : 'rtl'}`}>
            {/* Main Unified Toolbar */}
            <div className="filter-toolbar">
                <div className="filter-toolbar-controls">
                    {/* Search Input */}
                    <div className="filter-search-box">
                        <span className="search-icon" aria-hidden="true">
                            <Icons iconName="search" />
                        </span>
                        <input
                            type="text"
                            placeholder={isEn ? 'Search lighting...' : 'חיפוש גוף תאורה...'}
                            value={filters.txt || ''}
                            onChange={handleSearchChange}
                            aria-label={isEn ? 'Search by name or description' : 'חיפוש לפי שם או תיאור'}
                        />
                        {filters.txt && (
                            <button
                                type="button"
                                className="clear-search-btn"
                                onClick={() => onFilterChange({ ...filters, txt: undefined })}
                                aria-label={isEn ? 'Clear search' : 'נקה חיפוש'}
                            >
                                <Icons iconName="close" />
                            </button>
                        )}
                    </div>

                    {/* Unified Filter Button (Opens Slide-over Drawer) */}
                    <button
                        type="button"
                        className={`filter-trigger-btn ${activeFiltersCount > 0 ? 'active' : ''}`}
                        onClick={() => setIsDrawerOpen(true)}
                        aria-label={isEn ? 'Open filters' : 'פתח מסננים'}
                    >
                        <Icons iconName="filter" />
                        <span>{isEn ? 'Filter' : 'סינון'}</span>
                        {activeFiltersCount > 0 && (
                            <span className="pill-badge">{activeFiltersCount}</span>
                        )}
                    </button>

                    {/* Sort Dropdown (Right next to Filter Button) */}
                    <div className="filter-sort-select-wrapper">
                        <label htmlFor="categorySortOrder">{isEn ? 'Sort:' : 'מיון:'}</label>
                        <select
                            id="categorySortOrder"
                            value={sortOrder}
                            onChange={(e) => onSortChange(e.target.value)}
                            aria-label={isEn ? 'Sort products' : 'מיון מוצרים'}
                        >
                            <option value="name-asc">{isEn ? 'Name: A-Z' : 'שם: א-ת'}</option>
                            <option value="name-desc">{isEn ? 'Name: Z-A' : 'שם: ת-א'}</option>
                            {showPriceFilter && (
                                <>
                                    <option value="price-asc">{isEn ? 'Price: Low to High' : 'מחיר: מהנמוך לגבוה'}</option>
                                    <option value="price-desc">{isEn ? 'Price: High to Low' : 'מחיר: מהגבוה לנמוך'}</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {/* Right Side: Result Count */}
                <div className="filter-right-controls">
                    <span className="filter-results-counter">
                        {isEn 
                            ? `Showing ${filteredCount} of ${totalCount}` 
                            : `מציג ${filteredCount} מתוך ${totalCount}`}
                    </span>
                </div>
            </div>

            {/* Active Filter Chips Bar */}
            {activeFiltersCount > 0 && (
                <div className="active-filter-chips-bar">
                    <span className="active-chips-label">{isEn ? 'Active Filters:' : 'מסננים פעילים:'}</span>

                    <div className="chips-list">
                        {/* Search Query Chip */}
                        {filters.txt && (
                            <span className="filter-chip">
                                <span>"{filters.txt}"</span>
                                <button
                                    type="button"
                                    onClick={() => onFilterChange({ ...filters, txt: undefined })}
                                    aria-label={isEn ? 'Remove search filter' : 'הסר חיפוש'}
                                >
                                    <Icons iconName="close" />
                                </button>
                            </span>
                        )}

                        {/* Category Chips */}
                        {filters.category?.map(catEn => {
                            const opt = categoryOptions.find(c => c.en === catEn)
                            return (
                                <span key={catEn} className="filter-chip">
                                    <span>{opt ? (isEn ? opt.en : opt.he) : catEn}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleFilter('category', catEn)}
                                        aria-label={isEn ? `Remove category ${catEn}` : `הסר קטגוריה`}
                                    >
                                        <Icons iconName="close" />
                                    </button>
                                </span>
                            )
                        })}

                        {/* Material Chips */}
                        {filters.material?.map(matEn => {
                            const opt = PRODUCT_OPTIONS.MATERIALS.find(m => m.en === matEn)
                            return (
                                <span key={matEn} className="filter-chip">
                                    <span>{opt ? (isEn ? opt.en : opt.he) : matEn}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleFilter('material', matEn)}
                                        aria-label={isEn ? `Remove material ${matEn}` : `הסר חומר`}
                                    >
                                        <Icons iconName="close" />
                                    </button>
                                </span>
                            )
                        })}

                        {/* Wood Type Chips */}
                        {filters.woodType?.map(woodEn => {
                            const opt = PRODUCT_OPTIONS.WOOD_TYPES.find(w => w.en === woodEn)
                            return (
                                <span key={woodEn} className="filter-chip">
                                    <span>{opt ? (isEn ? opt.en : opt.he) : woodEn}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleFilter('woodType', woodEn)}
                                        aria-label={isEn ? `Remove wood ${woodEn}` : `הסר עץ`}
                                    >
                                        <Icons iconName="close" />
                                    </button>
                                </span>
                            )
                        })}

                        {/* Screw Type Chips */}
                        {filters.screwType?.map(screw => (
                            <span key={screw} className="filter-chip">
                                <span>{screw}</span>
                                <button
                                    type="button"
                                    onClick={() => handleToggleFilter('screwType', screw)}
                                    aria-label={isEn ? `Remove socket ${screw}` : `הסר סוג נורה`}
                                >
                                    <Icons iconName="close" />
                                </button>
                            </span>
                        ))}

                        {/* Price Range Chip */}
                        {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                            <span className="filter-chip">
                                <span>
                                    ₪{filters.minPrice ?? 0} - ₪{filters.maxPrice ?? '∞'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handlePriceChange(undefined, undefined)}
                                    aria-label={isEn ? 'Remove price filter' : 'הסר סינון מחיר'}
                                >
                                    <Icons iconName="close" />
                                </button>
                            </span>
                        )}

                        {/* Reset All Button */}
                        <button
                            type="button"
                            className="clear-all-chips-btn"
                            onClick={onResetFilters}
                        >
                            {isEn ? 'Clear All' : 'נקה הכל'}
                        </button>
                    </div>
                </div>
            )}

            {/* Slide-Over Filter Drawer (Unified for Desktop and Mobile) */}
            {isDrawerOpen && (
                <div className="filter-drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
                    <div 
                        className={`filter-drawer-content ${isEn ? 'ltr' : 'rtl'}`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="drawer-header">
                            <div className="drawer-header-title">
                                <h3>{isEn ? 'Filter Lighting' : 'סינון גופי תאורה'}</h3>
                                {activeFiltersCount > 0 && (
                                    <span className="pill-badge">{activeFiltersCount}</span>
                                )}
                            </div>
                            <button
                                type="button"
                                className="close-drawer-btn"
                                onClick={() => setIsDrawerOpen(false)}
                                aria-label={isEn ? 'Close filter drawer' : 'סגור תפריט סינון'}
                            >
                                <Icons iconName="close" />
                            </button>
                        </div>

                        {/* Drawer Scrollable Body */}
                        <div className="drawer-body">
                            {/* 1. Price Range Accordion (FIRST when visible) */}
                            {showPriceFilter && (
                                <div className="drawer-accordion-section">
                                    <button
                                        type="button"
                                        className="accordion-header"
                                        onClick={() => toggleSection('price')}
                                        aria-expanded={!!expandedSections.price}
                                    >
                                        <span>{isEn ? 'Price Range (₪)' : 'טווח מחירים (₪)'}</span>
                                        <span className="accordion-arrow">{expandedSections.price ? '−' : '+'}</span>
                                    </button>
                                    {expandedSections.price && (
                                        <div className="accordion-content price-inputs-row">
                                            <div className="price-input-group">
                                                <label>{isEn ? 'From' : 'מ-'}</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    value={filters.minPrice ?? ''}
                                                    onChange={(e) => handlePriceChange(e.target.value ? +e.target.value : undefined, filters.maxPrice)}
                                                />
                                            </div>
                                            <div className="price-input-group">
                                                <label>{isEn ? 'To' : 'עד'}</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="10000"
                                                    value={filters.maxPrice ?? ''}
                                                    onChange={(e) => handlePriceChange(filters.minPrice, e.target.value ? +e.target.value : undefined)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 2. Category Accordion (When browsing "All") */}
                            {isAllCategory && visibleCategories.length > 0 && (
                                <div className="drawer-accordion-section">
                                    <button
                                        type="button"
                                        className="accordion-header"
                                        onClick={() => toggleSection('category')}
                                        aria-expanded={!!expandedSections.category}
                                    >
                                        <span>{isEn ? 'Category' : 'קטגוריה'}</span>
                                        <span className="accordion-arrow">{expandedSections.category ? '−' : '+'}</span>
                                    </button>
                                    {expandedSections.category && (
                                        <div className="accordion-content">
                                            {visibleCategories.map(cat => {
                                                const isChecked = filters.category?.includes(cat.en) || false
                                                return (
                                                    <label key={cat.en} className="filter-option-row">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleToggleFilter('category', cat.en)}
                                                        />
                                                        <span className="option-name">{isEn ? cat.en : cat.he}</span>
                                                        <span className="option-count">({getCategoryCount(cat.en)})</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 3. Material Accordion */}
                            {visibleMaterials.length > 0 && (
                                <div className="drawer-accordion-section">
                                    <button
                                        type="button"
                                        className="accordion-header"
                                        onClick={() => toggleSection('material')}
                                        aria-expanded={!!expandedSections.material}
                                    >
                                        <span>{isEn ? 'Material' : 'חומר'}</span>
                                        <span className="accordion-arrow">{expandedSections.material ? '−' : '+'}</span>
                                    </button>
                                    {expandedSections.material && (
                                        <div className="accordion-content">
                                            {visibleMaterials.map(mat => {
                                                const isChecked = filters.material?.includes(mat.en) || false
                                                return (
                                                    <label key={mat.en} className="filter-option-row">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleToggleFilter('material', mat.en)}
                                                        />
                                                        <span className="option-name">{isEn ? mat.en : mat.he}</span>
                                                        <span className="option-count">({getMaterialCount(mat.en)})</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 4. Wood Finish Accordion */}
                            {visibleWoodTypes.length > 0 && (
                                <div className="drawer-accordion-section">
                                    <button
                                        type="button"
                                        className="accordion-header"
                                        onClick={() => toggleSection('woodType')}
                                        aria-expanded={!!expandedSections.woodType}
                                    >
                                        <span>{isEn ? 'Wood Finish' : 'סוג עץ'}</span>
                                        <span className="accordion-arrow">{expandedSections.woodType ? '−' : '+'}</span>
                                    </button>
                                    {expandedSections.woodType && (
                                        <div className="accordion-content">
                                            {visibleWoodTypes.map(wood => {
                                                const isChecked = filters.woodType?.includes(wood.en) || false
                                                return (
                                                    <label key={wood.en} className="filter-option-row">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleToggleFilter('woodType', wood.en)}
                                                        />
                                                        <span className="option-name">{isEn ? wood.en : wood.he}</span>
                                                        <span className="option-count">({getWoodCount(wood.en)})</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 5. Dynamic Socket / Bulb Accordion (Strict exact matching) */}
                            {visibleScrewTypes.length > 0 && (
                                <div className="drawer-accordion-section">
                                    <button
                                        type="button"
                                        className="accordion-header"
                                        onClick={() => toggleSection('screwType')}
                                        aria-expanded={!!expandedSections.screwType}
                                    >
                                        <span>{isEn ? 'Socket / Bulb' : 'סוג נורה'}</span>
                                        <span className="accordion-arrow">{expandedSections.screwType ? '−' : '+'}</span>
                                    </button>
                                    {expandedSections.screwType && (
                                        <div className="accordion-content">
                                            {visibleScrewTypes.map(screw => {
                                                const isChecked = filters.screwType?.includes(screw) || false
                                                return (
                                                    <label key={screw} className="filter-option-row">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleToggleFilter('screwType', screw)}
                                                        />
                                                        <span className="option-name">{screw}</span>
                                                        <span className="option-count">({getScrewCount(screw)})</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Drawer Sticky Footer Actions */}
                        <div className="drawer-footer">
                            <button
                                type="button"
                                className="drawer-reset-btn"
                                onClick={onResetFilters}
                            >
                                {isEn ? 'Clear All' : 'נקה הכל'}
                            </button>
                            <button
                                type="button"
                                className="drawer-apply-btn"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                {isEn ? `Show ${filteredCount} items` : `הצג ${filteredCount} פריטים`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
