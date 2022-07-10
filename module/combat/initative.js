export const _getInitiativeFormula = function() {

	const data = this.actor.data.data;
	const dice = data.INIDice;
	const init = data.INIBasis.value;
	const parts = [dice, init];

	return parts.filter(p => p !== null).join(" + ");
};