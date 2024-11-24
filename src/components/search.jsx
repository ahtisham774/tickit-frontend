import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../API';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  // Debounce function to delay API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchUsers(query);
      } else {
        setUsers([]);
        setNoResults(false);
      }
    }, 300); // Debounce delay of 300ms

    return () => clearTimeout(timer);
  }, [query]);

  // Function to fetch users from the API
  const searchUsers = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/search?search=${searchTerm}`);
      const data = await response.json();

      if (data.length > 0) {
        setUsers(data);
        setNoResults(false);
      } else {
        setUsers([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle user selection from the dropdown
  const handleUserSelect = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="relative w-full  ">
      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full px-4 py-2  rounded-lg text-black shadow-sm border-none outline-none"
      />

      {/* Dropdown List */}
      {query.trim() && (
        <div className="absolute w-fit mt-2 bg-primary border border-gray-300 rounded-lg overflow-hidden shadow-lg z-10">
          {loading && (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          )}

          {!loading && users.length > 0 && (
            <ul className="divide-y divide-gray-200 w-full">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="p-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserSelect(user._id)}
                >
                  <p className="font-semibold text-black">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </li>
              ))}
            </ul>
          )}

          {!loading && noResults && (
            <div className="p-4 text-center text-gray-500">No record found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
