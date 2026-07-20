---
draft: false
title: "Den Robot Framework MCP-Server ohne Installation ausprobieren"
# --- Italic subheading
lead: "Wie du den MCP-Server für Robot Framework im Starter-Lab von Robotmk ausprobieren kannst."
# -- giscus id to match comments
commentid: rf-mcp-starter
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
#description: "Claude Code im Codespace: Anleitung, Workarounds und Beispiele für Robot Framework" 
date: "2026-05-20T10:00:00+02:00"
categories:
  - tutorials
tags:
  - codespaces
  - claude
  - copilot
  - rmk-starter
  - robotframework
  - mcp
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: img/vsc-gh-cl.png
vgwort: https://vg04.met.vgwort.de/na/37d2e70759c24e29895305147a51765c
translationKey: "rf-mcp-starter"
---

Tests von KI-Agenten wie ChatGPT oder Claude Desktop schreiben lassen?  
Wer das schon einmal probiert hat, kennt das Problem: Die Agenten erfinden Keywords und Libraries, die gar nicht existieren – und sie haben keine Möglichkeit, mit der zu testenden Applikation zu interagieren.  
Das Ergebnis ist Test-Code, der auf dem Papier plausibel aussieht, aber in der Praxis nicht funktioniert.

Der **MCP-Server** für Robot Framework setzt hier an: Er kann Robot Framework direkt einsetzen und somit jeden Schritt validieren.

