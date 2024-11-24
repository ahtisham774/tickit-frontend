import React, { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../API'
import toast from 'react-hot-toast'

const Upload = () => {
  const [video, setVideo] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVideoChange = e => {
    setVideo(e.target.files[0])
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!video) {
      setMessage('Please select a video file.')
      return
    }

    const formData = new FormData()
    formData.append('video', video)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('tags', tags)
    formData.append('hashtags', hashtags)

    try {
      setLoading(true)
      axios
        .post(`${BASE_URL}/video/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('ticKitToken')}` // Include the token if authentication is required
          }
        })
        .then(response => {
          toast.success(response.data.message)
          setVideo(null)
          setTitle('')
          setDescription('')
          setTags('')
          setHashtags('')
        })
        .catch(error => {
          console.error('Error uploading video:', error)
          toast.error('Failed to upload video. Please try again.')
        })
        .finally(() => setLoading(false))
    } catch (error) {
      console.error('Error uploading video:', error)
      toast.error('Failed to upload video. Please try again.')
    }
  }

  return (
    <div className=' p-4 lg:px-24'>
      <h1 className='text-2xl font-bold mb-4'>Upload Video</h1>
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 grid-rows-4 items-center justify-center gap-5 '
      >
        <div className='row-span-1'>
          <label className='block text-sm font-medium mb-2'>Title</label>
          <input
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='block w-full p-2 border rounded text-black'
            required
          />
        </div>
        <div className='row-span-3 h-full '>
          <label className='block text-sm font-medium mb-2'>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className='block w-full p-2 h-full border rounded text-black'
          ></textarea>
        </div>
        <div className='row-span-1'>
          <label className='block text-sm font-medium mb-2'>
            Tags (comma-separated)
          </label>
          <input
            type='text'
            value={tags}
            onChange={e => setTags(e.target.value)}
            className='block w-full p-2 border rounded text-black'
          />
        </div>
        <div className='row-span-1'>
          <label className='block text-sm font-medium mb-2'>
            Hashtags (comma-separated)
          </label>
          <input
            type='text'
            value={hashtags}
            onChange={e => setHashtags(e.target.value)}
            className='block w-full p-2 border rounded text-black'
          />
        </div>
        <div className='row-span-1'>
          <label className='block text-sm font-medium mb-2'>Video File</label>
          <input
            type='file'
            accept='video/*'
            onChange={handleVideoChange}
            className='block w-full p-2 border rounded '
          />
        </div>

        <div className='row-span-1  h-full flex flex-col justify-end'>
          <button
            type='submit'
            disabled={loading}
            className='w-full disabled:cursor-not-allowed disabled:opacity-60 bg-secondary text-white p-2 py-2.5 h-fit rounded hover:opacity-80'
          >
            {loading ? (
              <div className='flex justify-center items-center'>
                <div className='size-6 rounded-full border-4 border-gray-800  border-t-secondary animate-spin' />
              </div>
            ) : (
              'Upload Video'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Upload
