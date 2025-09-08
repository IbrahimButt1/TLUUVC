'use client';

import { useEffect } from 'react';
import { markAllEmailsAsRead } from '@/lib/emails';

export default function InboxClient() {
  useEffect(() => {
    // This function will run on the client after the component mounts
    markAllEmailsAsRead();
  }, []);

  return null; // This component does not render anything
}
