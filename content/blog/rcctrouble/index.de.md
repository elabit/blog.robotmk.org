---
draft: false
pinned: true
title: "RCC Troubleshooting"
# --- Italic subheading
# lead: 
# -- giscus id to match comments
# commentid: 
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description: Tipps zur schnellen Fehlerbehebung bei der Erstellung von RCC-Environments
date: "2025-05-06T16:02:59+02:00"
categories:
  - tutorials
tags:
  - "rcc"
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
#thumbnail: ""
vgwort: https://vg04.met.vgwort.de/na/1360506dbdd3408db23ff8cf26aa26e4
translationKey: "rcctrouble"
---

**RCC** ist das Kommandozeilenwerkzeug, um mit dem die Python-Environments für Robotmk Framework gebaut werden können.  
Das praktische dabei: es kommt sowohl bei der Testentwicklung, als auch während der Ausführung durch Robotmk zum Einsatz. Das garantiert, dass die Scripte immer in einer verlässlichen Umgebung laufen.  

Doch manchmal kann es beim Bauen oder Aktivieren der Environments zu Fehlern kommen.  
Dieser Artikel fasst die häufigsten Fehlerquellen bei der Arbeit mit RCC zusammen und zeigt, wie man sie effizient behebt.

<!--more-->

---

## Allgemeine Fehler

### RCC kann nicht ausgeführt werden / Falsche Versionsnummer

**Problem**: `rcc version` lässt sich überhaupt nicht ausführen oder zeigt eine andere Version als **17.29.1** an.  

**Mögliche Ursachen**:

- Die Datei ist nicht korrekt in `rcc` oder `rcc.exe` **umbenannt** worden.
- Sie befindet sich am falschen **Speicherort** oder 
- ist nicht **ausführbar** (Linux/Mac)
  
**Lösung:**  

Mit den Befehlen `which` (Linux/Mac) und `where` (Windows) kannst Du überprüfen, wohin der Aufruf von `rcc` führt.  
Überprüfe, ob das Verzeichnis **bin** tatsächlich im Pfad enthalten ist. Starte die Shell gegebenenfalls neu, damit die Änderungen wirksam werden.  
Setz unter Linux/Mac die Ausführungsberechtigung (`chmod +x`).

```powershell
❯ C:\Users\simon_meggle>where rcc
C:\Users\simon_meggle\bin\rcc.exe
```

```bash
❯ which rcc
/Users/simon/bin/rcc
```

---

### Falsche Shell / Admin-CMD

**Fehler:** Es wird die Meldung *"Cannot do shell for simple execution model"* angezeigt. 

**Lösung:** Du hast den RCC-Befehl wahrscheinlich versehentlich in einer Admin-CMD/PowerShell ausgeführt. → Führe RCC unter deinem **eigenen Benutzerkonto** aus!

---

### Fehlerhafte Dateiendung (YAML vs. YML)

**Fehler:** Du bekommst eine diese Meldungen: 


{{< figure src="img/rcc-shellerror.png" >}}

{{< figure src="img/rcc-roboterror.png" >}}

**Lösung:**

**conda.yaml** bzw. **robot.yaml** kann nicht gefunden werden - stimmen die Dateiendung? (Oft ist die Ursache "yml" statt "yaml".)

---


### cmd.exe wird nicht gefunden

**Fehler:** Dieser Fehler tritt während der Erstellung der RCC-Umgebung auf:

{{< figure src="img/cmdexenotfound.png" >}}

**Beschreibung:** Internes Windows-Problem.

