ig.module
(
	'game.fsm'
)


.defines(function() 
{
    
Fsm = ig.Class.extend( 
{
    fsmOwner: null,
    
    prevState: null,
    currentState: null,
    globalState: null,

    
    init: function (settings) 
    {
        this.fsmOwner = settings.fsmOwner;
        
        this.currentState = settings.beginState;
        this.globalState = settings.globalState;
       
        if (this.globalState && this.globalState.enter) 
        {
            this.globalState.enter(this.fsmOwner); 
        }
        
        if (this.currentState.enter)
        {
	        this.currentState.enter(this.fsmOwner);        
        }
    },
    
    
    
    update: function (dt) 
    {
		ig.assert(this.currentState != null, 'Current state somehow is null during update!');
        
        if (this.globalState != null && this.globalState.update) 
        {
            this.globalState.update(this.fsmOwner, dt);
        }
        
        if (this.currentState.update)
        {
			this.currentState.update(this.fsmOwner, dt);        
        }
    },
    
    
    
    changeState: function (state) 
    {
        ig.assert(this.currentState != null, 'Current state has gone missing during enter!');
        
        if (this.currentState.exit)
        {
	        this.currentState.exit(this.fsmOwner);
	    }
	    
        this.prevState = this.currentState;
        this.currentState = state;
        
        if (this.currentState.enter)
        {
	        this.currentState.enter(this.fsmOwner);
	    }
    },
    
    

    isInState: function (stateToCheck)
    {
        ig.assert(this.stateStack.length >= 1, 'Entity ran out of states during isInState check!');
        var inState = false;
        
        if (this.currentState.state === stateToCheck.state) 
        {
            inState = true;
        }
        
        return inState;
    },
    
    
    
    sendMessage: function(message, extraData) 
    {
        var msgHandled = false;
        
        if (this.currentState.onMessage)
        {
	        msgHandled = this.currentState.onMessage(this.fsmOwner, message, extraData);
	    }
        
        if (msgHandled == false && this.globalState && this.globalState.onMessage)
        {
            this.globalState.onMessage(this.fsmOwner, message, extraData);
        }
    }
    
});

});
