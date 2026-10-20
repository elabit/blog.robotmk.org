---
draft: false
title: "Proxy-Settings verstehen und anwenden"
# --- Italic subheading
lead: "Wie unterschiedlich Python und Chromium mit Proxy-Variablen umgehen und was das für Robot Framework bedeutet."
# -- giscus id to match comments
commentid: proxy-settings
# -- predefined URL
# slug:
# -- for posts in menubar, use this (shorter) title
# menutitle:
#description:
date: "2026-10-20T09:00:00+02:00"
categories:
  - how-to
tags:
  - robotmk
  - robot-framework
  - rcc
  - browser-library
  - requests-library
  - proxy
  - troubleshooting
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: "img/title.png"
# TODO: eigene VG-Wort-Zählmarke eintragen
vgwort:
translationKey: "proxy-settings"
---

Proxy-Probleme gehören zu den Fällen, bei denen ich innerlich kurz seufze. Nicht, weil sie schwer wären, sondern weil sie so schwer zu greifen sind. Seit heute weiß ich auch, warum.

Ich wollte das Verhalten von Browser Library und RequestsLibrary mal "kurz" in einem Test nachstellen. Herausgekommen ist ein nettes kleines Testprojekt mit zwei Proxies, die jeden Request mitschreiben, und eine interessante Erkenntnis.

<!--more-->

## Der Testaufbau

### Testcase

Zur Demonstration dient ein ganz einfacher Testcase, der zuerst per **REST-Aufruf** prüft, ob ein Backend antwortet, und dann eine Weboberfläche im **Browser** öffnet:

```robotframework
Python Request
    Scenario GET    http://example.com/?via=python-requests

Open HTTP And HTTPS Page
    Open Scenario Browser
    New Page    http://example.com
    Get Title    ==    Example Domain
    Go To    https://example.org
    Get Title    ==    Example Domain
```

`Scenario GET` und `Open Scenario Browser` stammen aus einer Resource-Datei, die je nach Szenario wechselt.  
In der einen rufen sie `GET` und `New Browser` ohne Proxy auf, in der anderen mit einem explizit angegebenen Proxy.  
Der Test selbst ist in allen Läufen identisch, nur die Proxy-Konfiguration variiert.

Wie sich die beiden oben genannten Libraries daran halten, wollte ich genau wissen.

### Proxies

