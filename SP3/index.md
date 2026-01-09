---
layout: default
title: 'Sprint 3: Administració de dominis i seguretat (20h)'
---

# Administració de dominis i seguretat

![Imatge portada](https://documentation.ubuntu.com/server/_images/ad_integration.png)

# Índex

- [Administració de dominis i seguretat](#administració-de-dominis-i-seguretat)
- [Conceptes bàsics](#conceptes-bàsics)
- [Creació i configuració](#creació-i-configuració)
  - [Configuració previa](#configuració-previa)
  - [Creació i configuració servidors](#creació-i-configuració-servidors)
  - [Configuració client](#configuració-client)

# Conceptes bàsics

# Creació i configuració

## Configuració previa

He postat les dues maquines en la mateixa xarxa virtual interna, creant la `NatNetwork` i assignant-la a les maquines

![Creació xarxa NatNetwork virtualbox](../images/sp3/sp3-natnetwork.png)

| Server                                                               | Client                                                             |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| ![Configuració xarxa servidor](../images/sp3/sp3-server-network.png) | ![Configuració xarxa client](../images/sp3/sp3-client-network.png) |

Hem configurat la IP a estatica en el servidor, perque en principi "sempre" hauria de tenim la IP fixa, per fer-ho senzill ho he fet en interficie grafica (i no el netplan). I comprovat que s'ha aplicat correcta i tenim sortida a internet.

| ![Configuració IP estatica](../images/sp3/sp3-conf-IP.png) | ![Comprovació IP i connexió](../images/sp3/sp3-compr-IP.png) |
| :--------------------------------------------------------: | :----------------------------------------------------------: |

He canviat del hostname amb `hostnamectl` i posat el domini "cire.cat" en el /etc/hosts, degut a que no tenim DNS

![Configuració hostname](../images/sp3/sp3-conf-hostname.png)

### Creació i configuració servidors

Els paquets a instal·lar per a configurar el domini són `slapd` i `ldap-utils`, a on surtira un prompt per posar la contrasenya de l'administrador del domini

![Prompt contrasenya instal·lació](../images/sp3/sp3-prompt-pass.png)
![Prompt confirmació contrasenya instal·lació](../images/sp3/sp3-prompt-confirPass.png)

Amb la comanda `slapcat` podem obtenir l'informació dels objectes, unitats, etc, del domini

![Primer slapcat](../images/sp3/sp3-primer-slapcat.png)

Per configurar comodament algunes opcions del domini he executat `dpkg-reconfigure slapd`

|               ![En la pantalla 1 no ometem configuració](../images/sp3/image.png)                |              ![Pantalla 2 nom domini cire.cat](../images/sp3/image-1.png)               |
| :----------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------: |
|                  ![Pantalla 3 nom organització cire](../images/sp3/image-2.png)                  |               ![Pantalla 4 contrasenya admin](../images/sp3/image-3.png)                |
|              ![Pantalla 5 verificació contrasenya admin](../images/sp3/image-4.png)              | ![Pantalla 6 posem si a borrar la base dades, en aquest cas](../images/sp3/image-5.png) |
| ![Pantalla 6 posem si a moure els arxius de la base de dades antiga ](../images/sp3/image-6.png) |        ![Comprovació del slapcat que tenim el domini](../images/sp3/image-7.png)        |

Posteriorment he modificat el ou.ldif, usu.ldif i el de grups, per canviar al meu domini

| ![Antic ldif](../images/sp3/image-8.png) | ![Canvi ldif](../images/sp3/image-9.png) |
| :--------------------------------------: | :--------------------------------------: |

I finalment he afegit la unitat amb `ldapadd -c -x -D "cn=admin,dc=cire,dc=cat" -W -f ` i els arxius.

![Creació unitats, usuaris i grups 1](../images/sp3/image-10.png)
![Creació unitats, usuaris i grups 2](../images/sp3/image-10-1.png)

I podrem veure al slapcat que s'han creat.

![Comprovació slapcat dels usuaris](../images/sp3/image-11.png)

### Configuració client

He instal·lat els paquets libnss-ldap libpam-ldap nscd

![Instal·lació paquets](../images/sp3/image-19.png)

En el prompt que surt en l'instal·lació, he posat la IP del servidor i emplenat les dades.

|                               ![Pantalla 1 de la IP ldap://](../images/sp3/image-12.png)                               |      ![Pantalla 2 domini](../images/sp3/image-13.png)      |
| :--------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------: |
|                                 ![Pantalla 3 Versió ldap](../images/sp3/image-14.png)                                  | ![Pantalla 4 Local root admin](../images/sp3/image-15.png) |
| ![Pantalla 5 seleccionem que la base NO necessita credencials per connectar-se, IMPORTANT](../images/sp3/image-16.png) | ![Pantalla 6 ldap-auth-config](../images/sp3/image-17.png) |
|                                 ![Pantalla 7 contrasenya](../images/sp3/image-18.png)                                  |                                                            |

En principi podriem reconfigurar amb el paquet el ldap-auth-config, que es practicament mateix que surt a l'instal·lació

|              ![Pantalla 1 debconf SI](../images/sp3/image-20.png)               |   ![Pantalla 2 ldap require login NO](../images/sp3/image-21.png)    |
| :-----------------------------------------------------------------------------: | :------------------------------------------------------------------: |
|         ![Pantalla 3 usuari administrador](../images/sp3/image-22.png)          | ![Pantalla 4 ldap root account password](../images/sp3/image-23.png) |
| ![Pantalla 5 ldap root account password encryption](../images/sp3/image-24.png) |                                                                      |

Després al `/etc/nsswitch.conf` he afegit la base `ldap` abans de totes, per a que cerqui ahi usuari, contrasenyes i grups

![Afegint entrada ldap en nsswitch.conf en passwd, group, shadow, gshadow ](../images/sp3/image-25.png)

Per finalitzar en el arxius de autenficació he fet:

- En el /etc/pam.d/common-password he eliminat el `use_authtok`
- Afegit `session optional pam_mkhomedir.so skel=/etc/skel umask=077` al final en el `common-session`
- encara que també executant `pam-auth-update` i marcant "LDAP Authentication" i "Create home directory on login", funcionaria.

| ![Linia a eliminar common-password](../images/sp3/image-26.png) | ![Comprovació que s'ha eliminat](../images/sp3/image-27.png) |
| :-------------------------------------------------------------: | :----------------------------------------------------------: |
|   ![Afegit el pam_mkhomedir.so ](../images/sp3/image-28.png)    |

I he configurat el fitxer de configuració de LightDM per permetre l'inici de sessió manual d'usuaris LDAP. Això és necessari perquè, per defecte, LightDM només mostra els usuaris locals i no permet introduir manualment un nom d'usuari. Afegint aquestes opcions:

```bash
[Seat:*]
user-session=ubuntu
greeter-show-manual-login=true
```

![Configuració lightdm](../images/sp3/image-29.png)

Ens assegurem que aparegui l'opció "Login manual" al gestor d'inici de sessió, permetent així que els usuaris autenticats pel servidor LDAP puguin iniciar sessió al sistema.

En reiniciar, podem comprovar que puc iniciar sessió

|          ![Posant l'usuari](../images/sp3/image-30.png)           |                ![Posant la contrasenya](../images/sp3/image-31.png)                 |
| :---------------------------------------------------------------: | :---------------------------------------------------------------------------------: |
| ![Captura de que esta creant el home](../images/sp3/image-32.png) | ![Captura comprovació que en hem connectat graficament](../images/sp3/image-33.png) |
