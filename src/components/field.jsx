

const Field = ({type, value,  onChange,isRequired, placeholder}) => {
  return (
    <input type={type} value={value} required={isRequired} onChange={onChange} placeholder={placeholder} className='w-full bg-transparent h-12 px-4 border-2 border-gray-700 rounded-lg  focus:outline-none focus:border-secondary' />
    
  )
}

export default Field