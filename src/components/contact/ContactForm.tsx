"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "c7a53dbf-abf4-4dc7-9497-e93e281ddc86",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Nuevo mensaje de contacto de ${formData.name}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label={t("submit")} className="space-y-4">
      {status === "success" && (
        <div
          aria-live="polite"
          className="bg-green-50 border border-green-200 text-green-800 text-sm p-3 rounded-md"
        >
          {t("success")}
        </div>
      )}
      {status === "error" && (
        <div
          aria-live="polite"
          className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-md"
        >
          {t("error")}
        </div>
      )}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          {t("name")}
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          {t("email")}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium">
          {t("message")}
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" disabled={status === "loading"} className="w-full">
        {status === "loading" ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
