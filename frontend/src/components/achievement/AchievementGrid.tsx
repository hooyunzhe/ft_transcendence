'use client';

import React, { useEffect, useState } from 'react';
import ListHeader from '../utils/ListHeader';
import { ListHeaderIcon } from '@/types/UtilTypes';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { Avatar, Box, Grid, ListItem, Paper, Typography } from '@mui/material';
import {
  useAchievement,
  useUserAchievement,
  useUserAchievementAction,
  useUserAchievementChecks,
} from '@/lib/stores/useUserAchievementStore';
import { Achievement } from '@/types/AchievementTypes';
import callAPI from '@/lib/callAPI';
import { UserAchievement } from '@/types/UserAchievementTypes';

export default function AchievementGrid() {
  const currentUser = useCurrentUser();
  const userAchievements = useUserAchievement();
  const achievements = useAchievement();
  const { getAchievementData, getUserAchievementData } =
    useUserAchievementAction();
  const { isAchieved } = useUserAchievementChecks();
  const [Achieved, setAchieved] = useState('false');

  async function getCurrentUserAchievement(
    userID: number,
  ): Promise<UserAchievement[]> {
    const userAchievementData = JSON.parse(
      await callAPI(
        'GET',
        'user-achievements?search_type=USER&search_number=' + userID,
      ),
    );
    return userAchievementData;
  }

  useEffect(() => {
    getAchievementData();
    getUserAchievementData();
    // const test = getCurrentUserAchievement();
    // const test2 = getAchievementsByUser(currentUser.id);
  }, []);

  return (
    <>
      <ListHeader
        title='Achievements'
        icon={ListHeaderIcon.ACHIEVEMENTS}
      ></ListHeader>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', padding: '20px 30px' }}>
        {achievements.map((achievement: Achievement, index: number) => (
          <>
            <Box
              sx={{
                width: '50%',
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'center',
              }}
            >
              <Paper
                sx={{
                  margin: '10px',
                  padding: '20px',
                  width: '90%',
                  boxSizing: 'border-box',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    opacity: `${
                      isAchieved(currentUser.id, achievement.id) ? 1 : 0.3
                    }`,
                  }}
                >
                  <Avatar>W</Avatar>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      margin: '0 0 0 10px',
                    }}
                  >
                    <Typography>{achievement.name}</Typography>
                    <Typography fontSize={15}>
                      {achievement.description}
                    </Typography>
                    {/* <Typography fontSize={15}>{achievement.id}</Typography> */}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </>
        ))}
      </Box>
    </>
  );
}
