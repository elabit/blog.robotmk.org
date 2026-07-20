---
draft: false
title: "CryptoLibrary: Sichere Kryptografie für Robot Framework-Tests"
# --- Italic subheading
lead: "Wie Du sensible Daten in Deinen Robot Framework-Tests mit der CryptoLibrary schützen kannst."
# -- giscus id to match comments
commentid: cryptolib-howto
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
#description: "Robotmk kann RCC-Environments vollständig offline aufbauen. Dieser Artikel erklärt, warum das wichtig ist und wie es in der Praxis funktioniert."
date: "2026-04-28T10:42:47+02:00"
categories:
  - tutorials
tags:
  - "cryptolibrary"
  - "encryption"
  - "security"
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: img/key.png
vgwort: https://vg04.met.vgwort.de/na/9ca9c8f8c1b548e6aa7dee75f8408dfb
translationKey: "cryptolibrary"
---


Wer Synthetic Monitoring mit Robotmk im Checkmk-Umfeld betreibt, stößt früher oder später auf diese eine Frage: *wie verhindere ich, dass Passwörter jemals im Klartext auftauchen?*

Dieser Artikel beschreibt wie die **CryptoLibrary** eingesetzt wird, um sensible Daten in Robot Framework-Tests zu schützen.

<!--more-->

---

## Warum Klartext-Passwörter ein Problem sind

Wer in Robot Framework einsteigt, kann schnell überfordert sein von der Vielzahl an Möglichkeiten und Libraries.  
Das Thema Sicherheit wird dabei oft erst spät angegangen – oder im schlimmsten Fall gar nicht. Nicht selten sieht es in Testsuites dann so aus: 

``` robotframework
*** Variables ***
${USERNAME}   robotmk
${PASSWORD}   supersecret123  # BAD!!
${API_KEY}    abcdef123456  # BAD!!
${PIN}        1234  # BAD!!
```

😱 So einen Robot kannst Du unmöglich in ein Git-Repository einchecken, geschweige denn in einer Produktionsumgebung laufen lassen!

**Klartext-Passwörter sind ein No-Go** - und trotzdem findet man sie immer wieder.  
Das Problem: Robot Framework bietet von Haus aus keine eingebaute Lösung für die sichere Handhabung von Geheimnissen.

> Wobei - das stimmt nicht ganz: schau Dir mal [Secret Variables]({{< ref "/secretvars" >}}) an, die es seit Robot Framework 7 gibt. Allerdings helfen die nur, wenn auch die Libraries mitspielen – und das tun leider nicht alle. 

---

## CryptoLibrary: Basics

