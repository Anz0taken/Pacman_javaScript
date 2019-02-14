var width=783;
var height=461;

/*
	Il campo per comodità sarà quindi diviso in una matrice immaginaria più grande,
	con la quale possiamo poi giostrare più facilemte la grafica del nostro campo da gioco.
	Ogni cella della matrice immaginaria sarà larga (27px * 27px).
	
	ex. se volessimo andare a disegnare un quadrato dati due punti (A,B)
	quello che in realtà vogliamo fare, e disegnare un quadrato che parta dal pixel di coordinate (27*A,27*B) e si concluda in esso.
	(Procedura illustrata più avanti)
	
	Immaginiamo quindi di avere un campo di 2700px di altezza * 2700 px di larghezza,
	sarà quindi il nostro campo immaginario composto dal 270 celle di alezza * 270 celle di larghezza,
	dove ogni cella può essere un "muro" o meno.
*/
var Base = width/27;
var Altezza = height/27;

var canvas = document.getElementById("myCanvas");
canvas.width = width;
canvas.height = height;
//============================================================================================================VARIABILI GLOBALI GENERALI PER IL GIOCO
var Gioco = 0;				//variabile che determina se il gioco è : fermo (0), in corso (1), vittoria (2), sconfitta (3)
var PalliniPerVincere;		//il numero di pallini che bisogna prendere per vincere la partita
var PalliniPresi=0;			//il numero di pallini presi
var TimingKillingFantasmi;	//variabile usata per gestire meglio l'evento cui da la possibilità al giocatore di mangiare i fantasmi (ovvero, se prendiamo una pallina grande già quando è in corso evento in cui possiamo mangiare i fantasmi, il timing viene azzerato ripartendo da 0 ) (i fantasmini quindi, saranno mangiabili per altri 10 secondi)
var TimingSpawnFantasmi;	//per evitare che nella sessione corrente, i timing spawn fantasmi della sessione precedente diano problemi, viene caricata la funzione e il timing dedicato allo spawn fantasmi nella variabile
var TimingColoreAlternatoFantasmi;
var Score;					//punteggio corrente del giocatore (partita attuale)
var Sounds = 1;				//se  i suoni devono essere riprodotti o meno
var NumeroCibo=0;			//il numero di cibo totale sul campo 
//---------------------------------------------------------------------------------------------------------------------------------------------------


//============================================================================================================CREAZIONE CAMPO DA GIOCO
/*
	La variabile sottostante,
	contiene un array di caratteri che serviranno a determinare
	in quale "cella immaginaria" della nostra matrice vogliamo posizionare un muro, un vuoto o un pallino.
	lo spazio (" ") rappresenterà un pallino, le "x" il muro e gli "o" il vuoto.
	
*/
var CampoDati = "    x      x xp              "+" xx   xx x   x               "+" xxxx xx x x                 "+"   xx xx   x x               "+" x    xx xxxxx               "+" x xx xx xx                  "+" x x        xx               "+" x x xx x x xx               "+"     xp xxx   p              ";

//creazione matrice contenente dati del campo
var Campo = new Array(height);

for(i = 0; i < height; i++)
	Campo[i] = new Array(width);

for(i = 0; i < height; i++)
	for(j = 0; j < width; j++)
		Campo[i][j]=0;
	
//Creazione limiti
creaLimiteCampo(0,0,1,height,"black");
creaLimiteCampo(0,0,width,1,"black");
creaLimiteCampo(width+1,0,width+2,height,"black");
creaLimiteCampo(0,height-1,width,height,"black");

inserisciOstacoli();	//inserisce gli ostacoli lì dove devono essere posizionati (in base all'array di caratteri "CampoDati"), inoltre conta quanti pallini devono essere inseriti

NumeroCibo = Math.floor(NumeroCibo*1.5);	//in base a una cattiva organizzazione spawn dei pallini, necessitiamo del 50% in più dei pallini essenziali

var Cibo = new Array(NumeroCibo);

for(var i=0; i<NumeroCibo;i++)
	Cibo[i] = new Pallini();

costruisciPallini();	//creato l'array di "pallini", possiamo quindi inizializzare ogni istanza
//------------------------------------------------------------------------------------------------------------------------------


