---
layout: default
title: 'Sprint 2: Instal·lació, configuració de programari de base i gestió de fitxers'
---

# Instal·lació i configuració programari de base i gestió de fitxers

<img width="1680" height="840" alt="image" src="https://github.com/user-attachments/assets/79893fa9-e556-4565-8dc8-7d8c3467cca1" />

# Índex

- [Instal·lació i configuració programari de base i gestió de fitxers](#instal·lació-i-configuració-programari-de-base-i-gestió-de-fitxers)
- [Conceptes bàsics](#conceptes-bàsics)
  - [Formes de formatar](#formes-de-formatar)
    - [Amb GPARTED](#amb-gparted)
    - [Via linia comandes](#via-linia-comandes)
  - [Muntatge](#muntatge)
- [Gestió de processos](#gestió-de-processos)
- [Gestió d'usuaris i grups i permisos](#gestió-dusuaris-i-grups-i-permisos)
  - [Directoris i fitxers importants](#directoris-i-fitxers-importants)
    - [Directoris importants](#directoris-importants)
    - [Fitxers usuaris i grups](#fitxers-usuaris-i-grups)
  - [Comandes bàsiques / gestió](#comandes-bàsiques--gestió)
    - [Exercis](#exercis)
      - [Canvia nom usuari](#canvia-nom-usuari)
      - [Crear usuari amb useradd](#crear-usuari-amb-useradd)
  - [Gestió bàsica d’usuaris i grups](#gestió-bàsica-dusuaris-i-grups)
    - [adduser / addgroup](#adduser-addgroup)
    - [useradd/ groupadd](#useradd-groupadd)
    - [usermod / grupmod](#usermod-grupmod)
    - [adduser / gpasswd](#adduser-gpasswd)
    - [userdel/ grupdel](#userdel-grupdel)
    - [chage](#chage)
  - [Gestió avançada](#gestió-avançada)
    - [TTY](#tty)
    - [PAM](#pam)

<!--
- [Còpies de seguretat i automatització de tasques](#copies-de-seguretat-i-automatitzacio-de-tasques)

- [Eines de còpia: rsync, tar, dd](#eines-de-copia)
- [Estratègies: complet, incremental, diferencial](#estrategies-de-copia)
- [Scripts i planificació: cron, crontab, systemd timers](#scripts-i-planificacio)
- [Verificació i proves de restauració (checksums)](#verificacio-i-proves-de-restauracio)
- [Còpies remotes i sincronització (ssh, scp, rclone)](#copies-remotes-i-sincronitzacio)

- [Quotes d'usuari](#quotes-dusuari)
- [Activació i comprovació de quotes (quotaon, quotacheck)](#activacio-i-comprovacio-de-quotes)
- [Configuració per usuari i per grup (edquota)](#configuracio-per-usuari-i-per-grup)
- [Informes i límits (repquota, quota)](#informes-i-limits)
- [Gestió d'excediments i notificacions](#gestio-dexcediments-i-notificacions)
-->

# Conceptes bàsics

Quan treballem amb discs i sistemes de fitxers, és important entendre com s’organitza la informació dins del dispositiu d’emmagatzematge. Cada nivell (físic, lògic i del sistema operatiu) té les seves pròpies unitats i funcions.

- **sector**: Unitat minima fisica a on es guarden les dades, per defecte **512 bytes**, no se pot canviar, el disc treballa a este nivell
- **cluster**: unitat logica minima a on es guarden les dades a nivell de sistema operatius, 4096 bytes, se pot canviar al formatar el disc.
- Habitualment té una mida de 4096 bytes, és a dir, 8 sectors (**4096/ 512 = 8**).

La mida del bloc y cluster així com el sistema de fitxers pot ser diferent a cada particio del disc.

Si llistem amb `fdisk -l` per trobar la nostra partició

![Particio fdisk mida block](../images/sp2/particioFDISK_midaBlock.png)

> Podem observar que la mida del sector es 512 bytes

Amb el temps i l’ús, els arxius es creen, esborren i modifiquen contínuament. Aixó pot fer que els blocs es distribueixin de manera dispersa al disc.

- Aixó ho nomenem **fragmentació externa**

La **fragmentació interna** és quan es desaprofita espai del disc perquè els blocs són massa grans per al que s’ha de guardar dintre. Problema comú del FAT32.

> Exemple: un fitxer de 8 bytes ocupa un bloc de 4096 bytes → tenim 4088 bytes desaprofitats.

Per mirar la mida del bloc de la partició podem usar `tune2fs`, filtrar per Block

![Informe tune2fs](../images/sp2/tune2fsBlock.png)

Per a la fragmentacio externa amb la comanda "e4defrag" ens indica si una partició fa falta fragmentar.

![Informe e4defrag](../images/sp2/informeE4defrag.png)

En cas de haver desfragmentar, traiem el paràmetre `-c`

![Fragmentant](../images/sp2/fragmentantE4defrag.png)

Sistemes de fitxers habituals:

- FAT32 / exFAT – simple però tendeix a ser afectat per la fragmentació, és reconegut per Windows i Linux.
- EXT4 – modern, optimitzat per a Linux, redueix molt la fragmentació.
- NTFS – sistema de Windows, compatible també amb Linux.

Per poder gestionar correctament un disc, primer cal dividir-lo o organitzar-lo lògicament. Que són:

- **partició**: és una **divisió lògica d’un disc dur** que permet separar i organitzar l’espai d’emmagatzematge en unitats independents.
- **volum**: és una **unitat lògica d’emmagatzematge** formada per una o més particions o discs, gestionada pel sistema operatiu com si fos un sol espai. Com afegir una capa d'abstracció damunt de les particions/ discs.

Abans d’utilitzar una partició ( o en la propia fabricació del dispositiu d'enmagatzematge).
Cal aplicar un formatat, és a dir, preparar-la amb un sistema de fitxers concret. N'hi han de 3 tipus:

- Formatat alt nivell: simplement esborra els punters/ taula fitxer, només borra "sistema fitxers".
- Formatat mig nivell: borra sistema fitxer, si troba sector defectuos el marca per a no guardar-hi informació.
- Formatat baix: borra sistema fitxer, si troba sector defectuos els intenta arreglar. No es pot fer a nivell sistema operatiu, només amb eines de fabricant.

Podem veure l'espai desaprofitat amb una simple prova.

> Escrivint un text com "Bon dia" que són 8 bytes reals i en el sistema ocupa 4096 bytes (la mida d’un bloc).

```bash
echo "Bon dia" > hola
```

![Bytes arxiu text pla 8 Bytes reals](../images/sp2/bytesArxiu.png)

Això significa que hi ha fragmentació interna de 4096 − 8 = 4088 bytes, és a dir, espai desaprofitat dins del bloc.

## Formes de formatar

Fent servir GPARTED i la linia de comandes, formatare dues particions a EXT4 i NTFS respectivament.
Intentant canviar la mida del bloc si ho permet l'eina.

### Amb GPARTED

És una eina visual per crear, eliminar o formatar particions.

- Permet triar el sistema de fitxers (FAT32, EXT4, NTFS...) però **no permet canviar la mida del bloc**.

Els passos a seguir són:

1. Iniciem l'eina i Seleccionem el disk dalt a la dreta

| ![Logo GPARTED](../images/sp2/sp2-logoGparted.png)        | ![Prompt contrasenya root per iniciar com root GPARTED](../images/sp2/sp2-polkitGParted.png) |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| ![GPARTED iniciat](../images/sp2/sp2-gparted-iniciat.png) | ![Gparted seleccionant disc](../images/sp2/sp2-gparted1.png)                                 |

2. Creem nova taula particions GPT

![Gparted creació taula particions 1](../images/sp2/sp2-GPARTED-taula-particions.png)
![Gparted creació taula particions 2](../images/sp2/sp2-GPARTED-taula-particions-2.png)

2. Creem nova partició i la formatem a EXT4

![GParted creacio particio1 - 1](../images/sp2/sp2-creacioParticio1.png)
![GParted creacio particio1 - 2](../images/sp2/sp2-creacioParticio1-2.png)
![Gparted partició 1 creada](../images/sp2/sp2-creacioParticio1-creada.png)

3. Repetim el pas anterior pero a format NTFS i fem clic en **Aplicar todas las operaciones**

![GParted creacio particio2](../images/sp2/sp2-creacioParticio2.png)
![GParted aplicar todas las operaciones](../images/sp2/sp2-gparted-aplicaroperaciones.png)
![GParted aplicar todas las operaciones > Aplicar](../images/sp2/sp2-gparted-aplicaroperaciones-2.png)
![Aplicar > Cerrar](../images/sp2/sp2-gparted-aplicaroperaciones-3.png)

4. Comprovem que les dues particions és troben creades

![GParted comprovacions particions creades](../images/sp2/sp2-comprovacions.png)

### Via linia comandes

Amb `fdisk` podem crear i modificar particions manuals.

Posterior d'identificar el disc amb el paràmetre `-l`, he creat una partició nova primaria fins al sector 204600

![Creant particio 1 fdisk](../images/sp2/sp2-partitioningSDB1.png)

I una altra en el que resta, comprovem amb `fdisk` que ho tenim creat.

![Creant particio 2 fdisk](../images/sp2/sp2-partitioningdb2.png)
![Comprovació particions creadesfdisk](../images/sp2/comprovacioExisteix.png)

Posteriorment, amb `mkfs.ext4 -b 2048 /dev/sdb1`estem formatant amb una mida de block diferent a la partició 1

![Formatant particio 1 mida bloc 2048 i en EXT4](../images/sp2/sp2-formatExt4-2048bytes.png)

I podem comprovar amb `tune2fs -l /dev/sdb1 | grep Block`

![Comprovació mida bloc tune2fs](../images/sp2/sp2-tune2fsSDB1.png)

I a l'altra partició com a NTFS per a que Windows ho reconegui `mkfs.ntfs /dev/sdb1`

![Formatant particio 2 a NTFS](../images/sp2/sp2-formatNTFS-SB2.png)

En el GParted podem comprovar que es troben les particions

![Comprovació particions en GParted](../images/sp2/sp2-gparted-comprovacio.png)

## Muntatge

Per treballar amb aquestes particions les hem de muntar, per això, se sol realitzar el següent:

He creat les dues carpetes a on muntare cadascun de les particions

![Creació carpetes muntatge](../images/sp2/sp2-creaciocarpetes.png)

Afegim un arxiu per a despres de muntar, comprovar que no es trobara dintre.

![Creació arxius pre-muntatge](../images/sp2/sp2-creacioArxiu.png)

Montem "temporalment" amb `mount -t ext4 /dev/sdb1 /mnt/particio-linux`, i afegim un arxiu dintre

![Muntatge temporal partició 1 EXT4](../images/sp2/sp2-muntatge1.png)

En reiniciar no tornem a veure l'arxiu, de fet ni es troba muntat.

![Comprovació post muntatge i reinici, l'arxiu no es troba](../images/sp2/sp2-despresReinici1.png)

Si volem fer-ho permanent, ho afegim al `/etc/fstab`, la linia que he afegit ha sigut

```bash
/dev/sdb1   /mnt/particio-linux   ext4   defaults   0  1

```

> El fitxer de **/etc/fstab ** indica què s’ha de muntar automàticament en iniciar el sistema i com s’ha de fer.

Cada línia descriu una partició o dispositiu amb sis camps separats per espais o tabulacions:

> <dispositiu> <punt_muntatge> <sistema_fitxers> <opcions> <dump> <pass>

- Dispositiu: pot ser /dev/sdb1, una UUID, o una etiqueta (LABEL) de la partició.
- Punt de muntatge: carpeta on s’accedirà al contingut, si no existeix, no la crea, sino que falla.
- Sistema de fitxers: tipus utilitzat. Per exemple: ext4, ntfs, vfat, xfs, etc.
- Opcions: paràmetres de muntatge (separats per comes)
  - defaults → valors per defecte (lectura/escriptura, execució, etc.)
  - ro / rw → només lectura o lectura/escriptura
  - noexec → no permet executar arxius
  - nosuid → ignora bits SUID/SGID
  - nodev → no permet dispositius especials
  - auto / noauto → si es munta automàticament o no
  - user / nouser → si usuaris normals poden muntar-la
- Dump: valor 0 (no es fa) o 1 (es fa).
  Controla si es fa còpia amb l’eina dump. El sistema faria ús de l’eina antiga **dump** per fer còpies de seguretat del sistema de fitxers.
- Pass: ordre de verificació amb fsck durant l’arrencada.
- Amb 0 no comprova el sistema de fitxers (es salta).
- Amb 1 comprova primer (prioritat més alta), normalment s'aplica a l'arrel `/`
- Amb 2 o superior comprova després de la 1, en segon pla (qualsevol valor >= 2 es tracta igual que 2.)

![Afegir muntatge a inici sistema amb fstab](../images/sp2/sp2-fstab.png)

Ara en reiniciar, es `guarda` el muntatge i veiem l'arxiu

![Comprovació post muntatge i reinici, l'arxiu es troba](../images/sp2/sp2-despresReinici2.png)

# Gestió de processos

Els processos són programes en execució dins del sistema. Cada procés té un PID (Process ID), un usuari propietari i pot estar en diferents estats (actiu, en espera, aturat...). El sistema operatiu planifica i reparteix el temps de CPU entre ells.

Eines bàsiques per gestionar-los:

- ps, top, htop → veure processos actius.
- kill, pkill → finalitzar un procés per PID o nom.
- nice, renice → ajustar la prioritat d’execució.
- systemctl, service → controlar serveis (daemons).

A nivell pràctic, cada procés hereta permisos de l’usuari que l’ha iniciat i pot estar vinculat a un servei o a una sessió d’usuari.

Ara veurem com fer-les servir minimament.

**> [ENCARA HO TENIM QUE FER - TODO]**

## Gestió d'usuaris i grups i permisos

La seguretat en Linux es basa en usuaris i grups, que determinen qui pot accedir o modificar arxius i processos.

**Tipus d’usuaris**

- Usuari normal: pot iniciar sessió i executar programes dins del seu espai.
- Superusuari (root): té tots els permisos i pot gestionar el sistema sencer.
- Usuari de servei (daemon): creat per executar serveis com www-data, mysql, sshd (no inicien sessió interactiva).
- Usuari de sistema: similar al d’un servei, amb UID baix (<1000), reservat per processos interns.

**Grups**
Un grup agrupa diversos usuaris amb permisos comuns sobre arxius o directoris.
Cada usuari pertany a:

- un grup principal, i
- pot formar part de grups secundaris.

Els grups permeten definir permisos col·lectius, per exemple, donar accés a una carpeta compartida sense fer-ho usuari per usuari.

| Fitxer       | Funció principal                               |
| ------------ | ---------------------------------------------- |
| /etc/passwd  | Llista tots els usuaris definits al sistema.   |
| /etc/shadow  | Desa les contrasenyes xifrades dels usuaris.   |
| /etc/group   | Conté la llista de grups i els seus membres.   |
| /etc/gshadow | Desa contrasenyes i administradors dels grups. |

### Directoris i fitxers importants

En Linux, la informació d’usuaris i grups està centralitzada en fitxers de configuració de text dins /etc.

### Directoris importants

#### /etc/skel

El directori **/etc/skel** (de skeleton) conté els fitxers i carpetes base que es copien automàticament al directori personal de qualsevol nou usuari creat al sistema.

Quan executem `adduser` o `useradd -m`, el contingut d’aquest directori es replica dins de /home/nom_usuari, garantint que cada compte disposi d’un entorn mínim de configuració per a la shell i altres programes.

- **.bash_logout**: el script s’executa quan l'usuari tanca sessió.
- **.profile**: s'executa quan l'usuari inicia sessió.
- **.bashrc**: s'executa per afegir una configuració a la nostra sessió el .bashrc.

**1. Proves del skel**
A mode d'exemple, la prova mes simple que podem fer es crear una carpeta/ arxiu que vulguem que tots els usuaris tinguin.
I podrem observar que als _nous_ usuaris, tenen aquesta carpeta.

![Proves SKEL](../images/sp2/sp2-skel-test1.png)

**2. Proves .bash_logout**

En sortir, potser a l'usuari l'interessa que és moguin Captures, Baixades a una carpeta de sessió, que identifica quantes vegades ha entrat i sortit (per si l'hi agrada tindreu net cada vega).

Això, ho he aconseguit afegint unes quantes linies en aquest arxiu

```bash
ORIGEN="$HOME/Imágenes/Capturas de pantalla/"
DESTI="$HOME/sessions/session_$(date +%d_%Y)"
mkdir -p "$DESTI"
mv "$ORIGEN"/* "$DESTI"
```

Així es troba l'estructura previ a sortir.

![Configuració logout, previ sortir](../images/sp2/sp2-configuracio-bashlogout.png)

I aquesta es l'estructura més `neta`:

![Comprovació .bash_logout](../images/sp2/sp2-comprovacio-bashlogout.png)

**3. Proves .profile**
Una de les coses que un usuari podria valorar, és que en iniciar sessió , se l'obrir el navegador, hi han molts formes de fer-ho-

- Una d'elles és fent servir la comanda `xdg-open` del paquet `xdg-utils`. I tambe afegim un log per demostrar que s'ha obert

![Configuració .profile](../images/sp2/sp2-conf-profile.png)

I podem comprovar que s'obri.

![Comprovació profile](../images/sp2/sp2-comprovacio-profile.png)

**4. Proves .bashrc**
Com a admin, per a quedar amigables amb l'usuaris, podriem fer que en obrir la terminal s'envie una notificació deien "**Un gran poder, convella una gran responsabilitat**". I també podem afegir una eina que és _**cowsay**_ (una vaca ASCII) amb fortune (frases de `fortuna`)

Ho podem fer, fent ús **`notify-send`**

```bash
notify-send "Un gran poder, convella una gran responsabilitat"
cowsay $(whoami)
```

| Descripció                | Captura                                                               |
| ------------------------- | --------------------------------------------------------------------- |
| Configuració test .bashrc | ![Configuració test .bashrc](../images/sp2/sp2-conf-bashrc.png)       |
| Comprovació test .bashrc  | ![Comprovació test .bashrc](../images/sp2/sp2-comprovacio-bashrc.png) |

D'aquesta forma cada cop que s'obri una terminal amb bash, li surten els missatges.

### Fitxers usuaris i grups

El comportament per defecte en la creació i gestió d’usuaris es defineix en diversos fitxers de configuració del sistema.

Aquests controlen paràmetres com l’UID inicial, el directori personal, els permisos predeterminats, la caducitat de contrasenyes o el grup primari assignat.

Els principals són:

- /etc/adduser.conf: conté els valors per defecte dels programes adduser(8), addgroup(8), deluser(8) i delgroup(8).
- /etc/login.defs: defineix la configuració específica del lloc per a el conjunt de shadow password.
- /etc/default/useradd: configura els valors per defecte que useradd utilitza per a nous usuaris

Ara veurem algunes proves que podem fer.

**Arxiu `/etc/login.defs`**
En aquest arxiu podem configurar coses respecte a la contrasenya de l'usuari, com la duració.

Un test simple es limitar els dies màxims abans de canviar la contrasenya (`PASS_MAX_DAYS`) i el maxim de canvi en un dia `PASS_MIN_DAYS`.

- Per als nous usuaris.

![Configuració login.def](../images/sp2/sp2-conf-loginDefs.png)

Podem comprovar que tenim 3 dies abans que caduqui la contrasenya, això, en una empresa ho podriem realitzar mensualment.

![Comprovació 3 dies caducitat login.defs](../images/sp2/sp2-comprovacio-loginDefs1.png)

I també que al intentar canviar la contrasenya amb `passwd`, per corroborar que efectivament no permet després del 1r intent

> Nota: un altre usuari li pot canviar la contrasenya si es troba al mateix sistema sense les limitacions d'esperar

![Comprovació limit canvi contrasenya login.defs](../images/sp2/sp2-comprovacio-loginDefs2.png)

**Arxiu `/etc/adduser.conf`**
Podriem afegir que tinguin permisos de root, afegit la opció de `ADD_EXTRA_GROUPS`, més `EXTRA_GROUPS` a on posem `root`

![Configuració adduser](../images/sp2/sp2-adduser-conf.png)

Podem comprovar que és troba al grup de superusuaris

![Comprovació adduser sudo](../images/sp2/sp2-comprovacio-adduser-sudo.png)

**Arxiu `/etc/default/useradd`**
Podriem canviar el $HOME per a que el posi a una carpeta muntada, que perfectament podria ser un recurs xarxa muntat del servidor.
Així els perfils d'usuari es troben guardats ahi.

```bash
HOME=/mnt/particio-linux
```

![Configuració i comprovacions useradd](../images/sp2/sp2-conf-comprovacions-useradd.png)

**Arxiu `/etc/passwd`**

_Conté tots els usuaris del sistema i la informació bàsica de cadascun._

Cada línia té `7 camps` separats per `::`

```bash
nom_usuari : x : UID : GID : GECOS : directori_home : shell
```

| Camp           | Descripció                                                                   |
| -------------- | ---------------------------------------------------------------------------- |
| nom_usuari     | Nom identificatiu de l’usuari.                                               |
| x              | Indicador que la contrasenya es troba a /etc/shadow.                         |
| UID            | Identificador únic incremental de l’usuari (els de sistema solen ser <1000). |
| GID            | Identificador incremental del grup principal.                                |
| GECOS          | Informació opcional (nom complet, telèfon, etc.).                            |
| directori_home | Carpeta personal (p. ex. /home/usuari).                                      |
| shell          | Intèrpret d’ordres per defecte (p. ex. `/bin/bash`, `/usr/sbin/nologin`).    |

![Captura /etc/passwd](../images/sp2/sp2-passwd1.png)

Podem identificar que és usuari que podem iniciar sessió per:

- Té un directori /home/usuari o qualsevol altra ruta.
- Té un shell vàlid (no `/usr/sbin/nologin` ni `/bin/false`).

![grep bash /etc/passwd](../images/sp2/sp2-grep_shell_passwd.png)

**Arxiu `/etc/group`**

Defineix els grups del sistema i els usuaris que en formen part. I no hi podem veure l'administrador, ell es troba al `gshadow`.

Te el següent format:

```bash
nom_grup : x : GID : membres
```

| Camp     | Descripció                           |
| -------- | ------------------------------------ |
| nom_grup | Nom del grup.                        |
| x        | Referència al fitxer /etc/gshadow.   |
| GID      | Identificador únic del grup.         |
| membres  | Llista d’usuaris separats per comes. |

![Captura /etc/group acortat](../images/sp2/sp2-etc_group-1.png)

**Arxiu `/etc/shadow`**
Fitxer restringit a root, conté les contrasenyes xifrades i paràmetres de caducitat.

Te el següent format:

```bash
usuari : contrasenya_xifrada : últim_canvi : mínim : màxim : avís : inactiu : caducitat : reserva
```

| Camp                | Significat                                                  |
| ------------------- | ----------------------------------------------------------- |
| usuari              | Nom d’usuari.                                               |
| contrasenya_xifrada | Hash SHA‑512 o indicador: ! (bloquejat) o \* (sense login). |
| últim_canvi         | Dies des de l’1/1/1970 de l’últim canvi de contrasenya.     |
| mínim/màxim         | Dies mínims/màxims entre canvis de contrasenya.             |
| avís                | Dies abans de la caducitat per avisar l’usuari.             |
| inactiu             | Dies d’inactivitat abans de desactivar el compte.           |
| caducitat           | Data de fi de compte (en dies des de l’1/1/1970).           |
| reserva             | Camp reservat (no usat).                                    |

![Captura /etc/shadow, remarcant la contrasenya xifrada](../images/sp2/sp2-etc-shadow-1.png)

**Arxiu `/etc/gshadow`**
En aquest grup a diferencia del shadow, podem veure l'administrador del grup, mentre en l'altre sols els grups i usuaris.

- És la versió segura de /etc/group, només accessible per root.
- Inclou contrasenyes de grup (si n’hi ha) i administradors.

Te el següent format:

```bash
nom_grup : contrasenya_xifrada : administradors : membres
```

| Camp                | Descripció                                        |
| ------------------- | ------------------------------------------------- |
| nom_grup            | Nom del grup.                                     |
| contrasenya_xifrada | Normalment `!` (sense contrasenya).               |
| administradors      | Usuaris amb permís per afegir o eliminar membres. |
| membres             | Usuaris que pertanyen al grup.                    |

Captura `gshadow`, excloent (`-v`) els bloquejats amb `grep`:

![Captura gshadow excloent](../images/sp2/sp2-gshadow-1.png)

## Comandes bàsiques / gestió

En sistemes GNU/Linux, la gestió d’usuaris i grups es pot fer tant des de terminal com gràficament (en entorns com GNOME o KDE).
Per obtenir ajuda sobre qualsevol `comanda` podem utilitzar:

```bash
man comanda
# o
comanda --help
```

### Exercis

#### Crear usuari amb useradd

Com podem crear un usuari completament amb useradd, lo maxim possible?

Amb la comanda:

```bash
sudo useradd -m -s /bin/bash -c "Merda que s'actualitza cada dia i peta" -p $(openssl passwd -6) windows10
```

Paràmetres importants:

- -m: Crea el directori personal
- -s: Defineix l’intèrpret (ex: /bin/bash)
- -c: Afegeix informació GECOS
- -g: Defineix grup principal
- -G: Defineix grups addicionals
- -p <hash>: Defineix la contrasenya xifrada de l'usuari
  - openssl passwd -6: Genera el hash SHA-512 compatible amb /etc/shadow

![Creació usuari exercici exemple windows10](../images/sp2/sp2-exercici1-useadd-win10.png)

#### Canvia nom usuari

Quina comanda o comandes hem de fer servir per canviar el nom d'usuari correctament.

```bash
# Per canviar el nom d'usuari
sudo usermod -l nou_nom antic_nom

# Per canviar el nom del grup
sudo groupmod -n nou_nom antic_nom

# Per canviar carpeta personal, movent el contingut
sudo usermod -d /home/nou_nom -m nou_nom #

```

> He canviat el nom de windows10 a windows11, el 10 ja no rep actualitzacions, ja es bon sistema.

![Canvi de windows10 a windows11, marcant tots els canvi](../images/sp2/sp2-exercici2-canvi-nom-usuari.png)

### Gestió bàsica d’usuaris i grups

En distribucions basades en Ubuntu, la configuració gràfica permet afegir o eliminar usuaris bàsics des del panell de **Configuració **> **Sistema** > **Usuaris**.

| ![Accedir a configuracio > Sistema > usuaris](../images/sp2/sp2-conf-sistema-usuaris.png) | ![Opcions d'usuaris nous](../images/sp2/sp2-conf-usuaris-opcions.png) |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |

També tenim l'utilitat que ve en instal·lar _`gnome-system-tools`_. Que permet un poquet més.

![Gnome system Tools](../images/sp2/sp2-gnome-system-tools.png)

Encara que és més comú fer servir comandes, que veurem a continuació.

### Adduser/ addgroup

La forma més habitual i senzilla és amb:

```bash
sudo adduser nomusuari
```

Aquesta **comanda és interactiva**, demana **contrasenya** i **opcionalment nom complet, telèfon, etc**.

- Si només pressionem **Enter**, això deixa els camps opcionals (_GECOS_) buits.

![Creacio usuari cire](../images/sp2/sp2-adduser-cire.png)

Després de crear-lo, podem comprovar el resultat a `/etc/passwd` o amb `id`:

![Comprovar en passwd la creacio de cire](../images/sp2/sp2-check-cire-passwd.png)

I veure que s’ha creat automàticament:

- El usuari amb **nou UID** (1001)
- El **grup** principal amb el **mateix nom**
- El **directori** personal **/home/nomusuari**
- L’**intèrpret** de comandes per defecte (**/bin/bash**)

I tambe el seu grup:

![Comprovar en group la creacio de cire](../images/sp2/sp2-check-cire-group.png)

També podrem iniciar sessió gràficament amb aquest usuari.

![Comprovar inici sessió cire 1](../images/sp2/sp2-check-cire-log1.png)
![Comprovar inici sessió cire 2](../images/sp2/sp2-check-cire-log2.png)

---

**addgroup**

_És la versió més amigable de **groupadd**, disponible a Ubuntu i derivades._

- és essencialment un _wrapper_ de groupadd amb menys paràmetres i més fàcil d’usar.

```bash
sudo addgroup nomgrup
```

![Creacio grup alumnes i comprovacio que es troba](../images/sp2/sp2-addgroup-etc-group.png)

### useradd/ groupadd

A banda de la posterior comanda, aquesta serveix per crear els usuaris sense demanar-nos (preguntar-nos) en l'entrada estàndard (Standard Input), ens ho permet configurar practicament amb els paràmetre.

La creació d'un usuari directe sense paràmetres amb `useradd usuari` no crea la carpeta d'usuari, si que crea l'usuari, grup.
I assigna l'interpret SH (Dash Shell), en sistemes anteriors es possibles que assigne el Bourne Shell (sh també), que és antic i lent.

```bash
sudo useradd nomusuari
```

![Creacio Jesus amb useradd](../images/sp2/sp2-useradd-jesus.png)

Podem canviar l'interpret amb la comanda **usermod** i el paràmetre `-s`

```bash
sudo usermod -s /bin/bash nomusuari
```

![Canvi d'interpret Jesus](../images/sp2/sp2-canvi-interpret-jesus.png)

Per a la carpeta d'usuari, primer l'hauriem de crear amb `mkdir` i canviar els permisos amb `chown`

- El paràmetre `-R` es per a que sigui recursiu a qualsevol carpeta/arxiu dintre, en aquest cas no faria falta, pero es una recomanació

```bash
sudo mkdir /home/nomusuari
sudo chown -R nomusuari:nomusuari /home/nomusuari
```

![Creació $HOME Jesus ](../images/sp2/sp2-creacio-home-jesus.png)

Finalment hem d'assignar contrasenya a l'usuari, per a poder accedir-hi, podem comprovar al shadow que no n'hi ha. Això ho podem realitzat amb `passwd`

```bash
sudo passwd nomusuari
```

![Afegir contrasenya jesus ](../images/sp2/sp2-add-passwd-jesus.png)

En resum, per crear un usuari amb useradd minim hem d'afegir, ja sigui amb els paràmetres o nosaltres manualment:

- Carpeta d'usuari en la mateixa ruta del definida al `passwd`
- Contrasenya
- L'interpret es opcional

> També podem `iniciar` sessió amb `su`, encara que no compta com inici grafic.

| Login amb `su` a jesus                                        | Login gràfic jesus                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------ |
| ![Login amb su a jesus](../images/sp2/sp2-su-login-jesus.png) | ![Login gràfic jesus](../images/sp2/sp2-graphic-login-jesus-1.png) |

![Login gràfic jesus](../images/sp2/sp2-graphic-login-jesus-2.png)

> En cás de voler bloquejar un usuari ho podem fer amb el paràmetre `-L` amb `usermod`, al `passwd` identifiquem que és troba bloquejat per l'exclamació a l'inici `!`

```bash
sudo usermod -L nomusuari
```

o

```bash
sudo passwd -l nomusuari
```

Les dues comandes són diferents tecnicament.

Amb **usermod -L** bloquejar el compte complet.

> Encara que ambdós casos és pot continuar accedint si utilitza altres mètodes (per exemple, claus SSH).

En tots dos casos casos, a `/etc/shadow` apareixerà un `!` davant del hash.

> Per desbloquejar és el paràmetre `-U`

```bash
usermod -U nomusuari
passwd -u nomusuari
```

| Bloquejant i desploquejant amb usermod -L i -U                    | Bloquejant i desploquejant passwd -l i -u                       |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| ![Amb usermod](../images/sp2/sp2-block-unblock-usermod-jesus.png) | ![Amb passwd](../images/sp2/sp2-block-unblock-passwd-jesus.png) |

> En l'inic gràfic amb els dos mètodes, sortiria el següent error de "Fallada autenticació en contrasenya":
> De fet ni sortirá l'usuari, l'haurem de posar nosaltres

![Fail login amb contrasenya jesus](../images/sp2/sp2-fail-login-jesus.png)

> Nota: els usuaris creats, per defecte no tenen permisos admin (sudo), com podem observar.

---

`groupadd` serveix per crear un grup nou al sistema. Observarem el /etc/group que

```bash
sudo groupadd nomgrup

```

Algunes opcions simples són:

| Opció  | Descripció                                      |
| ------ | ----------------------------------------------- |
| -g GID | Assigna un GID concret al grup                  |
| -r     | Crea un grup de sistema (UID/GID baixos, <1000) |

Exemples:

|   # | Acció               | Comanda / Notes                                                                              |
| --: | ------------------- | -------------------------------------------------------------------------------------------- |
|   1 | Creació grup simple | sudo groupadd alumnes2, segueix l'ordre GID anterior                                         |
|   2 | GID específic       | sudo groupadd -g 1500 alumnes3, el GID és 1500                                               |
|   3 | Grup de sistema     | sudo groupadd -r alumne4, en el arxiu groups, el GID es inferior als 1000, al ser de sistema |

![Creació grups i comprovació grups ](../images/sp2/sp2-creacioGrups-groupadd.png)

### usermod / grupmod

Previament mencionat, permeten modificar propietats usuaris i grup existents
Tenen la següent estructura:

```bash
sudo usermod [opcions] nomusuari
sudo groupmod [opcions] nomgrup
```

Alguns exemples d'ús (a banda dels ja mostrats) són:

```bash
sudo usermod -aG sudo nomusuari   # afegir a un grup
sudo usermod -d /nou/home -m nomusuari  # canviar carpeta personal, movent el contingut
```

![Afegit a jesus a grup root i modificant $HOME](../images/sp2/sp2-usermod-root-home.png)

### adduser / gpasswd

El mètode més simple per afegir l'usuari a un grup és amb `adduser`, el primer paràmetre es el nom d'usuari i el segon el del grup.

```bash
sudo adduser nomusuari nomgrup
```

![Afegint usuari cire a grup alumnes](../images/sp2/sp2-adduser-cire-alumnes.png)

L'altre metode és amb el paràmetre `-a` amb `gpasswd`

```bash
sudo gpasswd -a nomusuari nomgrup
```

![Afegint usuari cire i jesus a grup alumnes2](../images/sp2/sp2-gpasswd-cire-jesus-alumnes2.png)

També está `sudo usermod -aG`, previament mencionat.

### userdel/ grupdel

Podem esborrar amb `userdel`, si afegim el paràmetre `-r` per esborrar "recursivament", sense l'opció no esborra la carpeta $HOME de l'usuari.

```bash
sudo userdel nomusuari
sudo userdel -r nomusuari
```

| Sense el paràmetre                                                   | Amb el paràmetre                                                 |
| -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| ![userdel sense recursiu](../images/sp2/sp2-userdel-norecursive.png) | ![userdel amb recursiu](../images/sp2/sp2-userdel-recursive.png) |

Per borrar un grup podem simplement amb `grupdel` o `delgroup`

![Eliminacio completa jesus](../images/sp2/sp2-deluser-jesus.png)

```bash
sudo groupdel nomgrup
```

![Eliminació basica amb delgroup i groupdel ](../images/sp2/sp2-grupdel-delgroup-basic.png)

També podem fer servir **`deluser`** amb `--remove-all-files` (per sols arxiu) o `--remove-home`.
Normalment si esborrem un usuari, és problable que vulguem tots els seus arxius repartits en el sistema fora.

```bash
sudo deluser --remove-all-files --remove-home nomusuari
```

![Eliminació d'usuari amb deluser](../images/sp2/sp2-deluser-basic.png)

### chage

La comanda `chage` ens permet visualitzar i modificar les polítiques de caducitat i expiració d’usuaris.

Una prova que podem fer és la de forçar que caduqui la contrasenya. Aixó en el cás d'un despit d'empleat, és possible que ho hàgim de fer.

- Amb el paràmetre `-E` posa com que el `compte` va caducar el 01 de gener del 1970, per lo tant l'usuari no pot entrar
- El `-l` ens permet veure l'informació.

| Acció                        |                                  Captura                                   |
| ---------------------------- | :------------------------------------------------------------------------: |
| Execució `chage -E 0`        |       ![Execució chage -E 0](../images/sp2/sp2-execucio-chage-E.png)       |
| Comprovació compte bloquejat | ![Comprovació compte bloquejat](../images/sp2/sp2-comprovacio-chage-E.png) |

> Per traure la caducitat seria `chage -E -1 `

Hi ha un altre interessant que és el `-d` que posa la data de caducitat de la `contrasenya` a 0.
Obligant a que en el proxim inici de sessió, es canvïi.

> per si volem fer rotació contrasenya a un usuari en específic.

![Comprovació canvi contrasenya](../images/sp2/sp2-comprovacio-chage-d-canviPass.png)

## Gestió avançada

### TTY

La "terminal" que hem estat fent servir, realment no ho és, es una pseudoterminal, podem canviar a una més propera al concepte, que és la TTY, amb CTR-F2-F6

> La TTY és una **terminal física o virtual** que permet interactuar directament amb el nucli de Linux

- Resum tècnic: control d'accés, autenticació i mecanismes del sistema per administració avançada.

### PAM
