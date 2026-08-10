# CodeSwitch Explorer — DE/EN/RU

Browserbasierte Analyse für deutsch-englisch-russische Code-Switches.

Installation:

```bash
cd "CodeSwitchExplorer"
npm install
npm run dev
```

Um die URL `http://CodeSwitchExplorer:5173/` zu verwenden, ergänze die Datei `C:\Windows\System32\drivers\etc\hosts` mit:

```
127.0.0.1 CodeSwitchExplorer
```

Starten nach Hosts-Änderung (Administrator erforderlich):

```powershell
npm.cmd run dev -- --host CodeSwitchExplorer --port 5173
```

Hinweis: Die POS-Tagging-Logik nutzt `compromise` für Englisch und heuristische Regeln für Deutsch und Russisch. Für präzisere POS-Analyse sind serverseitige NLP-Modelle empfehlenswert.
