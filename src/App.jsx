import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes
} from 'react-router-dom'
import Login from './pages/login'
import SignUp from './pages/signUp'
import NotFound from './components/notFound'
import ProtectedRoute from './utils/protectedRoutes'
import { useAuth } from './context/useAuth'
import Layout from './components/admin/layout'
import AdminDashboard from './pages/admin/dashboard'
import LoginPortal from './pages/admin/login'
import Creators from './pages/admin/creators'
import AddCreator from './pages/admin/addCreator'
import LoginCreator from './pages/creator/login'
import CreatorDashboard from './pages/creator/dashboard'
import Upload from './pages/creator/upload'
import ShowVideos from './pages/creator/showVideos'
import HomePage from './pages/HomePage'
import ShowCreator from './pages/creator/showCreator'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/user/:id' element={<ShowCreator />} />

        {/* Admin Dashboard Routes */}
        <Route path='dashboard' element={<Outlet />}>
          <Route
            element={
              <ProtectedRoute
                role='admin'
                redirectTo='/dashboard/login-portal'
              />
            }
          >
            <Route
              element={
                <Layout>
                  <Outlet />
                </Layout>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path='creators' element={<Outlet />}>
                <Route index element={<Creators />} />
                <Route path='create' element={<AddCreator />} />
              </Route>
            </Route>
          </Route>
          <Route path='login-portal' element={<LoginPortal />} />
          <Route path='*' element={<NotFound />} />
        </Route>

        {/* Creator Dashboard Routes */}
        <Route path='creator' element={<Outlet />}>
          <Route
            element={
              <ProtectedRoute role='creator' redirectTo='/creator/login' />
            }
          >
            <Route element={<CreatorDashboard />}>
              <Route
                index
                element={<Navigate to='/creator/videos/' replace />}
              />
              {/* Route for showing videos */}
              <Route path='videos' element={<ShowVideos />} />
              <Route
                path='my-videos'
                element={<ShowVideos filterType='myVideos' />}
              />

              <Route path='upload-video' element={<Upload />} />
            </Route>
          </Route>
          <Route path='login' element={<LoginCreator />} />
          <Route path='*' element={<NotFound />} />
        </Route>

        {/* Catch-All Route */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