//============================================================================================================CREAZIONE FANTASMI
var FantasmiMaxSpawn = 15;	//il numero massimo di fantasmi che possono essere presenti sullo schermo
var FantasmiNow = 0;		//il numero di fantasmi presenti sullo chermo (quindi in gioco)
var FANTASMIMAXSIZE = 29;	//il numero massimo di fantasmi che la memoria può sopportare

var Fantasmi = new Array(FANTASMIMAXSIZE);

for(var i=0; i<FANTASMIMAXSIZE ; i++)
	Fantasmi[i] = new Fantasma();

var ColoriFantasmi = ["#ff7200","#3fff42","yellow","pink","#e821ff","red"];

spawnaFantasma();

function spawnaFantasma()
{
	if(Gioco==1)	//se il gioco è ancora in corso
	{
		var FantasmaSpawnato=0;	//variabile che serve per capire se il fantasma che vogliamo far spawnare è stato effettivamente generato

		for(var i = 0; i<FantasmiMaxSpawn && !FantasmaSpawnato; i++)	//controlla per ogni fantasma che può essere messo in gioco, e fino a che non l'hai fatto spawnare
		{
			if(!Fantasmi[i].returnVita())	//se abbiamo trovato un fantasma non in vita
			{
				FantasmaSpawnato=1; //dichiara che il fantasma l'abbiamo fatto spawnare, e che quindi può uscire dal ciclo
				Fantasmi[i].inizializza(ColoriFantasmi[i%6],i+1);	//inizializza il fantasma
				Fantasmi[i].stampa();
			}
		}
		clearTimeout(TimingSpawnFantasmi);
		TimingSpawnFantasmi = setTimeout(spawnaFantasma,2351);
	}
}

//------------------------------------------------------------------------------------------------------------------------------

//============================================================================================================CREAZIONE FILE AUDIO
var suonoMangiato = new Audio('Audio/Mangiato.mp3');
var suonoSottofondo = new Audio('Audio/Sottofondo.mp3');
var suonoInizio = new Audio('Audio/ColonnaSonora.mp3');
var suonoFine = new Audio('Audio/Morte.mp3');
var suonoFantasmaMangiato = new Audio('Audio/FantasmaMangiato.mp3');
//------------------------------------------------------------------------------------------------------------------------------


//============================================================================================================CREAZIONE GIOCATORE
var Giocatore = new PacMan();
Giocatore.inizializzaPacMan();
//------------------------------------------------------------------------------------------------------------------------------






gameLoopPolling();

/*===================================================================================================================DATI CONVENZIONALI DEL GIOCO
	CONVENZIONI CAMPO :
		MURO 		-1
		VUOTO 		 0
		FANTASTMI	[1,29]
		PALLINI     [30;X]
-------------------------------------------------------------------------------------------------------------------------------------------------*/

