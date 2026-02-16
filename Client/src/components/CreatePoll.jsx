// Component: Create Poll
import { useState } from 'react';
import { useCreatePoll } from '../hooks/useCreatePoll';
import './CreatePoll.css';

export const CreatePoll = ({ onPollCreated }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { createPoll, loading, error } = useCreatePoll();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createPoll(question, options);
      onPollCreated(result);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="create-poll">
      <h1>Create a Poll</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What's your question?"
            required
          />
        </div>

        <div className="form-group">
          <label>Options</label>
          {options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="btn-remove"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddOption} className="btn-add">
            + Add Option
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
};
