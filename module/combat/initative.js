export const _getInitiativeFormula = function() {

	const type = this. actor.type;

	if(type == "PlayerCharakter") {
		
		const system = this.actor.sheet.getData().system;

		const dice = system.INIDice;
		const init = system.INIBasis.value;

		return dice + " + " + init;
	} else return this.actor.system.INI;
};