function gameLoopPolling()
{
	//===============================================================================================================GESTIONE PACMAN
	Giocatore.cancella();		//cancella l'immagine di pacman
	Giocatore.cambiaAmbiezzaBocca();	//cambia l'ampiezza della bocca
	Giocatore.cambiaDirezione();	//in base alla direzione precedentemente prenotata, verificare se è possibile cambiare direzione
	Giocatore.sposta();	//sposta pacman in base alla direzione attuale
	Giocatore.stampa();	//stampa graficamente pacman
	//------------------------------------------------------------------------------------------------------------------------------
	
	/*
		Il successivo for è inevitabile poichè i fantasmi, passando sopra i pallini, sovrascrivono i loro valori sulla matrice,
		inoltre ne cancellerebbero anche le tracce grafice.
		Il for che segue, serve proprio a evitare questi due eventi.
	*/
	
	//===============================================================================================================GESTIONE PALLINI
	for(i = 0; i < NumeroCibo ;i++)		//per ogni pallino
		if(Cibo[i].returnVita())		//se vivo
		{
			Cibo[i].stampa();			//stampalo
			Cibo[i].mettiMarchio();		//rimetti il marchio
		}
	//------------------------------------------------------------------------------------------------------------------------------
	
	
//===============================================================================================================GESTIONE FANTASMA
	for(var i = 0; i<FantasmiMaxSpawn; i++)
	{
		if(Fantasmi[i].returnVita())	// se il fantasma è in vita
		{
			Fantasmi[i].rimuoviMarchio();
			Fantasmi[i].cancella();
			
			if(Fantasmi[i].controllaIncrocio()>1)	//determina il numero di strade attuali
			/*
				Il prossimo metodo, cerca di prendere tutte le strade possibili a sua disposizione, tutte quante tranne quella dietro di sè.
				In modo tale che se si trova in una strada con unica via, la percorre.
				Se ha la possibilita di poter percorrere più strade (sempre esclusa la precedente), sorteggia quella da prendere
				(anche la strada che stava già percorrendo).
			*/
				Fantasmi[i].cambiaDirezione();
			else	//mentre se si trova in un vicolo cieco
				Fantasmi[i].invertiVerso();	//inverti il verso

			Fantasmi[i].sposta();
		
			Fantasmi[i].stampa();
			Fantasmi[i].mettiMarchio();
		}
	}
	
//------------------------------------------------------------------------------------------------------------------------------
	
	if(Gioco==1 && PalliniPresi<PalliniPerVincere)
	{
		setTimeout(gameLoopPolling,13);	//richiama questa funzione ogni 10ms
	}
	else if(Gioco==2)
	{
		mettiScrittaMenu();
	}
	else if(Gioco==3)
	{
		suonoFine.play();
		animazioneMortePacman();
		setTimeout(mettiScrittaMenu,2000);
	}
	
	Score+=0.05;
	AggiornaScore();
}
/*
	Ogni 100 ms, la seguente funzione controlla quali sono i "pallini"
	che ancora devono essere mangiati per stamparli graficamente sullo schermo.
	Questo perchè potrebbe essere che pacman non è riuscito a mangiare completamente un pallino,
	o che un fantasma ci è passato sopra.
*/

function fantasmiKillTime()
{
	for(var i = 0; i<FantasmiMaxSpawn; i++)
	{
		if(Fantasmi[i].returnVita())	// se il fantasma è in vita
		{
			Fantasmi[i].diventaPauroso();
			Fantasmi[i].colorePauraBlu();
		}
	}
	
	clearTimeout(TimingKillingFantasmi);	//azzera l'ultimo timer dei fantasmi della funzione dedicata al ritorno del fantasma "coraggioso"
	clearTimeout(TimingColoreAlternatoFantasmi); //azzera l'ultimo timer dei fantasmi della funzione dedicata all'intermittenza del colore dei fantasmi (nel caso in cui l'intermittenza fosse già iniziata, anch'essa viene terminata)
	TimingColoreAlternatoFantasmi = setTimeout(invertiColoriDeiFantasmi,7000);	//richiamala tra 7 secondi
	TimingKillingFantasmi = setTimeout	(	//fallo ripartire
											function()
											{
												for(var i = 0; i<FantasmiMaxSpawn; i++)
												{
													if(Fantasmi[i].returnVita())	// se il fantasma è in vita
													{
														Fantasmi[i].diventaCoraggioso();
														Fantasmi[i].colorePauraBlu();
													}
												}				
												clearTimeout(TimingColoreAlternatoFantasmi);
											},
											10000	//chiama questa funzione tra 10 secondi
										)
}

function invertiColoriDeiFantasmi()
{
	for(var i = 0; i<FantasmiMaxSpawn; i++)
	{
		if(Fantasmi[i].returnVita())	// se il fantasma è in vita
		{
			Fantasmi[i].invertiColorePaura();
		}
	}
	TimingColoreAlternatoFantasmi = setTimeout(invertiColoriDeiFantasmi,250);	//inverti il colore dei fantasma tra altri 250ms
}


function inserisciOstacoli()
{
	var Max = CampoDati["length"];
	var i;
	
	for(i = 0;i < Max;i++)
	{
		//determina le sue coordinate
		var Riga = Math.floor(i/Base);
		var Colonna = (i%Base);

		if(CampoDati[i] == "x")	//se trovi un muro
		{			
			//------------------------------------------------------------------------------------------------------------------per settori, utilizzeremo convenzionalmente quelli degli assi cartesiani

			creaLimiteCampo(Colonna*27+1,Riga*27+1,(Colonna+1)*27+1,(Riga+1)*27+1,"#0a1a84");										//si disegna la prima sezione dello schermo (secondo settore)

			//------------------------------------------------------------------------------------------------------------------Da qui in poi, si disegneranno i restanti pezzi con la speculazione orizzontale e verticale

			creaLimiteCampo((Base-Colonna-1)*27+1,Riga*27+1,((Base-Colonna))*27+1,(Riga+1)*27+1,"#0a1a84");						//primo settore		
			creaLimiteCampo(Colonna*27+1,(Altezza-Riga-1)*27,(Colonna+1)*27+1,(Altezza-Riga)*27,"#0a1a84"); 						//terzo settore
			creaLimiteCampo((Base-Colonna-1)*27+1,(Altezza-Riga-1)*27,((Base-Colonna))*27+1,(Altezza-Riga)*27,"#0a1a84");			//quarto settore
		}
		else
		{
			NumeroCibo++;
		}
	}
}

