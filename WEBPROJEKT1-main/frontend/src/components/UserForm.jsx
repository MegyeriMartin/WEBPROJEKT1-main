import { useState } from 'react';
import api from '../api/axiosInstance';

const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    role: 'developer',
    newsletter: false,
};

export default function UserForm() {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setFormData((currentData) => ({
            ...currentData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError('A vezetéknév és a keresztnév megadása kötelező.');
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Adj meg érvényes, @ jelet tartalmazó e-mail-címet.');
            return;
        }

        const age = formData.age === '' ? null : Number(formData.age);
        if (age !== null && (!Number.isFinite(age) || age <= 0)) {
            setError('Az életkornak 0-nál nagyobb számnak kell lennie.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/users', { ...formData, age });
            setSuccess('A felhasználói adatok sikeresen elküldve.');
            setFormData(initialFormData);
        } catch (requestError) {
            console.error('Hiba a felhasználói adatok beküldésekor:', requestError);
            setError(
                requestError.response?.data?.error ??
                    'Nem sikerült elküldeni az űrlapot. Próbáld újra.',
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="user-form-section">
            <h2>Felhasználói Adatlap</h2>
            <form className="user-form" onSubmit={handleSubmit} aria-busy={loading}>
                <label>
                    Vezetéknév *
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Pl. Kovács"
                        required
                    />
                </label>

                <label>
                    Keresztnév *
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Pl. János"
                        required
                    />
                </label>

                <label>
                    E-mail cím *
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="kovacs.janos@example.com"
                        required
                    />
                </label>

                <label>
                    Életkor
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Pl. 30"
                        min="1"
                    />
                </label>

                <label>
                    Szerepkör
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="developer">Fejlesztő</option>
                        <option value="designer">Designer</option>
                        <option value="manager">Projektmenedzser</option>
                    </select>
                </label>

                <label className="user-form-checkbox">
                    <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleChange}
                    />
                    Feliratkozás a hírlevélre
                </label>

                {error && (
                    <p className="user-form-message user-form-error" role="alert">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="user-form-message user-form-success" role="status">
                        {success}
                    </p>
                )}
                {loading && (
                    <p className="user-form-message" role="status" aria-live="polite">
                        Az adatok küldése folyamatban...
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Küldés...' : 'Adatok beküldése'}
                </button>
            </form>
        </section>
    );
}
