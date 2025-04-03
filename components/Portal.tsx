'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: React.ReactNode
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    // Create portal container
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.zIndex = '1000'
    document.body.appendChild(container)
    setPortalContainer(container)

    // Cleanup
    return () => {
      document.body.removeChild(container)
    }
  }, [])

  if (!portalContainer) return null

  return createPortal(children, portalContainer)
}

export default Portal 