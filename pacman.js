function PacMan()
{
	this.x; //cordinata x di pacman
	this.y; //cordinata y di pacman
	this.alphaBocca; //quanto la mia bocca è aperta
	this.direction; //indica la direzione (se 0 destra, se 1 sopra, se 2 sinistra, se 3 giù)
	this.alphaDirection; //in base alla posizione corrente, determina dove la bocca di pacman deve essre visualizzata
	this.rag; //raggio del nostro pac man 
	this.crescitaBocca; //se la mia bocca deve chiudersi o aprirsi
	this.direzionePrenotata;
	
	this.inizializzaPacMan = function() //inizializza le variabili di pacman
	{
		this.x = 14; //la x sarà uguale alla metà del campo
		this.y = 14; // la y sarà uguale alla metà del campo
		this.direction = -1;	//inizialmente il nostro pacman sarà voltato verso destra
		this.rag = 8;		//il raggio del nostro pacman sarà di 10
		this.alphaBocca = 45;	//la nostra bocca sarà totalmente aperta
		this.crescitaBocca = 0; //la bocca all'inizio della creazione di pacman dovrà chiudersi
		this.alphaDirection = 0; //la bocca verrà visualizzata verso destra
		this.direzionePrenotata = -1;
	}
	
	this.stampa = function()	//stampa su schermo pacman
	{
		var Cerchio = canvas.getContext("2d");	//dichiara che l'elemento che vogliamo disegnare sia sul canvas, ed è in seconda dimensione
		Cerchio.beginPath();	//inizia a disegnare, stacca la penna precedentemente messa sul foglio
		Cerchio.lineTo(this.x,this.y);	//poggia la penna nel centro di pac man
		Cerchio.arc(this.x, this.y, this.rag, ((this.alphaDirection+this.alphaBocca)*3.14/180), ((this.alphaDirection-this.alphaBocca)*3.14/180)); //trascina la penna dall'inizio fino alla fine dell'arco
		Cerchio.lineTo(this.x,this.y);	//concludi quindi il disegno di pacman riportando la penna al centro
		Cerchio.fillStyle = "yellow";	//dovrà essere riempito di giallo
		Cerchio.fill();	//disegnalo
	}
	
	this.cancella = function() //cancella la figura di pacman e solo quella
	{
		var Cerchio = canvas.getContext("2d");
		Cerchio.beginPath();
		Cerchio.lineTo(this.x,this.y);
		Cerchio.arc(this.x, this.y, this.rag+2, ((this.alphaDirection+this.alphaBocca)*3.14/180), ((this.alphaDirection-this.alphaBocca)*3.14/180));
		Cerchio.lineTo(this.x,this.y);
		Cerchio.fillStyle = "black";
		Cerchio.strokeStyle = "black";
		Cerchio.fill();
		Cerchio.stroke();
	}
	
	this.cambiaAmbiezzaBocca = function()	//determina l'ampiezza della bocca di pacman
	{
		if(this.crescitaBocca == 0) //se la bocca di pacman deve chiudersi
			this.alphaBocca-= 3.5;	//dimiuisci l'ampiezza di 5 gradi
		else if(this.crescitaBocca == 1)
			this.alphaBocca+= 3.5;	//altrimenti aumentala di 5 gradi
		
		if(this.alphaBocca < 5) //se la bocca si è chiusa
			this.crescitaBocca = 1; //fai crescere la bocca
		else if(this.alphaBocca > 40) //se la bocca è aperta al massimo
		{	
			this.crescitaBocca = 0; //fai chiudere la bocca
		}
	}
	
	this.cambiaDirezione = function ()	//cambia direzione di pacman
	{
		//in base alla direzione precedentemente prenotata, verificare se è possibile cambiare direzione
		if(this.direzionePrenotata == 2 && Campo[this.y-this.rag-5][this.x-6-this.rag]!=-1 && Campo[this.y+this.rag+5][this.x-6-this.rag]!=-1 && Campo[this.y][this.x-6-this.rag]!=-1) //freccia sinistra
		{
			this.direction = 2;	//cambiagli direzione
			this.alphaDirection = -180; //in base alla direzione, visualizza la sua relativa bocca
		}
		else if(this.direzionePrenotata == 1 && Campo[this.y-6-this.rag][this.x-this.rag-5]!=-1 && Campo[this.y-6-this.rag][this.x+this.rag+5]!=-1 && Campo[this.y-6-this.rag][this.x]!=-1) //freccia sù
		{
			this.direction = 1;
			this.alphaDirection = -90;
		}
		else if(this.direzionePrenotata == 0 && Campo[this.y-this.rag-5][this.x+6+this.rag]!=-1 && Campo[this.y+this.rag+5][this.x+6+this.rag]!=-1 && Campo[this.y][this.x+6+this.rag]!=-1) //freccia destra
		{
			this.direction = 0;
			this.alphaDirection = 0;
		}
		else if(this.direzionePrenotata == 3 && Campo[this.y+6+this.rag][this.x-this.rag-5]!=-1 && Campo[this.y+6+this.rag][this.x+this.rag+5]!=-1 && Campo[this.y+6+this.rag][this.x]!=-1) //freccia giù
		{
			this.direction = 3;
			this.alphaDirection = 90;
		}
	}
	
	this.prenotaDirezione = function(Tasto)
	{
		if(Tasto == 37)
		{
			this.direzionePrenotata = 2; //segnala che l'utente ha prenotato una direzione
		}
		else if(Tasto == 38)
		{
			this.direzionePrenotata = 1;
		}
		else if(Tasto == 39)
		{
			this.direzionePrenotata = 0;
		}
		else if(Tasto == 40)
		{
			this.direzionePrenotata = 3;
		}	
	}
	
	this.sposta = function()	//se pacman è in movimento spostalo
	{
		if(this.direction == 2)	//se la direzione attuale voluta e verso sinistra
		{
			if(Campo[this.y-this.rag-5][this.x-6-this.rag]!=-1 && Campo[this.y+this.rag+5][this.x-6-this.rag]!=-1 && Campo[this.y][this.x-6-this.rag]!=-1) //se il prossimo movimento di pacman non sarà contro alcun muro allora spostalo (il controllo viene fatto controllando un area quadrata al quella di pacman, per questo viene compresa tutta la sua dimensione (raggio) e non sono il centro)
				this.x -= 1;
		}
		else if(this.direction == 1)	//su
		{
			if(Campo[this.y-6-this.rag][this.x-this.rag-5]!=-1 && Campo[this.y-6-this.rag][this.x+this.rag+5]!=-1 && Campo[this.y-6-this.rag][this.x]!=-1)
				this.y -= 1;
		}
		else if(this.direction == 0)	//destra
		{
			if(Campo[this.y-this.rag-5][this.x+6+this.rag]!=-1 && Campo[this.y+this.rag+5][this.x+6+this.rag]!=-1 && Campo[this.y][this.x+6+this.rag]!=-1)
				this.x += 1;
		}
		else if(this.direction == 3)	//giù
		{
			if(Campo[this.y+6+this.rag][this.x-this.rag-5]!=-1 && Campo[this.y+6+this.rag][this.x+this.rag+5]!=-1 && Campo[this.y+6+this.rag][this.x]!=-1)
				this.y += 1;
		}
		
		if(Campo[this.y][this.x]>29)	//quando mangi un pallino
			{
				partiSuonoMangiato();
				
				if(Cibo[Campo[this.y][this.x]-30].returnRaggio()>1) //Se è un pallino grande
				{
					fantasmiKillTime(); 
					Score+=450;
				}
				
				Cibo[Campo[this.y][this.x]-30].rimuoviMarchio();	//in base al suo indice (ricavato dal "marchio" che rilascia nella matrice), rimuoviamo il suo valore dalla matrice
				PalliniPresi++;
				
				Score+=50;
				AggiornaScore();
			}
			
		if(Campo[this.y][this.x]<30 && Campo[this.y][this.x]>0)	//quando incotri un fantasmino
		{
			if(Fantasmi[Campo[this.y][this.x]-1].returnPaura())
			{
				suonoFantasmaMangiato.pause();
				suonoFantasmaMangiato.currentTime = 0;
				suonoFantasmaMangiato.play();
				Fantasmi[Campo[this.y][this.x]-1].cancella();
				Fantasmi[Campo[this.y][this.x]-1].uccidiFantasma();
				Fantasmi[Campo[this.y][this.x]-1].rimuoviMarchio();
				Score+=1000;
				AggiornaScore();
			}
			else
			{
				suonoSottofondo.pause();
				Gioco=3;
			}
		}
	}
	
	this.aumentaAmpiezzaBocca = function()
	{
		this.alphaBocca += 10;
	}
	
	this.returnAmpiezzaBocca = function()
	{
		return this.alphaBocca;
	}
}
