"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
}

interface WhatsAppBotManagerProps {
  initialFaqs: FAQ[];
}

export default function WhatsAppBotManager({ initialFaqs }: WhatsAppBotManagerProps) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "",
    order: 0,
  });

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  async function handleCreate() {
    if (!form.question || !form.answer || !form.category) {
      toast.error("Completa todos los campos");
      return;
    }

    const res = await fetch("/api/admin/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      toast.error("Error al crear pregunta");
      return;
    }

    const newFaq = await res.json();
    setFaqs((prev) => [...prev, newFaq]);
    setForm({ question: "", answer: "", category: "", order: 0 });
    setShowForm(false);
    toast.success("Pregunta creada");
  }

  async function handleUpdate() {
    if (!editing) return;

    const res = await fetch("/api/admin/whatsapp", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (!res.ok) {
      toast.error("Error al actualizar");
      return;
    }

    const updated = await res.json();
    setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    setEditing(null);
    toast.success("Pregunta actualizada");
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta pregunta?")) return;

    const res = await fetch(`/api/admin/whatsapp?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Error al eliminar");
      return;
    }

    setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast.success("Pregunta eliminada");
  }

  async function toggleActive(faq: FAQ) {
    const res = await fetch("/api/admin/whatsapp", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: faq.id, active: !faq.active }),
    });

    if (!res.ok) {
      toast.error("Error al cambiar estado");
      return;
    }

    const updated = await res.json();
    setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Bot de WhatsApp
          </h1>
          <p className="text-neutral-500 mt-1">
            Gestiona las preguntas frecuentes y respuestas automáticas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva pregunta
        </button>
      </div>

      {/* New FAQ form */}
      {showForm && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-6">
          <h3 className="font-medium text-neutral-900 mb-4">Nueva pregunta</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Categoría
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej: Reservaciones, Pagos, General"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                list="categories"
              />
              <datalist id="categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Pregunta
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="¿Cuáles son los métodos de pago?"
                value={form.question}
                onChange={(e) =>
                  setForm((f) => ({ ...f, question: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Respuesta
              </label>
              <textarea
                className="input-field min-h-[100px]"
                placeholder="Aceptamos SPEI, tarjeta de crédito/débito y OXXO..."
                value={form.answer}
                onChange={(e) =>
                  setForm((f) => ({ ...f, answer: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Orden
              </label>
              <input
                type="number"
                className="input-field w-24"
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))
                }
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreate} className="btn-primary">
                Guardar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="btn-ghost"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      {faqs.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
          <p className="font-medium text-neutral-700">Sin preguntas configuradas</p>
          <p className="text-sm text-neutral-500 mt-1">
            Agrega preguntas frecuentes para que el bot responda automáticamente.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
                {category}
              </h2>
              <div className="space-y-2">
                {faqs
                  .filter((f) => f.category === category)
                  .map((faq) => (
                    <div
                      key={faq.id}
                      className={`bg-white border rounded-xl p-4 ${
                        faq.active
                          ? "border-neutral-200"
                          : "border-neutral-200 opacity-60"
                      }`}
                    >
                      {editing?.id === faq.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            className="input-field"
                            value={editing.question}
                            onChange={(e) =>
                              setEditing((prev) =>
                                prev ? { ...prev, question: e.target.value } : null
                              )
                            }
                          />
                          <textarea
                            className="input-field min-h-[80px]"
                            value={editing.answer}
                            onChange={(e) =>
                              setEditing((prev) =>
                                prev ? { ...prev, answer: e.target.value } : null
                              )
                            }
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdate}
                              className="btn-primary flex items-center gap-1 text-sm"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="btn-ghost flex items-center gap-1 text-sm"
                            >
                              <X className="w-3.5 h-3.5" />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900">
                              {faq.question}
                            </p>
                            <p className="text-sm text-neutral-600 mt-1 whitespace-pre-wrap">
                              {faq.answer}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => toggleActive(faq)}
                              className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors"
                              title={faq.active ? "Desactivar" : "Activar"}
                            >
                              {faq.active ? (
                                <ToggleRight className="w-5 h-5 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => setEditing(faq)}
                              className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(faq.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
