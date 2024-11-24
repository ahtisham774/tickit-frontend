const Logo = ({ className="flex-col" }) => {
  return (
    <div className={`flex ${className} items-center justify-center gap-3`}>
      <img src='/assets/logo-icon.png' alt='logo' className='w-32 h-auto' />
      <h1 className='text-3xl font-bold  text'>
        <span>TicKit</span>
      </h1>
    </div>
  )
}

export default Logo
