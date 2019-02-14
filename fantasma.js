function Fantasma()
{
	this.x; //cordinata x di pacman
	this.y; //cordinata y di pacman
	this.directionPre;	//direzione precedente effettuata
	this.direction; //indica la direzione (se 0 destra, se 1 sopra, se 2 sinistra, se 3 giù)
	this.colore; //colore del mio fantasma
	this.marchio;
	this.vita=0;
	this.velocita;
	this.pauroso;
	this.colorePaura;
	
	this.inizializza = function(colore,j) //inizializza le variabili di pacman
	{
		this.x = Math.floor(width/2)+1; //la x sarà uguale alla metà del campo
		this.y = Math.floor(height/2); // la y sarà uguale alla metà del campo
		this.direction = 3;	//inizialmente il nostro fantasma si girerà verso destra
		this.directionPre = -100;	//determiniamo la direzione precedente effettuata (in primo luogo nulla)
		this.colore = colore;
		this.marchio = j;
		this.vita=1;
		this.pauroso=0;
		this.colorePaura="blue";
	}
	
	this.stampa = function()	//stampa su schermo pacman
	{
		var Boo = canvas.getContext("2d");	//dichiara che l'elemento che vogliamo disegnare sia sul canvas, ed è in seconda dimensione
		Boo.beginPath();
		if(!this.pauroso)
			Boo.fillStyle = this.colore;
		else
			Boo.fillStyle = this.colorePaura;
		
		Boo.arc(this.x, this.y, 8,180*3.14/180,0*3.14/180);
		Boo.lineTo(this.x+8,this.y+8);
		Boo.arc(this.x+6, this.y+8, 2,0*3.14/180,180*3.14/180);
		Boo.arc(this.x  , this.y+8, 2,0*3.14/180,180*3.14/180);
		Boo.arc(this.x-6, this.y+8, 2,0*3.14/180,180*3.14/180);
		Boo.lineTo(this.x-8,this.y);
		Boo.fill();
		Boo.fillStyle = "white";
		Boo.beginPath();
		Boo.arc(this.x+3, this.y, 3,0,360*3.14/180);
		Boo.arc(this.x-3, this.y, 3,0,360*3.14/180);
		Boo.fill();
		Boo.beginPath();
		Boo.fillStyle = "black";
		Boo.arc(this.x+3, this.y, 1,0,360*3.14/180);
		Boo.arc(this.x-3, this.y, 1,0,360*3.14/180);
		Boo.fill();
	}
	
	this.cancella = function() //cancella la figura di pacman e solo quella
	{
		var Boo = canvas.getContext("2d");	//dichiara che l'elemento che vogliamo disegnare sia sul canvas, ed è in seconda dimensione
		Boo.beginPath();
		Boo.fillStyle = "black";
		Boo.arc(this.x, this.y, 9,180*3.14/180,0*3.14/180);
		Boo.lineTo(this.x+9,this.y+9);
		Boo.arc(this.x+7, this.y+9, 4,0*3.14/180,180*3.14/180);
		Boo.arc(this.x  , this.y+9, 4,0*3.14/180,180*3.14/180);
		Boo.arc(this.x-7, this.y+9, 4,0*3.14/180,180*3.14/180);
		Boo.lineTo(this.x-9,this.y);
		Boo.fill();
	}
		
	this.cambiaDirezione = function ()	//cambia direzione di un fantasma
	{		
		var DirectionVoluta;	//la direzione che stiamo pensando di prendere
		var validita;			//flag utilizzato per poter capire se dobbiamo tentare di dover prendere altre direzioni, o se la direzione presa va bene 
		
		do
		{
			DirectionVoluta = NumeroCasuale(0,3);	//proviamo a prendere una direzione
			validita = true;						//iniziamo dicendo che vada bene
			
			if(DirectionVoluta == 2)	//se la direzione che pensiamo di dover prendere è a sinistra
			{
				if(Campo[this.y-8-5][this.x-6-8]==-1 || Campo[this.y+8+5][this.x-6-8]==-1 || Campo[this.y][this.x-6-8]==-1) //controlla se c'è un muro nella direzione interessata
				{
					validita=false;	//se c'è un muro, segnala che la direzione presa non è valida
				}
			}
			else if(DirectionVoluta == 1) //sopra
			{
				if(Campo[this.y-6-8][this.x-8-5]==-1 || Campo[this.y-6-8][this.x+8+5]==-1 || Campo[this.y-6-8][this.x]==-1)
				{
					validita=false;
				}
			}
			else if(DirectionVoluta == 0) //destra
			{
				if(Campo[this.y-8-5][this.x+6+8]==-1 || Campo[this.y+8+5][this.x+6+8]==-1 || Campo[this.y][this.x+6+8]==-1)
				{
					validita=false;
				}
			}
			else if(DirectionVoluta == 3) //giù
			{
				if(Campo[this.y+6+8][this.x-8-5]==-1 || Campo[this.y+6+8][this.x+8+5]==-1 || Campo[this.y+6+8][this.x]==-1)
				{
					validita=false;
				}
			}
		}
		while(DirectionVoluta==this.directionPre || validita==false);	//continua a trovare una direzione fino a quando quella presa : 1) Non va contro un muro. 2)Non è la strada precedentemente percorsa
		
		//una volta trovata la direzione ideale 
		this.direction = DirectionVoluta;
		this.directionPre = (this.direction+2)%4;
	}

	this.sposta = function()
	{	
		if(this.direction == 2)	//se la direzione attuale voluta e verso sinistra
		{
			if(Campo[this.y-8-5][this.x-6-8]!=-1 && Campo[this.y+8+5][this.x-6-8]!=-1 && Campo[this.y][this.x-6-8]!=-1) //se il prossimo movimento di pacman non sarà contro alcun muro allora spostalo (il controllo viene fatto controllando un area quadrata al quella di pacman, per questo viene compresa tutta la sua dimensione (raggio) e non sono il centro)
				this.x -= 1;
		}
		else if(this.direction == 1)	//su
		{
			if(Campo[this.y-6-8][this.x-8-5]!=-1 && Campo[this.y-6-8][this.x+8+5]!=-1 && Campo[this.y-6-8][this.x]!=-1)
				this.y -= 1;
		}
		else if(this.direction == 0)	//destra
		{
			if(Campo[this.y-8-5][this.x+6+8]!=-1 && Campo[this.y+8+5][this.x+6+8]!=-1 && Campo[this.y][this.x+6+8]!=-1)
				this.x += 1;
		}
		else if(this.direction == 3)	//giù
		{
			if(Campo[this.y+6+8][this.x-8-5]!=-1 && Campo[this.y+6+8][this.x+8+5]!=-1 && Campo[this.y+6+8][this.x]!=-1)
				this.y += 1;
		}
	}
	
	this.controllaIncrocio = function()
	{
		var Incrocio=0;	//tiene conto di quante strade potremmo intraprendere in base alla nostra posizione attuale

		if(Campo[this.y-8-5][this.x-6-8]!=-1 && Campo[this.y+8+5][this.x-6-8]!=-1 && Campo[this.y][this.x-6-8]!=-1)	//se sopra quindi, non c'è un muro
		{
			Incrocio++;	//contala come strada
		}

		if(Campo[this.y-6-8][this.x-8-5]!=-1 && Campo[this.y-6-8][this.x+8+5]!=-1 && Campo[this.y-6-8][this.x]!=-1)
		{
			Incrocio++;
		}
		
		if(Campo[this.y-8-5][this.x+6+8]!=-1 && Campo[this.y+8+5][this.x+6+8]!=-1 && Campo[this.y][this.x+6+8]!=-1)
		{
			Incrocio++;
		}

		if(Campo[this.y+6+8][this.x-8-5]!=-1 && Campo[this.y+6+8][this.x+8+5]!=-1 && Campo[this.y+6+8][this.x]!=-1)
		{	
			Incrocio++;
		}
		
		return Incrocio;
	}
	
	this.uccidiFantasma = function()
	{
		this.vita = 0;
	}
	
	this.invertiVerso = function()
	{
		this.direction = this.directionPre;
		this.directionPre = (this.direction+2)%4;
	}
	
	this.mettiMarchio = function()
	{
		//inserisce il marchio sulla matrice, non in una sola cella, ma in diverse celle (per facilitare il contatto tra pacman e i fantasmini)
		for(var i = this.y-8 ; i < this.y+8; i++)
			for(var j = this.x-8 ; j < this.x+8; j++)
				Campo[i][j] = this.marchio;
	}
	
	this.invertiColorePaura = function()
	{
		if(this.colorePaura == "blue")
			this.colorePaura = "white";
		else
			this.colorePaura = "blue";
	}
	
	this.colorePauraBlu = function()
	{
		this.colorePaura = "blue";	
	}
	
	this.diventaPauroso = function()
	{
		this.pauroso=1;
	}
	
	this.diventaCoraggioso = function()
	{
		this.pauroso=0;
	}
		
	this.rimuoviMarchio = function()
	{		
		//rimuove il valore dalla matrice
		for(var i = this.y-8 ; i < this.y+8; i++)
			for(var j = this.x-8 ; j < this.x+8; j++)
				Campo[i][j] = 0;
	}
	
	this.returnVita = function()
	{
		return this.vita;
	}
	
	this.returnPaura = function ()
	{
		return this.pauroso;
	}
}
