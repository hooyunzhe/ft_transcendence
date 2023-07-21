'use client';

import {
  MatchHistoryComponent,
  MatchHistoryHeadComponent,
} from '../../components/game/match_history';
// function Layout({rows}: LayoutProps)
// {
// //   return (

// };

<<<<<<< HEAD
 async function callAPIs(route: string) {
  const domain = `http://backend:3000/api/';
=======
async function callAPIs(route: string) {
  const domain = 'http://backend:3000/api/';
>>>>>>> 47abc119b3eb50e5874a2010d07e291fce0dacb5

  console.log(domain + route);

  return await fetch(domain + route, {
    cache: 'no-store',
  })
    .then((data) => data.json())
    .catch((error) => {
      console.log('Error :', error);
    });
}

export default async function matchHistoryPage() {
  const response = await callAPIs('match_history');
  return (
    <MatchHistoryHeadComponent>
      <MatchHistoryComponent rows={response} />
    </MatchHistoryHeadComponent>
  );
}
