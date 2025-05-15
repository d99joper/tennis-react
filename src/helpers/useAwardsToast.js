// hooks/useAwardToast.js
import { useState } from 'react'
import FloatingAward from 'components/awards/FloatingAward'

export default function useAwardToast() {
  const [queue, setQueue] = useState([])

  const showAward = (type, title) => {
    setQueue(q => [...q, { type, title }])
  }

  const pop = () => {
    setQueue(q => q.slice(1))
  }

  const render = queue.length > 0 ? (
    <FloatingAward {...queue[0]} onDone={pop} />
  ) : null

  return { showAward, render }
}
