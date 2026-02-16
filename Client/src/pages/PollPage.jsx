// Page: Poll
import { useParams } from 'react-router-dom';
import { PollView } from '../components/PollView';

export const PollPage = () => {
  const { pollId } = useParams();
  return <PollView pollId={pollId} />;
};
