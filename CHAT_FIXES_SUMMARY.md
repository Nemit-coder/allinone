# Chat Feature - Issues & Fixes Summary

## Problems Identified

### 1. **Critical Database Query Bug** 🔴
**Issue:** Messages not loading when returning to a chat
- **File:** `backend/src/controllers/chat.controller.ts` (line 58)
- **Problem:** Query used `conversation` field instead of `conversationId`
- **Impact:** `Message.find({ conversation: conversationId })` returned empty results because the Message model uses field name `conversationId`
- **Fix:** Changed to `Message.find({ conversationId: conversationId })`

### 2. **Messages Lost on Tab Switch**
**Issue:** When user changes tabs and returns to chat, previous messages disappear
- **Root Cause:** Messages stored only in React state (`const [messages, setMessages] = useState<Message[]>([])`)
- **What happens:**
  - User navigates away from Chat page → component state resets
  - User returns to Chat page → component re-mounts with fresh state
  - Previous messages are lost (but database has them)
- **Fix:** Added proper cleanup and re-fetching on reconnection

### 3. **Missing Room Leave Event**
**Issue:** When user navigates away, they stay joined to the conversation room
- **Problem:** Client never told server to leave the room, causing unnecessary socket subscriptions
- **Fix:** Added `conversation:leave` socket event handler in backend

### 4. **Weak Socket Reconnection Handling**
**Issue:** After logout/login or network reconnection, messages wouldn't reload
- **Problem:** 
  - Socket configuration had no reconnection settings
  - No handler for when socket reconnects
  - Auth token wasn't refreshed on reconnection attempts
- **Fix:** Added reconnection options and `reconnect_attempt` handler

---

## Changes Made

### Backend Changes

#### 1. **chat.controller.ts** - Fixed query field
```typescript
// BEFORE (line 58) ❌
const messages = await Message.find({ conversation: conversationId })

// AFTER ✅
const messages = await Message.find({ conversationId: conversationId })
```

#### 2. **socketHandler.ts** - Added room leave event & logging
```typescript
// NEW: Added conversation:leave handler
socket.on("conversation:leave", (conversationId: string) => {
  socket.leave(conversationId);
  console.log(`User ${userId} left conversation ${conversationId}`);
});

// IMPROVED: Added logging for debugging
console.log(`✅ Socket connected: userId=${userId}, socketId=${socket.id}, conversations=${conversations.length}`);
```

---

### Frontend Changes

#### 1. **socket.ts** - Enhanced reconnection capabilities
```typescript
// IMPROVED: Socket configuration with reconnection options
socket = io((import.meta as any).env.VITE_API_URL, {
  auth: { token: getAccessToken() },
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,           // Enable auto-reconnect
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

// NEW: Update auth token on reconnection attempts
socket.on("reconnect_attempt", () => {
  socket!.auth = { token: getAccessToken() };
});
```

#### 2. **Chat.tsx** - Multiple improvements

**a) Fixed message loading with proper error handling:**
```typescript
api.get(`/chat/messages/${activeConv._id}`)
  .then((res) => {
    setMessages(res.data.messages ?? [])
  })
  .catch((err) => {
    console.error("Failed to load messages:", err)
    setMessages([])
  })
  .finally(() => setMsgLoading(false))
```

**b) Added room leave on unmount:**
```typescript
useEffect(() => {
  // ... fetch and join
  
  // Cleanup: Leave the conversation room when switching or unmounting
  return () => {
    socket.emit("conversation:leave", activeConv._id)
  }
}, [activeConv?._id])
```

**c) Added socket reconnection handler:**
```typescript
useEffect(() => {
  const handleReconnect = () => {
    console.log("Socket reconnected")
    // Rejoin active conversation room and reload messages
    if (activeConv) {
      socket.emit("conversation:join", activeConv._id)
      socket.emit("message:read", { conversationId: activeConv._id })
      
      // Reload messages after reconnection
      setMsgLoading(true)
      api.get(`/chat/messages/${activeConv._id}`)
        .then((res) => setMessages(res.data.messages ?? []))
        .catch(console.error)
        .finally(() => setMsgLoading(false))
    }
  }

  socket.on("connect", handleReconnect)
  
  return () => {
    socket.off("connect", handleReconnect)
  }
}, [activeConv?._id])
```

