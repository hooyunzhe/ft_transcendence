import ChannelMembers from '@/types/ChannelMemberTypes';
import { Friend } from '@/types/FriendTypes';
import { Stack } from '@mui/system';
import { useState } from 'react';
import DialogPrompt from '../utils/DialogPrompt';
import FriendDisplay from './ChannelMemberFriendDisplay';

interface ChannelMemberAddPromptProps {
  AddUser: (...args: any) => Promise<string>;
  friends: Friend[];
  channelMembers: ChannelMembers[];
}

export function ChannelMemberAddPrompt({
  AddUser,
  friends,
  channelMembers,
}: ChannelMemberAddPromptProps) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | undefined>();
  const [friendSearch, setFriendSearch] = useState('');

  function handleAddMemberAction() {

    console.log('HANDLE ADD BUTTON');
    if (!selectedFriend)
      return 'friend is undefined';
    const friendToJoin = friends.find(
      (friend) => friend.id === selectedFriend.id
    );
    // console.log(friendToJoin);


    if (!friendToJoin) {
      return 'Invalid friend name!';
    }
    return AddUser(selectedFriend.incoming_friend.id);
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
      backHandler={async () => { }}
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
        {friends
          .filter((friend) =>
            channelMembers.every((member) => {
              {
                return member.user.id !== friend.incoming_friend.id
              };
            }),
          )
          .map((friend: Friend, index: number) => (
            <FriendDisplay
              key={index}
              selected={selectedFriend?.incoming_friend.id ?? 0}
              selectCurrent={() => {
                // console.log('setSelectedFriend clicked');
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
