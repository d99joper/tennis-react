import FloatingAward from 'components/forms/FloatingAward'
import { useState } from 'react'

export default function useAwardToast() {
  const [queue, setQueue] = useState([])

  const showAward = (type, title) => {
    setQueue(q => [...q, { type, title }])
  }

  const pop = () => setQueue(q => q.slice(1))

  const AwardToast = () =>
    queue.length > 0 ? (
      <FloatingAward {...queue[0]} onDone={pop} />
    ) : null

  return { showAward, AwardToast }
}
