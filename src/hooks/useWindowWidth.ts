import { useEffect, useState } from 'react';

export function useWindowWidth() {
  const [width, setWidth] = useState<number>(() =>
    typeof window === 'undefined' ? 0 : window.innerWidth
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}