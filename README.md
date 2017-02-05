# Phototheque

Photothèque est une librairie Js/Css qui permet de créer des galeries photo (à la google image) responsive et configurable avec une visionneuse intégré

**Attention : Librairie en développement, ne pas utiliser en production**

## Fonctionnalité

- La gallerie rogne au mieux les images pour les afficher sur toute la ligne
- La galerie peut s'accompagner ou pas d'une visoneuse
- La gouttière entre les photos est configurable
- Permet de mettre des vignettes dans la galerie et les photos hautes résolutions en visionneuse
- On peut intégrer une légende à afficher dans la viosionneuse
- Prise en charge des flêches droite et gauche pour passer les photos (et échape pour quitter la visonneuse)
- *[Bientôt]* La visionneuse peut être utiliser sans la gallerie
- *[Bientôt]* Prise en charge du swift sur smartphone pour passe les photos
- *[Bientôt]* Possibilité d'intégrer un bouton "play" pour faire défiller les photos (avec réglage de la vitesse de défilement)

## Démonstration

Vous pouvez consulter une démonstration en ligne [ici](http://www.lucien-chastan.fr/phototheque/index.html)

## Installation

Ajouter les fichiers Js et Css dans votre page Html

```html
<link href="phototheque.css" rel="stylesheet">
<script src="phototheque.js"></script>
```

## Utilisation

Créer une `<div>` avec la class "phototheque" avec vos `<img>`

```html
<div id="MyPhototheque" class="phototheque">

	<img src="vignette/img_1.jpg" data-full="http:img/img_1.jpg" data-legende="image 1" alt="">
	<img src="vignette/img_2.jpg" data-full="http:img/img_2.jpg" data-legende="image 2" alt="">
	<img src="vignette/img_3.jpg" data-full="http:img/img_3.jpg" data-legende="image 3" alt="">
	
</div>
```

Lancer la création de la photothèque

```javascript

//utilisation en full option
window.onload = function (){
	MyPhototheque = new Phototheque(
		'#MyPhototheque',
         {
         	"maxHeight" : "200px",
         	"gouttiere" : "3px",
         	"lastRow" : "center",
         	"visiotheque" : true,
         	"visiotheque-option" : {
         		"legende" : "data-legende"
         	}
     	}
 	);
 }
 
 //utilisation en option minimal
 window.onload = function (){
	MyPhototheque = new Phototheque('#MyPhototheque');
 }
 
```

## Options

- `"maxHeight"` : Hauteur des photos dans la galerie *[defaut : 400px]*
- `"gouttiere"` : Espacement entre les photos *[defaut : 0px]*
- `"lastRow"` : gestion des photos de la dernière ligne, si elles ne peuvent pas être en full largeur, valeur possible :
	+ `"left"` : photos alignées à gauche
	+ `"right"` : photos alignées à droite
	+ `"center"` : photos centrées *[valeur par defaut]*
- `"visiotheque"` : true ou false suivant si on veux la visionneuse au click *[defaut : true]*
- `"visiotheque-option"` : option de la visiothèque
	+ `"legende"` : défini la légende que l'on va afficher
		* `"none"` : pas de légende
		* `"alt"` : on prend l'attribut `alt`
		* `"data-legende"` : on prend l'attribut `data-legende` *[valeur par defaut]*