**d) Prevented duplicate messages:**
```typescript
const handleReceive = (msg: Message) => {
  if (activeConv && msg.conversationId === activeConv._id) {
    setMessages((prev) => {
      // Avoid duplicates
      const isDuplicate = prev.some((m) => m._id === msg._id)
      return isDuplicate ? prev : [...prev, msg]
    })
    socket.emit("message:read", { conversationId: activeConv._id })
  }
  // ... rest of handler
}
```

**e) Added myId to dependency array:**
```typescript
}, [activeConv?._id, myId])  // Added myId dependency
```

---

## How It Works Now

### Scenario 1: User Changes Tabs and Returns
```
1. User in Chat tab
   ↓
2. User switches to Home tab
   ↓ 
3. Socket emits "conversation:leave" (cleanup effect)
   ↓
4. User switches back to Chat tab
   ↓
5. useEffect triggered (activeConv changed)
   ↓
6. API fetches messages from database ✅
   ↓
7. Socket emits "conversation:join"
   ↓
8. Messages appear in UI
```

### Scenario 2: User Logs Out and Logs In
```
1. User clicks Logout
   ↓
2. AppLayout calls api.post("/auth/logout")
   ↓
3. Backend clears refresh token from DB and cookie
   ↓
4. Frontend calls disconnectSocket()
   ↓
5. Socket is disconnected and set to null
   ↓
6. User logs in
   ↓
7. New access token is generated
   ↓
8. User navigates to Chat
   ↓
9. connectSocket() called with new token
   ↓
10. Socket reconnects with fresh auth
    ↓
11. Server auto-joins all conversation rooms
    ↓
12. Frontend fetches messages via API ✅
    ↓
13. Messages appear in UI
```

### Scenario 3: Network Reconnection
```
1. Socket disconnects (network issue)
   ↓
2. Socket.io auto-attempts reconnection (built-in)
   ↓
3. "reconnect_attempt" event → updates auth token
   ↓
4. Socket reconnects
   ↓
5. "connect" event → handleReconnect() fires
   ↓
6. Rejoin active conversation room
   ↓
7. Reload messages from API ✅
   ↓
8. Resume chatting seamlessly
```

---

## Testing Checklist

- [ ] **Test 1:** Open chat, switch tabs, return → messages should appear
- [ ] **Test 2:** Open chat, refresh page → messages should appear
- [ ] **Test 3:** Chat with another user (live), switch tabs, return → both users' messages should appear
- [ ] **Test 4:** Logout from chat page, login, navigate to same chat → messages should appear
- [ ] **Test 5:** Simulate network disconnect, reconnect → messages should resume loading
- [ ] **Test 6:** Send message, switch tabs, return → new message should appear
- [ ] **Test 7:** Multiple users chatting, both switch tabs, return → all messages preserved
- [ ] **Test 8:** Check browser console for socket connection logs
- [ ] **Test 9:** Verify no duplicate messages appear
- [ ] **Test 10:** Open multiple chats, switch between them → correct messages for each

---

## Key Files Modified

| File | Changes |
|------|---------|
| `backend/src/controllers/chat.controller.ts` | Fixed query field: `conversation` → `conversationId` |
| `backend/src/socket/socketHandler.ts` | Added conversation:leave event, improved logging |
| `frontend/src/lib/socket.ts` | Enhanced reconnection config, added token refresh on reconnect |
| `frontend/src/pages/Chat.tsx` | Better error handling, reconnection handler, room cleanup, duplicate prevention |

---

## Additional Notes

- ✅ AppLayout already calls `disconnectSocket()` on logout (no changes needed)
- ✅ Socket configuration uses websocket transport only
- ✅ Authentication verified via JWT on every socket connection
- ✅ Auto-join all conversation rooms on connect
- ✅ Auto-leave conversation rooms on component unmount
- ⚠️ Make sure `.env` has correct `VITE_API_URL` on frontend
- ⚠️ Make sure `ACCESS_TOKEN_SECRET` matches between frontend token generation and backend verification

---

## Performance Improvements

1. **Reduced API Calls:** Messages fetched only when needed
2. **Better Memory Management:** Proper cleanup of socket listeners
3. **Optimized Reconnection:** Doesn't spam reconnection attempts
4. **Duplicate Prevention:** No duplicate messages in state
5. **Efficient Room Management:** Joins/leaves rooms on demand

---

Generated: 2026-06-05
