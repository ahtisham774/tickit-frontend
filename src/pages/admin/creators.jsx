import toast from 'react-hot-toast'
import BtnOutline from '../../components/btnOutline'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AUTH, BASE_URL } from '../../API'
import { RiDeleteBin6Fill } from 'react-icons/ri'

const ITEMS_PER_PAGE = 10
const Creators = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [creators, setCreators] = useState(null)
  const [sendToken, setSendToken] = useState(false)

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/admin/creators/all`)
        const data = await response.json()
        console.log(data)
        if (response.ok) {
          setCreators(data)
          setLoading(false)
        } else {
          toast.error(data.message)
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    }

    fetchCreators()
  }, [])

  const handleClick = () => {
    navigate('create')
  }

  // Pagination logic
  const totalPages = Math.ceil(creators?.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCreators = creators?.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const handleDelete = async creator => {
    try {
      const confirm = window.confirm(
        'Are you sure you want to delete this creator?'
      )
      if (!confirm) return
    } catch (error) {
      console.error('Error deleting creator:', error)
    }
  }

  const handleRefreshToken = async creator => {
    try {
      setSendToken(true)
      const token = localStorage.getItem('ticKitToken')
      const response = await fetch(`${AUTH}/user/admin/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: creator.email })
      })
      const data = await response.json()
      if (data.message) {
        toast.success(data.message)
      } else {
        toast.error(data.err)
      }
      setSendToken(false)
    } catch (error) {
      console.error('Error refreshing token:', error)
    }
  }

  return (
    <div className='w-full flex flex-col gap-5 p-4'>
      <div className='flex lg:items-center justify-between w-full flex-col sm:flex-row gap-3'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold '>Creators</h1>
          <p className='text-xl '>List of all creators</p>
        </div>
        <BtnOutline
          text='Create Creator'
          css='bg-[var(--primary-color)] text-white rounded'
          handleClick={handleClick}
        />
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse min-w-full whitespace-nowrap  shadow-md rounded-lg'>
          <thead>
            <tr className=' text-left border-b border-gray-700'>
              <th className='p-3 text-xl font-bold'>Sr</th>
              <th className='p-3 text-xl font-bold'>Username</th>
              <th className='p-3 text-xl font-bold'>Email</th>
              <th className='p-3 text-xl font-bold'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='6' className='p-3 text-xl font-normal text-center'>
                  Loading...
                </td>
              </tr>
            ) : paginatedCreators?.length === 0 ? (
              <tr>
                <td colSpan='6' className='p-3 text-xl font-normal text-center'>
                  No Creator found
                </td>
              </tr>
            ) : (
              paginatedCreators?.map((creator, index) => (
                <tr key={creator.sr} className='border-b border-b-gray-700'>
                  <td className='p-3 text-xl font-normal '>
                    {startIdx + index + 1}
                  </td>
                  <td className='p-3 text-xl font-normal '>
                    {creator?.username}
                  </td>

                  <td className='p-3 text-xl font-normal '>{creator?.email}</td>

                  <td className='p-3 text-xl font-normal  flex space-x-5 items-center w-full justify-between'>
                    <button
                      onClick={() => handleRefreshToken(creator)}
                      type='button'
                      disabled={sendToken}
                      style={{
                        opacity: sendToken ? 0.6 : 1,
                        pointerEvents: sendToken ? 'none' : 'auto'
                      }}
                      className='px-4 py-1.5 bg-secondary rounded'
                    >
                      {sendToken ? (
                        <div className='animate-spin inline-block w-5 h-5 mx-12 border-4 rounded-full border-t-secondary border-black'></div>
                      ) : (
                        'Refresh Token'
                      )}
                    </button>
                    <RiDeleteBin6Fill
                      className='size-6 cursor-pointer'
                      onClick={() => handleDelete(creator)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 mt-4'>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Creators
