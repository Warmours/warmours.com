# Script enviador
cat > ~/send_whatsapp.sh << 'EOF'
#!/bin/bash
ACCOUNT_SID="AC49a19c74cf48037882499ff271dc003d"
AUTH_TOKEN="1bdef9177a384834a339e710fc26d61b"
FROM="whatsapp:+14155238886"

while IFS= read -r TO; do
  echo "📱 Enviando a $TO..."
  curl -s "https://api.twilio.com/2010-04-01/Accounts/$ACCOUNT_SID/Messages.json" \
    -X POST \
    --data-urlencode "To=$TO" \
    --data-urlencode "From=$FROM" \
    --data-urlencode "Body=🤖 ICARUS IA v2.6 LIVE! Cotización gratis: https://lustinia.web.app" \
    -u "$ACCOUNT_SID:$AUTH_TOKEN" | grep -E "(sid|errorCode)"
done < whatsapp_targets.txt
EOF

chmod +x ~/send_whatsapp.sh
./send_whatsapp.sh
