/*JS*/
//VARIABLES GLOBALES:
	//GLOBAL DE n_jugadore y n_bots.
		var n_j=1;
		var n_b=1;
		var obj_juego;
//INTERFAZ AJUSTES:
	function crear_ajustes(){
		borrar_ajustes();
		//ELEMENTO SETTINGS
		var new_ele = document.getElementById("screen");
		new_ele.insertAdjacentHTML('beforeend','<div id="ajustes"></div>');

		new_ele = document.getElementById("ajustes");
		new_ele.insertAdjacentHTML('beforeend',`<img src="img/close.png" 
			id="close" onclick="borrar_ajustes()" onmouseover="this.src='img/close_hover.png'" onmouseout="this.src='img/close.png'">`);

		new_ele.insertAdjacentHTML('beforeend',
			`
			<h3>Ajustes</h3>
			<form class="column">
				<input type="text" class="text" placeholder="Número de jugadores" id="n_jugadores" class="box">
				<input type="text" class="text" placeholder="Número de bots" id="n_bots" class="box">
			</form>
			<button class="button_save" onclick="guardar_ajustes()">Guardar Cambios</button>

			`);

	}

	function borrar_ajustes(){
		borrar_elemento("ajustes");
	}

//CODIGO AJUSTES
	function guardar_ajustes(){
		if(document.getElementById("n_jugadores").value == ""){
			document.getElementById("n_jugadores").value=0;
		}
		if(document.getElementById("n_bots").value == ""){
			document.getElementById("n_bots").value=0;
		}
		n_j=parseInt(document.getElementById("n_jugadores").value);
		n_b=parseInt(document.getElementById("n_bots").value);
		borrar_ajustes();
	}


//FUNCIONES GLOBALES
	function borrar_elemento(id){
		myobj = document.getElementById(id);//cojo el id
			if(myobj!=null){
				myobj.remove();//borro el elemento
			}
	}
	function empezar_juego(){
		obj_juego=new juego(n_j,n_b);
		//console.log(obj_juego.baraja.print());
	}

