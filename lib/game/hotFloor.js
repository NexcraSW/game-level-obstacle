ig.module
(
	'game.hotFloor'
)


.requires
(
    'game.fsm',
	'impact.entity'
)


.defines(function() {

EntityHotFloor = ig.Entity.extend(
{
	size:{x:200, y:200},
	entityFsm: null,
	
	openDur:0,
	openDurRange:{min:0.5,max:3.0},
	
	preFireDur:0,
	preFireDurTotal:1.0,
	
	fireDur:0,
	fireDurTotal:2.0,
	
	idleSheet: null,
	openSheet: null,
	fireSheet: null,
	
	init: function (x, y, settings) 
	{
        this.parent(x, y, settings);
        
		this.entityFsm = new Fsm({fsmOwner:this, beginState:HotFloorBeginState, globalState:HotFloorGlobalState});
		
        this.idleSheet = new ig.AnimationSheet('media/artAssets/stageHazards/pd-scenery-stage10-props-floorTrap1.png', 200, 200);
        this.openSheet = new ig.AnimationSheet('media/artAssets/stageHazards/pd-scenery-stage10-props-floorTrap2.png', 200, 200);
        this.fireSheet = new ig.AnimationSheet('media/artAssets/stageHazards/pd-scenery-stage10-props-floorTrap3.png', 200, 200);
        
        this.anims.idle = new ig.Animation(this.idleSheet, 0.05, [0], true);
        this.anims.open = new ig.Animation(this.openSheet, 0.05, [0], true);
        this.anims.fire = new ig.Animation(this.fireSheet, 0.05, [0,1], false);
        
        this.currentAnim = this.anims.idle;
	},

	

	update: function () 
	{
        this.parent();
		this.entityFsm.update(ig.system.tick);		
    },
    
    
    
    sendMessage: function(message, extraData) 
    {
        var msgHandled = this.entityFsm.sendMessage(message, extraData);
		return msgHandled;
	},
	
});

});





ig.HOT_FLOOR_STATE = 
{
	'GLOBAL': 			0,
	'BEGIN': 			1,
	'IDLE': 			2,
	'ACTIVE_CLOSED': 	3,
	'ACTIVE_OPEN': 		4,
	'FIRE': 			5,
	'INACTIVE': 		6,
};



ig.HOT_FLOOR_MSGS = 
{
	'ACTIVATE':		0,
	'DEACTIVATE':	1,
}


HotFloorGlobalState = 
{
	state: ig.HOT_FLOOR_STATE.GLOBAL,
    
    onMessage: function(hotFloor, message, extraData) 
    {
        var msgHandled = true;		

		switch (message) 
		{
			case ig.HOT_FLOOR_MSGS.DEACTIVATE:
				hotFloor.entityFsm.changeState(HotFloorInactiveState);
				break;

			default: 
				msgHandled = false;
				break;
		}

        return msgHandled;
    }
}



HotFloorBeginState = 
{
	state: ig.HOT_FLOOR_STATE.BEGIN,

    onMessage: function(hotFloor, message, extraData) 
    {
        var msgHandled = true;		

		switch (message) 
		{
			case ig.HOT_FLOOR_MSGS.ACTIVATE:
				hotFloor.entityFsm.changeState(HotFloorIdleState);
				break;

			default: 
				msgHandled = false;
				break;
		}

        return msgHandled;
    }
}



HotFloorIdleState = 
{
	state: ig.HOT_FLOOR_STATE.IDLE,

    enter: function(hotFloor) 
    {
		hotFloor.currentAnim = hotFloor.anims.idle;
    },
    
    
    update: function(hotFloor, dt) 
    {
		hotFloor.entityFsm.changeState(HotFloorActiveClosedState);
    }
}



HotFloorActiveClosedState = 
{
	state: ig.HOT_FLOOR_STATE.ACTIVE_CLOSED,

    enter: function(hotFloor) 
    {
		hotFloor.currentAnim = hotFloor.anims.idle;
		hotFloor.openDur = (Math.random() * hotFloor.openDurRange.max - hotFloor.openDurRange.min) + hotFloor.openDurRange.min;
    },
    
    
    update: function(hotFloor, dt) 
    {
		hotFloor.openDur -= dt;
		
		if (hotFloor.openDur <= 0)
		{
			hotFloor.entityFsm.changeState(HotFloorActiveOpenState);
		}
    },
}



HotFloorActiveOpenState = 
{
	state: ig.HOT_FLOOR_STATE.ACTIVE_OPEN,

    enter: function(hotFloor) 
    {
		hotFloor.currentAnim = hotFloor.anims.open;
		hotFloor.preFireDur = hotFloor.preFireDurTotal;
    },
    
    
    update: function(hotFloor, dt) 
    {
		hotFloor.preFireDur -= dt;
		
		if (hotFloor.preFireDur <= 0)
		{
			hotFloor.entityFsm.changeState(HotFloorFireState);
		}
    },
}



HotFloorFireState = 
{
	state: ig.HOT_FLOOR_STATE.FIRE,

    enter: function(hotFloor) 
    {
		hotFloor.currentAnim = hotFloor.anims.fire;
		hotFloor.fireDur = hotFloor.fireDurTotal;
    },
    
    
    update: function(hotFloor, dt) 
    {
		hotFloor.fireDur -= dt;
		
		if (hotFloor.fireDur <= 0)
		{
			hotFloor.entityFsm.changeState(HotFloorActiveClosedState);
		}
    },
}



HotFloorInactiveState = 
{
	state: ig.HOT_FLOOR_STATE.INACTIVE,

    enter: function(hotFloor) 
    {
		hotFloor.currentAnim = hotFloor.anims.idle;
    },
    
    
    onMessage: function(hotFloor, message, extraData) 
    {
        var msgHandled = true;		

		switch (message) 
		{
			case ig.HOT_FLOOR_MSGS.ACTIVATE:
				hotFloor.entityFsm.changeState(HotFloorIdleState);
				break;


			default: 
				msgHandled = false;
				break;
		}

        return msgHandled;
    }
}
