import React, { useEffect, useState } from 'react'
import { userService } from '../../services/user.service'
import type { Miniuser, User } from '../../model/user.model'
import { useLanguage } from '../../hooks/useLanguage'
import { AdminUserEdit } from './AdminUserEdit'

export const AdminUserList: React.FC = () => {
    const [users, setUsers] = useState<Miniuser[]>([])
    const [editingUser, setEditingUser] = useState<Miniuser | null | 'new'>(null)
    const { language } = useLanguage()
    const isEn = language === 'en'

    useEffect(() => {
        async function loadUsers() {
            try {
                const fetchedUsers = await userService.query()
                setUsers(fetchedUsers)
            } catch (err) {
                console.error('Failed to load users', err)
            }
        }

        loadUsers()
    }, [])

    async function onRemoveUser(userId: string) {
        if (!window.confirm(isEn ? 'Are you sure?' : 'האם אתה בטוח?')) return
        try {
            await userService.remove(userId)
            setUsers(prev => prev.filter(u => u._id?.toString() !== userId))
        } catch (err) {
            console.error('Failed to remove user', err)
        }
    }

    async function onSaveUser(userToSave: User | Miniuser) {
        try {
            const savedUser = await userService.save(userToSave)
            if (userToSave._id) {
                setUsers(prev => prev.map(u => u._id === savedUser._id ? savedUser : u))
            } else {
                setUsers(prev => [savedUser, ...prev])
            }
            setEditingUser(null)
        } catch (err) {
            console.error('Failed to save user', err)
        }
    }

    if (editingUser) {
        return (
            <AdminUserEdit 
                user={editingUser === 'new' ? undefined : editingUser} 
                onSave={onSaveUser} 
                onCancel={() => setEditingUser(null)} 
            />
        )
    }

    return (
        <section className="admin-user-list">
            <header className="list-header">
                <h2>{isEn ? 'Manage Users' : 'ניהול משתמשים'}</h2>
                <button className="btn-add" onClick={() => setEditingUser('new')}>
                    {isEn ? 'Add User' : 'הוסף משתמש'}
                </button>
            </header>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{isEn ? 'Full Name' : 'שם מלא'}</th>
                            <th>{isEn ? 'Username' : 'שם משתמש'}</th>
                            <th>{isEn ? 'Role' : 'תפקיד'}</th>
                            <th>{isEn ? 'Actions' : 'פעולות'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id?.toString()}>
                                <td>{user.fullname}</td>
                                <td>{user.username}</td>
                                <td>{user.role || '-'}</td>
                                <td className="actions">
                                    <button onClick={() => setEditingUser(user)}>{isEn ? 'Edit' : 'ערוך'}</button>
                                    <button onClick={() => onRemoveUser(user._id!.toString())}>{isEn ? 'Remove' : 'מחק'}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
