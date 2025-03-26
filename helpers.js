/**
 * Format a message object for the chat UI
 * @param {string} text - The message text
 * @param {string} sender - The sender ('user' or 'bot')
 * @returns {Object} - A formatted message object
 */
export const formatMessage = (text, sender) => {
  return {
    sender,
    text,
    timestamp: new Date()
  };
}; 