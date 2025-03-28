document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  
  // Add disclaimer
  const disclaimerDiv = document.createElement('div');
  disclaimerDiv.className = 'disclaimer';
  disclaimerDiv.textContent = 'BSCare provides general health information, not medical advice. For medical concerns, please consult a healthcare professional.';
  document.querySelector('.chat-container').insertBefore(disclaimerDiv, chatMessages);
  
  // Store conversation history
  const conversationHistory = [];
  
  // Add welcome message
  addMessage("Hello! I'm BSCare, your health assistant. How can I help you today?", false);
  
  // Function to add a message to the chat
  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Auto scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to conversation history
    conversationHistory.push({
      role: isUser ? 'user' : 'assistant',
      content: content
    });
  }
  
  // Function to send message to the server
  async function sendMessage() {
    const query = userInput.value.trim();
    
    if (!query) return;
    
    // Add user message to chat
    addMessage(query, true);
    
    // Clear input
    userInput.value = '';
    
    try {
      // Show loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'message assistant';
      const loadingContent = document.createElement('div');
      loadingContent.className = 'message-content';
      loadingContent.textContent = 'Thinking...';
      loadingDiv.appendChild(loadingContent);
      chatMessages.appendChild(loadingDiv);
      
      // Use the mock API as the primary solution
      const response = await fetch('/api/mock-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          history: conversationHistory
        }),
      });
      
      // Remove loading indicator
      chatMessages.removeChild(loadingDiv);
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Add assistant response to chat
      addMessage(data.response);
      
    } catch (error) {
      console.error('Error:', error);
      addMessage('Sorry, I encountered an error. Please try again later.');
    }
  }
  
  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}); 