//OBJETOS
	//CARTA
		function carta(num, palo){
			this.palos=["oros","copas","espadas","bastos"];
			this.palo=palo;
			this.num=num;
			this.carta=palo*100+num;
			this.print = this.num+" de "+this.palos[this.palo];
			this.calcular_puntos=function(){
				var carta_puntos=2.5;
				if(this.palo==0){
					carta_puntos+=10;
				}
				if(this.num==7){
					carta_puntos+=25;
				}
				if(this.num==7 && this.palo==0){
					carta_puntos+=100;
				}
				return carta_puntos;
			}
			this.puntos=this.calcular_puntos();

		}
	//BARAJA
		function baraja(){
			this.baraja=new Array(40);

			this.barajear=function(){
				var b=[];
				var i=0;
				while(b.length < 40){
					var random_palo=parseInt(Math.round(Math.random()*3));
					var random_number=parseInt(Math.round(Math.random()*9)+1);

					var res= parseInt( (parseInt(random_palo)*100) + parseInt(random_number) );
					var repe=0;
					for(var c=0; c<b.length; c++){
						if(res==b[c]){
							repe=1;
						}
					}
					if(repe==0){
						this.baraja[i] = new carta(random_number, random_palo);
						//console.log(this.baraja[i].print);
						i++;
						b.push(res);
					}	
				}
			};
			
			this.print=function() {
				var res="";
				for(var c=0; c<this.baraja.length; c++){
					res+=this.baraja[c].print+",";
				}
				return res;
			}
		}
	//JUGADOR
		function jugador(nombre){
			this.nombre=nombre;
			this.id;
			this.mazo=[];
			this.cartas=[];
			//MARCADOR
				this.n_cartas=0;
				this.escobas=0;
				this.sietes=0;
				this.oros=0;
				this.siete_de_oros=0;
				this.puntos=0;

				this.ganador=0;
				this.jugadas=[];
			//ES BOT
				this.bot=0;//=1 es un bot.
				this.isBot=function(){
					this.bot=1;
					this.nombre+=" (bot)";
				}
			//PRINT
				this.print=function(){
					var res=""+this.nombre;
					res+="\nMAZO: ";
					for(var i=0; i<this.mazo.length; i++){
						res+=this.mazo[i].print+",";
					}
					res+="\nCARTAS GANADAS: ";
					for(var i=0; i<this.cartas.length; i++){
						res+=this.cartas[i].print+",";
					}
					res+="\nESCOBAS: "+this.escobas+". 7s: "+this.sietes+". OROS: "+this.oros+". N° cartas: "
					+this.n_cartas;
					return res;
				}
			//ACTUALIZAR
				this.actualizar=function(){
					this.n_cartas=this.cartas.length;
					this.sietes=0;
					this.oros=0;
					for(var i=0; i<this.cartas.length; i++){
						var num = this.cartas[i].num;
						var palo = this.cartas[i].palo;
						if(num == 7){
							this.sietes++;
						}
						if(palo == 0){
							this.oros++;
						}
						if(num == 7 && palo == 0){
							this.siete_de_oros=1;
						}
					}
				}
			//CALCULAR PUNTOS
				this.calcular_puntos=function(jugadores){
					//[jugador,numero]
					var sietes=[0,0];
					var oros=[0,0];
					var n_cartas=[0,0];
					//CALCULAR PUNTOS
						for(var i=0; i<jugadores.length; i++){
							jugadores[i].actualizar();
							jugadores[i].puntos+=jugadores[i].escobas;
							if(jugadores[i].siete_de_oros==1){
								jugadores[i].puntos++;
							}
							if(sietes[1]<jugadores[i].sietes){
								sietes=[i,jugadores[i].sietes];
							}
							if(oros[1]<jugadores[i].oros){
								sietes=[i,jugadores[i].oros];
							}
							if(n_cartas[1]<jugadores[i].n_cartas){
								sietes=[i,jugadores[i].n_cartas];
							}
						}
						jugadores[sietes[0]].puntos++;
						jugadores[oros[0]].puntos++;
						jugadores[n_cartas[0]].puntos++;
					//SABER GANADOR
						var last_puntos=0;
						var ganador=0;
						for(var i=0; i<jugadores.length; i++){
							if(last_puntos<jugadores[i].puntos){
								last_puntos=jugadores[i].puntos;
								ganador=i;
							}
						}
						jugadores[ganador].ganador=1;
						//return jugadores;
				}
			//INTERFAZ
				//INTERFAZ DEL TURNO DE PARTIDA
					this.interfaz=function(){
						this.borrar_interfaz();
						this.actualizar();
						var palos=["oros","copas","espadas","bastos"];
						//MARCADOR
							var new_ele = document.getElementById("line_1");
							var txt=`<p class="p_marcador"><span class="span_marcador_nombre">`+this.nombre+`</span></p>
							<p class="p_marcador"><span class="span_marcador">ESCOBAS:</span> `+this.escobas+`</p>
							<p class="p_marcador"><span class="span_marcador">7s:</span> `+this.sietes+`</p>
							<p class="p_marcador"><span class="span_marcador">OROS:</span> `+this.oros+`</p>
							<p class="p_marcador"><span class="span_marcador">7oros:</span> `+this.siete_de_oros+`</p>
							<p class="p_marcador"><span class="span_marcador">N° cartas:</span> `+this.n_cartas+`</p>`;
							new_ele.insertAdjacentHTML('beforeend','<div id="marcador">'+txt+'</div>');
						//MAZO
							new_ele = document.getElementById("box_2");
							new_ele.insertAdjacentHTML('beforeend',`
								<div id="mazo">
									<h4>MAZO</h4>
									<div id="box_mazo"></div>
								</div>
								`);

							new_ele = document.getElementById("box_mazo");
							for(var i=0; i<this.mazo.length; i++){
								var carta=this.mazo[i];
								var style="mazo_carta_"+palos[carta.palo];
								var onclick="obj_juego.carta_seleccionada("+i+")";
								new_ele.insertAdjacentHTML('beforeend',
								`
								<div class=box_mazo_carta id="`+onclick+`" onclick="`+onclick+`">
									<div class="`+style+`">`+carta.num+`</div>
									<p class="tablero_texto">`+carta.print+`</p>
								</div>
								`);
							}
					}

					this.borrar_interfaz=function(){
						borrar_elemento("marcador");
						borrar_elemento("mazo");
					}
					this.borrar_onclicks=function(){
						for(var i=0; i<this.mazo.length; i++){
							document.getElementById("obj_juego.carta_seleccionada("+i+")").onclick = "kk";
						}
					}
				//INTERFAZ DEL FINAL DE PARTIDA
					this.interfaz_final=function (){
						this.borrar_interfaz_final();
						//GLOBALES
							var palos=["oros","copas","espadas","bastos"];
							var si=["no","si"];
						//CREAR HTML
							var txt=`
								<div class="box_final">
									<p class="texto_final_nombre">`+this.nombre+`</p>
									<p class="texto_final_puntos">`+this.puntos+`pts</p>
									<div class="marcador_final">
										<p class="texto_final_marcador"><span class="span_final_marcador">Escobas:</span> `+this.escobas+`</p>
										<p class="texto_final_marcador"><span class="span_final_marcador">Siete de oros:</span> `+si[this.siete_de_oros]+`</p>
										<p class="texto_final_marcador"><span class="span_final_marcador">Sietes:</span> `+this.sietes+`</p>
										<p class="texto_final_marcador"><span class="span_final_marcador">Oros:</span> `+this.oros+`</p>
										<p class="texto_final_marcador"><span class="span_final_marcador">N° de cartas:</span> `+this.n_cartas+`</p>
									</div>
								</div>
							`;
						//CARGAR HTML
							var new_ele = document.getElementById("final");
							new_ele.insertAdjacentHTML('beforeend',`
								<div id="box_final_`+this.id+`">
									`+txt+`
								</div>
							`);
					}
					this.borrar_interfaz_final=function(){
						borrar_elemento(`box_final_`+this.id);
					}
		}
	//JUEGO
		function juego(n_jugadores, n_bots){
			//ATRIBUTOS
				this.cartas_out=0;
				//CONTROL DE LA PARTIDA(GAME: g_)
					this.g_jugador=0;//Jugador en juego
					this.g_turno=0;//hay 3 turnos cada vez que se reparte
					this.g_repartir=0;//Si g_turno=3 -> 1, se reparte
				//OBJETOS
				this.mates=new matematicas();//OBJETO MATEMATICAS
			//PRINT ARRAY DE CARTAS
				this.print_cartas = function(cartas) {
					var res="";
					for(var i=0; i<cartas.length; i++){
						res+=cartas[i].print+",";
					}
					return res;
				}
			//NUMERO DE JUGADORES TOTALES
				this.n_jugadores=n_jugadores;
				this.n_bots=n_bots;
				this.total_jugadores=n_jugadores+n_bots;
			//CREO LA BARAJA Y BARAJEO.
				this.baraja=new baraja();
				this.baraja.barajear();
			//CREO LOS JUGADORES
				this.jugadores;
				this.cargar_jugadores=function() {
					this.jugadores=new Array(this.total_jugadores);
					for(var i=0; i<this.total_jugadores; i++){
						this.jugadores[i]=new jugador("J"+(i+1));
						this.jugadores[i].id=i;
					}
					var bots=new Array(this.n_bots);
					var i=0;
					while(i<this.n_bots){
						var random=parseInt(Math.round(Math.random()*(this.total_jugadores-1)));
						var igual=0;
						for(var j=0; j<i; j++){
							if(random==bots[j]){
								igual=1;
							}
						}
						if(igual==0){
							bots[i]=random;
							this.jugadores[random].isBot();
							//console.log("J"+random+" is a bot");
							i++;
						}
					}	
				}
				this.cargar_jugadores();
			//CREAR MAZOS:
				this.cargar_mazos=function() {
					var no_cartas=0;
					for(var i=0; i<3; i++){
						for(var j=0; j<this.total_jugadores; j++){
							if(i==0){
								this.jugadores[j].mazo=[];//ELIMINA EL ARRAY COMPLETAMENTE.
							}
							if(no_cartas==0){
								this.jugadores[j].mazo.push(this.baraja.baraja[this.cartas_out]);
								this.cartas_out++;
							}
							if(this.cartas_out>=40){
								no_cartas=1;
							}
						}
					}
					return no_cartas;
				}
				this.cargar_mazos();
			//CREO EL TABLERO
				this.tablero = new tablero();
				this.tablero.crear_tablero(this.baraja.baraja,this.cartas_out);
					this.cartas_out+=4;
				//this.tablero.interfaz();
			//FIN DE LA PARTIDA
				this.last_g_jugador=0;
				this.fin_de_juego=function(){
					this.tablero.borrar_interfaz();
					this.jugadores[0].borrar_interfaz();
					this.borrar_interfaz_jugada();
					if(this.tablero.tablero.length != 0){
						for(var i=0; i<this.tablero.tablero.length; i++){
							this.jugadores[this.last_g_jugador].cartas.push(this.tablero.tablero[i]);
						}
					}
					//this.jugadores=this.jugadores[0].calcular_puntos(this.jugadores);
					this.jugadores[0].calcular_puntos(this.jugadores);
					this.interfaz_final();
				}

				this.interfaz_final=function(){
					var jugadores=this.jugadores;
					var ganador=0;
					var new_ele = document.getElementById("box_1");
					new_ele.insertAdjacentHTML('beforeend',`<div id="final"></div>`);
					for(var i=0; i<jugadores.length; i++){
						if(jugadores[i].ganador==1){
							ganador=i;
						}
						jugadores[i].interfaz_final();
					}
				}
				this.borrar_interfaz_final = function(){
					borrar_elemento("final");
				}
				this.borrar_interfaz_final();
			//TURNO
				this.turno=function(){
					//CARGAR INTERFACES Y CODIGOS DE JUGADOR
						this.tablero.interfaz();
						var turno_bot=0
						if(this.jugadores[this.g_jugador].bot==0){//NO BOT
							this.jugadores[this.g_jugador].interfaz();
						}
						else{//BOT
							turno_bot=1;
							this.turno_bot(this.g_jugador);
						}		
				}

				this.no_cartas=0;//CONTROL DE FIN DE PARTIDA
				this.turno_terminado=function(){
					//GESTION DE TURNO
						this.g_jugador++;
						if(this.g_jugador>=this.total_jugadores){
							this.g_jugador=0;
							this.g_turno++;
						}
						if(this.g_turno>=3){
							this.g_turno=0;
							this.g_repartir=1;
						}
						if(this.g_repartir>=1){
							this.g_repartir=0;
							this.no_cartas+=this.cargar_mazos();
						}
						if((this.no_cartas<=1) && (this.jugadores[this.g_jugador].mazo.length > 0) ){
							this.turno();
						}
						else{
							this.fin_de_juego();
						}
				}		
			//JUGADOR NO BOT
				//ATRIBUTOS
					this.noBot_carta;
					this.noBot_sumas;
				//SUMAR 15
					this.suma_15 = function(carta) {
						var comb=this.tablero.comb_tablero();
						var res=[]
						for(var j=0; j<comb.length; j++){//numero de casos
							var suma=parseInt(carta.num);
							for(var k=0; k<comb[j].length; k++){//caso

								suma+=parseInt(comb[j][k].num);
							}
							if(suma==15){
								res.push(j);
							}
						}
						return res;
					}
				//INTERFAZ
					this.interfaz_opciones=function(carta,suma){
						var comb=this.tablero.comb_tablero();
						this.borrar_interfaz_opciones();
						var palos=["oros","copas","espadas","bastos"];
						var new_ele = document.getElementById("box_3");
						new_ele.insertAdjacentHTML('beforeend',`
							<div id="opciones">
								<h3>OPCIONES</h3>
								<div id="contenido_opciones"></div>
							</div>`);
						
						new_ele = document.getElementById("contenido_opciones");
						for(var i=0; i<suma.length; i++){
							var txt=`
							<div class=box_opcion_cartaMazo>
								<div class="opciones_carta_`+palos[carta.palo]+`">`+carta.num+`</div>
								<p class="opciones_texto">`+carta.print+`</p>
							</div>
							`;
							for(var j=0; j<comb[suma[i]].length; j++){
								txt+=`
								<div class=box_opcion_carta>
									<div class="opciones_carta_`+palos[comb[suma[i]][j].palo]+`">`+comb[suma[i]][j].num+`</div>
									<p class="opciones_texto">`+comb[suma[i]][j].print+`</p>
								</div>
								`;
							}
							new_ele.insertAdjacentHTML('beforeend',
								`
								<div class="box_opcion" onclick="obj_juego.opcion_selecionada(`+i+`)">`+txt+`</div>
								`);
						}
					}
					this.borrar_interfaz_opciones=function(){
						borrar_elemento("opciones");
					}
					this.borrar_interfaz_opciones();
				//OPCION SELECCIONADA
					this.opcion_selecionada=function(id){
						var comb=this.tablero.comb_tablero();
						//ESCOBA??
							if(comb[this.noBot_sumas[id]].length==this.tablero.tablero.length){
								this.jugadores[this.g_jugador].escobas++;
							}
						//BORRAR INTERFAZ
							this.jugadores[this.g_jugador].borrar_interfaz();
							this.borrar_interfaz_opciones();
						//GUARDAR Y ELIMINAR CARTAS
							this.guardar_cartas(this.g_jugador,this.noBot_carta,comb[this.noBot_sumas[id]]);
					}
				//CARTA SELECCIONADA
					this.carta_seleccionada=function(id){
						var carta = this.jugadores[this.g_jugador].mazo[id];
						var suma=this.suma_15(carta);
						this.noBot_carta=carta;
						this.noBot_sumas=suma;
						if(this.noBot_sumas.length!=0){
							this.jugadores[this.g_jugador].borrar_onclicks();//CARTA SOBRE LA MESA PRESA
							this.interfaz_opciones(carta,suma);
						}
						//ECHAR LA CARTA (al no existir ninguna posiblidad de suma)
						else{
							this.echar_carta(id);
							//TURNO TERMINADO
							this.jugadores[this.g_jugador].borrar_interfaz();
							this.turno_terminado();
						}
					}
				//ECHAR CARTA
					this.echar_carta = function(id){
						//AÑADIR CARTA DEL MAZO EN TABLERO
							this.tablero.tablero.push(this.jugadores[this.g_jugador].mazo[id]);
						//MOSTRAR EN JUGADA
							this.interfaz_jugada(this.jugadores[this.g_jugador].mazo[id],[])
						//BORRAR CARTA DEL MAZO
							var remove = this.jugadores[this.g_jugador].mazo.splice(id,1);
					}
			//JUGADOR BOT
				//SUMAR 15
					this.suma_15_bot = function(bot) {
						var comb=this.tablero.comb_tablero();
						var mazo=this.jugadores[bot].mazo;
						var res=new Array(2);//0: POSICION de carta del mazo, 1: POSICION de combinacion.
						res[0]=-1;
						res[1]=-1;
						var last_puntos=0;
						for(var i=0; i<mazo.length; i++){//mazo
							var carta_puntos=mazo[i].puntos;
							for(var j=0; j<comb.length; j++){//numero de casos
								var suma=parseInt(mazo[i].num);
								var puntos=carta_puntos;
								for(var k=0; k<comb[j].length; k++){//caso
									suma+=parseInt(comb[j][k].num);
									puntos+=comb[j][k].puntos;
								}
								if(suma==15){
									//console.log(mazo[i].print+","+this.print_cartas(comb[j])+". Puntos="+puntos);
									if(this.tablero.tablero.length==comb[j].length){
										puntos+=100;
										res[0]=i;
										res[1]=j;
										return res;									
									}
									if(puntos>last_puntos){
										last_puntos=puntos;
										res[0]=i;
										res[1]=j;
									}
								}
							}
						}
						return res;
					}
				//ECHAR CARTA
					this.echar_carta_bot = function(i){
						//SELECCIONO LA CARTA PARA ECHAR CON MENOS PUNTOS
							var pos=0;
							var last_puntos=this.jugadores[i].mazo[0].puntos;
							for(var j=0; j<this.jugadores[i].mazo.length; j++){
								if(this.jugadores[i].mazo[j].puntos<last_puntos){
									last_puntos=this.jugadores[i].mazo[j].puntos;
									pos=j;
								}
							}
						//AÑADIR CARTA DEL MAZO EN TABLERO
							this.tablero.tablero.push(this.jugadores[i].mazo[pos]);
						//MOSTRAR JUGADA
							this.interfaz_jugada(this.jugadores[i].mazo[pos],[]);
						//BORRAR CARTA DEL MAZO
							var remove = this.jugadores[i].mazo.splice(pos,1);
						//TERMINO TURNO
							this.turno_terminado();
					}
				//TURNO
					this.turno_bot=function (i){
						//i = g_jugador
						var pos=this.suma_15_bot(i);
						var comb=this.tablero.comb_tablero();
						if(pos[0]==-1){
							this.echar_carta_bot(i);
						}
						else{
							//ESCOBA??
								if(comb[pos[1]].length==this.tablero.tablero.length){
									this.jugadores[this.g_jugador].escobas++;
								}
							//ALMACENO LAS CARTAS
								this.guardar_cartas(i,this.jugadores[i].mazo[pos[0]],comb[pos[1]]);
						}
						//console.log(this.tablero.tablero);
						//console.log(this.jugadores[i].mazo);
						//console.log(this.jugadores[i].cartas);
					}
			//ALMACENAR CARTAS A JUGADOR
				this.guardar_cartas=function(i,carta_mazo,cartas_tablero) {
					//ALMACENAR Y MOSTRAR JUGADA
						this.interfaz_jugada(carta_mazo,cartas_tablero);
					//BORRAR CARTA DEL MAZO
						var pos = this.jugadores[i].mazo.indexOf(carta_mazo);
						var remove = this.jugadores[i].mazo.splice(pos,1);
					//BORRAR CARTAS DEL TABLERO
						for(var j=0; j<cartas_tablero.length; j++){
							pos = this.tablero.tablero.indexOf(cartas_tablero[j]);
							remove = this.tablero.tablero.splice(pos,1);
						}
					//ALMACENAR A JUGADOR
						cartas_tablero.push(carta_mazo);
						for(var j=0; j<cartas_tablero.length; j++){
							this.jugadores[i].cartas.push(cartas_tablero[j]);
						}
						this.last_g_jugador=i;
					//TURNO TERMINADO
						this.turno_terminado();
				}
			//MOSTRAR JUGADA
				//INTERFAZ;
				this.interfaz_jugada=function(carta_mazo,cartas_tablero){
					this.borrar_interfaz_jugada();
					var palos=["oros","copas","espadas","bastos"];
					var accion=["se llevo","echo"]
					var n_accion=0;
					if(cartas_tablero.length<=0){
						n_accion=1;
					}
					//PREPARAR CAJA Y METER EN HTML
						var new_ele = document.getElementById("box_4");
						var texto=
						`
						<div id="jugada">
							<h3>ÚLTIMA JUGADA</h3>
							<h4>`+this.jugadores[this.g_jugador].nombre+` `+accion[n_accion]+`:</h4>
							<div id="box_jugada">
							</div>
						</div>

						`;
						new_ele.insertAdjacentHTML('beforeend',texto);
					//CARTA MAZO
						var txt_cartas_tablero=`
							<div class="box_jugada_cartaMazo">
								<div class="jugada_carta_`+palos[carta_mazo.palo]+
									`">`+carta_mazo.num+`</div>
								<p class="jugada_texto">`+carta_mazo.print+`</p>
							</div>`;
					//CARTAS DEL TABLERO			
						for(var i=0; i<cartas_tablero.length; i++){
							texto=`
							<div class="box_jugada_carta">
								<div class="jugada_carta_`+palos[cartas_tablero[i].palo]+
									`">`+cartas_tablero[i].num+`</div>
								<p class="jugada_texto">`+cartas_tablero[i].print+`</p>
							</div>
							`;
							txt_cartas_tablero+=texto;
						}
					//METER EN HTML
						new_ele = document.getElementById("box_jugada");
						new_ele.insertAdjacentHTML('beforeend',txt_cartas_tablero);
					//ALMACENO LA JUGADA DEL JUGADOR
						var carta_array=[carta_mazo,cartas_tablero]
						this.jugadores[this.g_jugador].jugadas.push(carta_array);
				}
				//BORRAR INTERFAZ	
				this.borrar_interfaz_jugada=function(){
					borrar_elemento("jugada");
				}
				this.borrar_interfaz_jugada();
			//CARGAR PRIMER TURNO:
				this.turno();
		}


	//TABLERO
		function tablero(){
			//OBJETO MATEMATICAS
			this.m=new matematicas();
			this.tablero=[];
			this.conv=[];
			//FUNCION comb_tablero
				this.comb_tablero=function(){
					var tlen=parseInt(this.tablero.length);
					var contador=this.default_contador(tlen);
					var total_casos=((this.m.elebar(2,tlen))-1);//Casos totales(sin contar el elemento vacio(p=0)).
					var res=new Array(total_casos);

					var c=0;//contador de res
					//INICIALIZO el array dimensional de res.
					for(var i=0; i<total_casos; i++){
						//res[i]=new Array(tlen);
						res[i]=[];
					}
					for(var i=0; i<tlen; i++){//Combinaciones del array TABLERO entre "i" elementos de ese array.
						var casos=(this.m.combinatoria(tlen,(i+1)));
						contador=this.default_contador(tlen);
						for(var j=0; j<casos; j++){//Casos por i
							for(var k=0; k<(i+1); k++){//Almacenar las posiciones de forma ordenada.

								//res[c][k]=this.tablero[parseInt(contador[k])];
								res[c].push(this.tablero[parseInt(contador[k])]);		
								if(k==i){
									//CASOS DE DESBORDAMIENTO DEL CONTADOR.
									var inIf=0;
									for(var l=0; l<tlen; l++){
										var resta=(tlen-1)-(i-l);
										if(contador[l]>=resta && inIf==0){
											inIf++;

											contador[l-1]++;
											//CORREGIR EL CONTADOR
											for(var m=l; m<tlen; m++){
												contador[m]=(contador[m-1]+1);
											}
										}
									}
									if(inIf==0){
										contador[k]++;
									}
									
								}
							}
							c++;//CASO
						}
					}

					return res;
				}
			//RESTABLECER CONTADOR
				this.default_contador = function(n) {
					var res=new Array(n);
					for(var i=0; i<n; i++){
						res[i]=i;
					}
					return res;
				}
			//CREAR TABLERO
				this.crear_tablero = function(baraja,cartas_out) {
					for(var i=cartas_out; i<(cartas_out+4); i++){
						this.tablero.push(baraja[i]);
					}
				}
			//INTERFAZ
				this.interfaz = function(){
					this.borrar_interfaz();
					var palos=["oros","copas","espadas","bastos"];
					var new_ele = document.getElementById("box_1");
					new_ele.insertAdjacentHTML('beforeend',`
						<div id="tablero">
							<h4>TABLERO</h4>
							<div id="box_tablero"></div>
						</div>`);

					new_ele = document.getElementById("box_tablero");
					if(this.tablero.length==0){
						var txt=["E","s","c","o","b","a"];
						for(var i=0; i<txt.length; i++){
							var palo=i;
							if(i>=4){
								palo=i-4;
							}
							var style="tablero_carta_"+palos[palo];
							new_ele.insertAdjacentHTML('beforeend',
							`
							<div class=box_tablero_carta>
								<div class="`+style+`">`+txt[i]+`</div>
								<p class="tablero_texto">`+txt[i]+`</p>
							</div>
							`);
						}
					}
					else{
						for(var i=0; i<this.tablero.length; i++){
							var carta=this.tablero[i];
							var style="tablero_carta_"+palos[carta.palo];
							new_ele.insertAdjacentHTML('beforeend',
							`
							<div class=box_tablero_carta>
								<div class="`+style+`">`+carta.num+`</div>
								<p class="tablero_texto">`+carta.print+`</p>
							</div>
							`);
						}
					}
				}
				this.borrar_interfaz = function(){
					borrar_elemento("tablero");
				}
		}
	//MATEMATICAS
		function matematicas(){
			this.combinatoria=function(n,p) {
				return ((this.factorial(n))/(this.factorial(p)*this.factorial(n-p)));
			}
			this.factorial=function(n) {
				var res=1;
				for(var i=0; i<n; i++){
					res*=(i+1);
				}
				return res;
			}

			this.elebar=function(num,exp){
				res=1;
				for(var i=0; i<exp; i++){
					res*=num;
				}
				return res;
			}
		}