import React, { useState } from 'react'
import type { Miniuser, User, Role } from '../../model/user.model'
import { useLanguage } from '../../hooks/useLanguage'

type Props = {
    user?: Miniuser
    onSave: (user: User | Miniuser) => void
    onCancel: () => void
}

export const AdminUserEdit: React.FC<Props> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<User>>(user ? { ...user, password: '' } : {
        fullname: '',
        username: '',
        password: '',
        role: 'supplier',
        priceMultiplier: 1,
        showPrices: true
    })
    const { language } = useLanguage()
    const isEn = language === 'en'

    const roles: Role[] = ['admin', 'supplier', 'architect']

    function handleChange(field: string, value: any) {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // If password is empty and it's an edit, remove it so it's not hashed
        const dataToSave = { ...formData }
        if (user && !dataToSave.password) delete dataToSave.password
        onSave(dataToSave as User)
    }

    return (
        <section className="admin-edit-form">
            <h3>{user ? (isEn ? 'Edit User' : 'ערוך משתמש') : (isEn ? 'Add User' : 'הוסף משתמש')}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{isEn ? 'Full Name' : 'שם מלא'}</label>
                    <input 
                        type="text" 
                        value={formData.fullname || ''} 
                        onChange={(e) => handleChange('fullname', e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>{isEn ? 'Username' : 'שם משתמש'}</label>
                    <input 
                        type="text" 
                        value={formData.username || ''} 
                        onChange={(e) => handleChange('username', e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>{isEn ? 'Password' : 'סיסמה'} {user && (isEn ? '(leave empty to keep current)' : '(השאר ריק כדי לשמור על הקיימת)')}</label>
                    <input 
                        type="password" 
                        value={formData.password || ''} 
                        onChange={(e) => handleChange('password', e.target.value)} 
                        required={!user} 
                    />
                </div>
                <div className="form-group">
                    <label>{isEn ? 'Role' : 'תפקיד'}</label>
                    <select 
                        value={formData.role} 
                        onChange={(e) => handleChange('role', e.target.value)}
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>{isEn ? 'Price Multiplier' : 'מכפיל מחיר'}</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={formData.priceMultiplier || ''} 
                        onChange={(e) => handleChange('priceMultiplier', +e.target.value)} 
                    />
                </div>
                <div className="form-group checkbox">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={formData.showPrices !== false} 
                            onChange={(e) => handleChange('showPrices', e.target.checked)} 
                        />
                        {isEn ? 'Show Prices' : 'הצג מחירים'}
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-save">{isEn ? 'Save' : 'שמור'}</button>
                    <button type="button" className="btn-cancel" onClick={onCancel}>{isEn ? 'Cancel' : 'ביטול'}</button>
                </div>
            </form>
        </section>
    )
}
