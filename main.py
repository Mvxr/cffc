import discord
import random
import asyncio

intents = discord.Intents().all()
client = discord.Client(command_prefix=',', intents=intents)


# Generowanie ciągu 'k' losowych liter
def generate_code(length):
    return ''.join(random.choices('abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNOPRSTUWYZ0123456789', k=length))
  

# Obsługa zdarzenia wiadomości
@client.event
async def on_message(message):
    if message.author == client.user:
        return

    # Lista ról, które mogą używać komendy
    allowed_roles = ['Admin', 'Moderator']

    # Sprawdzenie, czy użytkownik posiada jedną z uprawnionych ról
    if any(role.name in allowed_roles for role in message.author.roles):
        if message.content.startswith('-kod'):
            # Podział wiadomości na argumenty
            args = message.content.split()
            channel_id = None

            # Sprawdzenie, czy podano argument z id kanału
            if len(args) > 1:
                try:
                    channel_id = int(args[1])
                except ValueError:
                    pass

            # Jeśli nie podano id kanału lub id jest nieprawidłowe, wysyłamy wiadomość na kanał, na którym wpisano komendę
            if channel_id is None or not client.get_channel(channel_id):
                channel_id = message.channel.id

            channel = client.get_channel(channel_id) # pobieranie ID kanału/deklarowanie na którym ma być wysłana wiadomość
            code = generate_code(8) # Generowanie kodu 8-znakowego
            embed = discord.Embed(title='Szybko! Łap kod na __**Wielkanocne Jajko**__:', description='⠀\n⠀⠀⠀⠀⠀⠀⠀__' + code + '__\n⠀',              color=discord.Color.blue())
            embed.set_thumbnail(url='https://i.imgur.com/gpQpRiQ.png') # zdjęcie do embeda
            embed.set_author(name='', icon_url='https://i.imgur.com/ZKoaMOG.png') # ikona do embeda
            embed.set_footer(text='Ilość użyć: 1') # stopka, ilość użyć i tak będzie zawsze 1
            await channel.send(embed=embed) # wysłanie wiadomości embedowej

        elif message.content.startswith('-rarekod'):
            code = generate_code(16) ##Generowanie kodu 16-znakowego
            embed = discord.Embed(title='Na czacie pojawił się __**RZADKI WIELKANOCNY SZOP**__.', description='Szybko, użyj kodu aby zyskać 5 punktów! \n⠀⠀\n⠀⠀\n⠀⠀⠀⠀⠀⠀⠀__' + code + '__\n⠀\n⠀', color=discord.Color.purple()) #kolor embeda
            embed.set_thumbnail(url='https://i.imgur.com/hIEpeHJ.png') #zdjęcie do embeda
            embed.set_author(name='', icon_url='https://i.imgur.com/ZKoaMOG.png') #ikona embeda
            embed.set_footer(text='Ilość użyć: 1') # pobieranie ID kanału/deklarowanie na którym ma być wysłana wiadomość
            await message.channel.send(embed=embed)

          
        # Funkcja sprawdzająca, czy wiadomość zawiera poprawny kod
        def check_code(msg):
            return msg.content.lower() == code.lower()

        # Funkcja wysyłająca wiadomość gratulacyjną
        async def congratulate_winner(msg):
            embed = discord.Embed(title='Brawo!', description=f'{msg.author.mention} odgadł/a kod! Zyskujesz jeden punkt! ', color=discord.Color.green())
            await message.channel.send(embed=embed)

        # Oczekiwanie na poprawną odpowiedź
        try:
            message = await client.wait_for('message', check=check_code, timeout=15) # timeout=[czas oczekiwania na wpisanie kodu]
            await congratulate_winner(message)
        except asyncio.TimeoutError:
            embed = discord.Embed(title='Koniec czasu!', description='Nikt nie odgadł kodu.', color=discord.Color.red())
            await message.channel.send(embed=embed)


# Uruchomienie bota
client.run('MTA3MjE1MzE2MzU1NTE0MzY4MA.Gt75ok.zPCPEJJNWZ44Yaxh0tx9pE55n6S3cfRxVzGNEI')
