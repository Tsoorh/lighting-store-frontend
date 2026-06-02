import React, { useState, useEffect } from 'react'
import { userService } from '../../services/user.service'
import { useLanguage } from '../../hooks/useLanguage'
import type { Role } from '../../model/user.model'

export const AdminPriceSettings: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role>('supplier')
    const [multiplier, setMultiplier] = useState<number>(1)
    const [isUpdating, setIsUpdating] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const { language } = useLanguage()
    const isEn = language === 'en'

    useEffect(() => {
        async function loadCurrentMultiplier() {
            try {
                const users = await userService.query()
                const userWithRole = users.find(u => u.role === selectedRole)
                if (userWithRole && userWithRole.priceMultiplier !== undefined) {
                    setMultiplier(userWithRole.priceMultiplier)
                } else {
                    setMultiplier(1)
                }
            } catch (err) {
                console.error('Failed to load current multiplier', err)
            }
        }
        loadCurrentMultiplier()
    }, [selectedRole])

    async function onUpdateMultipliers(e: React.FormEvent) {
        e.preventDefault()
        setIsUpdating(true)
        setMessage(null)
        try {
            const res = await userService.updateBulkMultiplier(selectedRole, multiplier)
            setMessage(isEn 
                ? `Success: ${res.message}` 
                : `הצלחה: עודכנו ${res.count} משתמשים`)
        } catch (err) {
            console.error('Failed to update multipliers', err)
            setMessage(isEn ? 'Failed to update multipliers' : 'עדכון המכפילים נכשל')
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <section className="admin-price-settings">
            <div className="admin-edit-form" style={{ maxWidth: '600px' }}>
                <header className="list-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h2>{isEn ? 'Global Price Multipliers' : 'מכפילי מחיר גלובליים'}</h2>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>{isEn 
                        ? 'Update the price multiplier for ALL users of a specific type at once.' 
                        : 'עדכן את מכפיל המחיר לכל המשתמשים מסוג מסוים בבת אחת.'}
                    </p>
                </header>

                <form onSubmit={onUpdateMultipliers} style={{ marginTop: '20px' }}>
                    <div className="form-group">
                        <label>{isEn ? 'Select User Type' : 'בחר סוג משתמש'}</label>
                        <select 
                            value={selectedRole} 
                            onChange={(e) => setSelectedRole(e.target.value as Role)}
                        >
                            <option value="supplier">{isEn ? 'Supplier' : 'ספק'}</option>
                            <option value="architect">{isEn ? 'Architect' : 'אדריכל'}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{isEn ? 'New Multiplier' : 'מכפיל חדש'}</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={multiplier} 
                            onChange={(e) => setMultiplier(+e.target.value)} 
                            required 
                        />
                    </div>

                    {message && <p className={`message ${message.includes('Success') || message.includes('הצלחה') ? 'success' : 'error'}`} style={{ marginBottom: '15px', color: message.includes('Success') || message.includes('הצלחה') ? 'green' : 'red', fontSize: '0.9rem' }}>{message}</p>}

                    <div className="form-actions">
                        <button type="submit" className="btn-save" disabled={isUpdating}>
                            {isUpdating ? (isEn ? 'Updating...' : 'מעדכן...') : (isEn ? 'Update All' : 'עדכן את כולם')}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}
