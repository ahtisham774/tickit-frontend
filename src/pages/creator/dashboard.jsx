import { Outlet } from 'react-router-dom'
import Navbar from '../../components/navbar'

const CreatorDashboard = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default CreatorDashboard