Steigen wir also tiefer ein: Die **CryptoLibrary** ist eine speziell für Robot Framework entwickelte Library, die es ermöglicht, Daten sicher zu ver- und entschlüsseln.  
Sie basiert auf dem Prinzip der [asymmetrischen Kryptografie](https://en.wikipedia.org/wiki/Public-key_cryptography), bei der ein Schlüsselpaar aus einem öffentlichen und einem privaten Schlüssel verwendet wird: 

- 🔑 Der "**public key**" wird zum **Verschlüsseln** der Daten genutzt.
- 🔐 Der "**private key**" wird zum **Entschlüsseln** verwendet; er ist mit einem Passwort geschützt

---

## Beispiel-Repository

In diesem Artikel verwenden wir die CryptoLibrary in einem praktischen Beispiel, das Du selbst ausprobieren kannst: 
[Checkmk/robotmk-examples/cryptolibrary](https://github.com/Checkmk/robotmk-examples/tree/main/examples/cryptolibrary)

```bash
> git clone https://github.com/Checkmk/robotmk-examples/
```


Das Robot-File **suite.robot** enthält zwei Tests: 

- **Login With Clear Text Password** - Der Login, wie man ihn nicht machen sollte 😉
- **Login With CryptoLibrary** - Der Login mit der CryptoLibrary, wie er sein sollte (den wir hier bauen) ✅


---


### Installation der CryptoLibrary

Die CryptoLibrary ist als Python-Paket verfügbar und kann einfach mit **pip** installiert werden.  
Robotmk nutzt intern **RCC**/**micromamba**, um die benötigten Python-Umgebungen zu erstellen.  
Daher reicht ein Eintrag in der `conda.yaml`:

``` yaml
channels:
- conda-forge
dependencies:
- python=3.12
- pip=23.2.1
- nodejs=22.11.0
- pip:
  - robotframework==7.1
  - robotframework-browser==19.12
  - robotframework-crypto==0.3 # <---
```

---

### Erzeugen und Aktivieren des Environments

Falls Du RCC noch nicht installiert hast, findest Du eine ausführliche Anleitung in diesem Artikel: [RCC: Efficient Python Integration](https://www.robotmk.org/en/blog/rcc-efficient-python-integration)

```bash
> cd examples/cryptolibrary
# Erzeugen des Environments
> rcc task shell
...
# Test: Python ist verfügbar, wir sind im aktivierten Environment
> which python3
/Users/simon/.robocorp/holotree/3a200ec_5a1fac3_172e83c1/bin/python3
```

**Bonus Tipp:** Starte VS Code direkt aus dem aktivierten Environment heraus; somit musst Du in VS Code nichts mehr konfigurieren, um das Environment nutzen zu können:

```bash
> code . 
```

---

### Das Schlüsselpaar generieren, Secret verschlüsseln

Bevor wir mit der CryptoLibrary loslegen können, brauchen wir ein **Schlüsselpaar**.  
Das kannst Du mit dem **CLI-Tool** der CryptoLibrary erzeugen.  
Starte ein neues Terminal in VS Code (sofern nicht schon eins offen ist)...

![new terminal](img/newterminal.png)

...und starte den Assistenten: 

```bash
> CryptoLibrary
```

{{< figure src="img/wizard.png" title="Der Konfigurationsassistent der CryptoLibrary" >}} 

Zur besseen Lesbarkeit liste ich hier die Schritte auf, die Du im Wizard durchläufst. Jede Einrückung entspricht dabei einer Unterebene im Wizard:

- Open Config
  - Configure Key Pair
    - Set Key Path
      - `keys` (beliebiger Name, Hauptsache der Ordner ist im Projekt enthalten)
      - Yes (create)
    - Generate Key Pair
      - Yes (regenerate)
      - No (do NOT save the password ⚠️)
      - `rmksecret` (Passwort für den privaten Schlüssel)
      - `rmksecret` (Passwort bestätigen)
    - Back
  - Back
- Encrypt
  - `Password123` (das Geheimnis, das Du verschlüsseln möchtest)

Natürlich kannst Du hier noch beliebig viele weitere Geheimnisse verschlüsseln lassen: API-Keys, PINs, Zugangsdaten – alles, was Du nicht im Klartext in Deinen Tests haben möchtest.  
Nach jeder Eingabe wird der verschlüsselte Wert ausgegeben, z.B. 

```bash
crypt:s7Jiwve6YIzsyqVlGxndTAjIYQqg84lTT/1it/pqcCsV0w81Kfk0tQc4M1kiDxnqO1i0J9ZtgH0BUSA=
```

Kopiere den *ganzen* String (inklusive `crypt:`) und füge ihn in Deine Robot-Variable ein, z.B. 

```
*** Variables ***
${URL}      https://practicetestautomation.com/practice-test-login/
${USERNAME}  student
${PASSWORD_CLEAR}  Password123  # this is BAD!
${PASSWORD_CRYPT}  crypt:s7Jiwve6YIzsyqVlGxndTAjIYQqg84lTT/1it/pqcCsV0w81Kfk0tQc4M1kiDxnqO1i0J9ZtgH0BUSA=
```

---

### CryptoLibrary importieren

Die `CryptoLibrary` wird nun im Robot-File in der `*** Settings ***`-Sektion eingebunden. Die drei wichtigsten Argumente steuern den Entschlüsselungsprozess:

- `key_path`: Relativer Pfad zu dem Ordner, der die Schlüssel enthält (in unserem Fall `keys`).
- `password`: Das Passwort zum Entsperren des privaten Schlüssels - wird aus der Umgebungsvariable `RMKCRYPTPW` gelesen (siehe nächster Abschnitt).
- `variable_decryption`: Aktiviert die automatische Entschlüsselung aller Variablen, die mit `crypt:` beginnen.

``` robotframework
*** Settings ***
Library    Browser
Library    CryptoLibrary    
...    key_path=keys
...    password=%{RMKCRYPTPW}
...    variable_decryption=True    
```


---


### Fill Secret vs. Fill Text

In unserem Beispiel-Test kommt die bekannte [Browser Library](https://marketsquare.github.io/robotframework-browser/Browser.html) zum Einsatz.  
Zur Eingabe von sensiblen Daten in Webformulare solltest Du das Keyword `Fill Secret` ([Link](https://marketsquare.github.io/robotframework-browser/Browser.html#Fill%20Secret)) verwenden. Es verhält sich ähnlich wie `Fill Text`, verhindert aber, dass der eingegebene Wert in den Robot-Logs landet:

```
Login With CryptoLibrary
    Fill Text  id=username  ${USERNAME}
    Fill Secret  id=password  $PASSWORD_CRYPT   # <----
    Click  id=submit
    Wait For Condition  Text  body  contains  Logged In Successfull
```

> Beachte, dass `Fill Secret` keine gewöhnliche Variable wie `${PASSWORD_CRYPT}` akzeptiert, sondern die spezielle Syntax `$PASSWORD_CRYPT` benötigt.  
Damit wird verhindert, dass Robot Framework den von der CryptoLibrary zu diesem Zeitpunkt bereits entschlüsselten Wert loggt (so wie alle Argumente). Der Python-Code im Keyword `Fill Secret` kann aber trotzdem auf die entschlüsselte Variable zugreifen und sie korrekt in das Formular eingeben.


---

### Schlüsselpasswort in der Systemd-Unit hinterlegen

Falls Du Dich jetzt wunderst, warum wir auch den privaten Schlüssel im Repo haben, obwohl er doch eigentlich geheim sein sollte - hier ist die Antwort:  

Erst mit dem *Passwort* wird der private Schlüssel nutzbar – und das Passwort gehört nicht in den Code, sondern als Umgebungsvariable in die Systemd-Unit des Checkmk-Agenten.  
Das geht mit einem sogenannten [Systemd-Override](https://dev.to/redrum_yot/understanding-drop-in-overrides-in-systemd-when-parameters-accumulate-vs-override-3noi):

```bash
> systemctl edit check-mk-agent-async.service
```

Dort dann eintragen:

```ini
[Service]
Environment="RMKCRYPTPW=rmksecret"
```

Anschließend Systemd reloaden und den Agenten neu starten:

```bash
sudo systemctl daemon-reload
sudo systemctl restart check-mk-agent-async.service
```

> Windows-User setzen hierfür eine System-Umgebungsvariable. 

Nun ist die Umgebungsvariable `RMKCRYPTPW` also im Kontext des Checkmk-Agenten bzw. Robotmk-Schedulers verfügbar. Die CryptoLibrary im Robot kann damit den privaten Schlüssel verwenden, um die verschlüsselten Werte in den Tests zu entschlüsseln.

---

### Testlauf (und ein kleiner Trick)

Um den Robot nun auf Deiner Maschine lokal zu testen, bräuchtest Du natürlich ebenfalls die Umgebungsvariable `RMKCRYPTPW`. Du könntest sie natürlich in Deiner bashrc oder zshrc setzen, aber das wäre etwas umständlich, wenn Du den Robot nur schnell mal testen möchtest. 

Aus diesem Anlass verrate ich Dir noch einen kleinen Trick, der eines meiner Lieblings-Themen in Robot Framework betrifft: die Datei `robot.toml`.

`robot.toml` ist eine Konfigurationsdatei für die VS Code Extension [RobotCode](https://robotcode.io) von Daniel Biehl. Sie ist eine wahre "Wunderwaffe" für das lokale Entwickeln, weil sie z.b. das Anlegen von Ausführungsprofilen ermöglicht - und eben auch das Setzen von Umgebungsvariablen, die nur für den Robot-Testlauf gelten.

`robot.toml` committed man üblicherweise ins Git, aber für sensible Daten (und dazu gehört ab jetzt auch das Passwort für den Private Key!) gibt es noch die Datei `.robot.toml`. Sie ist für lokale Overrides gedacht und wird nicht ins Git eingecheckt (=> `.gitignore`).   

```bash
[env]
RMKCRYPTPW = "rmksecret"
```

Nun kannst Du den Robot direkt in VS Code ausführen, ohne Dich um das Setzen der Umgebungsvariable kümmern zu müssen:

{{< figure src="img/run.png" title="Starten der Suite in VS Code" >}} 

Und siehe da - der Login wird durchgeführt, ohne dass sensible Daten im Klartext in den Logs auftauchen! 🎉

![alt text](img/form.png)

---

## Fazit

Die **CryptoLibrary** löst ein Problem, das im Alltag mit Robotmk immer wieder auftaucht: Credentials sicher im Robot-Code ablegen, ohne sie im Klartext preiszugeben.  

Der Aufwand für die Einrichtung ist überschaubar – und das Ergebnis überzeugt. 

Verwendest Du die CryptoLibrary bereits – oder setzt Du auf einen anderen Ansatz? Ich bin gespannt auf Deine Erfahrungen. Schreib mir gern in die Kommentare! 👇

