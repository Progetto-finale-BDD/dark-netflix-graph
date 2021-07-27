# Dark-netflix-graph



Requisiti
------------
Questo progetto richiede 2 moduli facoltativi:

Libreria D3.js (https://d3js.org/)

Il gestore NPM (https://www.npmjs.com/)

Nella soluzione proposta non abbiamo bisogno del primo modulo perchè le libreria viene importata direttamente dall'html
mentre il secondo viene utilizzato per runnare il server con il comando http-server. 

Come utilizzare
------------
Per utilizzarlo bisogna navigare fino cartella dove si trova il file "index.html" dal terminale. Successivamente runnare il comando http-server (dopo averlo installato con il comando npm install -g http-server) e aprile il proprio browser di riferimento su "http://localhost:8080/" (Testato sia su Chrome che su Firefox).

L'utente può interagire con l'interfaccia grafica in diversi mod con bottoni e checkbox presenti nell'header, in particolare:

1. L'utente può selezionare tra le 9 relazioni disponibili tramite delle checkbox. Le selezioni NON sono esclusive.

2. L'utente può scegliere tra i 4 anni in cui si sviluppa la serie, cliccando su uno di essi veranno mostrati solo i personaggi presenti in quell'anno. Le selezioni sono esclusive. Il bottone "ALL" mostra tutti i personaggi in tutti gli anni.

3. L'utente può interagire consultando la legenda dei nodi e successivamente cercare nel grafo i nodi con il bordo viola per sapere chi sono i personaggi "Time Traveller"
 
4. L'utente può interagire direttamente dal grafo cliccando con il tasto sinistro del mouse sui nodi per visualizzare i vari attori di un singolo personaggio tra le varie epoche.
 
5. L'utente può scegliere tra le 4 famiglie principali presenti nella serie TV, mostrando cosi solo i personaggi relativi a quella famiglia. Le selezioni NON sono esclusive.
 


Examples 
------------




Maintainers
------------
- Matteo Brandetti
- Gianluca De Angelis
- Pier Vincenzo De Lellis
