'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AlertDialogDemo() {

    return (
    <>
        <button onClick={() => toast.error('My first toast')}>
            Give me a toast
        </button>
    </>


    )
}
