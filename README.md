[![Stories in Ready](https://badge.waffle.io/deep75/franceconnect-demo.png?label=ready&title=Ready)](https://waffle.io/deep75/franceconnect-demo)
Exemple de fournisseur de services avec FranceConnect
==========================

Avec Docker, lancez la comande suivante :

```
docker run -d -p 80:3001 --name franceconnect-demo mcas/franceconnect-demo
```

Exemples de fournisseurs de services pour France-connect :
- 1 exemple en NodeJS avec la librairie Passport

Exemples fournis par des partenaires : 
- [http://gitlab.laposte.io/rmagnac/france-connect-workshop/] (http://gitlab.laposte.io/rmagnac/france-connect-workshop/) : exemple en Ruby, sans librairie
- [https://github.com/Lyon-Metropole/poc-france-connect/] (https://github.com/Lyon-Metropole/poc-france-connect) : exemple en Ruby / Sinatra / Omniauth et OpenID
- [https://adullact.net/scm/viewvc.php/?root=hackathon-fc] (https://adullact.net/scm/viewvc.php/?root=hackathon-fc) : exemple en PHP
- [https://github.com/florent-andre/franceconnecthelper] (https://github.com/florent-andre/franceconnecthelper) : exemple en Java avec la librairie Apache Oltu
- [https://github.com/astik/poc-franceconnect] (https://github.com/astik/poc-franceconnect) : nouvel exemple en Java, toujours avec Oltu, réalisé lors du workshop du 20 Janvier 2016. Ce nouvel exemple se base sur celui de Florent Andre, et inclut, en plus, la déconnexion
