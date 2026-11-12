import React, { useState, useEffect } from 'react'
import type { SocketOptionCategory, SocketOptions } from '../../model/options.model'
import { optionsService } from '../../services/options.service'

interface SocketOptionsEditorProps {
    screwType: string
    lightType: string
    isEn: boolean
    onSocketChange: (field: 'screwType' | 'lightType', value: string) => void
}

const SOCKET_FIELDS: Array<{
    category: SocketOptionCategory
    field: 'screwType' | 'lightType'
    optionsKey: 'screwTypes' | 'lightTypes'
    labelEn: string
    labelHe: string
    addNewEn: string
    addNewHe: string
    placeholderEn: string
    placeholderHe: string
}> = [
    {
        category: 'screw',
        field: 'screwType',
        optionsKey: 'screwTypes',
        labelEn: 'Screw Type',
        labelHe: 'סוג הברגה',
        addNewEn: '+ Add new screw type...',
        addNewHe: '+ הוסף סוג הברגה חדש...',
        placeholderEn: 'e.g. E14, GU5.3',
        placeholderHe: 'לדוגמה: E14, GU5.3'
    },
    {
        category: 'light',
        field: 'lightType',
        optionsKey: 'lightTypes',
        labelEn: 'Light Type',
        labelHe: 'סוג נורה',
        addNewEn: '+ Add new light type...',
        addNewHe: '+ הוסף סוג נורה חדש...',
        placeholderEn: 'e.g. LED - Max 12W',
        placeholderHe: 'לדוגמה: LED - Max 12W'
    }
]

export const SocketOptionsEditor: React.FC<SocketOptionsEditorProps> = ({
    screwType,
    lightType,
    isEn,
    onSocketChange
}) => {
    const [socketOptions, setSocketOptions] = useState<SocketOptions>(optionsService.getDefaultOptions())
    const [inlineAddType, setInlineAddType] = useState<SocketOptionCategory | null>(null)
    const [newOptionValue, setNewOptionValue] = useState('')
    const [isAddingOption, setIsAddingOption] = useState(false)
    const [showManageOptions, setShowManageOptions] = useState(false)
    const [optionError, setOptionError] = useState<{ category: SocketOptionCategory; message: string } | null>(null)

    useEffect(() => {
        let isMounted = true
        async function loadSocketOptions() {
            try {
                const opts = await optionsService.getSocketOptions()
                if (isMounted) setSocketOptions(opts)
            } catch (err) {
                console.error('Failed to load socket options', err)
            }
        }
        loadSocketOptions()

        const onSocketOptionsChanged = (e: Event) => {
            const detail = (e as CustomEvent).detail
            if (detail && isMounted) {
                setSocketOptions(detail)
            }
        }
        window.addEventListener('socket-options-changed', onSocketOptionsChanged)
        return () => {
            isMounted = false
            window.removeEventListener('socket-options-changed', onSocketOptionsChanged)
        }
    }, [])

    async function onSaveNewOption(category: SocketOptionCategory) {
        const trimmed = newOptionValue.trim()
        if (!trimmed) return
        setIsAddingOption(true)
        setOptionError(null)
        try {
            const updated = await optionsService.addSocketOption(category, trimmed)
            setSocketOptions(updated)
            onSocketChange(category === 'screw' ? 'screwType' : 'lightType', trimmed)
            setInlineAddType(null)
            setNewOptionValue('')
        } catch (err: unknown) {
            console.error('Failed to add socket option', err)
            setOptionError({
                category,
                message: isEn ? 'Failed to add option' : 'שגיאה בהוספת האפשרות'
            })
        } finally {
            setIsAddingOption(false)
        }
    }

    async function onRemoveOption(category: SocketOptionCategory, value: string) {
        const confirmMsg = isEn
            ? `Remove "${value}" from available ${category === 'screw' ? 'screw' : 'light'} options?`
            : `האם להסיר את "${value}" מאפשרויות ה${category === 'screw' ? 'הברגה' : 'נורה'}?`
        if (!window.confirm(confirmMsg)) return

        try {
            const updated = await optionsService.removeSocketOption(category, value)
            setSocketOptions(updated)
        } catch (err) {
            console.error('Failed to remove socket option', err)
            alert(isEn ? 'Failed to remove option' : 'שגיאה בהסרת האפשרות')
        }
    }

    const fieldValues = { screwType, lightType }

    return (
        <div className="form-section socket-type-form-section">
            <div className="section-header-with-action">
                <h4>{isEn ? 'Socket Type' : 'סוג הברגה/נורה'}</h4>
                <button
                    type="button"
                    className={`btn-manage-options ${showManageOptions ? 'active' : ''}`}
                    onClick={() => setShowManageOptions(prev => !prev)}
                >
                    {showManageOptions
                        ? (isEn ? 'Done Managing' : 'סיום ניהול אפשרויות')
                        : (isEn ? 'Manage Options' : 'ניהול אפשרויות')}
                </button>
            </div>

            {showManageOptions && (
                <div className="socket-options-manager">
                    <p className="socket-options-manager-help">
                        {isEn
                            ? 'Click × on any option to remove it from future selections. Existing products will retain their values.'
                            : 'לחץ על × כדי להסיר אפשרות מרשימת הבחירה בעתיד. מוצרים קיימים ישמרו על ערכיהם.'}
                    </p>

                    {SOCKET_FIELDS.map(cfg => (
                        <div key={cfg.category} className="socket-options-chips-section">
                            <h5>
                                {cfg.category === 'screw'
                                    ? (isEn ? 'Available Screw Types' : 'סוגי הברגה קיימים')
                                    : (isEn ? 'Available Light Types' : 'סוגי נורה קיימים')}
                                :
                            </h5>
                            <div className="socket-chips-list">
                                {socketOptions[cfg.optionsKey].map(type => (
                                    <span key={type} className="socket-chip">
                                        <span>{type}</span>
                                        <button
                                            type="button"
                                            className="chip-remove-btn"
                                            onClick={() => onRemoveOption(cfg.category, type)}
                                            title={isEn ? `Remove "${type}"` : `הסר את "${type}"`}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="stacked-fields">
                {SOCKET_FIELDS.map(cfg => {
                    const currentValue = fieldValues[cfg.field]
                    const optionsList = socketOptions[cfg.optionsKey]
                    const isInlineAdding = inlineAddType === cfg.category

                    return (
                        <div key={cfg.category} className="form-group">
                            <label>{isEn ? cfg.labelEn : cfg.labelHe}</label>
                            <select
                                value={isInlineAdding ? '__ADD_NEW__' : currentValue}
                                onChange={(e) => {
                                    if (e.target.value === '__ADD_NEW__') {
                                        setInlineAddType(cfg.category)
                                        setNewOptionValue('')
                                        setOptionError(null)
                                    } else {
                                        setInlineAddType(null)
                                        setOptionError(null)
                                        onSocketChange(cfg.field, e.target.value)
                                    }
                                }}
                            >
                                <option value="">{isEn ? '-- Select --' : '-- בחר --'}</option>
                                {currentValue && !optionsList.includes(currentValue) && (
                                    <option value={currentValue}>
                                        {currentValue} {isEn ? '(Saved)' : '(שמור)'}
                                    </option>
                                )}
                                {optionsList.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                                <option value="__ADD_NEW__">
                                    {isEn ? cfg.addNewEn : cfg.addNewHe}
                                </option>
                            </select>

                            {isInlineAdding && (
                                <div className="socket-option-inline-add">
                                    <input
                                        type="text"
                                        placeholder={isEn ? cfg.placeholderEn : cfg.placeholderHe}
                                        value={newOptionValue}
                                        onChange={(e) => setNewOptionValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                onSaveNewOption(cfg.category)
                                            } else if (e.key === 'Escape') {
                                                setInlineAddType(null)
                                                setOptionError(null)
                                            }
                                        }}
                                        autoFocus
                                    />
                                    <div className="inline-add-actions">
                                        <button
                                            type="button"
                                            className="btn-save-option"
                                            disabled={isAddingOption || !newOptionValue.trim()}
                                            onClick={() => onSaveNewOption(cfg.category)}
                                        >
                                            {isAddingOption ? (isEn ? 'Adding...' : 'מוסיף...') : (isEn ? 'Add' : 'הוסף')}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-cancel-option"
                                            onClick={() => {
                                                setInlineAddType(null)
                                                setNewOptionValue('')
                                                setOptionError(null)
                                            }}
                                        >
                                            {isEn ? 'Cancel' : 'ביטול'}
                                        </button>
                                    </div>
                                    {optionError?.category === cfg.category && (
                                        <span className="socket-option-error">{optionError.message}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