**Lösung:** Versuche, das [Windows-Tool zur Überprüfung von Systemdateien](https://support.microsoft.com/en-us/topic/use-the-system-file-checker-tool-to-repair-missing-or-corrupted-system-files-79aa86cb-ca52-166a-92a3-966e85d4094e) `sfc` zu verwenden:

Der Befehl `sfc /scannow` überprüft alle geschützten Systemdateien und **ersetzt beschädigte Dateien** durch eine zwischengespeicherte Kopie.  

(Ohne Gewähr..., aber bei einem Trainingsteilnehmer hat es tatsächlich funktioniert... 🤷‍♂️ )

---




### Benutzerprofil mit Leerzeichen

**Fehler:** 

{{< figure src="img/profile_with_space.png" title="RCC-Fehlermeldung wegen Leerzeichen im Userprofil" >}}

**Beschreibung:** Aus unbekannten Gründen darf das Benutzerprofil keine Leerzeichen enthalten.

**Lösung:** Ändern Sie den Pfad, in dem RCC die Umgebungen speichern soll:

- Definieren Sie eine neue Umgebungsvariable `ROBOCORP_HOME` und weisen Sie ihr ein Verzeichnis Ihrer Wahl (ohne Leerzeichen) zu. Beispiel: `C:\rcc`
- Starten Sie eine neue CMD und versuchen Sie es erneut.


---

## Environment-Erstellung

### Erstellung der Umgebung schlägt fehl (Windows, VCRUNTIME140_1.dll / Fehlercode 0xc0000135)

Auf einigen Windows-Systemen fehlt die DLL **VCRUNTIME140_1.dll** (der Grund dafür ist unbekannt).
Das beim bau der Environments verwendete Tool **micromamba** bricht die Erstellung der Umgebung mit einer nichtssagenden Meldung ab:

{{< figure src="img/dllerror.png" title="RCC-Fehlermeldung beim Bau von Environments" >}}

Die Ursache kann verifiziert werden, wenn man das in der RCC-Ausgabe aufgeführte Tool **micromamba.exe** manuell auf der Konsole ausführt.  
Fehlt die DLL tatsächlich, erzeugt micromamba diese Fehlermeldung:

{{< figure src="img/vcr.png" title="Micromamba findet VCRUNTIME140_1.dll nicht" >}}

Auf Windows 11-Systemen tritt der Fehler auch mit dem Fehlercode `0xc0000135` zu Tage: 

```
Fatal [Micromamba [3221225781/c0000135]]: exit status 0xc0000135
```

**Lösung:** Installiere das [Microsoft Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2015-2017-2019-and-2022) von Microsoft - es enthält exakt diese DLL.


{{< figure src="img/vcr2.png" title="Achte darauf, die **X64**-Variante zu installieren" >}}

---

### Erstellung der Umgebung bricht ab (Windows, 0x80092012 und 0x80092013)

**Fehler:** RCC (micromamba) kann unter Windows keine Umgebung erstellen und bricht mit folgendem SSL-Fehler ab:

```
critical libmamba Multiple errors occured:
    Download error (35) SSL connect error [https://conda.anaconda.org/conda-forge/noarch/repodata.json.zst]
    schannel: next InitializeSecurityContext failed: Unknown error (0x80092012)
```

(Manchmal auch mit Fehlercode 0x80092013)

**Beschreibung:**  Auf Windows verwendet das in RCC eingesetzte **micromamba** intern libcurl mit dem Schannel-Backend (statt OpenSSL).  
Das bedeutet: die Zertifikatsprüfung erfolgt über den Windows Certificate Store und die sogenannten Windows-Revocation-Mechanismen (CRL/OCSP).

Beim Aufbau der HTTPS-Verbindung führt Schannel automatisch eine solche Revocation-Prüfung durch (also die Überprüfung, ob ein Zertifikat vielleicht widerrufen wurde).  
Schlägt diese fehl – z. B. weil der Revocation-Server nicht erreichbar ist oder durch Netzwerkregeln blockiert wird – bricht der TLS-Handshake ab.

**Ursachen:**  

- Unternehmensnetzwerke mit Proxy / Gateway (z. B. Cloudflare Gateway)
- von der Firewall blockierter Zugriff auf CRL/OCSP-Server
- Interne oder "intercepted" Zertifikate

**Wichtig zu wissen**:

- `rcc config diagnostics` kann erfolgreich sein, da dort keine strikte Revocation-Prüfung erfolgt
- Andere Tools funktionieren ggf. problemlos, weil sie OpenSSL statt Schannel verwenden oder Revocation-Fehler komplett ignorieren
- Das in RCC arbeitende **micromamba** hingegen verhält sich strikt, da Schannel den Fehler als kritisch bewertet!

**Lösung:**  Deaktiviere die Revocation-Prüfung für micromamba/curl über eine System-Umgebungsvariable:

```
CURL_SSL_NO_REVOKE=1
MAMBA_SSL_NO_REVOKE=true
```

Danach den Host neu starten und die Erstellung des Environments erneut versuchen.
(Alternativ: `psexec -i -s cmd.exe` und `setx /M CURL_SSL_NO_REVOKE=1` bzw. `setx /M MAMBA_SSL_NO_REVOKE=true` in der System-Shell ausführen, um die Variable systemweit zu setzen.)



---

### LongPath Support

**Fehler:** Beim Aktivieren der erforderlichen LongPath-Unterstützung mit `rcc config longpaths -e` erscheint diese Fehlermeldung:

```
WARNING! Long path support failed. Reason: exit status 1. WARNING! Long paths do not work!

Error executing: rcc.exe configure longpaths --enable 
Error code: undefined Error: error Stderr: Failure to modify registry: Access is denied.
```

**Beschreibung:** Offensichtlich wird der Windows-Rechner zentral über Gruppenrichtlinien verwaltet, wodurch die LongPath-Richtlinie nicht geändert werden kann.  

**Lösung:** Bitte den für die GPOs zuständigen Administrator, diese Richtlinie zu setzen:
`Local Computer Policy > Computer Configuration > Administrative Templates > System > Filesystem > NTFS > Enable Win32 long paths > Enabled`

---

### Netzwerkzugriff per Proxy

**Fehler:** Während der Erstellung der Umgebung schlägt RCC aufgrund von Netzwerkfehlern fehl.

**Beschreibung:** RCC benötigt **Internetzugang**, um die Installationsdateien und -pakete herunterzuladen.[^1]
Wenn ein Proxy-Server im Netzwerk verwendet wird, musst Du diesen in einem "Profil" angeben.

**So geht's:**

- Lade zunächst die Datei (Vorlage) von <i class="fab fa-github"></i> [hier](https://github.com/Robotmk/level1-code/blob/main/conf/rcc_proxy_profile.template.yaml) herunter und speichere sie irgendwo im Dateisystem.
- Öffne die Datei mit einem Editor und gib die Adresse des Proxys in `http_proxy` und `https_proxy` an. (Protokoll und Port müssen ebenfalls angegeben werden!)

[^1]: ab Checkmk 2.4 wird auch der [Import von Umgebungen als ZIP-Datei] (<https://docs.checkmk.com/latest/de/robotmk.html?lquery=rcc#ziparchive>) unterstützt.

Beispiel:

```yaml  { lineNos="true" wrap="true" title="rcc_proxy_profile.yaml"}
name: MyProxy
description: RCC proxy profile
settings:
  certificates:
    verify-ssl: true
  network:
    no-proxy: 'localhost,127.0.0.1'
    https-proxy: 'http://myproxy.local:3128'
    http-proxy: 'http://myproxy.local:3128'
  meta:
    name: MyProxy
    description: RCC proxy profile
    source: Robotmk
```

- Führe anschließend die folgenden Befehle aus, um das Profil zu importieren und zu aktivieren.

```cmd { lineNos="false" wrap="true" title="RCC profile activation"}
> rcc config switch # zeigt das aktuelle Profil an (Standard)
> rcc config import -f <Datei>.yaml # importiert das Proxy-Profil
> rcc config switch -p <Profilname> # zum neuen Profil wechseln
```

Reset auf das **Standardprofil** (= kein Proxy) ist möglich mit  

`rcc config switch --noprofile`.

**Hinweis:** Der oben beschriebene Ansatz funktioniert nur, wenn der verwendete Proxy **alle Domains** prinzipiell/weitestgehend zulässt (→ man spricht dann von einem "transparenten" oder "offenen" Proxy).
Sogenannte "*Whitelisting*"-Proxys sind da schon restriktiver: Sie verwenden eine **Liste erlaubter Domains**; jeglicher sonstiger Datenverkehr wird **standardmäßig** blockiert.  

Wenn dies bei Dir der Fall ist, musst Du den Proxy-Administrator bitten, die folgenden Domains in die Whitelist aufzunehmen:

```
anaconda.org
conda.anaconda.org
files.pythonhosted.org  
pypi.org
registry.npmjs.org  
playwright.azureedge.net  
playwright-akamai.azureedge.net  
playwright-verizon.azureedge.net
github.com
githubusercontent.com
raw.githubusercontent.com
```

---


## VS Code

### Environment kann nicht in VS Code benutzt werden

Dieser Fehler tritt etwa seit Januar 2026 auf.

**Fehler:** Du hast VS Code korrekt aus dem aktivierten Environment heraus gestartet (`code .`), trotzdem fragt VS Code nach dem Interpreter. Robot Framework kann nicht gefunden werden. 

**Beschreibung:** Seit kurzem installiert sich neben der Python-Erweiterung für VS Code automatisch noch eine weitere namens **Python Environments**. (Diese soll offensichtlich das Handling von virtuellen environments erleichtern - unterstützt aber nicht RCC-Environments, wie es scheint... ) 

{{< figure src="img/msenv.png" title="Deinstalliere die Erweiterung 'Python Environments'" >}}

**Lösung:** Deinstalliere (bzw. deaktiviere) diese Erweiterung und starte VS Code danach neu.

---

## Sonstiges

### Verwendung eines internen Artifactory-Servers (Nexus, Artifactory usw.)

**Fehler:** RCC kann keine Pakete installieren, da es keinen Zugriff auf öffentliche Repositorys hat. 

**Beschreibung:** In einigen Organisationen ist der Zugriff auf öffentliche Repositorys wie PyPI oder Anaconda.org nicht möglich. Stattdessen müssen interne Artifactory-Server als Proxys verwendet werden.

**Lösung:** In diesem Fall muss die Datei **conda.yaml** entsprechend geändert werden:


```yaml
dependencies:
  - python=3.12.3
  - pip=23.2.1
  - nodejs=22.11.0
  - pip:
    - --index-url https://nexusrepo/path
    - --trusted-host nexus_url
    - robotframework==7.2
    - robotframework-browser==19.12.5
```

> Danke an Erik Becker (Flughafen Berlin) für die Meldung dieses Problems und die Bereitstellung der Lösung!


---

Ich freue mich natürlich, wenn Du weitere Fehlerquellen oder Lösungen kennst, die hier noch nicht aufgeführt sind.  
**Nutze gerne die Kommentarfunktion!**