function costruisciPallini()
{
	var Max = CampoDati["length"];
	var i;
	var j=0;
	
	for(i = 0;i < Max;i++)
	{
		//determina le sue coordinate
		var Riga = Math.floor(i/Base);
		var Colonna = (i%Base);

		if(CampoDati[i] == " " && Colonna<15 && Riga<9)	//se trovi un vuoto, rempilo mettendo del cibo
		{	
			Cibo[j].inizializzaPallino(Math.floor((Colonna+0.5)*27), Math.floor((Riga+0.5)*27),1,j);
			Cibo[j].stampa();
			Cibo[j].mettiMarchio();
			j++;

			if(Riga<9)
			{			
				Cibo[j].inizializzaPallino(Math.floor((Base-Colonna+0.5-1)*27), Math.floor((Altezza-Riga+0.5-1)*27),1,j);
				Cibo[j].stampa();
				Cibo[j].mettiMarchio();
				j++;
			}
			
			if(Riga!=8)
			{
				Cibo[j].inizializzaPallino(Math.floor((Colonna+0.5)*27), Math.floor((Altezza-Riga+0.5-1)*27),1,j);
				Cibo[j].stampa();
				Cibo[j].mettiMarchio();
				j++;
			}
		
			if(Riga!=8 && Colonna!=14)
			{
				Cibo[j].inizializzaPallino(Math.floor((Base-Colonna+0.5-1)*27), Math.floor((Riga+0.5)*27),1,j);
				Cibo[j].stampa();
				Cibo[j].mettiMarchio();
				j++;	
			}
		}
		else if(CampoDati[i] == "p" && Colonna<15 && Riga<9)	//se una pallina gigante
		{	
			Cibo[j].inizializzaPallino(Math.floor((Colonna+0.5)*27), Math.floor((Riga+0.5)*27),3,j);
			Cibo[j].stampa();
			Cibo[j].mettiMarchio();
			j++;
			
			if(Riga==8 && Colonna!=14)	//bug--
			{
				Cibo[j].inizializzaPallino(Math.floor((Base-Colonna+0.5-1)*27), Math.floor((Altezza-Riga+0.5-1)*27),3,j);
				Cibo[j].stampa();
				Cibo[j].mettiMarchio();
				j++;
			}
			
			if(Riga<8)
			{			
				Cibo[j].inizializzaPallino(Math.floor((Base-Colonna+0.5-1)*27), Math.floor((Altezza-Riga+0.5-1)*27),3,j);
				Cibo[j].stampa();
				Cibo[j].mettiMarchio();
				j++;
			}
			
			if(Riga!=8 && Colonna!=14)
			{
				Cibo[j].inizializzaPallino(Math.floor((Base-Colonna+0.5-1)*27), Math.floor((Riga+0.5)*27),3,j);
				Cibo[j].stampa();
				Cibo[j].mettiMarchio();
				j++;	
			}
		}
	}
	PalliniPerVincere=j;
}

/*
	Dati due punti di un rettangolo, A ,B.
	E definite le proprie coordinate :
		A(Spig1X,Spig1Y)
		B(Spig2X,Spig2Y)
	
	la seguente funzione provvederà a disegnare graficamente il rettangolo sullo schermo, e inserire i dati del rettangolo nella matrice,
	definendo quindi lo spazio da lui occupato come "limite" (-1)
*/

