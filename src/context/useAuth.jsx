// AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { AUTH } from '../API';

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ticKitToken') || null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for user token and role
  useEffect(() => {
    const role = localStorage.getItem('ticKitRole') || null;

    // Fetch the current user if token exists
    const fetchUser = async () => {


      try {
        const response = await fetch(`${AUTH}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            _id: userData._id,
            email: userData.email,
            username: `${userData.username}`,
            role: userData.role,
            token: token,
          });
          setLoading(false)
        } else {
          setUser(null);
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
        setLoading(false)
      }
    };

    fetchUser();
  }, [token]);



  // Logout function to clear the user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ticKitToken');
    localStorage.removeItem('ticKitRole');
  };

  if (loading) {
    return <div className='fixed w-screen min-h-screen h-full grid place-items-center'>
      <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-primary"></div>
    </div>
  }

  return (
    <AuthContext.Provider value={{ user, token,setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
