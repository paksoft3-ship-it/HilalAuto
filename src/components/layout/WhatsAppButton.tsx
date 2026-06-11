"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { externalRoutes } from "@/lib/routes";
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslations } from "next-intl";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
}

export function WhatsAppButton({ message, className }: WhatsAppButtonProps) {
  const tHero = useTranslations("hero");
  const tFooter = useTranslations("footer");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const href = externalRoutes.whatsapp(
    WHATSAPP_NUMBER,
    message ?? tHero("whatsappMessage")
  );

  if (!visible) return null;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tFooter("whatsappAria")}
      className={cn(
        "hidden md:flex fixed bottom-32 right-32 z-50",
        "items-center justify-center",
        "w-[56px] h-[56px] rounded-full bg-whatsapp text-white",
        "hover:opacity-90 transition-opacity",
        className
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <FaWhatsapp size={24} strokeWidth={1.5} aria-hidden />
    </motion.a>
  );
}
