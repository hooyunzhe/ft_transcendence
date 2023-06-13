'use client';

import callAPI from '@/lib/callAPI';
import ChannelMembers from '@/types/ChannelMembers';
import { Grid, List } from '@mui/material';
import { useEffect, useState } from 'react';
import { ChannelMemberDisplay } from './ChannelMemberDisplay';

export function ChannelMemberList() {
  const [channelMembers, setChannelMembers] = useState<ChannelMembers[]>([]);

  useEffect(() => {
    async function getChannelMembers() {
      const channelMembersData = JSON.parse(
        await callAPI('GET', 'channel_members'),
      );
      setChannelMembers(channelMembersData);
    }
    getChannelMembers();
  }, []);

  return (
    <>
      <Grid>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {channelMembers.map((obj: ChannelMembers, index: number) => (
            <ChannelMemberDisplay key={index} {...obj}></ChannelMemberDisplay>
          ))}
        </List>
      </Grid>
    </>
  );
}