function creaLimiteCampo(Spig1X,Spig1Y,Spig2X,Spig2Y,Colore)
{
	Spig1X=Math.floor(Spig1X);
	Spig1Y=Math.floor(Spig1Y);
	Spig2X=Math.floor(Spig2X);
	Spig2Y=Math.floor(Spig2Y);
	
	var canvas=document.getElementById("myCanvas");
	var ctx=canvas.getContext("2d");
	ctx.beginPath();
	ctx.strokeStyle = Colore;
	ctx.moveTo(Spig1X,Spig1Y);	//Parto dal punto A
	ctx.lineTo(Spig2X,Spig1Y);	//disegna prima linea orizzontale
	ctx.lineTo(Spig2X,Spig2Y);	//Giungo quindi al bunto B
	ctx.lineTo(Spig1X,Spig2Y);	//seconda orizzontale
	ctx.lineTo(Spig1X,Spig1Y);	//Concludo ritornando al punto A
	ctx.stroke();
	
	//Inserisci il rettangolo nella matrice
	for(i = Spig1Y; i < Spig2Y ; i++)
		for(j = Spig1X; j < Spig2X; j++)
			Campo[i][j] = -1;
}

window.onkeydown = function(event) //avvia la funzione quando viene premuto un tasto
{
	Giocatore.prenotaDirezione(event.which);
	
	if(event.which == 13 && Gioco!=1)	//se il giocatore ha premuto il tasto enter e il gioco è fermo
	{
		suonoInizio.pause();
		suonoInizio.currentTime = 0;
		suonoInizio.play();	//fai partire la colonna sonora
		Gioco=1;
		setTimeout(partiGioco,4000);	//dopo che è finita la colonna sonora fai partire il gioco
	}
	else if(event.which == 77)
	{
		if(Sounds)
		{
			Sounds=0;
			suonoSottofondo.pause();
			document.getElementById("dynamicSound").innerHTML = "off";
		}
		else
		{
			Sounds=1;
			document.getElementById("dynamicSound").innerHTML = "on";
			partiSuonoSottofondo();
		}
	}
}

function azzeraGioco()
{
	Score = 0;
	PalliniPresi = 0;
	Giocatore.cancella();
	Giocatore.inizializzaPacMan();
	costruisciPallini();
	for(var i = 0; i<FantasmiMaxSpawn; i++)
	{
		Fantasmi[i].uccidiFantasma();
		Fantasmi[i].rimuoviMarchio();
		Fantasmi[i].cancella();
	}
}

function NumeroCasuale(Min,Max)		//Restituisce un numero pseudocasuale
{
	var Numero;
	Numero=Math.floor(Math.random()*(Max-Min+1)+Min);
	return Numero;
}

function rimuoviScrittaMenu()
{
	document.getElementById("startGame").style.right = "10000px";
}

function mettiScrittaMenu()
{
	if(Gioco!=1)
		document.getElementById("startGame").style.right = "0px";
}

function AggiornaScore()
{
	document.getElementById("dynamicScore").innerHTML = Math.floor(Score);
}

function partiSuonoSottofondo()
{
	if(Gioco==1 && Sounds)
	{
		suonoSottofondo.pause();
		suonoSottofondo.currentTime = 0;
		suonoSottofondo.play();
		setTimeout(partiSuonoSottofondo,400);
	}
}

function partiSuonoMangiato()
{
	if(Sounds && Gioco)
	{
		suonoMangiato.pause();
		suonoMangiato.currentTime = 0;
		suonoMangiato.play();
	}
}

function animazioneMortePacman()
{
	Giocatore.cancella();
	if(Giocatore.returnAmpiezzaBocca()<170 && Gioco!=1)
	{
		for(var i = 0; i<FantasmiMaxSpawn; i++)
			if(Fantasmi[i].returnVita())	// se il fantasma è in vita
			{
				Fantasmi[i].cancella();
				Fantasmi[i].stampa();
			}
	
		Giocatore.aumentaAmpiezzaBocca();
		Giocatore.stampa();
		setTimeout(animazioneMortePacman,70);
	}
	else
	{
		for(var i = 0; i<FantasmiMaxSpawn; i++)
			if(Fantasmi[i].returnVita())	// se il fantasma è in vita
			{
				Fantasmi[i].cancella();
				Fantasmi[i].stampa();
			}		
	}
}

function partiGioco()
{
	rimuoviScrittaMenu();
	azzeraGioco();
	spawnaFantasma();
	gameLoopPolling();
	partiSuonoSottofondo();
}