'use client';
import { Friend } from '@/types/FriendTypes';
import { Stack } from '@mui/system';
import { useState } from 'react';
import DialogPrompt from '../utils/LegacyDialogPrompt';
import FriendDisplay from './ChannelMemberFriendDisplay';
import { useChannelMembers } from '@/lib/stores/useChannelMemberStore';
import { useFriends } from '@/lib/stores/useFriendStore';

interface ChannelMemberAddPromptProps {
  addUser: (...args: any) => Promise<string>;
  channelHash: string;
}

export function ChannelMemberAddPrompt({
  addUser,
  channelHash,
}: ChannelMemberAddPromptProps) {
  const channelMembers = useChannelMembers();
  const friends = useFriends();
  const [selectedFriend, setSelectedFriend] = useState<Friend | undefined>();
  const [friendSearch, setFriendSearch] = useState('');

  async function handleAddMemberAction(): Promise<string> {
    if (selectedFriend === undefined) {
      return "Friend doesn't exist";
    }
    const friendToJoin = friends.find(
      (friend) => friend.id === selectedFriend.id,
    );

    if (!friendToJoin) {
      return 'Invalid friend name!';
    }
    return addUser(friendToJoin.incoming_friend.id, channelHash);
  }

  return (
    <DialogPrompt
      buttonText='Add members button'
      dialogTitle='Add members'
      dialogDescription='Add your friends to the channel'
      labelText='username'
      textInput={friendSearch}
      backButtonText='Cancel'
      onChangeHandler={(input) => {
        setFriendSearch(input);
        setSelectedFriend(undefined);
      }}
      backHandler={async () => {}}
      actionButtonText='Add'
      handleAction={async () => {
        const response = await handleAddMemberAction();

        if (!response) {
          setFriendSearch('');
          setSelectedFriend(undefined);
        }
        return response;
      }}
    >
      <Stack maxHeight={200} overflow='auto' spacing={1} sx={{ p: 1 }}>
        {friends.length > 0 &&
          friends
            .filter((friend) =>
              channelMembers.every((member) => {
                return member.user.id !== friend.incoming_friend.id;
              }),
            )
            .map((friend: Friend, index: number) => (
              <FriendDisplay
                key={index}
                selected={selectedFriend?.incoming_friend.id ?? 0}
                selectCurrent={() => {
                  setFriendSearch(friend.incoming_friend.username);
                  setSelectedFriend(friend);
                }}
                friend={friend}
              ></FriendDisplay>
            ))}
      </Stack>
    </DialogPrompt>
  );
}
