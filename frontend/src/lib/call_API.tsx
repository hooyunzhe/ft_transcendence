export default async function call_API(route: string): Promise<any> {
  const domain = 'http://localhost:4242/api/';

  console.log(domain + route);

  // await fetch(domain + route, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ intra_uid: 4242, username: 'WORKS' }),
  // });

  // return fetch(domain + route, {
  //   cache: 'no-store',
  // })
  //   .then((data) => data.json())
  //   .catch((error) => {
  //     console.log('Error :', error);
  //   });

  let res;

  await fetch(domain + route, {
    cache: 'no-store',
  })
    .then((data) => (res = data.json()))
    .catch((error) => {
      console.log('Error :', error);
      res = error;
    });

  return res;
}
