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

        //On met en place la visionneuse
        this.visionneuse = new Visiotheque(element, option);

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
                this.allImg[listePhoto[i]].style.width = (parseInt(this.maxHeight) * this.ratioTable[listePhoto[i]]) + ratioToPixel / listePhoto.length - gouttiere + 'px';
            else this.allImg[listePhoto[i]].style.width = 'auto';

            //on applique des styles
            if(lastRow) this.allImg[listePhoto[i]].style.marginBottom = '0px';
            else this.allImg[listePhoto[i]].style.marginBottom = this.gouttiere + 'px';
        }
    }
}


//CLASS DE LA VISONNEUSE DE PHOTO
class Visiotheque{
    
    constructor(element, option){
        this.element = document.querySelector(element);
        this.imgCollection = this.element.querySelectorAll('img');
        
        //création du fond noir
        this.creatElementStructure();

        //attribution des events click sur les image
        this.addEvents();
    }

    creatElementStructure(){
        //création du fond et mise en place des attributs
        this.background = document.createElement('div');
        this.background.className = 'visiotheque-background';
        this.element.appendChild(this.background);
        
        //création de l'élément de zoomeuse
        this.imgOpenAnimation = document.createElement('img');
        this.imgOpenAnimation.className = 'visiotheque-img-open-animation';
        this.imgOpenAnimation.setAttribute('alt','');
        this.background.appendChild(this.imgOpenAnimation);
    }

    addEvents(){
        for(var i = 0 ; i < this.imgCollection.length ; i++){
            this.imgCollection[i].addEventListener('click', (i)=>{this.openVisiotheque(i)});
        }
    }

    openVisiotheque(img){
        var scrollPosition = this.getScrollPosition(),
            positionImg = {
                'top' : img.target.offsetTop - scrollPosition[1],
                'left' : img.target.offsetLeft - scrollPosition[0]
            };
                
        this.background.style.display = 'block';
        var sleepToOpen = setTimeout(()=>{
            
            //affichage du background
            this.background.style.backgroundColor = 'rgba(0,0,0,0.8)';
            
            //attribut de l'imgAnimationOpen
            this.imgOpenAnimation.setAttribute('src',img.target.src);
            this.imgOpenAnimation.style.height = img.target.offsetHeight + 'px';
            this.imgOpenAnimation.style.width = img.target.offsetWidth + 'px';
            this.imgOpenAnimation.style.top = positionImg['top'] + 'px';
            this.imgOpenAnimation.style.left = positionImg['left'] + 'px';
            this.imgOpenAnimation.style.transition = 'all 0.3s';
            
            var sleepToZoom = setTimeout(()=>{
                
                //donne la nouvelle source
                var newSrc = this.imgOpenAnimation.getAttribute('data-full');
                if(newSrc) this.imgOpenAnimation.setAttribute('src',newSrc);
                
                //effet de zoom
                this.imgOpenAnimation.style.top = '20px';
                this.imgOpenAnimation.style.left = '20px';
                this.imgOpenAnimation.style.height = '400px';
                this.imgOpenAnimation.style.width = '600px';
            },50);
            
        },20);
    }
    
    
    //RETOURNE LE DÉCALAGE DU SCROLL
    getScrollPosition(){
        return Array((document.documentElement && document.documentElement.scrollLeft) || window.pageXOffset || self.pageXOffset || document.body.scrollLeft,(document.documentElement && document.documentElement.scrollTop) || window.pageYOffset || self.pageYOffset || document.body.scrollTop);
    }
}