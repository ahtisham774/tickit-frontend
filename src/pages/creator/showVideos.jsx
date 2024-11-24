import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../API'
import { FaAngleLeft, FaPause, FaPlay } from 'react-icons/fa'
import { IoMdSend } from 'react-icons/io'
import { AiFillDislike, AiFillLike } from 'react-icons/ai'
import { useAuth } from '../../context/useAuth'
const ShowVideos = ({ filterType = 'all' }) => {
  const [videoData, setVideoData] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const videRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  // Fetch video data based on videoId
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoId = searchParams.get('i')
        if (!videoId) {
          const endpoint = `${BASE_URL}/video/random`
          const response = await axios.get(
            endpoint,
            filterType === 'myVideos'
              ? {
                  headers: {
                    Authorization: `User ${user?._id}`
                  }
                }
              : {}
          )
          const randomVideo = response.data.video
          setSearchParams({ i: randomVideo._id })
          return
        }

        axios
          .get(
            `${BASE_URL}/video/${videoId}`,
            filterType === 'myVideos'
              ? {
                  headers: {
                    Authorization: `User ${user?._id}`
                  }
                }
              : {}
          )
          .then(response => {
            setVideoData(response.data.video)
            setComments(response.data.comments || [])
          })
          .catch(error => {
            console.error('Error fetching video data:', error)
          })
          .finally(() => setLoading(false))
      } catch (error) {
        console.error('Error fetching video data:', error)
      }
    }

    fetchVideo()
  }, [searchParams.get('i'), filterType])

  // Handle video play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      videRef.current.pause()
    } else {
      videRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Navigate to the next or previous video
  const handleNavigate = direction => {
    if (!videoData) return

    const nextVideoId =
      direction === 'next' ? videoData.nextId : videoData.prevId
    if (nextVideoId) {
      setSearchParams({ i: nextVideoId })
    }
  }

  const handleLikeDislike = async (videoId, type) => {
    try {
      if (!user) {
        alert('Please login to like/dislike a video')
        return
      }
      const response = await fetch(`${BASE_URL}/video/like-dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ videoId, type })
      })
      const data = await response.json()
      if (data.success) {
        setVideoData(prev => ({
          ...prev,
          likes: data.stats.likes,
          dislikes: data.stats.dislikes,
          isLike: data.stats.isLike,
          isDislike: data.stats.isDislike
        }))
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Error updating comment reaction:', error)
    }
  }

  // Handle new comment submission
  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      if (!user) {
        alert('Please login to add a comment')
        setNewComment('')
      }
      axios
        .post(
          `${BASE_URL}/video/comment`,
          {
            videoId: videoData._id,
            comment: newComment
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        .then(response => {
          setComments(prevComments => [
            ...prevComments,
            {
              _id: response.data.comment._id,
              comment: response.data.comment.comment,
              date: response.data.comment.date,
              user: {
                username: user.username
              }
            }
          ])
          setNewComment('')
        })
        .catch(error => console.error('Error adding comment:', error))
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  return (
    <div className='flex flex-col md:flex-row h-full w-full  text-white lg:px-20'>
      {loading ? (
        <div className='flex flex-col items-center justify-center h-full min-h-[calc(100dvh-200px)] w-full'>
          <p className='text-lg font-normal text-gray-300'>Loading...</p>
        </div>
      ) : videoData ? (
        <>
          <div className='flex-grow md:w-2/3 border-r border-gray-700 h-full flex justify-center items-center '>
            <div className='relative w-full max-w-md  flex items-center justify-center '>
              <div className='relative h-full min-h-52 bg-gray-600 rounded-xl  w-full max-w-xs group'>
                <video
                  className='h-auto object-cover  block max-w-full rounded-lg group-hover:scale-x-110 transition duration-500 ease-in-out'
                  src={videoData.url}
                  ref={videRef}
                />
                <button
                  onClick={handlePlayPause}
                  className='absolute top-1/2 left-1/2 transform hidden group-hover:flex items-center justify-center -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 size-16 rounded-full'
                >
                  {isPlaying ? (
                    <FaPause className='text-white text-xl' />
                  ) : (
                    <FaPlay className='text-white text-xl' />
                  )}
                </button>
              </div>
              <div className='flex flex-col gap-3 items-center w-fit h-fit absolute bottom-24 right-0'>
                <div className='flex flex-col items-center'>
                  <button
                    className='text-xl flex items-center justify-center '
                    onClick={() => handleLikeDislike(videoData._id, 'like')}
                  >
                    <AiFillLike
                      className={`${
                        videoData?.isLike ? 'text-blue-500' : 'text-white'
                      }
                    hover:scale-110 transition-all hover:rotate-2  
                  `}
                    />
                  </button>
                  {videoData.likes}
                </div>
                <div className='flex flex-col items-center'>
                  <button
                    className='text-xl flex items-center justify-center '
                    onClick={() => handleLikeDislike(videoData._id, 'dislike')}
                  >
                    <AiFillDislike
                      className={`${
                        videoData?.isDislike ? 'text-red-500' : 'text-white'
                      }
                     hover:scale-110 transition-all hover:-rotate-2 
                    `}
                    />
                  </button>
                  {videoData.dislikes}
                </div>
              </div>
              <button
                disabled={!videoData.prevId}
                onClick={() => handleNavigate('prev')}
                className='absolute left-0 top-1/2 disabled:opacity-50 disabled:cursor-not-allowed transform -translate-y-1/2 bg-gray-500 hover:bg-gray-600 p-2 hover:-translate-x-1 transition-all size-8 flex items-center justify-center rounded-full'
              >
                <FaAngleLeft />
              </button>
              <button
                disabled={!videoData.nextId}
                onClick={() => handleNavigate('next')}
                className='absolute right-0 top-1/2 disabled:opacity-50 disabled:cursor-not-allowed transform -translate-y-1/2 bg-gray-500 hover:bg-gray-600 p-2 hover:translate-x-1 transition-all size-8 flex items-center justify-center rounded-full'
              >
                <FaAngleLeft className='-scale-x-[1]' />
              </button>
            </div>
          </div>

          {/* Info and Comments Section */}
          <div className='flex-grow md:w-1/3  p-4 flex flex-col space-y-4 overflow-y-auto'>
            {/* Metadata Section */}
            <div className='border border-gray-700 p-4 rounded-lg'>
              <h2 className='text-xl font-medium'>{videoData?.title}</h2>
              <p className='text-sm text-gray-300'>
                By: {videoData?.creator?.username}{' '}
                {videoData?.creator?._id === user?._id && (
                  <span className='text-[10px]'>(You)</span>
                )}
              </p>
              <p className='mt-2 font-normal text-sm text-gray-400'>
                {videoData?.description}
              </p>
              <div className='flex flex-wrap gap-2 mt-2'>
                {videoData?.tags?.map(tag => (
                  <span
                    key={tag}
                    className='bg-gray-700 text-sm px-2 py-1 rounded-md'
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className='flex flex-wrap gap-1 mt-2'>
                {videoData?.hashtags?.map(tag => (
                  <span key={tag} className='text-sm'>
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className='border border-gray-700 px-4 py-2 rounded-lg h-full flex flex-col gap-2'>
              <h3 className='text-lg font-bold'>Comments</h3>
              <hr className='border-gray-700' />
              <div className='space-y-2   max-h-52 h-full  overflow-y-auto mt-2 flex-1'>
                {comments?.map(comment => (
                  <div
                    key={comment._id}
                    className='flex justify-between items-center w-fit border border-gray-700 p-2 px-4 rounded-[10px_10px_10px_0]'
                  >
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-semibold text-gray-200'>
                          {comment.user.username}
                        </p>
                        <p className='text-[8px] text-gray-300'>
                          {new Date(comment.date).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </p>
                      </div>
                      <p className='text-xs text-gray-100'>{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-4 flex w-full border border-gray-700 px-2 rounded'>
                <input
                  type='text'
                  placeholder='Add a comment'
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className='bg-transparent w-full border-none outline-none'
                />
                <button
                  onClick={handleAddComment}
                  className='bg-transparent border-none outline-none py-2 rounded-r-md text-white'
                >
                  <IoMdSend />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center h-full min-h-[calc(100dvh-200px)] w-full'>
          <p className='text-lg font-normal text-gray-300'>
            No video found. Please try again later.
          </p>
          {user && (
            <button
              className='bg-secondary hover:opacity-60 text-white font-bold py-2 px-4 rounded mt-4'
              onClick={() => navigate('/creator/upload-video')}
            >
              Upload a video
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ShowVideos
