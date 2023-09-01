'use client';
import { useEffect, useState } from 'react';
import InputField from '../utils/InputField';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useFriendActions, useFriends } from '@/lib/stores/useFriendStore';
import { useFriendSocket } from '@/lib/stores/useSocketStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { User } from '@/types/UserTypes';
import { Friend, FriendStatus } from '@/types/FriendTypes';
import { FriendCategory } from '@/types/UtilTypes';

export default function FriendAddPrompt() {
  const currentUser = useCurrentUser();
  const friends = useFriends();
  const friendSocket = useFriendSocket();
  const { addFriend } = useFriendActions();
  const { resetDialog, resetTriggers } = useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { displayNotification } = useNotificationActions();
  const { setCurrentFriendCategory } = useUtilActions();
  const [usernameToSearch, setUsernameToSearch] = useState('');
  const { handleAchievementsEarned } = useAchievementActions();

  async function getUserByName(name: string): Promise<User | null> {
    return await callAPI(
      'GET',
      `users?search_type=NAME&search_string=${name}`,
    ).then((res) => res.body);
  }

  function checkFriendship(incomingID: number): string {
    const friendshipFound = friends.find(
      (friend: Friend) => friend.incoming_friend.id === incomingID,
    );

    if (friendshipFound) {
      switch (friendshipFound.status) {
        case FriendStatus.FRIENDS:
          return 'User is already a friend';
        case FriendStatus.PENDING:
          return 'User already invited you';
        case FriendStatus.INVITED:
          return 'User already invited';
        case FriendStatus.BLOCKED:
          return 'User already blocked';
      }
    }
    return '';
  }

  async function handleAddFriendAction(): Promise<void> {
    const userToAdd = await getUserByName(usernameToSearch);
    if (!userToAdd) {
      throw 'User not found';
    }
    const errorMessage = checkFriendship(userToAdd.id);
    if (errorMessage) {
      throw errorMessage;
    }
    if (userToAdd.id === currentUser.id) {
      throw 'No, you simply cannot add yourself smartie pants';
    }

    const newRequests = await callAPI('POST', 'friends', {
      outgoing_id: currentUser.id,
      incoming_id: userToAdd.id,
    }).then((res) => res.body);

    if (newRequests) {
      addFriend(newRequests[0]);
      emitToSocket(friendSocket, 'newRequest', {
        outgoing_request: newRequests[0],
        incoming_request: newRequests[1],
      });
      await handleAchievementsEarned(
        currentUser.id,
        1,
        displayNotification,
      ).then(
        (earned) => earned && displayNotification('success', 'Request sent'),
      );
      setCurrentFriendCategory(FriendCategory.INVITED);
    } else {
      console.log('FATAL ERROR: FAILED TO ADD FRIEND IN BACKEND');
    }
  }

  async function handleAction(): Promise<void> {
    handleAddFriendAction()
      .then(resetDialog)
      .catch((error) => {
        resetTriggers();
        displayNotification('error', error);
      });
  }

  useEffect(() => {
    if (actionClicked) {
      handleAction();
    }
    if (backClicked) {
      resetDialog();
    }
  }, [actionClicked, backClicked]);

  return (
    <InputField
      label='Username'
      value={usernameToSearch}
      onChange={setUsernameToSearch}
      onSubmit={handleAction}
    />
  );
}
