<template>
  <div class="chat">
    <header class="chat-header">
      <h1>Live Chat</h1>
      <div class="connection-status" :class="{ connected: isConnected }">
        <span class="status-dot"></span>
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </div>
    </header>

    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message"
          :class="{ 'own-message': message.userId === currentUser.id }"
        >
          <div class="message-avatar">
            {{ message.userId === currentUser.id ? currentUser.avatar : '👤' }}
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-username">{{ message.username }}</span>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="message-text">{{ message.text }}</div>
          </div>
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="chat-input-form">
        <div class="input-container">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type your message..."
            :disabled="!isConnected"
            class="message-input"
          />
          <button
            type="submit"
            :disabled="!newMessage.trim() || !isConnected"
            class="send-button"
          >
            Send
          </button>
        </div>
      </form>
    </div>

    <div class="online-users">
      <h3>Online Users ({{ onlineUsers.length }})</h3>
      <div class="users-list">
        <div v-for="user in onlineUsers" :key="user.id" class="user-item">
          <span class="user-avatar">{{ user.avatar }}</span>
          <span class="user-name">{{ user.name }}</span>
          <span v-if="user.id === currentUser.id" class="user-badge">(You)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'

// Reactive state
const messages = ref([])
const newMessage = ref('')
const isConnected = ref(false)
const messagesContainer = ref(null)

const currentUser = reactive({
  id: 'user-' + Math.random().toString(36).substr(2, 9),
  name: 'You',
  avatar: '😊'
})

const onlineUsers = ref([
  currentUser,
  { id: 'user-2', name: 'Alice', avatar: '👩' },
  { id: 'user-3', name: 'Bob', avatar: '👨' },
  { id: 'user-4', name: 'Charlie', avatar: '🧑' }
])

// Mock WebSocket simulation
let messageInterval = null
let connectionTimeout = null

const connectToChat = () => {
  // Simulate connection delay
  connectionTimeout = setTimeout(() => {
    isConnected.value = true

    // Add initial messages
    addMessage({
      id: 'msg-1',
      userId: 'user-2',
      username: 'Alice',
      text: 'Welcome to the chat room! 👋',
      timestamp: new Date(Date.now() - 300000)
    })

    addMessage({
      id: 'msg-2',
      userId: 'user-3',
      username: 'Bob',
      text: 'Hey everyone! How\'s it going?',
      timestamp: new Date(Date.now() - 120000)
    })

    // Simulate random incoming messages
    startMessageSimulation()
  }, 1000)
}

const startMessageSimulation = () => {
  const mockMessages = [
    'That\'s awesome! 🎉',
    'I agree with that point',
    'Has anyone tried the new feature?',
    'Looking forward to the update',
    'Great discussion everyone!',
    'I\'ll check that out later',
    'Thanks for sharing!',
    'Interesting perspective 🤔'
  ]

  messageInterval = setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance
      const randomUser = onlineUsers.value.filter(u => u.id !== currentUser.id)[Math.floor(Math.random() * 3)]
      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)]

      addMessage({
        id: 'msg-' + Date.now(),
        userId: randomUser.id,
        username: randomUser.name,
        text: randomMessage,
        timestamp: new Date()
      })
    }
  }, 3000)
}

const addMessage = (message) => {
  messages.value.push(message)
  nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !isConnected.value) return

  const message = {
    id: 'msg-' + Date.now(),
    userId: currentUser.id,
    username: currentUser.name,
    text: newMessage.value.trim(),
    timestamp: new Date()
  }

  addMessage(message)
  newMessage.value = ''
}

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Lifecycle
onMounted(() => {
  connectToChat()
})

onUnmounted(() => {
  if (messageInterval) clearInterval(messageInterval)
  if (connectionTimeout) clearTimeout(connectionTimeout)
})
</script>

<style scoped>
.chat {
  display: grid;
  grid-template-columns: 1fr 300px;
  height: calc(100vh - 2rem);
  max-width: 1400px;
  margin: 1rem auto;
  gap: 2rem;
  padding: 0 2rem;
}

.chat-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.chat-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: #fee2e2;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}

.connection-status.connected {
  background: #dcfce7;
  color: #16a34a;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.chat-container {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: calc(100vh - 200px);
}

.message {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.message.own-message {
  flex-direction: row-reverse;
}

.message.own-message .message-content {
  background: #3b82f6;
  color: white;
}

.message.own-message .message-header {
  text-align: right;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.message-content {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  max-width: 70%;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.message-username {
  font-weight: 600;
  font-size: 0.875rem;
  opacity: 0.8;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.6;
}

.message-text {
  line-height: 1.5;
}

.chat-input-form {
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.input-container {
  display: flex;
  gap: 1rem;
}

.message-input {
  flex: 1;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #3b82f6;
}

.message-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
}

.send-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.send-button:hover:not(:disabled) {
  background: #2563eb;
}

.send-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.online-users {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  height: fit-content;
}

.online-users h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-item:hover {
  background: #f8fafc;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.user-name {
  font-weight: 500;
  color: #2c3e50;
}

.user-badge {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

@media (max-width: 1024px) {
  .chat {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
    margin: 0;
    padding: 1rem;
    gap: 1rem;
  }

  .online-users {
    display: none;
  }
}

@media (max-width: 768px) {
  .chat {
    padding: 0.5rem;
  }

  .chat-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .message-content {
    max-width: 85%;
  }

  .input-container {
    flex-direction: column;
  }

  .send-button {
    align-self: flex-end;
  }
}
</style>