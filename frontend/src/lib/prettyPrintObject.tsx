export default function prettyPrintObject(obj: object): JSX.Element {
  return (
    <>
      {Array.isArray(obj) ? '[' : '{'}
      <br />
      {Object.entries(obj).map((element, index) => {
        const [key, value] = element;
        return (
          <div key={index} style={{ marginLeft: '30px' }}>
            {typeof value === 'object'
              ? prettyPrintObject(value)
              : key + ': ' + value + ','}
          </div>
        );
      })}
      {Array.isArray(obj) ? ']' : '}'}
    </>
  );
}
