---
layout: default
title: 'Sprint 1: Instal·lació i configuració inicial'
---

### Index

---

- [Virtualització i instal·lació del so Ubuntu](#virtualització-i-installació-del-so-ubuntu)
  - [Configuració VirtualBox](#configuració-virtualbox)
  - [Procediment animat](#procediment-animat)
  - [Instal·lació guiada](#installació-guiada)

### Virtualització i instal·lació del so Ubuntu

---

## Tasca: crear màquina virtual per instal·lar Ubuntu 24

Ubuntu és una distribució de Linux (basada en [Debian](https://www.debian.org/index.ca.html)) molt popular (en servidors) de codi obert. En aquest document, explicaré el procediment d'instal·lació, configuració i algunes comandes bàsiques.

## Configuració VirtualBox

En iniciar, el programari de VirtualBox creem una nova màquina virtual, amb la següent configuració minima es prou

- Ram: 4 GB, en l'experiencia d'usar les maquina virtual,
- Processador: en 4 fils de CPU anira fluid, encara que en 2 funcionara, al ser una maquina que creixara, necessitarem més potencia
- Xarxa: Nat, l'entorn que farem servir será un de proves i degut a que permet aïllar la màquina virtual.
- Posem la ISO d'ubuntu.

![ConfiguracioMaquina](/images/sp1/ConfiguracioMaquina.png)

## Procediment animat

---

En iniciar seguim els passos que mostra al vídeo, fins arribar al particionat.

![ConfiguracióMaquina](/images/sp1/instalacioAnimada_1.gif)

En el particioniat s'ha creat l'arrel, que és la partició a on es troba tot el sistema de fitxers i el swap que és la partició arxiu que és fara servir en cas que la ram no sigui prou.

![ConfiguracióMaquina](/images/sp1/instalacioAnimada_2.gif)

## Instal·lació guiada

---

Posteriorment d'inicar, pressionem Enter per iniciar el instal·lador

![Inici instal·lador](/images/sp1/pressEnter.png)

Seguim el procés d'instal·lació seleccionant les nostres opcions.

> Per mes informació mirar la part del [procediment animat](#procediment-animat)

![Pantalla llenguatge 1](/images/sp1/pantallaLlenguatge.png)

En les particions he creat les següents bàsiques:

- **'/'**: per al sistema i aplicacions. Ocupant tot el disco
- **'/efi'**: es crea automáticament (és la de menor mida) actua com el lloc d'emmagatzematge per als carregadors d'arrencada EFI, les aplicacions i els controladors que seran llançats pel firmware UEFI.
- **'swap'**: memòria virtual per evitar bloquejos amb 4 GB de RAM.

Fent servir el sistema de fitxers ext4 que és el més comú fet servir en Ubuntu, que menys problemes dona.

![particionat](/images/sp1/particionat.png)

I finalment després d'acabar l'instal·lació tindrem l'instal·lació feta:

![instalat](/images/sp1/instalat.png)

## Llicenciament

Ubuntu té una llicència GPL (GNU General Public License), que permet modificar, distribuir i utilitzar el sistema de manera lliure.

Hi han diverses tipus de llicencies en linux, per exemple

- **MIT license**: similar a la GPL, permet modificar, distribuir i usar el programari de forma lliure, peró a diferencia de la GPL, s'ha redistribuir el codi amb mínimes restriccions, sempre incloent-hi l'avís de **copyright** original i la renúncia de responsabilitat
- **Apache License**: permet als desenvolupadors utilitzar, modificar i redistribuir el programari, obligant d'esmentar cadascun dels canvis que es facin.

Alguns dels conceptes que més es mencionen en licencies són:

- **copyleft**: els usuaris poden utilitzar, modificar i distribuir lliurement l'obra. Requereix que les obres derivades estiguin subjectes a la mateixa llicència de copyright.
  - Promou la col·laboració i l'intercanvi en la comunitat creativa, com per exemple GPL o Creative Commons licenses.
- **copyright**: protegeix els drets del creador de controlar l'ús, la distribució i la modificació de l'obra, no requereix que les obres derivades siguin llicenciades sota els mateixos termes.
  - Protegeix els drets dels creadors i incentivar la innovació. Exemple: All Rights Reserved, Public Domain Dedication, copyright

## Gestors d'arrencada per a instal·lacions dual

<!-- En primer lloc, entrant en l'Ubuntu amb **Gnome Disks** he formatat el volum.
![GParted-Partitioning-1](../images/sp1/gpartedPartitioning.png)

I **fdisk** canviem l'estil de la partició a GPT.
- Amb **"n"** s'ha creat una nova partició que fa servir tot el disk, de tipus **primaria** **"p"**.
- Posteriorment amb **"t"** he canviat el tipus a **GPT**.

![ParticionatAmbFdisk1](../images/sp1/fdiskPartitioning1.png)
![ParticionatAmbFdisk2](../images/sp1/fdiskPartitioning2.png)

I guardat amb **"w"**:

![ParticionatAmbFdisk3](../images/sp1/fdiskPartitioning3.png)

> _L'error que surt de **ioctl()**, és normal després de canviar particion; el kernel no reconoceix els canvis. S'arreglaria amb **sudo partprobe /dev/sda5** o amb un **reinici**._ > ![alt text](../images/sp1/preconfiguracio.png)
-->

En primer lloc hem de realitzar canvis en la configuració de VirtualBox degut a que requereix una configuració específica. Els canvis duts a terme són:

- Habilitar el EFI.
- Traure la xarxa per no haver-hi de iniciar sessió.
- Canviar el tipus de sistema a Windows i la pantalla (per no tenir-hi problemes).

Afegida la ISO de Windows i iniciat.

![Pre-configuracio](../images/sp1/preconfiguracio.png)

Realitzem el procés d'instal·lació normal fins a la finestra de particions a on seleccionem la buida. I esperem fins que finalitzi i continuem el procés d'instal·lació.
![Instal·lació Windows 1, continuem endavant ](../images/sp1/installWin1.png)
![Instal·lació Windows 2, seleccionem personalitzat](../images/sp1/installWin2.png)
![Instal·lació Windows 3, seleccionem la buida](../images/sp1/installWin3.png)
![Instal·lació Windows 4, ](../images/sp1/installWin4.png)

## Punts de restauració

## Configuració de la xarxa

## Commandes generals i isntalacions
