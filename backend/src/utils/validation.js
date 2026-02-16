// Validation utilities

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

export function validatePollCreation(question, options) {
  const errors = [];

  const sanitizedQuestion = sanitizeString(question);
  
  if (!sanitizedQuestion || sanitizedQuestion.length === 0) {
    errors.push('Question is required');
  } else if (sanitizedQuestion.length > 200) {
    errors.push('Question must be 200 characters or less');
  }

  if (!Array.isArray(options)) {
    errors.push('Options must be an array');
  } else if (options.length < 2) {
    errors.push('At least 2 options are required');
  } else if (options.length > 10) {
    errors.push('Maximum 10 options allowed');
  } else {
    const validOptions = options.filter(opt => {
      const sanitized = sanitizeString(opt);
      return sanitized.length > 0 && sanitized.length <= 100;
    });
    
    if (validOptions.length < 2) {
      errors.push('At least 2 valid options are required');
    }

    const uniqueOptions = new Set(options.map(opt => sanitizeString(opt).toLowerCase()));
    if (uniqueOptions.size !== validOptions.length) {
      errors.push('Options must be unique');
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
