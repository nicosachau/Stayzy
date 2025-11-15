# Labor 4 zum Modul Webanwendungen

Zur Durchführung dieser Aufgabe benötigen Sie die Laufzeitumgebung *Node.js*. Die Installation der Laufzeitumgebung *Node.js* und eine Möglichkeit zur Entwicklung mit *Node.js* sind in der `README.md` im Repository der Aufgabe 1 beschrieben.

Um Ihnen den Einstieg zu erleichtern, ist in diesem Repository ein grundlegendes *Node.js*-Projekt abgelegt. Ein *Node.js* Projekt erfordert eine Konfigurationsdatei `package.json`. Diese enthält Informationen über das Projekt und kann für den *Node Package Manager* mit dem Befehl `npm init` erzeugt werden.

- In Ihrem geklonten Projekt editieren Sie bitte die `package.json`, sodass diese Ihrem Projekt entspricht.

In der `package.json` Datei sehen Sie Skripte, unter anderem das Startskript für das Projekt. In dem Projekt ist als Dependency das Webframework *Express* gelistet. In der Datei `server.js` ist ein einfacher Webserver mit dem Webframework *Express* kodiert.

- Wechseln Sie in einer Shell in dem *Node.js* Container in das Projektverzeichnis und führen Sie den Befehl `npm install` aus, um die in der `package.json` Datei gelisteten Abhängigkeiten zu installieren. 
- Starten Sie den Server mit dem `npm start` Befehl. Der Server startet in diesem Fall auf Port 80 (siehe Konfiguration in `server.js`).
- In einem Webbrowser erreichen Sie den Server unter der Adresse `localhost:8081` (Port 8081 ergibt sich durch das Mapping des Ports des *Node.js* Containers, welches beim Starten des Containers über den Parameter `-p` spezifiziert wurde).
- Die Portweiterleitungen können Sie bei Bedarf in Visual Studio Code im Reiter *Ports* einsehen und konfigurieren.

Weitere Pakete können Sie mittels des Befehls `npm install -s <pkg>` installieren.# Stayzy


Das ist der Link, den du später in deine Bewerbung schreiben kannst.

---

## 5. Git-Repository erstellen und pushen

Im Projektordner:

```bash
git init
git add .
git commit -m "Initial commit: Stayzy WA Aufgabe 4"

# Beispiel mit GitLab (URL aus deiner package.json)
git remote add origin https://gitlab.iue.fh-kiel.de/wa/sose25/m1-priess/m1-d/wa-a4.git
git push -u origin main
