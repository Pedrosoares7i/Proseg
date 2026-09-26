# ProSeg

Site institucional da ProSeg — segurança e gestão inteligente de energia. Projeto
interdisciplinar da ETEC, redesenhado como peça de portfólio de UI/UX e front-end.

> **Projeto conceitual.** As telas, os números e as integrações apresentadas são
> ilustrativos. Não há clientes, depoimentos ou resultados reais aqui, e o
> formulário de contato não envia dados.

## Ver o site

Abrir `index.html` direto no navegador funciona, mas um servidor local evita
restrições de segurança em alguns navegadores para `fetch`/módulos:

```bash
python -m http.server 8000
```

Depois acesse <http://localhost:8000>.

## Páginas

| Arquivo        | Papel                                                          |
| -------------- | -------------------------------------------------------------- |
| `index.html`   | Landing longa: proposta, soluções, plataforma, processo, FAQ, CTA |
| `contato.html` | Página interna com briefing de projeto e canais de contato      |

## Estrutura

```
index.html          landing completa
contato.html        contato + briefing
css/
  tokens.css        cores, tipografia, espaçamento, raios, sombras, motion
  base.css          reset, tipografia, layout, utilitários, acessibilidade
  components.css    header, botões, cards, console, tabs, form, footer
  sections.css      seções da landing e breakpoints
  contact.css       página de contato
js/
  main.js           header, menu mobile, scroll spy, reveal, contadores, FAQ
  dashboard.js      abas acessíveis do console demonstrativo
  contact.js        validação e estados do formulário
img/
  favicon.svg
```

CSS é dividido por responsabilidade, não por página, e só é carregado o que cada
página usa. As cores, tamanhos e espaçamentos vêm de custom properties em
`css/tokens.css` — mudar a identidade visual significa editar um único arquivo.

## Decisões de design

- **Identidade.** Azul de confiança para segurança, âmbar de energia para
  eficiência. Fundo claro para leitura, fundo navy para os momentos de destaque
  (hero, confiança, CTA).
- **Sem prova social falsa.** Confiança é comunicada por garantiascontratuais
  e indicadores operacionais, nunca por depoimentos ou logos de terceiros.
- **Conteúdo antes de decoração.** Cada card nomeia um problema, a solução e o
  que o cliente recebe. Nenhum texto decorativo.
- **Uma fonte de ação por tela.** O CTA principal é sempre o mesmo caminho:
  falar com um especialista.
- **Segurança sem alarmismo.** A conversa parte de identificação de risco, não
  de medo.

## Acessibilidade

- HTML semântico com landmarks e um único `h1` por página
- Skip link, `:focus-visible` consistente e ordem de tabulação previsível
- Abas e acordeões operáveis por teclado (setas, Home/End, Esc)
- `prefers-reduced-motion` desliga reveal, contadores e pulses
- Ícones decorativos com `aria-hidden="true"`; ícones de status com rótulo textual
- Formulário com `label` ligado por `for`, `autocomplete` e erros descritos por
  `aria-describedby` + `aria-invalid`

## Responsividade

Um container fluido, uma escala tipográfica com `clamp()` e cinco breakpoints
(1200 / 1040 / 960 / 720 / 480px). O console demonstrativo reflows de 3 colunas
para 1; o menu vira gaveta abaixo de 960px.

## Melhorias em relação à versão anterior

- De 6,5 MB para ~187 KB de código e assets
- Sem imagens de terceiros: todo o visual é SVG e CSS
- Era um site de 6 páginas com navegação quebrada no mobile; agora são 2 páginas
  que funcionam
- `overflow-x` e larguras fixas que causavam scroll horizontal foram removidas
- Formulário deixou de ser decorativo e passou a validar e dar feedback real

## Stack

HTML, CSS e JavaScript puros — sem framework, sem build, sem `node_modules`. A
única dependência externa são as fontes (Google Fonts), que já vêm com pilha de
fallback do sistema, então o site renderiza corretamente offline. Roda em
qualquer navegador moderno, inclusive abrindo `index.html` direto do disco.
