# Élus : combien ça coûte vraiment ?

Site statique ultra-simple (HTML/CSS/JS pur, pas de build) hébergé sur GitHub Pages.

**Objectif :** rassembler toutes les rémunérations, indemnités et avantages des élus français et les comparer à 12 pays à méthode constante (en €, en PPA, en × salaire médian) pour démonter les idées reçues.

## Structure
```
index.html          # comparateur interactif
france.html         # atlas France complet
monde.html          # comparatif monde
methodologie.html   # sources + limites
style.css
script.js
data/france.json    # données France (éditable au bloc-notes)
data/monde.json     # données monde
```

## Mettre à jour une donnée
1. Ouvre `data/france.json` ou `data/monde.json`
2. Modifie le chiffre
3. `git commit -am "maj: ..."` + `git push` → site mis à jour en ~2 min

## Sources
- France : JO, assemblee-nationale.fr, senat.fr, DGCL, HATVP
- Monde : IPU Parline (data.ipu.org), sites officiels des parlements
- PPA/médian : OCDE, INSEE

Licence : Données Licence Ouverte 2.0, Code MIT.
