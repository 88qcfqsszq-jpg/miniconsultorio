# Assets do Dashboard (DashboardLanding)

Coloque os PNGs reais aqui. A página `/dashboard-landing` os consome por estes
nomes exatos. Enquanto não existirem, a UI usa fallbacks visuais leves (sem
quebrar o layout).

## Assets fornecidos (originais)
- `hero-medica-holograma.png` — imagem do hero (médica + holograma)
- `logo-medix.png` — logo no topo da sidebar
- `icons-casos.png` — folha com os 4 ícones de casos

## Ícones de casos (recortar do icons-casos.png)
A página espera os 4 ícones **separados** nestes nomes:
- `case-heart.png` — IAM com supra (Cardiologia)
- `case-lung-purple.png` — Asma grave (Pneumologia)
- `case-lung-blue.png` — Pneumonia adquirida na comunidade (Pneumologia)
- `case-virus.png` — Dengue com sinais de alarme (Infectologia)

Enquanto esses 4 arquivos não forem adicionados, cada card mostra um círculo
colorido (placeholder) no mesmo estilo. Basta soltar os PNGs com estes nomes
e a página passa a usá-los automaticamente — nenhuma mudança de código.

> Nenhuma imagem foi gerada ou redesenhada pelo código. O recorte do
> `icons-casos.png` em 4 arquivos deve ser feito manualmente (ou por ferramenta
> de imagem) e salvo com os nomes acima.
