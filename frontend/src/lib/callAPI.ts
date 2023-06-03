export default async function callAPI(
  method: string,
  route: string,
  body?: any,
): Promise<string> {
  const domain = 'http://localhost:4242/api/';

  return fetch(domain + route, {
    cache: 'no-store',
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((data) => data.text())
    .catch((error) => {
      console.log('Error :', error);
      return error;
    });
}
