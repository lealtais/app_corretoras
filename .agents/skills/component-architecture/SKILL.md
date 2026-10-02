---
name: component-architecture
description: Arquitetura de Componentes Reutilizáveis para React Native e Expo baseada em Atomic Design, Design System Tokens e separação estrita de responsabilidades (UI Primitives, Moléculas, Organismos e Custom Hooks).
---

# Arquitetura de Componentes Reutilizáveis (Design System & Atomic UI)

Esta skill estabelece o padrão arquitetural para componentes reutilizáveis, manuteníveis e desacoplados no projeto.

## 1. Princípios Fundamentais

1. **Responsabilidade Única (Single Responsibility)**:
   - Cada componente deve resolver apenas uma função visual ou estrutural.
2. **Composabilidade**:
   - Componentes menores combinam-se para formar componentes mais complexos.
   - Telas não devem reinventar botões, inputs, cards ou tipografia.
3. **Prop Inversion & Extensibilidade**:
   - Componentes base (Átomos) recebem props nativas (`TouchableOpacityProps`, `TextInputProps`) para permitir estilização e eventos sem hacks.
4. **Desacoplamento de Estado (Custom Hooks)**:
   - A lógica de negócios, filtros e mutações de dados fica isolada em hooks customizados (ex: `useProperties`), mantendo os componentes de UI focados na renderização.

---

## 2. Estrutura de Diretórios

```text
src/
├── components/
│   ├── ui/                    # Átomos / Primitivas reutilizáveis de Design System
│   │   ├── Button.tsx         # Botão primário, secundário, outline, com ícone
│   │   ├── IconButton.tsx     # Botão circular/quadrado de ícone (favorito, fechar, editar)
│   │   ├── Input.tsx          # Input de texto com label, erro e ícones
│   │   ├── RangeInput.tsx     # Entrada de intervalo (mín - máx)
│   │   ├── Badge.tsx          # Tag/chip selecionável ou informativo
│   │   ├── MetricCard.tsx     # Caixa de estatística/métrica com contagem
│   │   ├── AmenitiesGrid.tsx  # Grade de atributos (Quartos, Banheiros, Vagas)
│   │   ├── NotesList.tsx      # Lista formatada de anotações
│   │   └── SearchBar.tsx      # Barra de pesquisa com atalho de filtro
│   ├── Header.tsx             # Organismo: Topbar da aplicação
│   ├── BottomNav.tsx          # Organismo: Barra de navegação inferior
│   ├── PropertyCard.tsx       # Organismo: Card de imóvel composto
│   └── PieChart.tsx           # Organismo: Gráfico de pizza SVG
├── hooks/
│   └── useProperties.ts       # Hook de gerenciamento de dados e filtros
├── screens/                   # Visões que orquestram os organismos
│   ├── HomeScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── StatisticsScreen.tsx
│   ├── PropertyDetailModal.tsx
│   ├── PropertyFormModal.tsx
│   └── AdvancedSearchModal.tsx
├── constants/
│   └── theme.ts               # Tokens de design (cores, espaçamentos, raios)
└── types/
    └── property.ts            # Tipos e interfaces de domínio
```
