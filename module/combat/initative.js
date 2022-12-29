export const _getInitiativeFormula = function() {

	const system = this.actor.system;
	const dice = system.INIDice;
	const init = system.INIBasis.value;
	const parts = [dice, init];

	return parts.filter(p => p !== null).join(" + ");
};