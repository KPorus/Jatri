'use client';

import { useEffect, useState } from 'react';
import { getCountdown } from '@/lib/utils';

export function Countdown({ target, id = 'countdown' }: { target: string; id?: string }) {
  const [state, setState] = useState(() => getCountdown(target));

  useEffect(() => {
    const t = setInterval(() => setState(getCountdown(target)), 1000);
    return () => clearInterval(t);
  }, [target]);

  return (
    <span id={id} className={state.expired ? 'text-red-500' : 'text-brand-600 dark:text-brand-400'}>
      {state.label}
    </span>
  );
}