Ich habe **zwei Instanzen** von [mitmproxy](https://www.mitmproxy.org) aufgesetzt, auf macOS als Docker-Container, unter Windows als lokale Prozesse.

- **Proxy A** ist vorgesehen für die Umgebungsvariablen des Betriebssystems.  
- **Proxy B** wird im Test selbst explizit angegeben: der RequestsLibrary per `proxies=` in `GET`, der Browser Library per `proxy=` in `New Browser`. So lässt sich sehen, ob der explizite Proxy die Variablen überstimmt.

### Proxy-Umgebungsvariablen

Ich wollte natürlich auch wissen, was passiert, wenn beim Aufruf von Robot Framework bereits Proxy-Umgebungsvariablen gesetzt sind.  

Derlei drei finden sich in allen Betriebssystemen, z. B. in der Shell oder in den Systemeinstellungen:

- `HTTP_PROXY` = Proxy-Server für HTTP-Ziele  
- `HTTPS_PROXY` = Proxy-Server für HTTPS-Ziele     
- `NO_PROXY` = braucht man, sobald ein Proxy gesetzt ist: Es nimmt Ziele aus, die nicht über den Proxy laufen sollen oder können, typischerweise `localhost,127.0.0.1` und interne Hosts. Ohne Proxy hat die Variable nichts zu tun.

> Viele Programme nutzen diese Variablen zur Proxy-Konfiguration. 
> Ein Standard ist das aber nicht: Jedes Programm entscheidet selbst, ob und wie es sie liest.

### Der Testablauf


Testen wollte ich fünf Kombinationen:

| #   | Proxy-Env-Variablen (A) | `NO_PROXY`                   | Proxy explizit im Test (B) | Frage dahinter                                       |
| --- | ----------------------- | ---------------------------- | -------------------------- | ---------------------------------------------------- |
| 1   | ☑️                      | `localhost,127.0.0.1`        | –                          | Folgen beide Libraries den Variablen?                |
| 2   | ☑️                      | `localhost,127.0.0.1`        | ☑️                         | Setzt sich der explizite Proxy gegen die Variablen durch? |
| 3   | –                       | – (ohne Proxy bedeutungslos) | –                          | Gegenprobe: Geht ohne Proxy alles direkt?            |
| 4   | –                       | – (ohne Proxy bedeutungslos) | ☑️                         | Wirkt der explizite Proxy auch ganz allein?          |
| 5   | ☑️                      | **bewusst nicht gesetzt**    | –                          | Was passiert, wenn `NO_PROXY` vergessen wird?        |

"Explizit im Test" heißt: 

- `proxies=` bei der RequestsLibrary 
- `proxy=` bei der Browser Library (immer HTTP/HTTPS)

Damit ich nicht alles von Hand ausführen muss, habe ich mir ein kleines Skript für macOS (Bash) und Windows (PowerShell) geschrieben.  

Für jedes Szenario 

- startet es beide Proxies (auf macOS als Docker-Container, unter Windows als lokale `mitmdump`-Prozesse),
- setzt ggf. Variablen für **Proxy A** im Environment
- wählt die Resource-Datei mit oder ohne expliziten **Proxy B**
- und führt den Test aus.

Danach sammelt es die Logs beider Proxies ein und hält in einer Zusammenfassung fest, welcher Traffic nun über welchen Proxy lief.

Jede Kombination lief auf macOS und auf Windows Server 2022, und zwar einmal ohne und einmal mit Proxy-Anmeldung. 
Am Weg der Requests hat die Anmeldung nichts geändert; wie man die Zugangsdaten angibt, habe ich der Vollständigkeit halber am Ende als Referenz zusammengefasst.

Insgesamt waren das also **45 Testläufe**. Spannend war also nicht, *ob* der Test durchläuft, sondern *welchen Weg* er dabei nimmt.

## Die Ergebnisse

Was haben die beiden Libraries also daraus gemacht? 

| #   | Proxy-Env-Variablen (A) | Proxy explizit im Test (B) | RequestsLibrary | Browser Library |
| --- | ----------------------- | -------------------------- | --------------- | --------------- |
| 1   | ☑️                      | –                          | Proxy A         | --       |
| 2   | ☑️                      | ☑️                         | Proxy B         | Proxy B         |
| 3   | –                       | –                          | --          | --          |
| 4   | –                       | ☑️                         | Proxy B         | Proxy B         |
| 5   | ☑️ (ohne `NO_PROXY`)    | –                          | Proxy A         | --       |

Das Ergebnis war auf macOS und Windows gleich.  

Die einzige Abweichung brachte der Windows-Systemproxy, dazu unten mehr.

### Python hält sich an die Regeln

Beginnen wir mit dem nativen Python Teil: er betrifft die RequestsLibrary (BrowserLibrary = NodeJS/Browser = die ticken anders).  
Sie nutzt intern die Python-Bibliothek `requests`, und die folgt klaren Regeln:

- Sobald `HTTP_PROXY` und `HTTPS_PROXY` gesetzt waren, richtete die `RequestsLibrary` jeden Aufruf an **Proxy A**.  
- Fehlten die Variablen, ging er direkt, mit einer Ausnahme unter Windows, dazu gleich mehr.  
- Bekam `GET` dagegen explizit `proxies=` mit, ging der Request über **Proxy B**, auch wenn die Variablen auf **Proxy A** zeigten (Szenario 2). Der explizit gesetzte Proxy gewinnt.

Für die `RequestsLibrary` bedeutet das: Wenn du die Variablen setzt, musst du im Test nichts weiter tun.

```robotframework
*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Backend Antwortet
    ${resp}=    GET    https://example.org    expected_status=200
```

Willst du den Proxy lieber ausdrücklich im Test festlegen, etwa weil der Test auf verschiedenen Maschinen laufen soll, übergibst du ihn mit `proxies=`:

```robotframework
*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Backend Antwortet Über Proxy
    &{proxies}=    Create Dictionary    http=http://proxy.example:3128    https=http://proxy.example:3128
    ${resp}=    GET    https://example.org    proxies=${proxies}    expected_status=200
```

Dasselbe Argument nimmt auch `Create Session` entgegen, dann gilt der Proxy für alle Requests der Session.

Eine Eigenheit zeigte sich unter Windows. Im Lauf mit gesetztem Systemproxy (Internetoptionen bzw. WinINET) ging der Python-Request in Szenario 3, also ganz **ohne** Proxy-Variablen und ohne `proxies=`, trotzdem über **Proxy A**. 
Der Grund: Findet `getproxies()` unter Windows keine Variablen, liest es die Proxy-Einstellungen des Benutzers aus der Registry. Das ist praktisch, kann aber verwirren, wenn du „nichts konfiguriert“ hast.

**Fazit für Python:** 

- Ein expliziter Proxy hat Vorrang. Ohne ihn folgt requests den Umgebungsvariablen und unter Windows ersatzweise dem Systemproxy. 
- Das Verhalten ist dokumentiert und vorhersagbar. 
- Du musst nur wissen, welche Umgebung der Test tatsächlich sieht.

### Der Browser geht seinen eigenen Weg

Da wurde es richtig interessant... 

In allen Läufen mit per Env gesetzten Proxy-Variablen (A), aber explizit gesetzten Proxy B, ging der Chromium-Browser direkt ins Netz (Szenarien 1 und 5). (Wir erinnern uns: RequestsLibrary ging in denselben Läufen über **Proxy A**.)

Das kommt unerwartet. Warum ist das so? 

👉 **Playwright startet Chromium nur dann mit einem Proxy, wenn man ihm explizit einen übergibt.**  

Ohne `proxy` setzt es kein `--proxy-server`-Flag, und die Proxy-Variablen wertet Chromium auf macOS und Windows nicht aus.  

Ich vermute, das ist Absicht: Der Browser soll sich ja in jedem Test gleich verhalten, ganz unabhängig von der Umgebung, in der er zufällig gestartet wird.


```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Startseite Hinter Dem Proxy
    &{proxy}=    Create Dictionary    server=http://proxy.example:3128    bypass=localhost,127.0.0.1
    New Browser    chromium    proxy=${proxy}
    New Page    https://example.org
```

`server` nennt den Proxy, `bypass` die Hosts, die der Browser direkt erreichen soll. Das ist das Gegenstück zu `NO_PROXY`, nur eben für den Browser. `proxy=` hat in allen Läufen gewirkt, unabhängig davon, was in den Variablen oder in der Registry stand.

**Mein Fazit für den Browser:** Relevant ist nur, was beim Aufruf von `New Browser` mitgegeben wird. 

## Die unsichtbare Verbindung: gRPC und `NO_PROXY`

Neben Python und dem Browser gibt es noch eine dritte Netzwerk-Verbindung, die man leicht übersieht, weil sie gar nicht ins Internet will. Die **Browser Library** verbindet sich per **gRPC** mit ihrem Node-Prozess auf `127.0.0.1` und einem zufälligen Port.

> **Info:** gRPC ist ein Protokoll für Aufrufe zwischen Prozessen. Die Browser Library nutzt es, damit die Python-Seite (die Keywords) und die Node-Seite (Playwright) miteinander sprechen können.

Daraus entwickelte sich eine Fußangel, an der viele Einsteiger hängen geblieben sind: bei gesetztem Proxy schickt die gRPC-Bibliothek nämlich auch diese lokalen Verbindungen über den Proxy. Viele in der Community dürften diese Meldung kennen: `Could not connect to the playwright process`.

Seit **Browser Library 20.4.0** ist das behoben ([robotframework-browser#1037](https://github.com/MarketSquare/robotframework-browser/issues/1037)).  
Die Library schaltet den Proxy für ihren internen Kanal selbst ab (`grpc.enable_http_proxy=0`).  
Im Versuch lief deshalb auch das Szenario ohne `NO_PROXY` in allen Läufen durch, auf beiden Plattformen.

Ich empfehle trotzdem, `NO_PROXY` mindestens auf `localhost,127.0.0.1` zu setzen.  
Es kostet nichts, schützt ältere Environments und hält auch andere lokale Verbindungen vom Proxy fern.  

Und falls du noch eine Version vor 20.4.0 im Einsatz hast, ist das ein guter Grund für ein Update. 😊

## Die Checkliste für den nächsten Proxy-Fall

Aus den Messungen ist eine kurze Liste geworden, die ich inzwischen bei jedem neuen Projekt hinter einem Proxy durchgehe:

- **BrowserLibrary**:
  - Jeder `New Browser`, der durch den Proxy muss, bekommt `proxy=` mit `server` und `bypass`, auch wenn Variablen oder ein Systemproxy gesetzt sind.
  - mindestens Version 20.4.0 (wegen gRPC-Proxy-Problem)
- **RequestsLibrary**:
  - akzeptiert die Umgebungsvariablen und `proxies=`, wenn der Test unabhängig von der Umgebung laufen soll.
- `NO_PROXY` enthält in jedem Fall mindestens `localhost,127.0.0.1`.
- Die Umgebung des startenden Prozesses ist bekannt, also Dienst, Benutzer und systemweite Variablen.
- Unter Windows ist der Systemproxy des ausführenden Benutzers bekannt, denn Python folgt ihm, wenn keine Variablen gesetzt sind.
- Der Test protokolliert seine Proxy-Variablen. Dann kann man im Zweifel sehen, was tatsächlich genutzt wurde. 

## Sonderfall Robotmk: RCC-Profile

Wenn du Robot Framework mit Robotmk betreibst, kennst du noch eine weitere Stelle für Proxy-Einstellungen: das RCC-Profil. RCC baut die Python-Umgebungen für die Tests und lässt sich über Profile für Unternehmensnetze konfigurieren:

```yaml
name: firmenproxy
description: RCC-Proxyprofil für den Firmen-Proxy
settings:
  certificates:
    verify-ssl: true
  network:
    no-proxy: 'localhost,127.0.0.1'
    https-proxy: 'http://proxyuser:s3cr3t@proxy.example:3128'
    http-proxy: 'http://proxyuser:s3cr3t@proxy.example:3128'
  meta:
    name: firmenproxy
    description: RCC-Proxyprofil für den Firmen-Proxy
    source: Robotmk
```

Die naheliegende Annahme lautet: Im Profil steht der Proxy, also geht der ganze Test darüber. 

In Wahrheit bewirken die Proxy-Settings im RCC-Profil, 

- dass RCC über diesen Proxy seine Installationsdateien holt,
- dass im RCC-profil gestartete Prozesse die Variablen `HTTP_PROXY`, `HTTPS_PROXY` und `NO_PROXY` sehen. 

Wie oben gezeigt, haben die Umgebungsvariablen aber nur dann Einfluss, wenn die Libraries sie auch auswerten (= nur bei RequestsLibrary der Fall)

Zwei Details sind für Robotmk-Anwender trotzdem wichtig:

- **`rcc task script` erbt die Umgebung des Aufrufers.** Ohne Profil setzt RCC keine Proxy-Variablen, entfernt aber auch keine vorhandenen. Variablen des Schedulers oder des Systems kommen also im Test an.
- **`rcc ht vars` zeigt nur, was das Profil setzt.** Geerbte Variablen tauchen dort nicht auf. Wenn du damit prüfst, welcher Proxy im Test wirkt, siehst du im Zweifel nur die halbe Wahrheit. Das Protokollieren der Variablen im Test ist deshalb auch hier der verlässlichere Weg.

## Referenz: Proxy mit Anmeldung

Viele Firmen-Proxies verlangen Benutzer und Passwort. Am Weg der Requests ändert das nichts, aber jede Stelle erwartet die Zugangsdaten in einer anderen Form. Alle Varianten liefen im Versuch durch.

**Umgebungsvariable** (und damit RequestsLibrary ohne `proxies=`): Zugangsdaten in der URL.

```text
HTTPS_PROXY=http://proxyuser:s3cr3t@proxy.example:3128
```

**RequestsLibrary mit `proxies=`:** ebenfalls in der URL.

```robotframework
*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Backend Über Proxy Mit Anmeldung
    ${proxy}=    Set Variable    http://%{PROXY_USER}:%{PROXY_PASS}@proxy.example:3128
    &{proxies}=    Create Dictionary    http=${proxy}    https=${proxy}
    ${resp}=    GET    https://example.org    proxies=${proxies}    expected_status=200
```

**Browser Library:** eigene Felder `username` und `password` im `proxy`-Dictionary.

```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Startseite Mit Proxy-Anmeldung
    &{proxy}=    Create Dictionary    server=http://proxy.example:3128    bypass=localhost,127.0.0.1
    ...    username=%{PROXY_USER}    password=%{PROXY_PASS}
    New Browser    chromium    proxy=${proxy}
    New Page    https://example.org
```

**RCC-Profil:** wie die Umgebungsvariable, die URL mit Zugangsdaten in `http-proxy` und `https-proxy`. RCC reicht sie unverändert an Python weiter.

## Fazit

Das Verhalten von Python und Chromium ist dabei keine Laune, sondern folgt nachvollziehbaren Entscheidungen der jeweiligen Projekte.  

Unbequem wird es erst, wenn man es nicht kennt.  

Deshalb finde ich es wertvoll, solche Erfahrungen zu dokumentieren. Viele der Fallstricke, etwa die gRPC-Verbindung vor Version 20.4.0, wurden nur deshalb behoben, weil jemand sie gemeldet und reproduzierbar beschrieben hat. Danke allen, die daran mitgewirkt haben.

