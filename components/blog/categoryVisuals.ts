import type { ComponentType } from "react";
import type { BlogCategory } from "@/lib/blog";
import { BookIcon, ChatBubbleIcon, SparkleIcon, TrendUpIcon } from "./icons";

// O site nao tem banco de fotos (so logos/mascote/ilustracoes) -- em vez de
// fabricar fotografia falsa pra capa de post, cada categoria ganha uma
// composicao de gradiente propria na paleta da marca (variacoes de
// #B597FF/#38E3FF) + um icone, usada tanto no carrossel de destaque quanto
// no banner/badge dos cards.
export const CATEGORY_VISUALS: Record<
  BlogCategory,
  { from: string; to: string; badgeText: string; Icon: ComponentType<{ className?: string }> }
> = {
  "IA em movimento": { from: "#B597FF", to: "#7C6CF0", badgeText: "#3C3489", Icon: SparkleIcon },
  "Vendas com IA": { from: "#38E3FF", to: "#38A9E3", badgeText: "#0C447C", Icon: TrendUpIcon },
  "WhatsApp e atendimento": { from: "#5DCAA5", to: "#38E3FF", badgeText: "#085041", Icon: ChatBubbleIcon },
  "Guias e playbooks": { from: "#D85A30", to: "#B597FF", badgeText: "#72243E", Icon: BookIcon },
};
