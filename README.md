# MFC Heynsdaele – De Verlaten Vleugel

Een **fictieve**, Nederlandstalige first-person horror-escape room. De gebouwindeling, personages en geesten zijn bedacht voor de game; de game doet geen uitspraken over echte gebeurtenissen in Ronse of bij MFC Heynsdaele.

## Starten

1. Installeer Node.js 20 of nieuwer.
2. Open een terminal in deze map en voer `npm install` uit.
3. Start met `npm start`.
4. Ga naar `http://localhost:3000`.

Voor multiplayer: laat alle spelers dezelfde server-URL en dezelfde roomcode openen. De server staat maximaal vier spelers per room toe en synchroniseert posities en de voortgang (stroom, sleutel, code en ontsnapping). Voor spelen buiten je eigen netwerk moet deze Node-app op een host draaien die WebSockets ondersteunt (bijvoorbeeld Render, Railway, Fly.io of een eigen VPS); stel daar `PORT` beschikbaar. Een puur statische host is niet genoeg voor de multiplayer-server.

## Speldoel

Zet de stroom aan in de kelder, vind de sleutel in een patiëntenkamer, lees de code bij de verpleegpost en gebruik die bij de uitgang. Met een AZERTY-toetsenbord beweegt `ZQSD`, de muis kijkt, `E` gebruikt en `F` schakelt de zaklamp. Een aangesloten controller werkt automatisch: linker stick beweegt, rechter stick kijkt, A gebruikt, B schakelt de zaklamp en Start opent de winkel.

## Publicatie

De map is klaar als Docker-webservice (`Dockerfile`, `render.yaml` en `railway.json` zijn inbegrepen). Maak bij Render een nieuwe **Blueprint** op basis van deze repository, of maak bij Railway een project op basis van deze map/repository. Kies een regio en deploy de **volledige** map. Het Blueprint-bestand maakt een publieke webservice met een permanente schijf voor accounts en voortgang. Gebruik HTTPS; WebSockets schakelen dan automatisch naar `wss://`.

Open nooit `public/index.html` rechtstreeks en upload niet alleen `public/` naar GitHub Pages, Netlify of een andere statische host: accounts, multiplayer en de winkel gebruiken de Node-server op dezelfde URL. Dat veroorzaakt anders “Failed to fetch”.

Voor alleen een visuele demo op Netlify staat `netlify.toml` in de map; dit voorkomt een 404 door `public/` als publicatiemap te gebruiken. Netlify ondersteunt in deze opzet echter geen permanente WebSocket-server, dus gebruik Render of Railway voor de volledige game met aanmelden en multiplayer.

Controleer na deployment de publieke URL in twee vensters met dezelfde roomcode: beide spelers moeten elkaar in de lijst zien en dezelfde schakelaars kunnen gebruiken.

De huidige accountkluis schrijft naar `heynsdaele-users.json`. Dat is bruikbaar voor één vaste server met een permanente schijf, maar niet veilig genoeg voor een publieke schaalbare release. Vervang hem vóór lancering door Postgres/D1, versleutelde sessiecookies, rate limiting, e-mailherstel en back-ups.

## Grenzen van deze eerste versie

- Retro/procedurele raycasting in canvas, geen fotorealistische 3D-modellen of geluid.
- 250 dossierniveaus met oplopende voortgang, maar in deze MVP nog gebaseerd op één compacte procedurele plattegrond in plaats van 250 unieke handgemaakte maps.
- Eén kleine gedeelde level-state; accounts worden persistent opgeslagen op de server, zonder e-mailherstel of voicechat.
- De geest en beelden worden direct getekend met code: er zijn geen externe of locatiegebonden assets gebruikt.

