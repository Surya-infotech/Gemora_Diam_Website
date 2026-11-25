import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  X,
  Send,
  Image as ImageIcon,
  Minus,
  Sparkles,
  Check,
  CheckCheck,
  Loader2,
  User,
  LogIn,
  LogOut,
  Mail,
  Lock,
  Phone
} from "lucide-react";
import { io } from "socket.io-client";
import { useStore } from "../lib/store";

export default function ChatWidget() {
  const { user, login, logout } = useStore();
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

  // Authentication & Guest Tab state
  const [authTab, setAuthTab] = useState("signin"); // "signin" | "guest"
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState("");

  // Guest form fields for non-logged in users
  const [guestName, setGuestName] = useState(() => localStorage.getItem("gemora_chat_guest_name") || "");
  const [guestEmail, setGuestEmail] = useState(() => localStorage.getItem("gemora_chat_guest_email") || "");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const prevUserRef = useRef(user);

  // Clear errors when authTab changes
  useEffect(() => {
    setAuthError("");
  }, [authTab]);

  // Handle user authentication state changes (logout, login, switch account)
  useEffect(() => {
    const prevUser = prevUserRef.current;

    // Detect logout (was signed in, now logged out)
    if (prevUser && !user) {
      setConversation(null);
      setMessages([]);
      setInputText("");
      setUnreadCount(0);
      setIsOpen(false);
      setAuthTab("signin");
      setAuthError("");
      setGuestName("");
      setGuestEmail("");

      try {
        localStorage.removeItem("gemora_chat_conv_id");
        localStorage.removeItem("gemora_chat_guest_id");
        localStorage.removeItem("gemora_chat_guest_name");
        localStorage.removeItem("gemora_chat_guest_email");
      } catch {
        // ignore
      }

      if (socketRef.current && conversation?.conversationId) {
        socketRef.current.emit("leave_conversation", conversation.conversationId);
      }
    }
    // Detect switching to a different user account
    else if (
      prevUser &&
      user &&
      (prevUser._id !== user._id || prevUser.customerid !== user.customerid || prevUser.email !== user.email)
    ) {
      setConversation(null);
      setMessages([]);
      setInputText("");
      setUnreadCount(0);
      setAuthError("");

      try {
        localStorage.removeItem("gemora_chat_conv_id");
      } catch {
        // ignore
      }

      if (socketRef.current && conversation?.conversationId) {
        socketRef.current.emit("leave_conversation", conversation.conversationId);
      }
    }
    // Detect logging in (from guest/null to user)
    else if (!prevUser && user) {
      setAuthError("");
      // Reset any previous unauthenticated/guest session so user starts clean with their account
      setConversation(null);
      setMessages([]);
      setInputText("");
      setUnreadCount(0);

      try {
        localStorage.removeItem("gemora_chat_conv_id");
        localStorage.removeItem("gemora_chat_guest_id");
        localStorage.removeItem("gemora_chat_guest_name");
        localStorage.removeItem("gemora_chat_guest_email");
      } catch {
        // ignore
      }
    }

    prevUserRef.current = user;
  }, [user, conversation?.conversationId]);

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
  const initiateChat = useCallback(
    async (forcedName, forcedEmail, initialMsg = "") => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem(customerTokenKey);
        const guestId = !user ? getGuestId() : null;

        const payload = {
          guestId,
          name: forcedName || user?.fullname || guestName || "Visitor",
          email: forcedEmail || user?.email || guestEmail || "",
          initialMessage: (initialMsg || "").trim()
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
          if (initialMsg) {
            setInputText("");
          }
        }
      } catch (err) {
        console.error("Chat initiation error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [backendUrl, customerTokenKey, guestEmail, guestName, user]
  );

  // Load chat on opening widget
  const handleOpenWidget = () => {
    setIsOpen(true);
    setUnreadCount(0);

    if (conversation?.conversationId && socketRef.current) {
      socketRef.current.emit("mark_messages_read", {
        conversationId: conversation.conversationId,
        readerType: "customer"
      });
    }
  };

  // Handle direct sign-in from inside chat widget
  const handleInlineSignIn = async (e) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPassword) return;

    try {
      setIsSigningIn(true);
      setAuthError("");
      const res = await login({ email: signInEmail.trim(), password: signInPassword });
      if (res && res.success && res.customer) {
        // Auto initiate or resume conversation for the newly signed in user
        await initiateChat(res.customer.fullname, res.customer.email);
      } else {
        setAuthError(res?.error || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      setAuthError(err.message || "Sign in failed. Please verify your credentials.");
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle guest chat start
  const handleStartGuestChat = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    localStorage.setItem("gemora_chat_guest_name", guestName.trim());
    if (guestEmail.trim()) {
      localStorage.setItem("gemora_chat_guest_email", guestEmail.trim());
    }

    initiateChat(guestName.trim(), guestEmail.trim());
  };

  // Sign out handler from inside the widget
  const handleLogoutFromChat = () => {
    logout();
    setConversation(null);
    setMessages([]);
    setInputText("");
    setUnreadCount(0);
    setIsOpen(false);
    setAuthTab("signin");
    setAuthError("");
    setGuestName("");
    setGuestEmail("");
    try {
      localStorage.removeItem("gemora_chat_conv_id");
      localStorage.removeItem("gemora_chat_guest_id");
      localStorage.removeItem("gemora_chat_guest_name");
      localStorage.removeItem("gemora_chat_guest_email");
    } catch {
      // ignore
    }
  };

  // Send message
  const handleSendMessage = async (textToSend = inputText, attachmentUrl = "") => {
    const text = (textToSend || "").trim();
    if (!text && !attachmentUrl) return;

    // If conversation is not yet initiated, initiate it first with this message
    if (!conversation?.conversationId) {
      if (user) {
        initiateChat(user.fullname, user.email, text);
        return;
      }
      if (guestName.trim()) {
        initiateChat(guestName.trim(), guestEmail.trim(), text);
        return;
      }
      return;
    }

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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
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
                  color: "#d4af37",
                  flexShrink: 0
                }}
              >
                <Sparkles size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600", letterSpacing: "0.5px", color: "#f3f4f6" }}>
                  Gemora Diam Concierge
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      display: "inline-block",
                      boxShadow: "0 0 6px #10b981",
                      flexShrink: 0
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>Live Diamond Specialist</span>
                  {user && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        color: "#d4af37",
                        backgroundColor: "rgba(212,175,55,0.12)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        border: "1px solid rgba(212,175,55,0.25)",
                        maxWidth: "110px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                      title={`Signed in as ${user.fullname} (${user.email})`}
                    >
                      ✦ {user.fullname.split(" ")[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
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
            {/* INITIAL WELCOME / IDENTITY CARD (When conversation is not yet active) */}
            {!conversation && (
              user ? (
                /* ======================================================== */
                /* CASE 1: SIGNED-IN CLIENT ACCOUNT DETAILS CARD            */
                /* ======================================================== */
                <div
                  style={{
                    padding: "18px",
                    backgroundColor: "#161b24",
                    border: "1px solid rgba(212, 175, 55, 0.4)",
                    borderRadius: "14px",
                    marginTop: "4px",
                    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.45)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Sparkles size={13} style={{ color: "#d4af37" }} />
                      <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.14em", color: "#d4af37" }}>
                        Signed In Client
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        backgroundColor: "rgba(16, 185, 129, 0.15)",
                        color: "#10b981",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#10b981" }} />
                      Verified Profile
                    </span>
                  </div>

                  {/* Account Details Box */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      backgroundColor: "#0d0f14",
                      border: "1px solid #28303f",
                      borderRadius: "10px",
                      marginBottom: "14px"
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #d4af37 0%, #aa8624 100%)",
                        color: "#0a0c10",
                        fontWeight: "700",
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(212, 175, 55, 0.25)"
                      }}
                    >
                      {user.fullname ? user.fullname[0].toUpperCase() : "U"}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#f3f4f6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.fullname}
                      </div>
                      <div style={{ fontSize: "12px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }}>
                        {user.email}
                      </div>
                      {user.phone ? (
                        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Phone size={10} /> {user.phone}
                        </div>
                      ) : null}
                      {user.customerid ? (
                        <div style={{ fontSize: "10px", color: "#d4af37", marginTop: "3px", letterSpacing: "0.06em" }}>
                          Client ID: #{user.customerid}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#9ca3af", lineHeight: "1.45" }}>
                    Welcome back to the atelier, <strong style={{ color: "#f3f4f6" }}>{user.fullname}</strong>. Your consultation will be linked directly to your authenticated account.
                  </p>

                  <button
                    type="button"
                    onClick={() => initiateChat(user.fullname, user.email)}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "11px 16px",
                      background: "linear-gradient(135deg, #d4af37 0%, #aa8624 100%)",
                      color: "#0a0c10",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(212, 175, 55, 0.3)"
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Connecting to Concierge...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Start Conversation as {user.fullname.split(" ")[0]}</span>
                      </>
                    )}
                  </button>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "12px",
                      paddingTop: "10px",
                      borderTop: "1px solid #232936"
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleLogoutFromChat}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#9ca3af",
                        fontSize: "11px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: 0
                      }}
                    >
                      <LogOut size={12} />
                      <span>Sign Out / Switch</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab("guest");
                        initiateChat(guestName.trim() || "Visitor", guestEmail.trim());
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#6b7280",
                        fontSize: "11px",
                        cursor: "pointer",
                        padding: 0
                      }}
                    >
                      Chat as Guest
                    </button>
                  </div>
                </div>
              ) : (
                /* ======================================================== */
                /* CASE 2: NOT SIGNED IN (Sign In Tab or Guest Tab)         */
                /* ======================================================== */
                <div
                  style={{
                    padding: "18px",
                    backgroundColor: "#161b24",
                    border: "1px solid #2a3140",
                    borderRadius: "14px",
                    marginTop: "4px"
                  }}
                >
                  <h5 style={{ margin: "0 0 4px", fontSize: "14px", color: "#d4af37", fontWeight: "600" }}>
                    Welcome to Gemora Diam Atelier
                  </h5>
                  <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#9ca3af", lineHeight: "1.4" }}>
                    Sign in to your client account or continue as guest to speak with our diamond concierge.
                  </p>

                  {/* Tabs: Sign In vs Guest */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "4px",
                      backgroundColor: "#0d0f14",
                      padding: "3px",
                      borderRadius: "8px",
                      marginBottom: "14px",
                      border: "1px solid #252b37"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setAuthTab("signin")}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: authTab === "signin" ? "#d4af37" : "transparent",
                        color: authTab === "signin" ? "#0a0c10" : "#9ca3af",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <LogIn size={13} />
                      <span>Sign In Account</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthTab("guest")}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: authTab === "guest" ? "#d4af37" : "transparent",
                        color: authTab === "guest" ? "#0a0c10" : "#9ca3af",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <User size={13} />
                      <span>Guest Visitor</span>
                    </button>
                  </div>

                  {authTab === "signin" ? (
                    /* Sign In Form */
                    <form onSubmit={handleInlineSignIn} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {authError && (
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "rgba(225, 29, 72, 0.12)",
                            border: "1px solid rgba(225, 29, 72, 0.35)",
                            borderRadius: "6px",
                            color: "#fb7185",
                            fontSize: "11px",
                            lineHeight: "1.35"
                          }}
                        >
                          {authError}
                        </div>
                      )}
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>
                          Email Address *
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="email"
                            required
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                            placeholder="e.g. sarah@example.com"
                            style={{
                              width: "100%",
                              padding: "9px 12px 9px 34px",
                              backgroundColor: "#0d0f14",
                              border: "1px solid #2d3340",
                              borderRadius: "6px",
                              color: "#f3f4f6",
                              fontSize: "13px",
                              outline: "none"
                            }}
                          />
                          <Mail size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>
                          Password *
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="password"
                            required
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                              width: "100%",
                              padding: "9px 12px 9px 34px",
                              backgroundColor: "#0d0f14",
                              border: "1px solid #2d3340",
                              borderRadius: "6px",
                              color: "#f3f4f6",
                              fontSize: "13px",
                              outline: "none"
                            }}
                          />
                          <Lock size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isSigningIn}
                        style={{
                          marginTop: "4px",
                          padding: "10px 14px",
                          background: "linear-gradient(135deg, #d4af37 0%, #aa8624 100%)",
                          color: "#0a0c10",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: isSigningIn ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px"
                        }}
                      >
                        {isSigningIn ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Signing In...</span>
                          </>
                        ) : (
                          <>
                            <LogIn size={15} />
                            <span>Sign In & Start Chat</span>
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Guest Form */
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
                          marginTop: "4px",
                          padding: "10px 14px",
                          background: "linear-gradient(135deg, #d4af37 0%, #aa8624 100%)",
                          color: "#0a0c10",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: isLoading ? "not-allowed" : "pointer"
                        }}
                      >
                        {isLoading ? "Starting Chat..." : "Start Conversation"}
                      </button>
                    </form>
                  )}
                </div>
              )
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{ textAlign: "center", padding: "16px", color: "#9ca3af" }}>
                <Loader2 size={22} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                <span style={{ fontSize: "12px" }}>Connecting to Atelier Concierge...</span>
              </div>
            )}

            {/* Conversation Active: Top Account Banner if Signed In */}
            {conversation && user && (
              <div
                style={{
                  padding: "10px 12px",
                  backgroundColor: "rgba(212, 175, 55, 0.08)",
                  border: "1px solid rgba(212, 175, 55, 0.25)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "4px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #d4af37 0%, #aa8624 100%)",
                      color: "#0a0c10",
                      fontWeight: "700",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    {user.fullname ? user.fullname[0].toUpperCase() : "U"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#f3f4f6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.fullname}
                    </div>
                    <div style={{ fontSize: "10px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "700",
                    letterSpacing: "0.06em",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    flexShrink: 0
                  }}
                >
                  VERIFIED ACCOUNT
                </span>
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
              disabled={isUploading || (!conversation && !user && !guestName.trim())}
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
              placeholder={
                !conversation
                  ? user
                    ? "Type your question to start..."
                    : "Please sign in or enter details above..."
                  : "Ask about diamonds, rings, shipping..."
              }
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
              disabled={!inputText.trim()}
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
