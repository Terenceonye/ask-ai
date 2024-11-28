document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
  
    // Function to add a message to the chat box
    function addMessage(message, isUser = false) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");
      messageDiv.classList.add(isUser ? "user-message" : "bot-message");
      messageDiv.textContent = message;
      chatBox.appendChild(messageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    // Function to simulate bot response
    async function getBotResponse(userMessage) {
      addMessage("Thinking...", false);
  
      try {
        const response = await fetch("http://localhost:3000/qa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ context: "Provide answers to Nigerian current affairs.", question: userMessage }),
        });
  
        const data = await response.json();
        const botMessage = data.answer || "Sorry, I don't have an answer for that.";
        addMessage(botMessage, false);
      } catch (error) {
        addMessage("Error connecting to the bot. Please try again later.", false);
      }
    }
  
    // Handle form submission
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userMessage = userInput.value.trim();
      if (!userMessage) return;
  
      addMessage(userMessage, true); // Add user message to the chat
      userInput.value = ""; // Clear input field
  
      getBotResponse(userMessage); // Get response from the bot
    });
  });
  