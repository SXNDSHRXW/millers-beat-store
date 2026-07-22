import { Suspense } from 'react';
import { SuccessContent } from './SuccessContent';

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20" />}> 
      <SuccessContent />
    </Suspense>
  );
}
