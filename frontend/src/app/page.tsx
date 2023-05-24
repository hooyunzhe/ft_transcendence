import { FriendList } from '@/components/FriendList';
import React, { useState } from 'react';
export default function Home() {
  //@ts-expect-error Server Component
  return <FriendList API={'friends'}></FriendList>;
}
