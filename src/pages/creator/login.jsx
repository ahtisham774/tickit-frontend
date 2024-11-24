import { useState } from 'react';

import toast from 'react-hot-toast';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { AUTH } from '../../API';

const LoginCreator = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState(false)
    const { user, setToken } = useAuth()
    const navigate = useNavigate()
   

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });



    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            if(!searchParams.get('token')){
                alert('Please login with the link sent to your email')
                return
            }
            setLoading(true)
            fetch(`${AUTH}/user/creator/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...credentials,
                    token: searchParams.get('token')
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.err) {
                        console.error(data.err)
                        toast.error(data.err)
                        throw new Error(data.err);
                    }
                    const { token } = data
                    localStorage.setItem('ticKitToken', token)
                    setToken(token)
                    toast.success("Login Successful")
                    setIsOpen(false)
                    navigate('/creator')
                }
                )
                .catch(error => {
                    console.error(error)
                }).finally(() => setLoading(false))
        }
        catch (error) {
            console.error(error)
            toast.error("Login failed")
        }
    }


    if (user && user.role === 'creator') {
        // Redirect to the page they were on before visiting the login page
        return <Navigate to={location.state?.from || '/creator'} replace />;
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="transform transition-all duration-500 bezier bg-white rounded-lg shadow-lg p-8 w-96 mx-auto animate-slideDown"
                    >
                        <h2 className="text-2xl text-black font-bold text-center mb-4">Login</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={credentials.email}
                                    onChange={(e) =>
                                        setCredentials({
                                            ...credentials,
                                            email: e.target.value,
                                        })
                                    }

                                    className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={credentials.password}
                                    onChange={(e) =>
                                        setCredentials({
                                            ...credentials,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-secondary text-white py-2 text-center flex items-center justify-center disabled:cursor-not-allowed rounded-md font-semibold disabled:opacity-60 hover:bg-blue-700 transition"
                            >
                                {
                                    loading ?
                                        <div className='w-4 h-4 border-2 border-r-secondary animate-spin rounded-full ' />

                                        : "Login"
                                }
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
};

export default LoginCreator;
