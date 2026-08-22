"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send, MessageSquare, ArrowLeft, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Conversation {
  contact: { id: string; name: string; image: string | null };
  lastMessage: { content: string; createdAt: string; senderId: string };
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { name: string; image: string | null };
}

interface ChatPageProps {
  userId: string;
  userName: string;
}

export default function ChatPage({ userId, userName }: ChatPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedContact, setSelectedContact] = useState<Conversation["contact"] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
      const interval = setInterval(() => fetchMessages(selectedContact.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchConversations() {
    const res = await fetch("/api/mensajes");
    if (res.ok) {
      setConversations(await res.json());
    }
    setLoading(false);
  }

  async function fetchMessages(contactId: string) {
    const res = await fetch(`/api/mensajes?contactId=${contactId}`);
    if (res.ok) {
      setMessages(await res.json());
    }
  }

  async function handleSend() {
    if (!newMessage.trim() || !selectedContact) return;

    const content = newMessage.trim();
    setNewMessage("");

    const res = await fetch("/api/mensajes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverId: selectedContact.id,
        content,
      }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      fetchConversations();
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Mensajes</h1>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden flex" style={{ height: "600px" }}>
        {/* Conversations sidebar */}
        <div className={`w-80 border-r border-neutral-200 flex flex-col ${selectedContact ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-neutral-100">
            <p className="text-sm font-medium text-neutral-500">Conversaciones</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-neutral-400 text-sm">Cargando...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
                <p className="text-sm text-neutral-500">Sin mensajes</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.contact.id}
                  onClick={() => setSelectedContact(conv.contact)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors border-b border-neutral-50 text-left ${
                    selectedContact?.id === conv.contact.id ? "bg-neutral-50" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {conv.contact.image ? (
                      <Image src={conv.contact.image} alt="" width={40} height={40} className="object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-neutral-900 text-sm truncate">
                        {conv.contact.name}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 truncate mt-0.5">
                      {conv.lastMessage?.content}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${!selectedContact ? "hidden md:flex" : "flex"}`}>
          {selectedContact ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="md:hidden p-1 text-neutral-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                  {selectedContact.image ? (
                    <Image src={selectedContact.image} alt="" width={32} height={32} className="object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
                <p className="font-medium text-neutral-900 text-sm">{selectedContact.name}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMine = msg.senderId === userId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          isMine
                            ? "bg-primary-600 text-white rounded-br-md"
                            : "bg-neutral-100 text-neutral-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            isMine ? "text-white/70" : "text-neutral-400"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-neutral-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="btn-primary p-2.5 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                <p className="text-sm">Selecciona una conversación</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
