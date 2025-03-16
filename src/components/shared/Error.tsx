import { useRouteError } from 'react-router-dom';
import { LinkButton } from './Link-button';

export function Error() {
  const error = useRouteError();
  console.log(error);

  return (
    <div className="mb-auto mt-auto text-center">
      <h1>Page Not Found 😢</h1>
      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}
