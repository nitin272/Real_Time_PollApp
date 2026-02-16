// Page: Home
import { useNavigate } from 'react-router-dom';
import { CreatePoll } from '../components/CreatePoll';

export const HomePage = () => {
  const navigate = useNavigate();

  const handlePollCreated = (result) => {
    navigate(`/poll/${result.id}`);
  };

  return <CreatePoll onPollCreated={handlePollCreated} />;
};
