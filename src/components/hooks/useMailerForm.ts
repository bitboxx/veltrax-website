import { useCallback, useEffect, useRef, useState } from 'react'

const MAILER_URL = 'https://decaltracom-mailer.michaelbolle1981.workers.dev'
const ATTACH_DELAY_MS = 10_000

export function useMailerForm() {
  const [ready, setReady] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const mountedAt = useRef(Date.now())

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), ATTACH_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const submit = useCallback(
    async (payload: {
      name: string
      email: string
      message: string
      company?: string
      phone?: string
    }) => {
      if (!ready || Date.now() - mountedAt.current < ATTACH_DELAY_MS) return

      setSending(true)
      setError(false)

      try {
        const response = await fetch(MAILER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            language: 'en-gb',
          }),
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        setSent(true)
      } catch {
        setError(true)
      } finally {
        setSending(false)
      }
    },
    [ready],
  )

  return { ready, sending, sent, error, submit }
}
