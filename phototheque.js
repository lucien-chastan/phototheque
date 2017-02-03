//DÉFINITION DE LA CLASSE PHOTOTHEQUE
class Phototheque{

    constructor(element, option){
        this.groupImg = document.querySelector(element);
        this.photothequeWidth = this.groupImg.offsetWidth;
        this.allImg = this.groupImg.querySelectorAll('img');
        this.nbImg = this.allImg.length;
        this.ratioTable = [];
        this.gridRatio = this.photothequeWidth / parseInt(this.maxHeight);
        this.sommeRatio = 0;

        //Initialise les options de la phototheque et lance le rendu
        this.setOption(option);

        //On met en place la visionneuse si l'option est active
        if(this.visiotheque) this.visionneuse = new Visiotheque(element, option['visiotheque-option']);

        //on place un écouteur sur sur le resize de l'élément window
        window.addEventListener('resize', ()=>{this.defineLigne()});
    }


    //CONFIGURE OU RECONFIGURE LES OPTIONS DE LA PHOTOTHEQUE
    setOption(option){
        //si nous n'avons pas d'option;
        option = (option)? option : [];

        //application des valeurs d'options ou par defaut
        this.maxHeight = (option['maxHeight'])? option['maxHeight'] : (this.maxHeight)? this.maxHeight : '350px';
        this.gouttiere = (option['gouttiere'])? option['gouttiere'].replace('px', '') : (this.gouttiere)? this.gouttiere : 0;
        this.lastRow = (option['lastRow'])? option['lastRow'] : (this.lastRow)? this.lastRow : 'left';
        this.visiotheque = (option['visiotheque'])? option['visiotheque'] : (this.visiotheque)? this.visiotheque : true;

        //on lance la définition des lignes et la retaille des images
        this.initStyle();
        this.initImgHeight(this.maxHeight);
        this.getRatios();
        this.defineLigne();
    }


    //DONNE DU STYLE AUX ÉLÉMENTS SUIVANT LES OPTIONS
    initStyle(){

        //goutière entre les éléments
        this.groupImg.style.letterSpacing = this.gouttiere - 5 + 'px';

        //alignement de la dernière ligne de la galrie
        this.groupImg.style.textAlign = this.lastRow;

        //style sur les images
        for(var i = 0 ; i < this.nbImg ; i++){
            this.allImg[i].style.marginBottom = this.gouttiere + 'px';
        }
    }


    //FONCTION POUR TAILLER LES PHOTOS EN HAUTEUR
    initImgHeight(imgHeight){
        for(var i = 0 ; i < this.nbImg ; i++){
            this.allImg[i].style.height = imgHeight;
        }
    }

    //TROUVE LES RATIOS DES IMAGES
    getRatios(){
        for(var i = 0 ; i < this.nbImg ; i++){
            let ratio = this.allImg[i].naturalWidth / this.allImg[i].naturalHeight;
            this.ratioTable[i] = ratio;
            this.sommeRatio += ratio;
        }
    }


    //FONCTION DE REDIMENSSIONNEMENT DES IMAGES
    defineLigne(){
        var ligneConstruct = [],
            photoATraiter = this.allImg,
            sommeLigne = 0;

        this.photothequeWidth = this.groupImg.offsetWidth;
        this.gridRatio = this.photothequeWidth / parseInt(this.maxHeight);

        for(var i = 0 ; i < this.nbImg ; i++){
            if((this.ratioTable[i] + sommeLigne) <= this.gridRatio){
                ligneConstruct.push(i);
                sommeLigne += this.ratioTable[i];
            }else{
                if((this.gridRatio - sommeLigne) > (this.ratioTable[i] / 2) ){

                    ligneConstruct.push(i);
                    sommeLigne += this.ratioTable[i];

                    this.resizeLigne(ligneConstruct, false);

                    //raz des données
                    sommeLigne = 0;
                    ligneConstruct = [];

                }else{

                    this.resizeLigne(ligneConstruct, false);

                    //raz des données
                    sommeLigne = 0;
                    ligneConstruct = [];

                    ligneConstruct.push(i);
                    sommeLigne += this.ratioTable[i];

                }
            }

            //si c'est la dernière ligne
            if(i == (this.nbImg - 1)){
                this.resizeLigne(ligneConstruct, true);
            }
        }
    }


