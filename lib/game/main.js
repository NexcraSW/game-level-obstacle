ig.module
( 
	'game.main' 
)

.requires
(
	'game.hotFloor',
	'impact.game',
	'plugins.font2'
)


.defines(function()
{

TrapDoorSample = ig.Game.extend(
{
	// Demo variables
	bgImg: new ig.Image('media/artAssets/background/pd-trapDoorDemo-bg.png'),	
	
	trapDoorsTop: [],
	trapDoorsBottom:[],
	
	trapDoorsHorizGapDist:296,
	numTrapDoorsPerRow:3,
	
	trapDoorsActive: false,		
	
	// UI
	uiPanelBg: new ig.Image('media/ui/pd-trapDoorDemo-ui-backPanel.png'),
	uiPanelBgWidth:434,
	uiPanelCopyright: new ig.Image('media/ui/pd-trapDoorDemo-ui-copyrightNotice.png'),

	uiTextTitle: new ig.Font('media/ui/pd-trapDoorDemo-ui-font-pt36.png'),	
	uiTextInstrActivate: new ig.Font('media/ui/pd-trapDoorDemo-ui-font-pt24.png'),
	uiTextInstrDeactivate: new ig.Font('media/ui/pd-trapDoorDemo-ui-font-pt24.png'),	
	uiTextStatus: new ig.Font('media/ui/pd-trapDoorDemo-ui-font-pt36.png'),		
	
	// Input
	inputCodeActivate: 'INPUT-KEY-ACTIVATE-TRAPDOORS',
	inputCodeDeactivate: 'INPUT-KEY-DEACTIVATE-TRAPDOORS',
	

	
	init: function() 
	{
		// Bind inputs
		ig.input.bind(ig.KEY._1, this.inputCodeActivate);
		ig.input.bind(ig.KEY._2, this.inputCodeDeactivate);
		
		// Create trap doors
		var trapDoorsTopHorizStartPos = {x:284, y:350};
		var trapDoorsBottomHorizStartPos = {x:193, y:457};
		
		for (var i = 0; i < this.numTrapDoorsPerRow; i++)
		{
			this.trapDoorsTop.push(new EntityHotFloor(ig.game.screen.x + trapDoorsTopHorizStartPos.x + (i * this.trapDoorsHorizGapDist), ig.game.screen.y + trapDoorsTopHorizStartPos.y, null));
			this.trapDoorsBottom.push(new EntityHotFloor(ig.game.screen.x + trapDoorsBottomHorizStartPos.x + (i * this.trapDoorsHorizGapDist), ig.game.screen.y + trapDoorsBottomHorizStartPos.y, null));
		}
	},
	
	
	
	update: function() 
	{
		this.parent();
		
		// To keep the demo simple, poll inputs instead of handling with interrupts.
		if (ig.input.pressed(this.inputCodeActivate))
		{
			this.activateTrapDoors();
		}
		else if (ig.input.pressed(this.inputCodeDeactivate))
		{
			this.deactivateTrapDoors();
		}
		
		// Update trapdoors
		for (var i = 0; i < this.numTrapDoorsPerRow; i++)
		{
			this.trapDoorsTop[i].update();
			this.trapDoorsBottom[i].update();
		}
	},
	
	
	
	
	
	activateTrapDoors: function()
	{
		if (!this.trapDoorsActive)
		{
			for (var i = 0; i < this.numTrapDoorsPerRow; i++)
			{
				this.trapDoorsTop[i].sendMessage(ig.HOT_FLOOR_MSGS.ACTIVATE, null);
				this.trapDoorsBottom[i].sendMessage(ig.HOT_FLOOR_MSGS.ACTIVATE, null);
			}
		
			this.trapDoorsActive = true;		
		}
	},
	
	
	deactivateTrapDoors: function()
	{
		if (this.trapDoorsActive)
		{
			for (var i = 0; i < this.numTrapDoorsPerRow; i++)
			{
				this.trapDoorsTop[i].sendMessage(ig.HOT_FLOOR_MSGS.DEACTIVATE, null);
				this.trapDoorsBottom[i].sendMessage(ig.HOT_FLOOR_MSGS.DEACTIVATE, null);
			}
		
			this.trapDoorsActive = false;		
		}
	},
	
	
	draw: function() 
	{
		this.parent();

		var screenPosX = ig.game.screen.x;
		var screenPosY = ig.game.screen.y;
		var screenWidth = ig.system.width;
		var screenHeight = ig.system.height;

		// Draw game entities
		this.bgImg.draw(screenPosX, screenPosY);		
		
		for (var i = 0; i < this.numTrapDoorsPerRow; i++)
		{
			this.trapDoorsTop[i].draw();
			this.trapDoorsBottom[i].draw();
		}
		
		// Draw UI		
		this.uiPanelBg.draw((screenPosX + screenWidth * 0.5) - (this.uiPanelBgWidth * 0.5), screenPosY + (screenHeight * 0.04));
		this.uiPanelCopyright.draw(screenPosX + (screenWidth * 0.849), screenPosY + (screenHeight * 0.962));
		
		this.uiTextTitle.draw('Trap Door Demo', screenPosX + screenWidth * 0.5, screenPosY + (screenHeight * 0.065), ig.Font.ALIGN.CENTER);
		this.uiTextInstrActivate.draw('Press \'1\' to activate', screenPosX + screenWidth * 0.41, screenPosY + (screenHeight * 0.156), ig.Font.ALIGN.LEFT);
		this.uiTextInstrDeactivate.draw('Press \'2\' to deactivate', screenPosX + screenWidth * 0.41, screenPosY + (screenHeight * 0.223), ig.Font.ALIGN.LEFT);
		
		if (this.trapDoorsActive)
		{
			this.uiTextStatus.draw('Current Status: [#00F900 ACTIVE]', screenPosX + screenWidth * 0.5, screenPosY + (screenHeight * 0.293), ig.Font.ALIGN.CENTER);
		}
		else
		{
			this.uiTextStatus.draw('Current Status: [#FF2600 INACTIVE]', screenPosX + screenWidth * 0.5, screenPosY + (screenHeight * 0.293), ig.Font.ALIGN.CENTER);		
		}
	}
});



ig.main( '#canvas', TrapDoorSample, 60, 1280, 720, 1 );

});
