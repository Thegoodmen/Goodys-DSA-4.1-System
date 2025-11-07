export const _getInitiativeFormula = async function() {

	if(this.actor == null) return 0;

	const type = this.actor.type;

	if(type == "PlayerCharakter") {
		
		const system = (await this.actor.sheet?._prepareContext()).system;
		const dice = system.INIDice;
		const init = system.INIBasis.value;
		
		return dice + " + " + init;
	} else return this.actor.system.INI;
};