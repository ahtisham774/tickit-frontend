import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BASE_URL } from '../../API'

const ShowCreator = () => {
  const { id } = useParams()

  const [creator, setCreator] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(null)

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${id}/details`)
        const data = await response.json()
        setCreator(data.user)
        setVideos(data.videos)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching creator data:', error)
        setLoading(false)
      }
    }

    fetchCreatorData()
  }, [id])

  if (loading) {
    return <div className='text-center mt-10'>Loading...</div>
  }

  if (!creator) {
    return <div className='text-center mt-10'>Creator not found</div>
  }

  return (
    <div className='flex flex-col items-center w-full max-w-5xl mx-auto mt-10'>
      {/* Creator Profile */}
      <div className='text-center mb-8'>
        <img
          src={creator.avatar || 'https://via.placeholder.com/150'}
          alt={creator.username}
          className='w-24 h-24 rounded-full mx-auto mb-4 border border-gray-300 shadow'
        />
        <h1 className='text-2xl font-semibold'>{creator.username}</h1>
        <p className='text-gray-500'>{creator.email}</p>
      </div>

      {/* Video Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {videos.map(video => (
          <div
            key={video._id}
            className='relative group cursor-pointer'
            onClick={() => {
              setCurrentVideo(video)
              setIsModalOpen(true)
            }}
          >
            {/* Video Thumbnail */}
            <div className=' h-full bg-gray-600 rounded-xl  w-full max-w-xs '>
              <video
                className='h-auto object-cover  block max-w-full rounded-lg group-hover:scale-x-110 transition duration-500 ease-in-out'
                src={video.url}
                
              />
            </div>
            {/* Likes Count */}
            <div className='absolute bottom-2 left-2 text-white bg-black bg-opacity-75 px-2 py-1 text-sm rounded'>
              ❤️ {video.likeCount}
            </div>
            {/* Video Title on Hover */}
            <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center group-hover:scale-x-110 ease-in-out justify-center text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity'>
              {video.title}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-75 flex  items-center justify-center z-50 animate-fadeIn'
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className='relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-[80dvw] max-h-[80vh] overflow-y-auto  h-full'
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            {/* Video Player */}
            <div className='w-full h-[70vh]'>
              <video
                controls
                autoPlay
                src={currentVideo?.url}
                className='w-full h-full rounded-md'
              ></video>
            </div>
            {/* Video Title */}
            <div className='flex flex-col gap-2 '>
              <h2 className='mt-4 text-lg font-bold text-black'>
                {currentVideo?.title}
              </h2>
              <p className='text-sm text-gray-800 mt-2'>
                {currentVideo?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShowCreator
