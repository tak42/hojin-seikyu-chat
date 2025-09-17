import { useUser } from 'hooks/useUser';
import { PageLayout } from 'layouts/PageLayout';

export default function CityAdmin() {
  const { user } = useUser();

  return (
    <PageLayout
      render={(user) => (
        <div>
          <h1>sss</h1>
        </div>
      )}
    />
  );
}
