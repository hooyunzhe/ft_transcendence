"use client";

import {MatchHistoryComponent, MatchHistoryHeadComponent} from "../../components/match_history"
// function Layout({rows}: LayoutProps)
// {
// //   return (
    
// };

 async function callAPIs(route: string) {
  const domain = 'http://backend:3000/api/';

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
   const response = await callAPIs("match_history");
		return(<MatchHistoryHeadComponent>
			<MatchHistoryComponent rows={response} />
		</MatchHistoryHeadComponent> )
}

