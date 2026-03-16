from twilio.rest import Client
import time

# TUS credenciales
account_sid = "AC49a19c74cf48037882499ff271dc003d"
auth_token = "1bdef9177a384834a339e710fc26d61b"
client = Client(account_sid, auth_token)

from_number = "whatsapp:+14155238886"
targets = ["+5218140484672", "+521818367176", "+528110667355", "+528115781427", "+528180967391"]   # Agrega más aquí

for phone in targets:
    message = client.messages.create(
        from_=from_number,
        to=f"whatsapp:{phone}",
        body="🤖 ICARUS IA v2.6 LIVE!\n\nCotización GRATIS ahora:\nhttps://lustinia.web.app\n\n¡Responde INFO!"
    )
    print(f"✅ {phone}: {message.sid}")
    time.sleep(4)  # Sandbox limit
