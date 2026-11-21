import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Image as ImageIcon, Minus, Sparkles, Check, CheckCheck, Loader2 } from "lucide-react";
import { io } from "socket.io-client";
import { useStore } from "../lib/store";

export default function ChatWidget() {
  const { user } = useStore();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8085";
  const customerTokenKey = import.meta.env.VITE_CUSTOMERTOKEN_NAME;

  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminTyping, setAdminTyping] = useState(false);

  // Guest form fields for non-logged in users
  const [guestName, setGuestName] = useState(() => localStorage.getItem("gemora_chat_guest_name") || "");
  const [guestEmail, setGuestEmail] = useState(() => localStorage.getItem("gemora_chat_guest_email") || "");
  const [needsGuestDetails, setNeedsGuestDetails] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get or generate persistent Guest ID
  const getGuestId = () => {
    let gid = localStorage.getItem("gemora_chat_guest_id");
    if (!gid) {
      gid = "guest_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("gemora_chat_guest_id", gid);
    }
    return gid;
  };

  // Scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Connect Socket.IO
  useEffect(() => {
    const socket = io(backendUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // Re-join conversation room if we already have one
      if (conversation?.conversationId) {
        socket.emit("join_conversation", { conversationId: conversation.conversationId });
      }
    });

    socket.on("new_message", ({ message, conversationId }) => {
      if (conversation?.conversationId === conversationId || !conversation) {
        setMessages((prev) => {
          if (prev.some((m) => m.messageId === message.messageId)) return prev;
          return [...prev, message];
        });

        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        } else {
          // If open, automatically mark as read
          socket.emit("mark_messages_read", {
            conversationId,
            readerType: "customer"
          });
        }
      }
    });

    socket.on("user_typing", ({ senderType }) => {
      if (senderType === "admin") {
        setAdminTyping(true);
      }
    });

    socket.on("user_stop_typing", ({ senderType }) => {
      if (senderType === "admin") {
        setAdminTyping(false);
      }
    });

    socket.on("messages_read", ({ readerType }) => {
      if (readerType === "admin") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderType === "customer" || msg.senderType === "guest"
              ? { ...msg, isRead: true }
              : msg
          )
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [backendUrl, conversation?.conversationId, isOpen]);

  // Initiate conversation with server
  const initiateChat = useCallback(async (forcedName, forcedEmail) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem(customerTokenKey);
      const guestId = !user ? getGuestId() : null;

      const payload = {
        guestId,
        name: user?.fullname || forcedName || guestName,
        email: user?.email || forcedEmail || guestEmail
      };

      const res = await fetch(`${backendUrl}/Chat/Initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user": "true",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.conversation) {
        setConversation(data.conversation);
        setMessages(data.messages || []);
        localStorage.setItem("gemora_chat_conv_id", data.conversation.conversationId);

        if (socketRef.current) {
          socketRef.current.emit("join_conversation", {
            conversationId: data.conversation.conversationId
          });
        }
        setNeedsGuestDetails(false);
      }
    } catch (err) {
      console.error("Chat initiation error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, customerTokenKey, guestEmail, guestName, user]);

  // Load chat on opening widget
  const handleOpenWidget = () => {
    setIsOpen(true);
    setUnreadCount(0);

    if (!user && !guestName && !localStorage.getItem("gemora_chat_guest_name")) {
      setNeedsGuestDetails(true);
      return;
    }

    if (!conversation) {
      initiateChat();
    } else if (socketRef.current) {
      socketRef.current.emit("mark_messages_read", {
        conversationId: conversation.conversationId,
        readerType: "customer"
      });
    }
  };

  const handleStartGuestChat = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    localStorage.setItem("gemora_chat_guest_name", guestName.trim());
    if (guestEmail.trim()) {
      localStorage.setItem("gemora_chat_guest_email", guestEmail.trim());
    }

    initiateChat(guestName.trim(), guestEmail.trim());
  };

  // Send message
  const handleSendMessage = async (textToSend = inputText, attachmentUrl = "") => {
    const text = (textToSend || "").trim();
    if (!text && !attachmentUrl) return;
    if (!conversation?.conversationId) return;

    const senderType = user ? "customer" : "guest";
    const senderName = user?.fullname || guestName || "Visitor";
    const senderId = user?._id || user?.customerid || getGuestId();

    const payload = {
      conversationId: conversation.conversationId,
      senderType,
      senderId: String(senderId),
      senderName,
      message: text,
      messageType: attachmentUrl ? "image" : "text",
      attachmentUrl
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("send_message", payload);
    } else {
      // Fallback via HTTP
      const token = localStorage.getItem(customerTokenKey);
      fetch(`${backendUrl}/Chat/SendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user": "true",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      }).catch(console.error);
    }

    setInputText("");

    // Notify stop typing
    if (socketRef.current && conversation?.conversationId) {
      socketRef.current.emit("typing_stop", {
        conversationId: conversation.conversationId,
        senderType
      });
    }
  };

  // Handle typing debounce
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (socketRef.current && conversation?.conversationId) {
      const senderType = user ? "customer" : "guest";
      socketRef.current.emit("typing_start", {
        conversationId: conversation.conversationId,
        senderType,
        senderName: user?.fullname || guestName || "Visitor"
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit("typing_stop", {
          conversationId: conversation.conversationId,
          senderType
        });
      }, 1500);
    }
  };

  // Upload image attachment
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem(customerTokenKey);
      const res = await fetch(`${backendUrl}/Chat/UploadAttachment`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });

      const data = await res.json();
      if (data.success && data.url) {
        handleSendMessage("", data.url);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={handleOpenWidget}
          aria-label="Open Gemora Live Chat"
          style={{
            position: "fixed",
            bottom: "26px",
            right: "26px",
            zIndex: 9998,
            width: "58px",
            height: "58px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #d4af37 0%, #aa8624 100%)",
            color: "#0a0c10",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(212, 175, 55, 0.35)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <MessageSquare size={26} strokeWidth={2.2} />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                backgroundColor: "#e11d48",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "700",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #0d0f12"
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            width: "min(390px, calc(100vw - 32px))",
            height: "560px",
            maxHeight: "calc(100vh - 48px)",
            backgroundColor: "#12151b",
            border: "1px solid #2a3140",
            borderRadius: "16px",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(212, 175, 55, 0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
            color: "#e5e7eb"
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px",
              background: "linear-gradient(135deg, #1c222c 0%, #101318 100%)",
              borderBottom: "1px solid #282f3c",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)",
                  border: "1px solid #d4af37",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#d4af37"
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600", letterSpacing: "0.5px", color: "#f3f4f6" }}>
                  Gemora Diam Concierge
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      display: "inline-block",
                      boxShadow: "0 0 6px #10b981"
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>Live Diamond Specialist</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Minimize Chat"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex"
                }}
              >
                <Minus size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex"
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              backgroundColor: "#0d0f14",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            {/* Guest Welcome Form */}
            {needsGuestDetails && !conversation && (
              <div
                style={{
                  padding: "18px",
                  backgroundColor: "#161b24",
                  border: "1px solid #2a3140",
                  borderRadius: "12px",
                  marginTop: "10px"
                }}
              >
                <h5 style={{ margin: "0 0 6px", fontSize: "14px", color: "#d4af37", fontWeight: "600" }}>
                  Welcome to Gemora Diam Atelier
                </h5>
                <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#9ca3af", lineHeight: "1.4" }}>
                  Please share your details so our diamond concierge can assist you seamlessly.
                </p>
                <form onSubmit={handleStartGuestChat} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        backgroundColor: "#0d0f14",
                        border: "1px solid #2d3340",
                        borderRadius: "6px",
                        color: "#f3f4f6",
                        fontSize: "13px",
                        outline: "none"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>
                      Email or WhatsApp (Optional)
                    </label>
                    <input
                      type="text"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="e.g. sarah@example.com"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        backgroundColor: "#0d0f14",
                        border: "1px solid #2d3340",
                        borderRadius: "6px",
                        color: "#f3f4f6",
                        fontSize: "13px",
                        outline: "none"
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      marginTop: "6px",
                      padding: "10px 14px",
                      background: "linear-gradient(135deg, #d4af37 0%, #aa8624 100%)",
                      color: "#0a0c10",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    {isLoading ? "Starting Chat..." : "Start Conversation"}
                  </button>
                </form>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>
                <Loader2 size={22} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                <span style={{ fontSize: "12px" }}>Connecting to Atelier Concierge...</span>
              </div>
            )}

            {/* Message List */}
            {messages.map((msg, index) => {
              const isMe = msg.senderType === "customer" || msg.senderType === "guest";
              const timeStr = new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div
                  key={msg.messageId || index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    alignSelf: isMe ? "flex-end" : "flex-start"
                  }}
                >
                  <div
                    style={{
                      padding: msg.messageType === "image" ? "6px" : "10px 14px",
                      borderRadius: isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                      backgroundColor: isMe ? "#1e2532" : "#242a38",
                      border: isMe ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid #2f3747",
                      color: "#f3f4f6",
                      fontSize: "13px",
                      lineHeight: "1.45",
                      wordBreak: "break-word"
                    }}
                  >
                    {msg.messageType === "image" && msg.attachmentUrl ? (
                      <div>
                        <img
                          src={msg.attachmentUrl}
                          alt="Attachment"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "220px",
                            borderRadius: "10px",
                            display: "block",
                            objectFit: "cover"
                          }}
                        />
                        {msg.message && <div style={{ padding: "8px 6px 4px" }}>{msg.message}</div>}
                      </div>
                    ) : (
                      msg.message
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "3px",
                      fontSize: "10px",
                      color: "#6b7280"
                    }}
                  >
                    <span>{timeStr}</span>
                    {isMe && (
                      msg.isRead ? (
                        <CheckCheck size={13} style={{ color: "#d4af37" }} />
                      ) : (
                        <Check size={13} style={{ color: "#6b7280" }} />
                      )
                    )}
                  </div>
                </div>
              );
            })}

            {/* Admin typing indicator */}
            {adminTyping && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  backgroundColor: "#1a1f29",
                  fontSize: "11px",
                  color: "#d4af37",
                  fontStyle: "italic",
                  border: "1px solid #2d3340"
                }}
              >
                Gemora Atelier is typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "#161a22",
              borderTop: "1px solid #252b37",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: "none" }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || (!conversation && needsGuestDetails)}
              aria-label="Attach Photo"
              style={{
                background: "transparent",
                border: "none",
                color: isUploading ? "#d4af37" : "#9ca3af",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={19} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={!conversation && needsGuestDetails}
              placeholder={needsGuestDetails ? "Please enter your name first..." : "Ask about diamonds, rings, shipping..."}
              style={{
                flex: 1,
                padding: "10px 14px",
                backgroundColor: "#0f1217",
                border: "1px solid #282e3c",
                borderRadius: "20px",
                color: "#f3f4f6",
                fontSize: "13px",
                outline: "none"
              }}
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || (!conversation && needsGuestDetails)}
              aria-label="Send Message"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: inputText.trim()
                  ? "linear-gradient(135deg, #d4af37 0%, #aa8624 100%)"
                  : "#232936",
                color: inputText.trim() ? "#0a0c10" : "#6b7280",
                border: "none",
                cursor: inputText.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
