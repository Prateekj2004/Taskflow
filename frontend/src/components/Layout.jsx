import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom';
import axios from 'axios'

const Layout = ({ onLogout, user }) => {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try{
      const token = localStorage.getItem('token')
      if(!token) throw new Error('No Auth Token Found')
      
      const {data} = await axios.get("http://localhost:4000/api/tasks/gp", {
        headers: {Authorization: `Bearer ${token}`}
      })
      
      const arr = Array.isArray(data)? data:
        Array.isArray(data?.tasks) ? data.tasks :
          Array.isArray(data?.data) ? data.data : []
      setTasks(arr)
    }
    catch (error){
      console.error(err)
      setError(err.message || "could not load tasks")
    }
    finally {
      setLoading(false)
    }
  }, [onLogout])

  useEffect(()=>{fetchTasks()}, [fetchTasks])

  const stats = useMemo(() =>{
    const completedTasks = tasks.filter(t => 
      t.completed===true ||
      t.completed===1 ||
      (typeof t.completed === "string" && t.completed.toLowerCase() === 'yes')
    ).length

    const totalCount = tasks.length
    const pendingCount = totalCount - completedTasks
    const completionPercentage = totalCount ?
      Math.round((completedTasks/totalCount)/100) : 0
    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage
    }
  }, [tasks])

  const StatCard = ({title, value, icon}) => (
    <dir className='p-2 sm:p-3 rounded-xl bg-white shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300 hover:border-purple-100 group'>
      <div className='flex items gap-2'>
        <div className='p-1.5 rounded-lg br-gradient-to-br from-fuchsia-500/10 to-purple-500/10 group-hover:from-fuchsia-500/20 group-hover:to-purple-500/20  '>
          {icon}
        </div>
        <div>
          <p className='text-lg sm:text-xl font-bold bg-gradient-to-r from-fuchsia-500 bg-clip-text text-transparent'>
            {value}
          </p>
          <p className='text-xs text-gray-500 font-medium'>
            {title}
          </p>
        </div>
      </div>
    </dir>
  )

  if(loading) return(
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 ' />
    </div>
  )

  if(error) return (
    <div className='min-h-screen bg-gray-50 p-6 flex items justify-center'>
      <div className='bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md'>
        <p className='font-medium mb-2'>Error loading tasks</p>
        <p className='text-sm'>{error}</p>
        <button onClick={fetchTasks} className='mt-4 py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors'>
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks}/>
      <div className='ml-0 wl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300'>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6'>
          <div className='xl:col-span-2 space-y-3 sm:space-y-4'>
            <Outlet context={{tasks, refreshTasks: fetchTasks}}/>
          </div>
        </div>
      </div>      
    </div>
  )
}

export default Layout

