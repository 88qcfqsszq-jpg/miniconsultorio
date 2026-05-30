#!/bin/bash

# Script para fazer deploy rápido no GitHub Pages
# Uso: ./DEPLOY.sh seu-usuario seu-repo

if [ $# -lt 1 ]; then
  echo "❌ Uso: ./DEPLOY.sh seu-usuario seu-repositorio"
  echo ""
  echo "Exemplos:"
  echo "  ./DEPLOY.sh joao joao.github.io"
  echo "  ./DEPLOY.sh maria seu-consultorio (para github.com/maria/seu-consultorio)"
  exit 1
fi

USUARIO=$1
REPO=${2:-${USUARIO}.github.io}

echo "🚀 Iniciando deploy para GitHub Pages..."
echo "  Usuário: $USUARIO"
echo "  Repositório: $REPO"
echo ""

# Opção 1: Repositório novo
if [ "$REPO" = "${USUARIO}.github.io" ]; then
  echo "1️⃣  Clone o repositório:"
  echo "   git clone https://github.com/$USUARIO/$REPO.git"
  echo "   cd $REPO"
  echo ""
  echo "2️⃣  Copie os arquivos:"
  echo "   cp -r ../static-html/* ."
  echo ""
  echo "3️⃣  Commit e push:"
  echo "   git add ."
  echo "   git commit -m 'Adicionar Mini Consultório OSCE'"
  echo "   git push origin main"
  echo ""
  echo "4️⃣  Acesse:"
  echo "   https://$USUARIO.github.io"
else
  echo "1️⃣  Clone o repositório:"
  echo "   git clone https://github.com/$USUARIO/$REPO.git"
  echo "   cd $REPO"
  echo ""
  echo "2️⃣  Crie a pasta docs:"
  echo "   mkdir -p docs"
  echo "   cp -r ../static-html/* docs/"
  echo ""
  echo "3️⃣  Commit e push:"
  echo "   git add docs/"
  echo "   git commit -m 'Adicionar Mini Consultório OSCE em docs/'"
  echo "   git push origin main"
  echo ""
  echo "4️⃣  Configure no GitHub:"
  echo "   Settings > Pages > Source > main branch /docs folder"
  echo ""
  echo "5️⃣  Acesse:"
  echo "   https://$USUARIO.github.io/$REPO"
fi
