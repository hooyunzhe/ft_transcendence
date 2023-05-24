import { ChannelList } from '@/components/ChannelList';
import React, { useState } from 'react';
export default function Home() {
  //@ts-expect-error Server Component
  return <ChannelList API={'channels'}></ChannelList>;
}
