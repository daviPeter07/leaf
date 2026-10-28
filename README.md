<div align="center">

# 🍃 Leaf

**Acompanhe suas leituras como quem acompanha um treino.**

Páginas, tempo e ritmo de cada dia de leitura — e um status pronto para compartilhar nos stories, no estilo do Strava.

*Feito com amor para a Alice* 🧡

![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/estado-Zustand-F26A2E)
![Offline](https://img.shields.io/badge/dados-100%25%20locais-2E9D6A)

</div>

---

## O que o Leaf faz

| | |
|---|---|
| **Biblioteca** | Cadastre livros com total de páginas e capítulos, acompanhe o progresso e separe o que está lendo do que já terminou. |
| **Registro de leitura** | Informe de qual página até qual página leu e quanto tempo levou. O progresso e o capítulo atual são atualizados sozinhos. |
| **Sua semana** | Páginas, tempo e dias lidos de segunda a domingo, com gráfico semanal e sequência de dias seguidos. |
| **Feed de atividades** | Cada sessão vira um card no estilo Strava: **Páginas · Ritmo · Tempo**, com o ritmo em minutos por página. |
| **Status para os stories** | Escolha um dia de leitura e gere uma imagem 9:16 com as métricas empilhadas e um ícone de livro — com foto de fundo ou como sticker transparente. |
| **Tutorial de boas-vindas** | Cinco cards explicam o app no primeiro acesso e não aparecem de novo. |

Tudo fica salvo **apenas no aparelho** — sem conta, sem servidor.

## Stack

- **[Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/)** + **Expo Router** (rotas por arquivos, `Stack.Protected` para o onboarding)
- **React Native 0.88** com **React Compiler** ativado
- **Zustand** + `persist` em **AsyncStorage** para o estado
- **Zod** para validação dos formulários
- **date-fns** (locale `pt-BR`) para datas, semanas e sequência
- **react-native-view-shot** + **expo-sharing** + **expo-image-picker** para gerar e compartilhar o status
- **lucide-react-native** para ícones

## Rodando localmente

Pré-requisitos: Node.js LTS e o app **Expo Go** no celular (ou um emulador Android / simulador iOS).

```bash
git clone https://github.com/daviPeter07/leaf.git
cd leaf
npm install
npx expo start
```

Escaneie o QR code com o Expo Go, ou pressione `a` (Android) / `i` (iOS) no terminal.

> Depois de atualizar dependências, rode `npx expo start --clear` para limpar o cache do Metro.

### Scripts

| Comando | O que faz |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento do Expo |
| `npm run android` / `ios` / `web` | Abre direto em uma plataforma |
| `npm run lint` | ESLint com a config do Expo |
| `npx tsc --noEmit` | Checagem de tipos (modo strict) |
| `npx expo install --check` | Confere se as dependências batem com o SDK |

## Estrutura

```
src/
├── app/                    # Rotas (Expo Router)
│   ├── _layout.tsx         # Stack raiz, splash e guarda do tutorial
│   ├── tutorial.tsx        # Onboarding de 5 cards
│   ├── (tabs)/             # Início · Biblioteca · Status
│   ├── book/[id].tsx       # Detalhe do livro e histórico
│   ├── add-book.tsx        # Modais de cadastro, edição
│   ├── edit-book.tsx       #   e registro de leitura
│   ├── log-reading.tsx
│   └── share-day.tsx       # Tela de compartilhamento do status
├── components/
│   ├── app/                # UI genérica (botões, cabeçalho, StatRow…)
│   └── reading/            # Componentes de domínio (cards, sticker…)
├── store/reading-store.ts  # Zustand: livros, sessões e regras de negócio
├── utils/reading.ts        # Ritmo, duração, semana, sequência, dias
├── hooks/                  # Leitura derivada do store
├── constants/              # Paleta e cores de capa
└── types/                  # Modelos Book e ReadingSession
```

## Como funciona por dentro

- **Regras de negócio no store.** Limites de páginas e capítulos, cálculo do capítulo atual e a marcação de livro finalizado vivem nas actions do Zustand — as telas só chamam `addReading`, `updateBook` etc.
- **Datas locais.** Os dias de leitura são agrupados pela data do aparelho, então uma leitura às 23h conta para o dia certo.
- **Status transparente.** Os modelos *Sticker* exportam um PNG 1080×1920 com fundo transparente, para colar por cima de qualquer foto no Instagram.
- **Onboarding sem flicker.** O splash só some depois que o AsyncStorage carrega, e o `Stack.Protected` decide entre tutorial e app sem navegação manual.

---

<div align="center">
Feito com 🧡 para a Alice, por <a href="https://github.com/daviPeter07">Davi Peterson</a>
</div>
