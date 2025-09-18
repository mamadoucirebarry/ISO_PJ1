---
layout: default
title: "Sprint 1: Instal·lació i configuració inicial"
---

### Index
---

- [Virtualització i instal·lació del so Ubuntu](#virtualització-i-installació-del-so-ubuntu)
    - [Configuració VirtualBox](#configuració-virtualbox)
    - [Procediment animat](#procediment-animat)
    - [Instal·lació guiada](#installació-guiada)

### Virtualització i instal·lació del so Ubuntu
---

Tasca: crear màquina virtual per instal·lar Ubuntu 24
---

Ubuntu és una distribució de Linux (basada en [Debian](https://www.debian.org/index.ca.html)) molt popular (en servidors) de codi obert. En aquest document, explicaré el procediment d'instal·lació, configuració i algunes comandes bàsiques.

## Configuració VirtualBox
En iniciar, el programari de VirtualBox creem una nova màquina virtual, amb la següent configuració minima es prou
* Ram: 4 GB, en l'experiencia d'usar les maquina virtual, 
* Processador: en 4 fils de CPU anira fluid, encara que en 2 funcionara, al ser una maquina que creixara, necessitarem més potencia
* Xarxa: Nat, l'entorn que farem servir será un de proves i degut a que permet aïllar la màquina virtual.
* Posem la ISO d'ubuntu.

![ConfiguracioMaquina](/images/sp1/ConfiguracioMaquina.png)

## Procediment animat

---

En iniciar seguim els passos que mostra al vídeo, fins arribar al particionat.

![ConfiguracióMaquina](/images/sp1/instalacioAnimada_1.gif)

En el particioniat s'ha creat l'arrel i el swap

![ConfiguracióMaquina](/images/sp1/instalacioAnimada_2.gif)

## Instal·lació guiada
---

Posteriorment d'inicar, pressionem Enter per iniciar el instal·lador

![Inici instal·lador](/images/sp1/pressEnter.png)

Seguim el procés d'instal·lació seleccionant les nostres opcions.

> Per mes informació mirar la part del [procediment animat](#procediment-animat)

![pantalla1](/images/sp1/pantalla1.png)

En les particions he creat les següents bàsiques:
- **'/'**: per al sistema i aplicacions. Ocupant tot el disco
- **'/efi'**: es crea automáticament (és la de menor mida) actua com el lloc d'emmagatzematge per als carregadors d'arrencada EFI, les aplicacions i els controladors que seran llançats pel firmware UEFI.
- **'swap'**: memòria virtual per evitar bloquejos amb 4 GB de RAM.  

Fent servir el sistema de fitxers ext4 que és el més comú fet servir en Ubuntu, que menys problemes dona.

![particionat](/images/sp1/particionat.png)

## Llicenciament
## Gestors d'arrencada per a instal·lacions dual
## Punts de restauració
## Configuració de la xarxa
## Commandes generals i isntalacions