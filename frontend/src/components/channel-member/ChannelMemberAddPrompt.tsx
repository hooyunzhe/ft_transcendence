import ChannelMembers from '@/types/ChannelMemberTypes';
import { Friend } from '@/types/FriendTypes';
import { Stack } from '@mui/system';
import { useState } from 'react';
import DialogPrompt from '../DialogPrompt';
import FriendDisplay from './ChannelMemberFriendDisplay';

interface ChannelMemberAddPromptProps {
  handleAddButtonAction: (...args: any) => Promise<string>;
  friends: Friend[];
  channelMembers: ChannelMembers[];
}

export function ChannelMemberAddPrompt({
  handleAddButtonAction,
  friends,
  channelMembers,
}: ChannelMemberAddPromptProps) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | undefined>();
  const [friendSearch, setFriendSearch] = useState('');

  return (
    <DialogPrompt
      // closeHandler={async () => {}}
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
        const response = handleAddButtonAction(friendSearch, selectedFriend);

        if (!response) {
          setFriendSearch('');
          setSelectedFriend(undefined);
        }
        return response;
      }}
    >
      <Stack maxHeight={200} overflow='auto' spacing={1} sx={{ p: 1 }}>
        {friends
          .filter((friend) =>
            channelMembers.every((member) => {
              return member.id !== friend.incoming_friend.id;
            }),
          )
          .map((friend: Friend, index: number) => (
            <FriendDisplay
              key={index}
              selected={selectedFriend?.incoming_friend.id ?? 0}
              selectCurrent={() => {
                console.log('setSelectedFriend clicked');
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
