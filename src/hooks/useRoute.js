import { useEffect, useState, useCallback } from 'react'

// Tiny hash router: '#/violin/v2' → ['violin', 'v2'].
// Keeps the browser Back button inside the app.
function parse() {
  return window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
}

export function useRoute() {
  const [parts, setParts] = useState(parse)

  useEffect(() => {
    const onChange = () => setParts(parse())
    window.addEventListener('popstate', onChange)
    window.addEventListener('hashchange', onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener('hashchange', onChange)
    }
  }, [])

  const navigate = useCallback((next) => {
    const depth = (window.history.state?.depth ?? 0) + 1
    window.history.pushState({ depth }, '', next.length ? `#/${next.join('/')}` : window.location.pathname)
    setParts(next)
  }, [])

  // Go up one level. Uses history.back() when we pushed the current entry,
  // so the browser history stays in sync; otherwise (deep link) replaces it.
  const up = useCallback((parent) => {
    if ((window.history.state?.depth ?? 0) > 0) {
      window.history.back()
    } else {
      window.history.replaceState({ depth: 0 }, '', parent.length ? `#/${parent.join('/')}` : window.location.pathname)
      setParts(parent)
    }
  }, [])

  return { parts, navigate, up }
}