In diesem Tutorial zeige ich Dir, wie Du ihn direkt im [Robotmk-Starter Lab](https://www.robotmk.org/en/blog/rmk-starter/) ausprobieren kannst – komplett online, ohne lokale Installation. Das Lab unterstützt sowohl **Claude Code** als auch **GitHub Copilot**.

<!--more-->

## Einstieg: KI-Agenten vs. MCP-Server

### Warum der Chat/Agent Mode nicht ideal ist

KI-Agenten wie ChatGPT, Claude Desktop oder GitHub Copilot können im reinen Chat-Modus keinen zuverlässigen Robot Framework Code generieren. Das hat gleich mehrere Gründe:

- **Kein Zugriff auf die Testumgebung**: Der Agent weiß ja gar nicht, welche RF-Libraries installiert sind und welche Keywords tatsächlich zur Verfügung stehen.  
Er arbeitet ausschließlich aus seinem **Trainingswissen** – das ist zwangsläufig unvollständig und veraltet.
- **Keine Interaktion mit der AUT**: Um sinnvolle Tests zu schreiben, muss man die zu testende Applikation "befragen" können: Welche Elemente gibt es im DOM? Reagiert die Anwendung auf einen bestimmten Click? Was liefert ein API-Call zurück?  
Im Chat-Modus ist das schlicht nicht möglich.
- **Kein Feedback-Loop**: Nicht einmal der beste Entwickler schüttelt funktionierenden Code direkt aus dem Ärmel. Entwicklung ist der iterative Prozess aus `ausführen -> beobachten -> anpassen`.  
Ein Chat-Agent generiert Code **einmalig**, ohne ihn je ausgeführt oder validiert zu haben.  
Das Ergebnis sieht plausibel aus, scheitert aber ziemlich sicher.

> **Das Ergebnis**: Erfundene Keywords, nicht existierende Libraries, Tests, die syntaktisch korrekt aussehen, aber nicht laufen – und viel vertane Zeit.

### MCP: Der "USB-Standard" für KI-Tools

Ein MCP-Server (*Model Context Protocol*) löst genau dieses Problem: Er kapselt konkrete Fähigkeiten – im Fall von Robot Framework z.B. verfügbare Keywords auflisten, ein Szenario analysieren, einen Testfall generieren oder ein Keyword direkt ausführen – und stellt sie über eine einheitliche API dem KI-Agent bereit.

> Info: MCP ist ein offener Standard von Anthropic. Ähnlich wie ein USB-Gerät an jeden USB-Verteiler angeschlossen werden kann, bietet ein MCP-Server seine Werkzeuge jedem kompatiblen KI-Agenten an – egal ob Claude, Copilot oder ein anderes Modell.

**Der entscheidende Unterschied zum Chat-Modus**: Der Agent arbeitet nicht länger blind!  
Er kann die RF-Umgebung introspektieren, Keywords ausführen und das Ergebnis auswerten – bevor er den nächsten Schritt plant.

---

## Schritt 1: Das Lab starten

Das [Robotmk-Starter Repo](https://www.robotmk.org/en/blog/rmk-starter/) ist eine Sammlung von sofort lauffähigen Robot Framework Beispielen, Templates und Labs.  

Ich habe das Starter-Repo in einem eigenen Artikel ausführlich vorgestellt, hier findest du die wichtigsten Informationen: [Robotmk-Starter: Sofort loslegen mit Synthetic Monitoring](content/blog/rmk-starter/index.de.md).

Kurzanleitung für das RF-MCP Lab: 

**Voraussetzungen:**

- GitHub‑Account (zur Nutzung des Codespaces)
- AI:
  - Copilot-Budget (seit der Umstellung im Juni 2026 ist das Kontingent deutlich kleiner geworden) oder
  - Eine Claude-Subscription (Pro Plan bzw. API)

**Schritte:**

1. Öffne https://github.com/elabit/robotmk-starter
2. Scrolle nach unten zum Abschnitt "/labs" und klicke neben "**rf-mcp**" auf den Link "[try out](https://github.com/robotmk/lab-rf-mcp)". Damit öffnest Du das Repo für dieses Lab.
3. Klicke auf *Code* -> *Codespaces*" und hier auf die drei Punkte: klicke dann auf "*New with options...*" (nur so hast Du die Möglichkeit, dem Container 4 statt 2 CPUs zu geben)
4. In dem neuen Tab "*Create codespace for Robotmk/lab-rf-mcp*" wählst Du nun **4-core** aus und klickst auf **Create Codespace**.

Jetzt hol Dir erst mal einen Kaffee ☕️ - das Container-Image wird online geladen, Pakete werden installiert und [RCC](http://localhost:1314/de/blog/rcc-efficient-python-integration/) bereitet für Dich das Environment vor. Das Ganze dauert ca. 8 Minuten.

> **Hinweis:** Falls Du Dich mit GitHub Codespace Prebuilds auskennst: Ein Prebuild würde die Startzeit von ~8 auf ~1 Minute verkürzen. Ich habe das bisher nicht zum Laufen gebracht – über einen Hinweis in den Kommentaren würde ich mich freuen.

Warte unbedingt, bis der Codespace fertig eingerichtet ist, bevor Du weitermachst!

{{< figure src="img/finished.png" title="Fertige Umgebung" >}} 

---

## Schritt 2: RF-MCP einrichten (Claude)

Der RF-MCP-Server lässt sich sowohl mit **GitHub Copilot** als auch mit **Claude Code** verwenden – für beide Agenten sind die Konfigurationsdateien im Lab bereits vorbereitet.

Im Wesentlichen sind es jeweils nur zwei Dateien, mit denen man den Agenten den MCP-Server bekannt macht (achte auf die unterschiedlichen Verzeichnisse). Die MCP-Server haben sprechende Namen erhalten, damit sie im Tool-Log klar unterscheidbar sind.

### Copilot MCP-Config

- Datei: `.vscode/mcp.json`
- Name: **robotmcp-vsc**

Da **Copilot** direkt in VS Code integriert ist, registriert es dank der JSON-Datei den MCP-Server sofort.  
Das erkennst Du auch daran, dass die Datei "inline" bereits Schaltflächen enthält, um den MCP-Server zu steuern:

```
{
  "servers": {
    ✔️Running | Stop | Restart | 18 Tools | 2 prompts
    "robotmcp-vsc": {
      "type": "stdio",
      "command": "/root/.rcc-env/bin/python",
      "args": ["-m", "robotmcp.server"],
      "env": {
        "PATH": "/root/.rcc-env/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
      }
    }
  }
}
```

### Claude Code MCP-Config

- Datei: `.mcp.json`
- Name: **robotmcp-claude**

**Claude Code** hingegen muss erst als Extension installiert werden – und die Anmeldung im Codespace erfordert ein paar manuelle Schritte mehr. Mit dem folgenden Tutorial ist das aber gut lösbar.

```
{
    "mcpServers": {
        "robotmcp-claude": {
            "type": "stdio",
            "command": "/root/.rcc-env/bin/python",
            "args": [
                "-m",
                "robotmcp.server"
            ],
            "env": {
                "PATH": "/root/.rcc-env/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            }
        }
    }
}
```

--- 

### 2.1: Authentifizierung einleiten

Sobald der Codespace bereit ist, sollte rechts unten ein Hinweis erscheinen, der die Installation der Claude Code Extension für VS Code empfiehlt. Klicke darauf, um sie zu installieren. 


{{< figure src="img/recommendation.png" title="Empfehlung zur Installation von Claude nach dem Start des Codespaces" >}} 

Falls der Hinweis nicht (mehr) erscheint, kannst Du sie über das linke Panel "Extensions - RECOMMENDED" installieren.

Klicke nun im rechten Seitenpanel auf den Tab "**CLAUDE CODE**" (nicht auf den "CHAT"-Tab, der ist für Copilot):

{{< figure src="img/claude-tab.png" title="" >}} 

(Solltest du nur drei Punkte sehen, musst Du das Panel breiter ziehen)

Klicke auf **"Login with Claude.ai Subscription"** und wähle in der darauf folgenden Meldung **"Copy"**, um den Auth-Link zu kopieren.

{{< figure src="img/msg-auth-link.png" title="" >}} 

--- 

### 2.2: VNC-Session öffnen

Öffne das `Ports`‑Panel im Codespace und starte den noVNC‑Port (Globus‑Icon):

{{< figure src="img/vnclink.png" title="Öffnen des VNC-Ports" >}} 

Per Rechtsklick auf den Desktop kannst Du den Browser (Firefox) starten:  

{{< figure src="img/desktop.png" title="Starten des Browsers im noVNC-Desktop" >}}

--- 

### 2.3: Bei Claude anmelden

Füge jetzt den kopierten **Auth‑Link** in den Clipboard-Manager von NoVNC (linker Bildschirmrand) ein; danach kannst Du ihn in die Adresszeile des Browsers einfügen.

{{< figure src="img/clipboard-paste.png" title="NoVNC: Kommunikation mit der Zwischenablage über Zwischenschritt. Einfügen des Auth-Links" >}} 

Auf der nun geöffneten Claude.ai-Seite meldest Du Dich mit Deiner E‑Mail-Adresse an.  
Claude sendet Dir dann eine E‑Mail mit dem Betreff `Secure link to log in to Claude.ai`; darin ist ein Button, mit dem Du einen **6‑stelligen Code** generieren kannst.  

{{< figure src="img/6dig.png" >}} 

Wechsle zurück in die VNC-Session und gib diesen Code nun in die Webmaske von Claude ein.  

Nach einem Click auf "**Authorize**" solltest Du sehen, dass das Chat-Widget in VS Code (Codespace) nun **aktiviert** ist - die Anmeldung hat geklappt: 

{{< figure src="img/chatwindow.png" >}} 

---

### 2.4: Test 

Hat Claude nun Zugriff auf den MCP-Server? Das kannst Du ganz einfach testen, indem Du im Chat-Fenster `/mcp-servers` eingibst.  
Du kannst damit auch alle registrierten Tools und Fähigkeiten abfragen:

{{< figure src="img/mcp-running.gif" title="Der Befehl '/mcp-servers' listet alle registrierten MCP-Server auf" >}} 

---

## Schritt 3: Verwendung des MCP-Servers / Testerstellung

In der Markdown-Datei [PROMPTS.md](https://github.com/Robotmk/lab-rf-mcp/blob/main/PROMPTS.md) habe ich einen Prompt vorbereitet, den Du direkt verwenden kannst. Mit diesen Instruktionen wird der Agent gleich einen Test schreiben, der 

- die lokale Checkmk-Instanz öffnet
- den User **cmkadmin** einloggt
- in dessen Userprofil verifiziert, 
  - dass der Username korrekt ist
  - dass die UI-Sprache auf Englisch steht

Markiere den Text unterhalb der Überschrift "Checkmk Login" und füge ihn in das Chatfenster von Copilot bzw. Claude ein.

Sobald Du Enter drückst, kannst Du dem Agenten zusehen, wie er die nächsten Schritte plant. Behalte sowohl das Chatfenster als auch die VNC-Session im Blick: Du kannst dem Agenten beim "Denken" und Ausführen der Testschritte im Browser zusehen.


### Test 

Am Ende solltest Du im VS Code-Workspace eine neue Datei **cmk.robot** finden, die den fertigen Robot Framework Test beinhaltet.

Mit einem Klick auf den Pfeil am Anfang der Suite kannst Du Dich davon überzeugen, dass der KI-Agent, hier Claude, mit Hilfe des MCP-Servers einen lauffähigen Test erzeugen konnte. 

{{< figure src="img/run.gif" >}} 


---


## Fazit

Der RF-MCP-Server zeigt eindrucksvoll, was möglich wird, wenn KI-Agenten nicht mehr blind generieren, sondern aktiv mit der Testumgebung interagieren können.  
Der Unterschied zum reinen Chat-Modus ist fundamental: statt einmalig zu generieren, wird iterativ validiert.

**GitHub Copilot** lässt sich im Codespace dank der direkten VS Code-Integration besonders reibungslos einrichten – quasi *Batteries included*. Die Anbindung von **Claude Code** erfordert ein paar manuelle Schritte mehr, funktioniert danach aber genauso zuverlässig.

Welchen der beiden Agenten man bevorzugt, ist letztlich eine Frage des persönlichen Workflows und des verfügbaren Budgets. Beide profitieren in gleichem Maße vom MCP-Server – und genau das ist die Stärke eines offenen Standards.

In weiteren Artikeln werde ich zeigen, wie sich komplexere Testszenarien mit dem RF-MCP-Server strukturieren lassen und wo die aktuellen Grenzen der Implementierung liegen. Stay tuned.

👉 Hat die Einrichtung geklappt? Schreib mir gern einen Kommentar: