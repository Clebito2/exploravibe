# 🏝️ ExploraVibe - Vibe Brasileira Moderna 2026

**ExploraVibe** é uma plataforma premium de curadoria de experiências turísticas, focada no turismo de elite brasileiro. O projeto combina tecnologia de ponta (**Invisible AI**) com uma identidade visual ultra-moderna inspirada nas tendências de 2026.

## 🚀 Vision 2026
Transformamos o planejamento de viagens em uma jornada sensorial e personalizada:
- **Identidade "Oceano Tropical"**: Gradientes vibrantes, Glassmorphism e Neumorphism suave.
- **Invisible AI**: Motor de recomendação que entende sua vibe sem formulários chatos.
- **Destinos de Elite**: Foco estratégico em **João Pessoa (PB)** e **Goiânia (GO)**.

## 🛠️ Stack Tecnológica
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Backend/Auth**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Functions)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Custom Design Tokens
- **Monorepo**: Estrutura organizada para escalabilidade.

## 📁 Estrutura do Projeto
- `apps/web`: Aplicação principal (PWA/Web) com a nova identidade 2026.
- `apps/admin`: Painel de gestão para parceiros e administradores.
- `packages/shared`: Tipagens e utilitários compartilhados.

## ✨ Funcionalidades Implementadas
- [x] **Autenticação Premium**: Fluxos de login/cadastro com UX refinado.
- [x] **Personalização (LGPD)**: Gestão de preferências com consentimento explícito.
- [x] **Trip Planner**: Sistema colaborativo de roteiros e curadoria.
- [x] **Vibe Bag**: Carrinho de experiências dinâmico e visual.
- [x] **Seeding Automático**: Sistema de dados pronto para JP e Goiânia.

## 🏁 Como Iniciar
### Pré-requisitos
- Node.js 18+
- Conta Firebase configurada (.env)

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```


## 📋 Development Guidelines

### Formatação de Arquivos
**Problema:** O sistema usa `\r\n` (Windows) causando falhas em edições.

**Solução:**
- Editar via scripts Node.js com `fs.readFileSync/writeFileSync`
- Incluir `\r\n` exato no pattern matching
- Usar regex quando possível

### Análise de Impacto (OBRIGATÓRIO)

Antes de implementar QUALQUER mudança, analisar:

1. **Segurança:** Exposição de dados? Validações? Regras Firestore?
2. **UX:** Melhora experiência? Feedback visual? Loading states?
3. **Performance:** Impacto em queries? Otimização de assets?

### Padrões de Código

#### Firestore: NUNCA enviar `undefined`
```typescript
// ❌ ERRADO
const data = { field: optionalValue };

// ✅ CORRETO
const data = { field: optionalValue || "" };
```

#### Firebase Storage: Paths
```
profiles/{userId}/{timestamp}_{filename}
experiences/{timestamp}_{filename}
```

---
*ExploraVibe: Sinta a energia, viva a experiência.* 🌊⚡
