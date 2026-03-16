from twilio.rest import Client

account_sid = "AC49a19c74cf48037882499ff271dc003d"
auth_token = "1bdef9177a384834a339e710fc26d61b"
client = Client(account_sid, auth_token)

message = client.messages.create(
    from_="whatsapp:+14155238886",
    to="whatsapp:+5218140484672",
    body="🤖 ICARUS IA v2.6 LIVE!\nCotización GRATIS: https://lustinia.web.app"
)
print("✅ SID:", message.sid)