    //LA FONCTION IMPORTANTE, C'EST ELLE QUI DÉCIDE DU CROP DES IMAGES
    resizeLigne(listePhoto, lastRow){
        var sommeLigneRatio = 0,
            deltaRatio,
            ratioToPixel,
            gouttiere,
            maxRatio = 0;

        for(var i = 0 ; i < listePhoto.length ; i++){
            sommeLigneRatio += this.ratioTable[listePhoto[i]];
        }

        deltaRatio = this.gridRatio - sommeLigneRatio;
        ratioToPixel = deltaRatio * this.photothequeWidth / this.gridRatio;

        //calcul de l'éclatement maximal de la dernière ligne de la gallerie
        if(lastRow){
            for(var j = 0 ; j < listePhoto.length ; j++){
                maxRatio += this.ratioTable[listePhoto[j]] * 2;
            }
        }

        for(var i = 0 ; i < listePhoto.length ; i++){
            gouttiere = (listePhoto.length - 1) * this.gouttiere / listePhoto.length;

            //redimenssionement des images
            if(!lastRow || maxRatio >= this.gridRatio)
                this.allImg[listePhoto[i]].style.width = this.rInf((parseInt(this.maxHeight) * this.ratioTable[listePhoto[i]]) + ratioToPixel / listePhoto.length - gouttiere) + 'px';
            else this.allImg[listePhoto[i]].style.width = 'auto';

            //on applique des styles
            if(lastRow) this.allImg[listePhoto[i]].style.marginBottom = '0px';
            else this.allImg[listePhoto[i]].style.marginBottom = this.gouttiere + 'px';
        }
    }

    rInf($n){
        return Math.ceil($n) - 1;
    }
}





//CLASS DE LA VISONNEUSE DE PHOTO
class Visiotheque{

    constructor(element, option){
        this.element = document.querySelector(element);
        this.imgCollection = this.element.querySelectorAll('img');

        //défini les options
        this.setOption(option);

        //création du fond noir
        this.creatElementStructure();

        //attribution des events click sur les image
        this.addEvents();
    }

    //DÉFINI LES OPTIONS DE LA VISIONNEUSE
    setOption(option){

        this.typeLegende = (option['legende'])? option['legende'] : (this.typeLegende)? this.typeLegende : 'data-legende';

    }

    //CRÉER LA STRUCTURE DE LA VISIOTHEQUE
    creatElementStructure(){

        //création du fond et mise en place des attributs
        this.background = document.createElement('div');
        this.background.className = 'visiotheque-background';
        this.background.addEventListener('click', ()=>{this.closeVisiotheque()});
        this.element.appendChild(this.background);

        //création du loader
        this.loader = document.createElement('div');
        this.loader.className = 'visiotheque-loader';
        this.background.appendChild(this.loader);

        //création de l'élément de zoomeuse
        this.imgOpenAnimation = document.createElement('img');
        this.imgOpenAnimation.className = 'visiotheque-img-open-animation';
        this.imgOpenAnimation.setAttribute('alt','');
        this.background.appendChild(this.imgOpenAnimation);

        //création de la boite à légende
        this.visothequeLegende = document.createElement('div');
        this.visothequeLegende.className = 'visiotheque-legende';
        this.background.appendChild(this.visothequeLegende);
    }


    //AJOUTE LES ÉVENEMENTS AUX CLICS
    addEvents(){
        for(var i = 0 ; i < this.imgCollection.length ; i++){
            this.imgCollection[i].setAttribute('data-n-child', i);
            this.imgCollection[i].addEventListener('click', (i)=>{this.openVisiotheque(i);});
        }
    }

    //LANCE L'OUVERTURE DE LA VISOTHEQUE
    openVisiotheque(img){
        this.imgClick = img;
        this.background.style.display = 'block';
        this.currentPhoto = img.target.getAttribute('data-n-child');

        //temps d'attente avant de faire la fondu au noir
        var sleepToOpen = setTimeout(()=>{

            //affichage du background
            this.background.style.backgroundColor = 'rgba(0,0,0,0.8)';

            //affichage d'un loader
            this.loader.style.backgroundColor = 'rgba(255,255,255,1)';

            //on charge la nouvelle source de l'image
            if(img.target.getAttribute('data-full')){
                var newImage = new Image();
                newImage.src = this.imgClick.target.getAttribute('data-full');
                newImage.onload = ()=>{
                    this.imgOpenAnimation.src = newImage.src;
                    this.grandePhoto = this.imgOpenAnimation;
                    setTimeout(()=>{
                        this.openAnimation();
                    },50);
                }
            }else{
                this.imgOpenAnimation.src = this.imgClick.target.src;
                this.grandePhoto = this.imgOpenAnimation;
                setTimeout(()=>{
                    this.openAnimation();
                },50);
            }
        },20);
    }


