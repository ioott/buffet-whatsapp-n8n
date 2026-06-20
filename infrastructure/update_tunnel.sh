#!/bin/bash

# Caminho da sua pasta do n8n
N8N_DIR="/home/ubuntu/n8n-deploy"

echo "Iniciando atualização do túnel Cloudflare..."

# 1. Reinicia o contêiner temporário
docker restart temp-tunnel

# 2. Aguarda 10 segundos para a conexão estabilizar
sleep 10

# 3. Pesca a nova URL gerada
NOVA_URL=$(docker logs temp-tunnel 2>&1 | grep -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' | tail -n 1)

if [ -z "$NOVA_URL" ]; then
    echo "Erro: Não foi possível capturar a URL."
    exit 1
fi

echo "Nova URL capturada: $NOVA_URL"

# 4. Injeta a nova URL no arquivo .env
sed -i "s|^WEBHOOK_URL=.*|WEBHOOK_URL=$NOVA_URL|" "$N8N_DIR/.env"

# 5. Reinicia o n8n
cd "$N8N_DIR" || exit
docker compose up -d --force-recreate n8n

echo "Automação concluída com sucesso!"