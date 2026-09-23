import type { ComponentType } from "react";
import type { ClusterId } from "@/lib/editorial/types";
import { BookIcon, ChatBubbleIcon, SparkleIcon, TrendUpIcon } from "./icons";

// O site nao tem banco de fotos (so logos/mascote/ilustracoes) -- em vez de
// fabricar fotografia falsa pra capa de post, cada categoria ganha uma
// composicao de gradiente propria na paleta da marca (variacoes de
// #B597FF/#38E3FF) + um icone, usada tanto no carrossel de destaque quanto
// no banner/badge dos cards.
type CategoryVisual = {
  from: string;
  to: string;
  badgeText: string;
  Icon: ComponentType<{ className?: string }>;
};

const CLUSTER_VISUALS = {
  "cluster:ia-comercial": { from: "#B597FF", to: "#7C6CF0", badgeText: "#3C3489", Icon: SparkleIcon },
  "cluster:vendas-whatsapp": { from: "#5DCAA5", to: "#38E3FF", badgeText: "#085041", Icon: ChatBubbleIcon },
  "cluster:qualificacao": { from: "#D85A30", to: "#B597FF", badgeText: "#72243E", Icon: BookIcon },
  "cluster:follow-up": { from: "#38E3FF", to: "#38A9E3", badgeText: "#0C447C", Icon: TrendUpIcon },
  "cluster:agendamento": { from: "#B597FF", to: "#38E3FF", badgeText: "#3C3489", Icon: SparkleIcon },
  "cluster:crm-nativo": { from: "#38A9E3", to: "#7C6CF0", badgeText: "#0C447C", Icon: TrendUpIcon },
} satisfies Record<ClusterId, CategoryVisual>;

// A chave nominal mantém o banner da rota de detalhe estável durante a
// remoção coordenada do adapter; listagem, busca e carrossel usam ClusterId.
export const CATEGORY_VISUALS = {
  ...CLUSTER_VISUALS,
  "Vendas com IA": CLUSTER_VISUALS["cluster:ia-comercial"],
};
