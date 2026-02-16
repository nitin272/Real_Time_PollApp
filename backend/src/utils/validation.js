// Validation utilities

export function validatePollCreation(question, options) {
  const errors = [];

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    errors.push('Question is required');
  }

  if (!Array.isArray(options)) {
    errors.push('Options must be an array');
  } else if (options.length < 2) {
    errors.push('At least 2 options are required');
  } else {
    const validOptions = options.filter(opt => 
      typeof opt === 'string' && opt.trim().length > 0
    );
    if (validOptions.length < 2) {
      errors.push('At least 2 valid options are required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateVote(poll, optionIndex) {
  if (!poll) {
    return { isValid: false, error: 'Poll not found' };
  }

  if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= poll.options.length) {
    return { isValid: false, error: 'Invalid option selected' };
  }

  return { isValid: true };
}
