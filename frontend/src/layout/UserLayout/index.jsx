import NavBarComponent from '@/Components/Navbar/index.jsx'
import React from 'react'

function UserLayout({children}) {
  return (
    <div>
        <NavBarComponent/>
        {children}
    </div>
  )
}

export default UserLayout;