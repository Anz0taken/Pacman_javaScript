function Pallini()
{
	this.x;
	this.y;
	this.marchio;
	this.vita;
	this.rag;
	
	this.inizializzaPallino = function(x_,y_,rag_,marchio_)
	{
		this.x = x_;
		this.y = y_;
		this.rag = rag_;
		this.marchio = marchio_+30;	//il valore che rilascia sulla matrice, (da +6, poichè i valori da 0 a 5 non sono disponibili)
		this.vita = 1;	//se deve essere stampato
	}
	
	this.stampa = function()
	{
		var Cerchio = canvas.getContext("2d");
		Cerchio.beginPath();
		Cerchio.arc(this.x, this.y, this.rag, 0, 2 * Math.PI);
		Cerchio.strokeStyle = "white";
		Cerchio.fillStyle = "white";
		Cerchio.stroke();	//disegnalo
		Cerchio.fill();
	}
	
	this.mettiMarchio = function()
	{
		//inserisce il marchio sulla matrice, in 9 celle della matrice (dovuto a un errore di gioco)
		for(var i = this.y-2 ; i < this.y+2; i++)
			for(var j = this.x-2 ; j < this.x+2; j++)
				Campo[i][j] = this.marchio;
	}
	
	this.rimuoviMarchio = function()
	{
		this.vita = 0;	//determina che il pallino non dovrà essere più stampato
		
		//rimuove il valore dalla matrice
		for(var i = this.y-2 ; i < this.y+2; i++)
			for(var j = this.x-2 ; j < this.x+2; j++)
				Campo[i][j] = 0;
	}
	
	this.returnVita = function()
	{
		return this.vita;
	}
	
	this.returnRaggio = function()
	{
		return this.rag;
	}
}