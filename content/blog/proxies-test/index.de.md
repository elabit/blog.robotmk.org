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

"*It's always DNS*." - Ich möchte gern ergänzen: "*or the Proxy*."
Proxy-Probleme gehören zu den Fällen, bei denen ich innerlich kurz seufze...  
Oft scheitert daran die Installation von Environments, oder die Tests laufen nicht, und man weiß nicht, warum. (Und der Proxy-Admin hat einen Tag Urlaub.)

Ich wollte das Verhalten von **Browser Library** und **RequestsLibrary** mal "kurz" in einem Test nachstellen.  
Herausgekommen ist ein nettes kleines Testprojekt mit zwei Docker-Proxies, fünf Testszenarien und eine interessante Erkenntnis, die ich in diesem Artikel gern mit Euch teilen möchte.

<!--more-->

## Die Frage

Ich wollte wissen: Wie verhalten sich diese beiden Libraries, wenn ein Proxy im Spiel ist - und wie setzt man ihn jeweils korrekt?

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

Wie sich die beiden oben genannten Libraries dabei verhalten, wollte ich genau wissen.

### Die beiden Spielverderber: die Proxies

Ich habe **zwei Instanzen** von [mitmproxy](https://www.mitmproxy.org) aufgesetzt, auf macOS als Docker-Container, unter Windows als lokale Python-Prozesse.

- **Proxy A** soll über die **Umgebungsvariablen** des Betriebssystems gesetzt werden.  
- **Proxy B** wird im Testcase selbst explizit angegeben: 
  - der **RequestsLibrary** per `proxies=` in `GET`, 
  - der **Browser Library** per `proxy=` in `New Browser`. So lässt sich sehen, ob der explizite Proxy die Variablen überstimmt.

### Proxy-Umgebungsvariablen

Diese drei finden sich in allen Betriebssystemen:

- `HTTP_PROXY` = Proxy-Server für **HTTP**-Ziele  
- `HTTPS_PROXY` = Proxy-Server für **HTTPS**-Ziele     
- `NO_PROXY` = braucht man, sobald ein Proxy gesetzt ist: Sie nimmt Ziele aus, die nicht über den Proxy laufen sollen oder können, typischerweise `localhost,127.0.0.1` und interne Hosts. Ohne Proxy hat die Variable nichts zu tun.

> Viele Programme nutzen diese Variablen zur Proxy-Konfiguration. 
> Ein Standard ist das aber nicht: Jedes Programm entscheidet selbst, ob und wie es sie liest.

### Der Testablauf


Testen wollte ich fünf Kombinationen:

| #   | Proxy-Env-Variablen (A) | `NO_PROXY`                   | Proxy explizit im Test (B) | Was ich wissen wollte  |
| --- | ----------------------- | ------------------- | ------------------- | ------- |
| 1   | ☑️       | `localhost,127.0.0.1`        | –           | Nutzen die Libraries den **Proxy A** aus den Umgebungsvariablen?  |
| 2   | ☑️       | `localhost,127.0.0.1`        | ☑️          | Setzt sich der explizite **Proxy B** gegen die Umgebungsvariablen durch? |
| 3   | –        | – (ohne Proxy bedeutungslos) | –           | Gegenprobe: Geht ohne Proxy alles direkt?            |
| 4   | –        | – (ohne Proxy bedeutungslos) | ☑️          | Wirkt der explizite **Proxy B** auch ganz allein?          |
| 5   | ☑️       | **bewusst nicht gesetzt**    | –           | Was passiert, wenn `NO_PROXY` vergessen wird?        |

"Explizit im Test" heißt: ich setze den Proxy direkt für die Library, also

- `proxies=` bei der **RequestsLibrary** 
- `proxy=` bei der **Browser Library** 

Damit ich nicht alles von Hand ausführen muss, habe ich mir ein kleines Skript für macOS (Bash) und Windows (PowerShell) geschrieben.  

Für jedes Szenario 

- startet es beide Proxies (auf macOS als Docker-Container, unter Windows als lokale `mitmdump`-Prozesse),
- setzt je nach Szenario die Variablen für **Proxy A** im Environment,
- wählt die Resource-Datei mit oder ohne expliziten **Proxy B**
- und führt den Test aus.

Danach sammelt es die Logs beider Proxies ein und hält in einer Zusammenfassung fest, welcher Traffic nun über welchen Proxy lief.

> Spannend war also nicht, *ob* der Test durchläuft, sondern *welchen Weg* er dabei nimmt.

---

## Die Ergebnisse

Was haben die beiden Libraries also daraus gemacht? 

| #   | Proxy-Env-Variablen (A) | Proxy explizit im Test (B) | RequestsLibrary | Browser Library |
| --- | ----------------------- | -------------------------- | --------------- | --------------- |
| 1   | ☑️       | –           | → **Proxy A**         | –        |
| 2   | ☑️       | ☑️          | → **Proxy B**         | → **Proxy B**         |
| 3   | –        | –           | –           | --          |
| 4   | –        | ☑️          | → **Proxy B**         | → **Proxy B**         |
| 5   | ☑️ (ohne `NO_PROXY`)    | –           | → **Proxy A**         | –        |

Das Ergebnis war auf macOS und Windows gleich.  

### Python hält sich an die Regeln

Beginnen wir mit dem nativen Python-Teil: er betrifft die **RequestsLibrary**.  
Sie nutzt intern die Python-Bibliothek `requests`, und die folgt ganz klaren Regeln:

- Sobald `HTTP_PROXY` und `HTTPS_PROXY` gesetzt waren, richtete die `RequestsLibrary` jeden Aufruf an **Proxy A**.  
- Fehlten die Variablen, ging der Aufruf direkt - mit einer Ausnahme unter Windows, dazu gleich mehr.  
- Bekam `GET` dagegen explizit `proxies=` mit, ging der Request über **Proxy B**, auch wenn die Variablen auf **Proxy A** zeigten (Szenario 2). Der explizit gesetzte Proxy gewinnt.

Für die `RequestsLibrary` bedeutet das: Wenn Du die Variablen bereits im Environment setzt, musst Du im Test nichts weiter tun.

```robotframework
*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Backend Antwortet
    ${resp}=    GET    https://example.org    expected_status=200
```

Willst Du den Proxy lieber ausdrücklich im Test festlegen, etwa weil der Test auf verschiedenen Maschinen laufen soll, übergibst Du ihn mit `proxies=`:

```robotframework
*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Backend Antwortet Über Proxy
    &{proxies}=    Create Dictionary    http=http://proxy.example:3128    https=http://proxy.example:3128
    ${resp}=    GET    https://example.org    proxies=${proxies}    expected_status=200
```

Dasselbe Argument nimmt auch `Create Session` entgegen, dann gilt der Proxy für alle Requests der Session.

Eine Eigenheit zeigte sich unter **Windows**:  
Im Lauf mit gesetztem Systemproxy (Internetoptionen bzw. WinINET) ging der Python-Request in Szenario 3, also ganz **ohne** Proxy-Variablen und ohne `proxies=`, trotzdem über **Proxy A**.  
**Der Grund**: Findet `getproxies()` unter Windows keine Variablen, liest es die Proxy-Einstellungen des Benutzers aus der Registry.  Das ist praktisch, kann aber ganz schön verwirren 😵‍💫

**Fazit für Python:** 

- Ein expliziter Proxy hat Vorrang. Ohne ihn folgt requests den Umgebungsvariablen und unter Windows ersatzweise dem Systemproxy. 
- Das Verhalten ist dokumentiert und vorhersagbar. 
- Du musst nur wissen, welche Umgebung der Test tatsächlich sieht.

### Der Browser geht seinen eigenen Weg

Da wurde es richtig interessant... 

In den Läufen mit gesetzten Umgebungsvariablen für **Proxy A**, aber ohne expliziten **Proxy B**, **ging der Chromium-Browser trotzdem direkt ins Netz** (Szenarien 1 und 5). 

**Das kommt unerwartet. Warum ist das so?** 

👉 **Playwright startet Chromium nur dann mit einem Proxy, wenn man ihm explizit einen übergibt.**  

Ohne `proxy` startet es den Browser ohne `--proxy-server`-Flag; die Proxy-Variablen wertet Chromium auf macOS und Windows nicht aus.  

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

- `server` nennt den Proxy
- `bypass` die Hosts, die der Browser direkt erreichen soll. Das ist das Äquivalent zu `NO_PROXY`, nur eben für den Browser. 

`proxy=` hat in allen Läufen gewirkt, unabhängig davon, was in den Variablen oder in der Registry stand.

**Mein Fazit für die Browser Library:** Relevant ist nur, was beim Aufruf von `New Browser` mitgegeben wird. 

## Die unsichtbare Verbindung: gRPC und `NO_PROXY`

Es gibt noch eine dritte Netzwerk-Verbindung, die man leicht übersieht, weil sie mit dem Internet eigentlich gar nichts zu tun hat.   
Die **Browser Library** verbindet sich per **gRPC** mit ihrem Node-Prozess auf `127.0.0.1` und einem zufälligen Port.

> **Info:** gRPC ist ein Protokoll für Aufrufe zwischen Prozessen. Die Browser Library nutzt es, damit die Python-Seite (die Keywords) und die Node-Seite (Playwright) miteinander sprechen können.

Daraus ergab sich eine böse Fußangel, an der viele Einsteiger hängen geblieben sind:  
Bei gesetztem Proxy schickt die **gRPC**-Bibliothek nämlich auch diese lokalen Verbindungen über den Proxy.  

Viele in der Community dürften diese Meldung kennen:  

`Could not connect to the playwright process`.

Seit **Browser Library 20.4.0** ist das behoben (GitHub Issue: [robotframework-browser#1037](https://github.com/MarketSquare/robotframework-browser/issues/1037)).  
Die Library schaltet den Proxy für ihren internen Kanal inzwischen selbst ab (`grpc.enable_http_proxy=0`).  
Im Versuch mit Browser Library v20.4.0 lief deshalb auch das Szenario ohne `NO_PROXY` in allen Läufen durch, auf beiden Plattformen.

Trotzdem rate ich, `NO_PROXY` mindestens auf `localhost,127.0.0.1` zu setzen.  
Es kostet nichts, schützt ältere Environments - und hält auch andere lokale Verbindungen vom Proxy fern.  

Und falls Du noch eine Version vor 20.4.0 im Einsatz hast, ist das ein guter Grund für ein Update. 😊

## Die Checkliste für den nächsten Proxy-Fall

Aus den Messungen ist eine kurze Liste geworden, die ich inzwischen bei jedem neuen Projekt hinter einem Proxy durchgehe:

- **Browser Library**:
  - `New Browser` immer mit `proxy=` / `server` und `bypass` parametrisieren, auch wenn Variablen oder ein Systemproxy gesetzt sind.
  - mindestens Version 20.4.0 (wegen gRPC-Proxy-Problem)
- **RequestsLibrary**:
  - wertet die Umgebungsvariablen aus; `proxies=` nutzen, wenn der Test unabhängig von der Umgebung laufen soll.
- `NO_PROXY` in jedem Fall mindestens auf `localhost,127.0.0.1` setzen.
- Unter Windows den Systemproxy des ausführenden Benutzers kennen, denn Python folgt ihm, wenn keine Variablen gesetzt sind.
- Den Test seine Proxy-Variablen protokollieren lassen. Dann kannst Du im Zweifel sehen, was tatsächlich genutzt wurde. 

## Sonderfall Robotmk: RCC-Profile

Wenn Du Robot Framework mit **Robotmk** betreibst, kennst Du noch eine weitere Stelle für Proxy-Einstellungen: das RCC-Profil.  
RCC baut die Python/NodeJS-Umgebungen für die Tests und lässt sich über Profile für Unternehmensnetze konfigurieren:

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

Die naheliegende Annahme lautet, dass damit auch der Proxy für den Test konfiguriert wird.

In Wahrheit bewirken die Proxy-Settings im RCC-Profil lediglich, 

- dass RCC über diesen Proxy seine **Installationsdateien** holt,
- dass im RCC-Profil gestartete Prozesse die **Variablen** `HTTP_PROXY`, `HTTPS_PROXY` und `NO_PROXY` sehen. 

Wie oben gezeigt, haben die Umgebungsvariablen aber nur dann Einfluss, wenn die Libraries sie auch auswerten (= nur bei der RequestsLibrary der Fall).

Zwei Details sind für Robotmk-Anwender trotzdem wichtig:

- **`rcc task script` erbt die Umgebung des Aufrufers.** Ohne Profil setzt RCC keine Proxy-Variablen, entfernt aber auch keine vorhandenen. Variablen des Schedulers oder des Systems kommen also im Test an.
- **`rcc ht vars` zeigt nur, was das Profil setzt.** Geerbte Variablen tauchen dort nicht auf. Wenn Du damit prüfst, welcher Proxy im Test wirkt, siehst Du im Zweifel nur die halbe Wahrheit. Das Protokollieren der Variablen im Test ist deshalb auch hier der verlässlichere Weg.

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

Unbequem sind diese Settings eigentlich nur, wenn man sie nicht genau kennt.  

Und seit heute sage ich wieder voller Überzeugung: "*It's always DNS*."  😄
