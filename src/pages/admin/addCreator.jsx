import React, { useState } from 'react';
import { AUTH } from '../../API';
import { useAuth } from '../../context/useAuth';
import toast from 'react-hot-toast';

const AddCreator = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            fetch(`${AUTH}/user/admin/register-creator`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,

                },
                body: JSON.stringify(formData)
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.message) {
                        toast.success(data.message)
                    }
                    setFormData({
                        username: '',
                        email: '',
                        password: '',
                    })
                })
                .catch(err =>
                    toast.error(err.message)
                )
                .finally(() => setLoading(false))
        }
        catch (error) {
            console.error(error)


        }
    };

    return (
        <div className="flex w-full ju h-full min-h-[calc(100dvh-180px)]">
            <form
                onSubmit={handleSubmit}
                className="bg-dark p-8 rounded-lg flex flex-col items-center shadow-xl border border-stone-900 w-full "
            >
                <h2 className="text-2xl font-bold mb-6 text">Create Creator</h2>

                <div className="mb-4 w-full">
                    <label className="block text-secondary text-xl font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="bg-inherit px-4 py-3 outline-none w-full text-secondary rounded-lg border-2 transition-colors duration-100 border-solid focus:border-secondary border-[#2B3040]"
                        required
                    />
                </div>

                <div className="mb-4 w-full">
                    <label className="block text-secondary text-xl font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-inherit px-4 py-3 outline-none w-full text-secondary rounded-lg border-2 transition-colors duration-100 border-solid focus:border-secondary border-[#2B3040]"
                        required
                    />
                </div>

                <div className="mb-6 w-full">
                    <label className="block text-secondary text-xl font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-inherit px-4 py-3 outline-none w-full text-secondary rounded-lg border-2 transition-colors duration-100 border-solid focus:border-secondary border-[#2B3040]"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="self-end  disabled:opacity-60 disabled:cursor-not-allowed  button text-secondary font-bold py-2 px-4 rounded-md  transition duration-200"
                >
                    {
                        loading ?
                            <div className="flex items-center p-1 px-4 justify-center">
                                <div className="w-5 h-5 border-2 border-secondary border-b-white  rounded-full animate-spin"></div>
                            </div>
                            : 'Create'
                    }
                </button>
            </form>
        </div>
    );
};

export default AddCreator;
