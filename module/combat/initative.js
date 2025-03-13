export const _getInitiativeFormula = function() {

	if(this.actor == null) return 0;

	const type = this.actor.type;

	if(type == "PlayerCharakter") {
		
		const system = this.actor.sheet.getData().system;

		const dice = system.INIDice;
		const init = system.INIBasis.value;

		return dice + " + " + init;
	} else return this.actor.system.INI;
};