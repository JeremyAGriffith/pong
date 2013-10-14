/*	                                    oooo        .o8  
	                                    `888       "888  
	oooo oooo    ooo  .ooooo.  oooo d8b  888   .oooo888  
	 `88. `88.  .8'  d88' `88b `888""8P  888  d88' `888  
	  `88..]88..8'   888   888  888      888  888   888  
	   `888'`888'    888   888  888      888  888   888  
	    `8'  `8'     `Y8bod8P' d888b    o888o `Y8bod88P" */
function World(s, w, h){
	var state = 'pause';
	var sel=s, world_w=w, world_h=h;
	var paddles = [];
	var ball;

	this.init = function(){
		$(sel).css({'position':'relative', 'width':world_w+'px', 'height':world_h+'px',
			'border':'1px solid black'});

		paddles.push(
			new Paddle(1, 10, world_h/2, 20, 90, sel),
			new Paddle(2, world_w-30, world_h/2, 20, 90, sel)
		);
		ball = new Ball(1, world_w/2, world_h/2, sel);

		document.onkeydown = function(e){
			// console.log(e);
			switch(e.keyCode){
				// PLAYER 1 (left paddle)
				// UP (W)
				case 87:
					paddles[0].pos.y -= paddles[0].dy;
				break;
				// DOWN (S)
				case 83:
					paddles[0].pos.y += paddles[0].dy;
				break;
				// PLAYER 2 (right paddle)
				// UP
				case 38:
					paddles[1].pos.y -= paddles[1].dy;
				break;
				// DOWN
				case 40:
					paddles[1].pos.y += paddles[1].dy;
				break;
			}
			if (e.keyCode>40)
				checkBoundary(paddles[0], world_w, world_h);
			else
				checkBoundary(paddles[1], world_w, world_h);
		};

		ball.init(world_w/2, world_h/2);
	};

	this.gameLoop = function(){
		// PADDLES
		for (var i in paddles){
			$(paddles[i].sel).css({"left": paddles[i].pos.x+"px", "top": paddles[i].pos.y+"px"});
		}

		// BALL
		// console.log(ball);
		this.updateBall();
	};

	this.updateBall = function(){
		// console.log("Update");
		// MOVE
		if (world_w !== null && world_h !== null){
			// console.log(ball.sel, ball.pos.x, ball.pos.y, world_w, world_h);
			ball.pos.x += ball.speed * ball.dir.x;
			ball.pos.y += ball.speed * ball.dir.y;
			if (checkBoundary(ball, world_w, world_h)){
				// console.log("OOWWWWWWWWWWW");
				ball.dir.y *= -1;
				// var temp;
				if (ball.pos.x<=0){
					ball.init(world_w/2, world_h/2);
					paddles[1].score++;
					$('.score#s'+paddles[1].id).html(paddles[1].score);
				} else if ((ball.pos.x+ball.pos.width)>=world_w) {
					paddles[0].score++;
					$('.score#s'+paddles[0].id).html(paddles[0].score);
					ball.init(world_w/2, world_h/2);
				}
			}
			if (checkCollision(ball, paddles)){
				ball.dir.x *= -1;
				// console.log("hit");
			}
		}

		// DRAW
		$(ball.sel).css({"left": ball.pos.x+"px", "top": ball.pos.y+"px"});
	};
}

/*	                           .o8        .o8  oooo            
	                          "888       "888  `888            
	oo.ooooo.   .oooo.    .oooo888   .oooo888   888   .ooooo.  
	 888' `88b `P  )88b  d88' `888  d88' `888   888  d88' `88b 
	 888   888  .oP"888  888   888  888   888   888  888ooo888 
	 888   888 d8(  888  888   888  888   888   888  888    .o 
	 888bod8P' `Y888""8o `Y8bod88P" `Y8bod88P" o888o `Y8bod8P' 
	 888                                                       
	o888o                                                      */
function Paddle(id, x, y, w, h, world){
	this.id = id;
	this.sel = ".paddle#p"+id;
	this.score = 0;
	this.pos = {x:x, y:y, width:w, height:h};
	this.dy = 20;

	$(world).append("<div class='paddle' id='p"+id+"' "+
		"style='width:"+this.pos.width+"px;height:"+this.pos.height+"px;"+
		"position:absolute;left:"+this.pos.x+"px;top:"+this.pos.y+"px;"+
		"background:black;'></div>");
	$(world).append("<p class='score' id='s"+id+"' "+
		"style='width:200px;height:200px;font-size:38px;"+
		"position:absolute;left:"+(this.id*100+150)+"px;top:0px;"+
		"color:#DDDDDD;'>"+this.score+"</p>");
}

/*	 .o8                 oooo  oooo  
	"888                 `888  `888  
	 888oooo.   .oooo.    888   888  
	 d88' `88b `P  )88b   888   888  
	 888   888  .oP"888   888   888  
	 888   888 d8(  888   888   888  
	 `Y8bod8P' `Y888""8o o888o o888o */
function Ball(id, x, y, world){
	this.id = id;
	this.sel = ".ball#b"+id;
	this.pos = {x:x, y:y, width:12, height:12};
	this.dir = {x:0, y:0};
	this.speed = 0;

	$(world).append("<div class='ball' id='b"+id+"' "+
		"style='width:"+this.pos.width+"px;height:"+this.pos.height+"px;"+
		"position:absolute;left:"+this.pos.x+"px;top:"+this.pos.y+"px;"+
		"border-radius:"+(this.pos.width+this.pos.height)+"px;"+
		"background:red;'></div>");

	this.init = function(x, y){// , dir_x, dir_y, speed){
		this.pos.x = x;
		this.pos.y = y;

		var temp = Math.random();
		temp = temp>0.5 ? temp-0.2 : temp-0.8;
		// ball.init(world_w/2, world_h/2, temp, Math.round(Math.random())*2-1, 5);

		this.dir.x = temp;
		this.dir.y = Math.round(Math.random())*2-1;
		this.speed = 5;
	};
}

/*	oooo   o8o   .o8       
	`888   `"'  "888       
	 888  oooo   888oooo.  
	 888  `888   d88' `88b 
	 888   888   888   888 
	 888   888   888   888 
	o888o o888o  `Y8bod8P' */
function checkBoundary(obj, boundary_w, boundary_h)
{
	var did_collide = false;

	if(obj.pos.x+obj.pos.width > boundary_w){
		obj.pos.x = boundary_w - obj.pos.width;
		did_collide = true;
	}
	if(obj.pos.y+obj.pos.height > boundary_h){
		obj.pos.y = boundary_h - obj.pos.height;
		did_collide = true;
	}
	if(obj.pos.x<0){
		obj.pos.x = 0;
		did_collide = true;
	}
	if(obj.pos.y<0){
		obj.pos.y = 0;
		did_collide = true;
	}

	return did_collide;
}

function checkCollision(b, ps){
	var did_collide = false;

	// console.log(ps, b);
	if (b.pos.x+b.pos.width >= ps[1].pos.x-10){
		// console.log("CLOSE");
		if (b.pos.y >= ps[1].pos.y && b.pos.y+b.pos.height <= ps[1].pos.y+ps[1].pos.height){
			did_collide = true;
		}
	} else if (b.pos.x < ps[0].pos.x+ps[0].pos.width+10){
		// console.log("CLOSE");
		if (b.pos.y >= ps[0].pos.y && b.pos.y+b.pos.height <= ps[0].pos.y+ps[0].pos.height){
			did_collide = true;
		}
	}

	return did_collide;
}