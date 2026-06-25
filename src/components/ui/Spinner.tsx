import { cn } from '@/lib/utils';

export function Spinner({ className, id }: { className?: string; id?: string }) {
  return (
    <span
      id={id}
      className={cn('inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent', className)}
    />
  );
}

export function PageLoader({ id = 'page-loader' }: { id?: string }) {
  return (
    <div id={id} className="flex min-h-[50vh] w-full items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  );
}
