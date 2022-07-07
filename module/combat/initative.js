export const _getInitiativeFormula = function() {

	const actor = this.actor;
	const init = actor.data.data.INIBasis.value;
	const bonus = actor.data.data.INIBasis.modi;
	const parts = ["1d6", init, bonus];

	return parts.filter(p => p !== null).join(" + ");
};