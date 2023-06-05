import ChannelHeader from '@/components/ChannelHeader';
import { ChannelList } from '@/components/ChannelList';
import React, { useState } from 'react';
export default function Home() {
  return (
    <>
    <ChannelHeader></ChannelHeader>
    {/* @ts-expect-error Server Component  */}
    <ChannelList API={'channels'}></ChannelList>
  </>
  );
}