    //ANIME L'OUVERTURE DE VISIONNEUSE
    openAnimation(){
        var scrollPosition = this.getScrollPosition(),
            positionImg = {
                'top' : this.imgClick.target.offsetTop - scrollPosition[1],
                'left' : this.imgClick.target.offsetLeft - scrollPosition[0]
            };

        //on cache le loader
        this.loader.style.backgroundColor = 'rgba(255,255,255,0)';

        //attribut de l'imgAnimationOpen            
        this.imgOpenAnimation.style.display = 'block';
        this.imgOpenAnimation.style.maxHeight = this.imgClick.target.offsetHeight + 'px';
        this.imgOpenAnimation.style.maxWidth = this.imgClick.target.offsetWidth + 'px';
        this.imgOpenAnimation.style.top = positionImg['top'] + 'px';
        this.imgOpenAnimation.style.left = positionImg['left'] + 'px';
        this.imgOpenAnimation.style.transition = 'all 0.3s';

        var sleepToZoom = setTimeout(()=>{
            this.positionneCurrentPhoto();
        },50);
    }


    //DONNE LE LEFT ET LE RIGHT À L'IMAGE ET À LA LÉGENDE
    positionneCurrentPhoto(){
        var currentPhoto = this.imgCollection[this.currentPhoto],
            altLegende = currentPhoto.getAttribute('alt'),
            dataLegende = currentPhoto.getAttribute('data-legende');

        //donne la valeur à la légende
        if(this.typeLegende != '') this.visothequeLegende.innerHTML = (this.typeLegende == 'alt')? altLegende : dataLegende;
                
        //variable de calcul
        var photoDimension = {"height" : this.grandePhoto.naturalHeight, "width" : this.grandePhoto.naturalWidth},
            zoneDimension = {
                "height" : (this.background.offsetHeight - this.visothequeLegende.offsetHeight - 34),
                "width" : (this.background.offsetWidth - 10)
            },
            deltaVertical = photoDimension['height'] - zoneDimension['height'],
            deltaHorizontal = photoDimension['width'] - zoneDimension['width'],
            maxDelta = (Math.abs(deltaVertical) > Math.abs(deltaHorizontal))? deltaVertical : deltaHorizontal;
                
        //calcul des décalages en left et right
        if(deltaVertical > 0 || deltaHorizontal > 0){
            var decalageLeft = 5,
                decalageTop = 5;
            
            //photo typé portrait
            if(Math.abs(deltaVertical) > Math.abs(deltaHorizontal)) decalageLeft = (zoneDimension['width'] - (photoDimension['width'] * zoneDimension['height'] / photoDimension['height'])) / 2;
            
            //photo typé paysage
            if(Math.abs(deltaVertical) < Math.abs(deltaHorizontal)) decalageTop = (zoneDimension['height'] - (photoDimension['height'] * zoneDimension['width'] / photoDimension['width'])) / 2;
            
            //on attribut les valeurs
            this.imgOpenAnimation.style.left = decalageLeft + 'px';
            this.imgOpenAnimation.style.top = decalageTop + 'px';
        }
                
        //hauteur et largeur de l'image
        this.imgOpenAnimation.style.maxHeight = 'calc(100% - ' + (this.visothequeLegende.offsetHeight + 34) + 'px)';
        this.imgOpenAnimation.style.maxWidth = 'calc(100% - 10px)';
        
    }
    
    //FERMETURE DE LA VISIONNEUSE
    closeVisiotheque(){
        this.background.style.backgroundColor = 'rgba(0,0,0,0)';
        this.imgOpenAnimation.style.top = this.imgCollection[this.currentPhoto].style.top + 'px';
        this.imgOpenAnimation.style.left = this.imgCollection[this.currentPhoto].style.left + 'px';
        this.imgOpenAnimation.style.maxHeight = this.imgCollection[this.currentPhoto].offsetHeight + 'px';
        this.imgOpenAnimation.style.maxWidth = this.imgCollection[this.currentPhoto].offsetWidth + 'px';
        var sleepToclose = setTimeout(()=>{
            this.background.style.display = 'none';
            this.imgOpenAnimation.style.top = null;
            this.imgOpenAnimation.style.left = null;
        },500);
    }
    

    //RETOURNE LE DÉCALAGE DU SCROLL
    getScrollPosition(){
        return Array((document.documentElement && document.documentElement.scrollLeft) || window.pageXOffset || self.pageXOffset || document.body.scrollLeft,(document.documentElement && document.documentElement.scrollTop) || window.pageYOffset || self.pageYOffset || document.body.scrollTop);
    }

    //RETOURNE LES DIMENSIONS DE L'ÉCRAN QUELQUE SOIT LE NAVIGATEUR
    windowWidth(){
        if(window.innerWidth)
            return window.innerWidth;
        else if (document.documentElement.clientWidth)
            return document.documentElement.clientWidth;
        else if(document.body.clientWidth)
            return document.body.clientWidth;
        else 
            return -1;
    }

    // Retourne la hauteur de l'écran
    windowHeight(){
        if(window.innerHeight)
            return window.innerHeight;
        else if (document.documentElement.clientHeight)
            return document.documentElement.clientHeight;
        else if(document.body.clientHeight)
            return document.body.clientHeight;
        else 
            return -1;
    }
}