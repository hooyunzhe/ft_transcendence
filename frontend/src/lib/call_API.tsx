export default async function call_API(
  route: string,
  method: string,
  body?: any,
): Promise<string> {
  const domain = 'http://localhost:4242/api/';

  return fetch(domain + route, {
    cache: 'no-store',
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  })
    .then((data) => data.text())
    .catch((error) => {
      console.log('Error :', error);
      return error;
    });
}
